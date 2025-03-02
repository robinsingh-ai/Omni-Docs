#!/usr/bin/env python
"""
Script to check if the gRPC server is running and accessible.
"""
import sys
import socket
import time
import os
import grpc
from contextlib import closing
import argparse

def check_port(host, port, timeout=5):
    """Check if a port is open on a host."""
    with closing(socket.socket(socket.AF_INET, socket.SOCK_STREAM)) as sock:
        sock.settimeout(timeout)
        result = sock.connect_ex((host, port))
        return result == 0

def check_grpc_service(address):
    """Check if a gRPC service is responding."""
    try:
        # Create a gRPC insecure channel
        channel = grpc.insecure_channel(address)
        
        # Try to establish a connection
        future = grpc.channel_ready_future(channel)
        future.result(timeout=5)  # 5 seconds timeout
        
        return True, "gRPC service is running and responding"
    except grpc.FutureTimeoutError:
        return False, "gRPC service not responding within timeout period"
    except Exception as e:
        return False, f"Error connecting to gRPC service: {str(e)}"
    finally:
        # Close the channel
        if 'channel' in locals():
            # For gRPC 1.0+, channels are closed differently
            try:
                channel.close()
            except:
                pass

def main():
    parser = argparse.ArgumentParser(description='Check gRPC server status')
    parser.add_argument('--address', default='localhost:50051', 
                        help='gRPC server address in format host:port')
    args = parser.parse_args()
    
    # Split address into host and port
    try:
        host, port_str = args.address.rsplit(':', 1)
        port = int(port_str)
    except ValueError:
        print(f"Invalid address format: {args.address}. Expected format: host:port")
        sys.exit(1)
    
    print(f"Checking gRPC server at {host}:{port}...")
    
    # First check if the port is open
    port_open = check_port(host, port)
    if not port_open:
        print(f"❌ Port {port} is not open on {host}.")
        print("\nPossible reasons:")
        print("1. The gRPC server is not running")
        print("2. The gRPC server is running on a different port")
        print("3. There's a firewall blocking the connection")
        print("\nTry starting the gRPC server with:")
        print(f"cd backend/grpc_server && python server.py")
        sys.exit(1)
    
    # If port is open, check if the gRPC service is responding
    print(f"✅ Port {port} is open on {host}. Checking gRPC service...")
    
    success, message = check_grpc_service(args.address)
    if success:
        print(f"✅ {message}")
        print("\nYour gRPC server appears to be running correctly!")
    else:
        print(f"❌ {message}")
        print("\nThe port is open but the gRPC service is not responding properly.")
        print("This could be due to:")
        print("1. The service running on that port is not a gRPC server")
        print("2. The gRPC server is still starting up")
        print("3. The gRPC server is running but has errors")
        print("\nCheck the gRPC server logs for errors.")
    
if __name__ == '__main__':
    main() 