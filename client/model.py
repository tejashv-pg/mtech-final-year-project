import torch
import torch.nn as nn

class HeartDiseaseModel(nn.Module):
    def __init__(self):
        super(HeartDiseaseModel, self).__init__()
        # Input: 13 features from the dataset
        self.layer1 = nn.Linear(13, 16) 
        self.layer2 = nn.Linear(16, 8)
        self.output = nn.Linear(8, 1)
        self.sigmoid = nn.Sigmoid()

    def forward(self, x):
        x = torch.relu(self.layer1(x))
        x = torch.relu(self.layer2(x))
        x = self.sigmoid(self.output(x))
        return x

    def get_weights(self):
        """Extracts model weights as a list of numpy arrays for sending over network"""
        return {k: v.cpu().numpy().tolist() for k, v in self.state_dict().items()}

    def set_weights(self, weights):
        """Updates model weights from a list of numpy arrays"""
        state_dict = {k: torch.tensor(v) for k, v in weights.items()}
        self.load_state_dict(state_dict)