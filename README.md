# FedHealth AI

This project implements a Federated Learning system for predicting Heart Disease, featuring a centralized aggregator server, multiple hospital client nodes, and a real-time dashboard for monitoring the training process.

## Prerequisites

1. **Python 3.8+**
2. **Node.js & npm** (for the React dashboard)

## Environment Setup

Before running the server or clients, activate the virtual environment and install the required Python dependencies:

```bash
# Activate the virtual environment
source venv/bin/activate  # On Linux/macOS
# OR on Windows: venv\Scripts\activate

# Install the required dependencies
pip install -r requirement.txt
```

---

## 1. Run the Server (Aggregator)

The server acts as the central aggregator, coordinating the global model weights with the connected hospital nodes via WebSockets.

Open a new terminal, activate the virtual environment, and run:

```bash
cd server
python main.py
```
The server will start at `http://127.0.0.1:8000`.

---

## 2. Run the Hospital Nodes (Clients)

The clients represent individual hospitals training the model on their local, private data.

Open a new terminal for **each** client you want to simulate, activate the virtual environment, and start the clients:

**Terminal 1 (Hospital Node 1):**
```bash
cd client
python client.py
```

**Terminal 2 (Hospital Node 2):**
```bash
cd client
python client-2.py
```

---

## 3. Run the Dashboard

The dashboard provides a real-time visualization of the federated learning process, showing connected nodes, training rounds, and model loss/accuracy. 

Open a new terminal and run:

```bash
cd dashboard-ui

# Install dependencies (only required the first time)
npm install

# Start the Vite development server
npm run dev
```
The dashboard will be available at the URL shown in your terminal (typically `http://localhost:5173`).

### Static Dashboard (Alternative)
If you prefer to use the static HTML dashboard instead of the React application:
```bash
cd dashboard
# Open index.html in your web browser
```
