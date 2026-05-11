import socketio
from fastapi import FastAPI
import uvicorn
from aggregator import FedAggregator

# 1. Setup FastAPI and Socket.io
app = FastAPI()
sio = socketio.AsyncServer(async_mode='asgi', cors_allowed_origins="*")
combined_app = socketio.ASGIApp(sio, app)

aggregator = FedAggregator()
connected_clients = []
received_weights = []

@sio.event
async def connect(sid, environ):
    connected_clients.append(sid)
    print(f"🏥 Hospital Node Connected: {sid}. Total: {len(connected_clients)}")

@sio.event
async def disconnect(sid):
    connected_clients.remove(sid)
    print(f"⚠️ Hospital Node Disconnected: {sid}")

@sio.on("send_weights")
async def handle_weights(sid, data):
    """Triggered when a client finishes local training"""
    print(f"📥 Received weights from {sid}")
    received_weights.append(data["weights"])

    # If all connected clients have sent their weights, aggregate them!
    if len(received_weights) == len(connected_clients):
        print("🔄 All weights received. Running Federated Averaging...")
        new_global_weights = aggregator.aggregate(received_weights)
        received_weights.clear()
        
        # Broadcast the new improved 'Global Model' back to everyone
        await sio.emit("update_global_model", {"weights": new_global_weights})
        print("📢 Sent updated Global Model to all hospitals.")

@app.get("/")
def status():
    return {"status": "Aggregator is Running", "nodes": len(connected_clients)}

if __name__ == "__main__":
    uvicorn.run(combined_app, host="0.0.0.0", port=8000)