import os

# Get absolute path to retrieval_service
BACKEND_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
PARENT_DIR = os.path.dirname(BACKEND_DIR)
RETRIEVAL_SERVICE_DIR = os.path.join(PARENT_DIR, 'retrieval_service')

print(f"BACKEND_DIR: {BACKEND_DIR}")
print(f"PARENT_DIR: {PARENT_DIR}")
print(f"RETRIEVAL_SERVICE_DIR: {RETRIEVAL_SERVICE_DIR}")
print(f"Does retrieval service dir exist? {os.path.exists(RETRIEVAL_SERVICE_DIR)}")
if os.path.exists(RETRIEVAL_SERVICE_DIR):
    print(f"Contents: {os.listdir(RETRIEVAL_SERVICE_DIR)}")