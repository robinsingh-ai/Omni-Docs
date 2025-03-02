#!/usr/bin/env python
"""
A very simple script to check if the gRPC server is correctly binding and accessible.
"""
import socket
import subprocess
import sys
import os

def check_process_listening_on_port(port):
    """Check what process is listening on the given port."""
    try:
        if sys.platform.startswith('darwin') or sys.platform.startswith('linux'):
            # macOS or Linux
            output = subprocess.check_output(
                f"lsof -i :{port} -P -n -sTCP:LISTEN", 
                shell=True, 
                text=True
            )
            return output
        elif sys.platform.startswith('win'):
            # Windows
            output = subprocess.check_output(
                f"netstat -ano | findstr :{port}", 
                shell=True, 
                text=True
            )
            return output
        else:
            return "Unsupported platform for process checking"
    except subprocess.CalledProcessError:
        return "No process found listening on this port"

def check_tcp_connection(host, port, timeout=5):
    """Try to establish a raw TCP connection to the host:port."""
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(timeout)
        result = sock.connect_ex((host, port))
        if result == 0:
            return "TCP connection successful"
        else:
            error_map = {
                61: "Connection refused",
                111: "Connection refused",
                110: "Connection timed out",
                10061: "Connection refused (Windows)"
            }
            return f"TCP connection failed with error: {error_map.get(result, result)}"
    except socket.error as e:
        return f"Socket error: {e}"
    finally:
        sock.close()

def main():
    port = 50051
    
    print(f"===== Checking gRPC Server on Port {port} =====\n")
    
    # Check if any process is listening on the port
    print("Checking for processes listening on port:")
    process_info = check_process_listening_on_port(port)
    print(process_info)
    print()
    
    # Check raw TCP connection to localhost
    print("Trying direct TCP connection to localhost:")
    localhost_result = check_tcp_connection("localhost", port)
    print(localhost_result)
    print()
    
    # Check raw TCP connection to 127.0.0.1
    print("Trying direct TCP connection to 127.0.0.1:")
    ip_result = check_tcp_connection("127.0.0.1", port)
    print(ip_result)
    print()
    
    if "Connection refused" in localhost_result and "Connection refused" in ip_result:
        print("DIAGNOSIS: The gRPC server is not correctly binding to the port")
        print("SOLUTION: Check the server code to ensure it's binding to 0.0.0.0 or the correct interface")
    elif "Connection timed out" in localhost_result and "Connection timed out" in ip_result:
        print("DIAGNOSIS: The port is being blocked by a firewall")
        print("SOLUTION: Check firewall settings or try disabling the firewall temporarily")
    elif "successful" in localhost_result or "successful" in ip_result:
        print("DIAGNOSIS: TCP connection successful but gRPC communication fails")
        print("SOLUTION: This suggests a protocol mismatch, incorrect gRPC configuration, or server errors")
        print("          Try checking server logs for errors during request handling")
    else:
        print("DIAGNOSIS: Unknown connection issue")
        print("SOLUTION: Try restarting the gRPC server with debug logging enabled")
    
    print("\nTry examining the server logs for errors when a client attempts to connect")
    
if __name__ == "__main__":
    main() 