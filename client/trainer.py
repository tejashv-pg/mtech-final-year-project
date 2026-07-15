import torch
import torch.nn as nn
import torch.optim as optim

def train_local_model(model, data, targets, epochs=5):
    criterion = nn.BCELoss() # Binary Cross Entropy for 0/1 prediction
    optimizer = optim.Adam(model.parameters(), lr=0.01)

    model.train()
    for epoch in range(epochs):
        optimizer.zero_grad()
        outputs = model(data)
        loss = criterion(outputs, targets)
        loss.backward()
        optimizer.step()
        print(f"Epoch {epoch+1}/{epochs}, Loss: {loss.item():.4f}")
    
    with torch.no_grad():
        predictions = (model(data) >= 0.5).float()
        accuracy = (predictions == targets).float().mean().item() * 100.0
    
    return model.get_weights(), loss.item(), accuracy