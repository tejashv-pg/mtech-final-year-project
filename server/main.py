import socketio
from fastapi import FastAPI
import uvicorn
from aggregator import FedAggregator
from urllib.parse import parse_qs
from model import HeartDiseaseModel
import json
import os
import datetime

LOGS_DIR = os.path.join(os.path.dirname(__file__), '..', 'logs')
os.makedirs(LOGS_DIR, exist_ok=True)
LOG_FILE = os.path.join(LOGS_DIR, 'server_audit.json')

def append_log(source, message, log_type="info"):
    entry = {
        "id": str(datetime.datetime.now().timestamp()),
        "time": datetime.datetime.now().strftime('%H:%M:%S'),
        "source": source,
        "message": message,
        "type": log_type
    }
    
    logs = []
    if os.path.exists(LOG_FILE):
        try:
            with open(LOG_FILE, 'r') as f:
                logs = json.load(f)
        except Exception:
            pass
            
    logs.insert(0, entry)
    logs = logs[:500]
    
    with open(LOG_FILE, 'w') as f:
        json.dump(logs, f, indent=2)

initial_model = HeartDiseaseModel()

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
sio = socketio.AsyncServer(async_mode='asgi', cors_allowed_origins="*")
combined_app = socketio.ASGIApp(sio, app)

aggregator = FedAggregator()
connected_clients = {}
received_weights = []
node_losses = {}          # sid -> latest loss
node_accuracies = {}      # sid -> latest accuracy
current_round = 0
target_round = 0
global_model_weights = initial_model.get_weights()

def _dashboard_state():
    return {
        "nodeCount": len(connected_clients),
        "receivedCount": len(received_weights),
        "currentRound": current_round,
    }

@sio.event
async def connect(sid, environ):
    query = environ.get('QUERY_STRING', '')
    parsed_query = parse_qs(query)
    if 'client_type' in parsed_query and 'dashboard' in parsed_query['client_type']:
        print(f"🖥️ Dashboard Connected: {sid}")
        append_log("SYS", f"Dashboard Connected: {sid}", "info")
    else:
        h_id = parsed_query.get('hospital_id', ['unknown'])[0]
        h_name = parsed_query.get('hospital_name', [f'Hospital_{sid[:4]}'])[0]
        connected_clients[sid] = {"id": h_id, "name": h_name, "status": "Connected"}
        print(f"🏥 Hospital Node Connected: {sid} ({h_name})")
        append_log("NODE", f"Hospital Node Connected: {sid} ({h_name})", "success")
    await sio.emit("node_count_update", _dashboard_state())
    await sio.emit("hospitals_update", list(connected_clients.values()))

@sio.event
async def disconnect(sid):
    if sid in connected_clients:
        popped = connected_clients.pop(sid)
        print(f"🏥 Hospital Node Disconnected: {sid} ({popped.get('name')})")
        append_log("NODE", f"Hospital Node Disconnected: {sid} ({popped.get('name')})", "warning")
    else:
        print(f"🖥️ Dashboard Disconnected: {sid}")
        append_log("SYS", f"Dashboard Disconnected: {sid}", "warning")
    node_losses.pop(sid, None)
    await sio.emit("node_count_update", _dashboard_state())
    await sio.emit("hospitals_update", list(connected_clients.values()))

@sio.on("send_weights")
async def handle_weights(sid, data):
    global current_round, global_model_weights
    print(f"📥 Received weights from {sid}")
    append_log(f"NODE_{sid[:4]}", f"Received weights (loss: {data['loss']:.4f})", "info")
    received_weights.append({"sid": sid, "weights": data["weights"]})
    node_losses[sid] = data["loss"]
    node_accuracies[sid] = data.get("accuracy", 0.0)

    # Emit per-update event so dashboard can track received count live
    await sio.emit("weight_received", {
        **_dashboard_state(),
        "receivedCount": len(received_weights),
        "sid": sid,
        "loss": data["loss"],
    })

    if len(received_weights) == len(connected_clients):
        current_round += 1
        print(f"🔄 Round {current_round}: All weights received. Running FedAvg...")
        append_log("AGG", f"Round {current_round}: All weights received. Running FedAvg...", "info")

        weights_only = [w["weights"] for w in received_weights]
        global_model_weights = aggregator.aggregate(weights_only)

        # Build per-node loss map keyed by index for the dashboard
        per_node = {f"node_{i}": node_losses.get(w["sid"], 0)
                    for i, w in enumerate(received_weights)}

        avg_loss = sum(node_losses.values()) / len(node_losses) if node_losses else 0
        avg_acc = sum(node_accuracies.values()) / len(node_accuracies) if node_accuracies else max(0, min(100, (1 - avg_loss) * 100))

        received_weights.clear()

        await sio.emit("dashboard_update", {
            "round": current_round,
            "loss": avg_loss,
            "accuracy": avg_acc,
            "perNode": per_node,
        })

        if current_round < target_round:
            await sio.emit("update_global_model", {"weights": global_model_weights})
            print(f"📢 Round {current_round} complete. Avg loss: {avg_loss:.4f}. Starting next round...")
            append_log("AGG", f"Round {current_round} complete. Avg loss: {avg_loss:.4f}. Starting next round...", "success")
        else:
            print(f"✅ Training Sequence Complete. Reached target round {target_round}. Avg loss: {avg_loss:.4f}")
            append_log("AGG", f"Training Sequence Complete. Reached target round {target_round}. Avg loss: {avg_loss:.4f}", "success")

@app.get("/")
def status():
    return {"status": "Aggregator is Running", "nodes": len(connected_clients)}

@app.post("/start-training")
async def start_training():
    global target_round, global_model_weights, current_round
    target_round = current_round + 10
    print(f"🔔 Manual Trigger: Starting 10 new rounds (Target: Round {target_round})...")
    append_log("SYS", f"Manual Trigger: Starting 10 new rounds (Target: Round {target_round})...", "info")
    await sio.emit("update_global_model", {"weights": global_model_weights})
    return {"message": "Training sequence initiated"}

@app.get("/api/audit-logs")
def get_audit_logs():
    if os.path.exists(LOG_FILE):
        try:
            with open(LOG_FILE, 'r') as f:
                return json.load(f)
        except Exception:
            return []
    return []

if __name__ == "__main__":
    uvicorn.run(combined_app, host="127.0.0.1", port=8000)
