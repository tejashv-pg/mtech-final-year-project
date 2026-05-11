import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
import torch

def prepare_data(client_id):
    # 1. Download the UCI Heart Disease Dataset
    url = "https://archive.ics.uci.edu/ml/machine-learning-databases/heart-disease/processed.cleveland.data"
    names = ['age', 'sex', 'cp', 'trestbps', 'chol', 'fbs', 'restecg', 'thalach', 'exang', 'oldpeak', 'slope', 'ca', 'thal', 'target']
    
    # Load and clean (handle missing values '?' as 0.0)
    df = pd.read_csv(url, names=names, na_values='?').fillna(0.0)
    
    # Convert target to binary (0 = no disease, 1-4 = disease)
    df['target'] = df['target'].apply(lambda x: 1 if x > 0 else 0)

    # 2. Split data to simulate separate hospitals
    # Client 0 gets first half, Client 1 gets second half
    mid = len(df) // 2
    df_client = df.iloc[:mid] if client_id == 0 else df.iloc[mid:]

    X = df_client.drop('target', axis=1).values
    y = df_client['target'].values

    # 3. Standardize (Crucial for Neural Networks)
    scaler = StandardScaler()
    X = scaler.fit_transform(X)

    # Convert to PyTorch Tensors
    X_tensor = torch.tensor(X, dtype=torch.float32)
    y_tensor = torch.tensor(y, dtype=torch.float32).view(-1, 1)

    return X_tensor, y_tensor

if __name__ == "__main__":
    X, y = prepare_data(0)
    print(f"Data prepared for Client 0. Shape: {X.shape}")