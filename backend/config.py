import yaml
import os

def load_config():
    # Path to config.yml (same folder as config.py)
    config_path = os.path.join(os.path.dirname(__file__), "config.yml")
    with open(config_path, "r") as file:
        return yaml.safe_load(file)

# Load once when app starts
config = load_config()
