import socketio
from fastapi import FastAPI
import uvicorn
from aggregator import FedAggregator
from model import HeartDiseaseModel

initial_model = HeartDiseaseModel()

app = FastAPI()
sio = socketio.AsyncServer(async_mode='asgi', cors_allowed_origins="*")
combined_app = socketio.ASGIApp(sio, app)

aggregator = FedAggregator()
connected_clients = []
received_weights = []
node_losses = {}          # sid -> latest loss
current_round = 0

def _dashboard_state():
    return {
        "nodeCount": len(connected_clients),
        "receivedCount": len(received_weights),
        "currentRound": current_round,
    }

@sio.event
async def connect(sid, environ):
    query = environ.get('QUERY_STRING', '')
    if 'client_type=dashboard' not in query:
        connected_clients.append(sid)
        print(f"🏥 Hospital Node Connected: {sid}")
    else:
        print(f"🖥️ Dashboard Connected: {sid}")
    await sio.emit("node_count_update", _dashboard_state())

@sio.event
async def disconnect(sid):
    if sid in connected_clients:
        connected_clients.remove(sid)
        print(f"🏥 Hospital Node Disconnected: {sid}")
    else:
        print(f"🖥️ Dashboard Disconnected: {sid}")
    node_losses.pop(sid, None)
    await sio.emit("node_count_update", _dashboard_state())

@sio.on("send_weights")
async def handle_weights(sid, data):
    global current_round
    print(f"📥 Received weights from {sid}")
    received_weights.append({"sid": sid, "weights": data["weights"]})
    node_losses[sid] = data["loss"]

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

        weights_only = [w["weights"] for w in received_weights]
        new_global_weights = aggregator.aggregate(weights_only)

        # Build per-node loss map keyed by index for the dashboard
        per_node = {f"node_{i}": node_losses.get(w["sid"], 0)
                    for i, w in enumerate(received_weights)}

        avg_loss = sum(node_losses.values()) / len(node_losses) if node_losses else 0
        # Rough accuracy estimate: accuracy ≈ (1 - loss) * 100, clamped 0-100
        accuracy = max(0, min(100, (1 - avg_loss) * 100))

        received_weights.clear()

        await sio.emit("dashboard_update", {
            "round": current_round,
            "loss": avg_loss,
            "accuracy": accuracy,
            "perNode": per_node,
        })

        if current_round < 10:
            await sio.emit("update_global_model", {"weights": new_global_weights})
            print(f"📢 Round {current_round} complete. Avg loss: {avg_loss:.4f}. Starting next round...")
        else:
            print(f"✅ Training Sequence Complete. Reached 10 rounds. Avg loss: {avg_loss:.4f}")

@app.get("/")
def status():
    return {"status": "Aggregator is Running", "nodes": len(connected_clients)}

@app.post("/start-training")
async def start_training():
    global current_round
    current_round = 0
    print("🔔 Manual Trigger: Sending initial Global Model to all hospitals...")
    weights = initial_model.get_weights()
    await sio.emit("update_global_model", {"weights": weights})
    return {"message": "Training sequence initiated"}

if __name__ == "__main__":
    uvicorn.run(combined_app, host="127.0.0.1", port=8000)
