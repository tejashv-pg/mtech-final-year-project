import numpy as np

class FedAggregator:
    def __init__(self):
        self.global_weights = None

    def aggregate(self, list_of_weights):
        """
        Takes a list of weight dictionaries from clients and averages them.
        """
        if not list_of_weights:
            return None
        
        # Initialize the averaged weights dictionary with the first client's keys
        averaged_weights = {}
        keys = list_of_weights[0].keys()

        for key in keys:
            # Stack weights for this specific layer from all clients
            layer_weights = [np.array(client_w[key]) for client_w in list_of_weights]
            # Calculate the mean across all clients
            averaged_weights[key] = np.mean(layer_weights, axis=0).tolist()
            
        self.global_weights = averaged_weights
        return self.global_weights