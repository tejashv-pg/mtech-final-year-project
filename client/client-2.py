import socketio
from model import HeartDiseaseModel
from data_utils import prepare_data
from trainer import train_local_model
import torch

# Configuration
SERVER_URL = "http://localhost:8000"
CLIENT_ID = 1 # Change to 1 for the second simulated hospital
sio = socketio.Client()

# Initialize local model
model = HeartDiseaseModel()
X, y = prepare_data(CLIENT_ID)

@sio.event
def connect():
    print(f"✅ Connected to Aggregator Server as Hospital {CLIENT_ID}")

@sio.on("update_global_model")
def on_update(data):
    print("🚀 Received Global Model. Starting Local Training...")
    
    # 1. Update local model with Global Weights
    model.set_weights(data["weights"])
    
    # 2. Train locally on private data
    new_weights, loss, accuracy = train_local_model(model, X, y, epochs=3)
    
    # 3. Send only the weights back
    sio.emit("send_weights", {"weights": new_weights, "loss": loss, "accuracy": accuracy})
    print(f"📤 Local training complete. Loss: {loss:.4f}, Acc: {accuracy:.1f}%. Weights sent.")

if __name__ == "__main__":
    sio.connect(f"{SERVER_URL}?client_type=hospital&hospital_id={CLIENT_ID}&hospital_name=Hospital_{CLIENT_ID}")
    # Start the first round manually to test
    # In production, the server triggers this.
    sio.wait()