# backend/grpc_server/grpc_files/setup.py
from setuptools import setup, find_packages

setup(
    name="grpc_files",
    version="0.1.0",
    description="gRPC generated files for chat service",
    packages=find_packages(),
    python_requires=">=3.9",
)