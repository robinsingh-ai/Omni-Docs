# Use the official Python image from Docker Hub
FROM python:3.9-slim

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file
COPY requirements.txt .

# Install dependencies except for torch
RUN pip install -r requirements.txt || true

# Manually install torch for the correct architecture
RUN pip install --pre torch torchvision torchaudio --index-url https://download.pytorch.org/whl/nightly/cpu

# Install gRPC and protobuf explicitly
RUN pip install --no-cache-dir grpcio grpcio-tools protobuf


# Copy the entire project
COPY . .

# Create __init__.py files to make directories proper Python packages
RUN touch grpc_server/__init__.py
RUN touch grpc_server/grpc_files/__init__.py
RUN touch grpc_server/core/__init__.py
RUN touch grpc_server/utils/__init__.py
RUN touch grpc_server/agents/__init__.py

# Install the retrieval_service package
RUN cd grpc_server/retrieval_service && pip install -e .

# Set PYTHONPATH to include the grpc_server directory
ENV PYTHONPATH="/app:/app/grpc_server"

# Expose gRPC server port
EXPOSE 50051  

# Start the gRPC server
CMD ["python", "-m", "grpc_server.server"]