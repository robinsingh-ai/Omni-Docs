#!/usr/bin/env python
"""
A simple test client for the gRPC server.
"""
import os
import sys
import asyncio
import argparse
import grpc
import json

# Add parent directory to path to import grpc modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.grpc import chat_service_pb2, chat_service_pb2_grpc

async def test_get_models(address="localhost:50051"):
    """Test the GetAvailableModels endpoint."""
    try:
        print(f"Connecting to gRPC server at {address}...")
        
        # Create a channel with extended timeout
        channel = grpc.aio.insecure_channel(
            address,
            options=[
                ('grpc.max_send_message_length', 50 * 1024 * 1024),  # 50 MB
                ('grpc.max_receive_message_length', 50 * 1024 * 1024),  # 50 MB
                ('grpc.keepalive_time_ms', 30000),  # 30 seconds
                ('grpc.keepalive_timeout_ms', 10000),  # 10 seconds
                ('grpc.http2.max_pings_without_data', 0),
                ('grpc.keepalive_permit_without_calls', 1)
            ]
        )
        
        print("Creating stub...")
        stub = chat_service_pb2_grpc.ChatServiceStub(channel)
        
        print("Creating request...")
        request = chat_service_pb2.EmptyRequest()
        
        print("Calling GetAvailableModels...")
        try:
            response = await asyncio.wait_for(
                stub.GetAvailableModels(request), 
                timeout=20.0  # 20 second timeout
            )
            print(f"Response received: {response}")
            print(f"Available models: {response.model_names}")
            return True
        except asyncio.TimeoutError:
            print("Request timed out after 20 seconds")
            return False
        finally:
            print("Closing channel...")
            await channel.close()
            
    except Exception as e:
        print(f"Error: {e}")
        return False

async def test_chat(address="localhost:50051", model="llama3.1", source="nextjs", query="How do I create a component?"):
    """Test the StreamChat endpoint."""
    try:
        print(f"Connecting to gRPC server at {address}...")
        
        channel = grpc.aio.insecure_channel(
            address,
            options=[
                ('grpc.max_send_message_length', 50 * 1024 * 1024),
                ('grpc.max_receive_message_length', 50 * 1024 * 1024),
                ('grpc.keepalive_time_ms', 30000),
                ('grpc.keepalive_timeout_ms', 10000),
                ('grpc.http2.max_pings_without_data', 0),
                ('grpc.keepalive_permit_without_calls', 1)
            ]
        )
        
        print("Creating stub...")
        stub = chat_service_pb2_grpc.ChatServiceStub(channel)
        
        print(f"Creating request: model={model}, source={source}, query={query}")
        request = chat_service_pb2.ChatRequest(
            model_name=model,
            query=query,
            index_name=source,
            chat_history=[]
        )
        
        print("Calling StreamChat...")
        
        try:
            async for response in stub.StreamChat(request):
                print(f"Response chunk: type={response.type}, content={response.content[:30]}{'...' if len(response.content) > 30 else ''}")
                
                if response.type == "end":
                    print("Stream complete.")
                    break
                    
            return True
        except Exception as e:
            print(f"StreamChat error: {e}")
            return False
        finally:
            print("Closing channel...")
            await channel.close()
            
    except Exception as e:
        print(f"Error: {e}")
        return False

async def main():
    parser = argparse.ArgumentParser(description='Test gRPC server')
    parser.add_argument('--address', default='localhost:50051', help='gRPC server address')
    parser.add_argument('--test', choices=['models', 'chat', 'both'], default='both', help='Test to run')
    parser.add_argument('--model', default='llama3.1', help='Model to use for chat test')
    parser.add_argument('--source', default='nextjs', help='Doc source to use for chat test')
    parser.add_argument('--query', default='How do I create a component?', help='Query to use for chat test')
    
    args = parser.parse_args()
    
    success = True
    
    if args.test in ['models', 'both']:
        print("\n===== Testing GetAvailableModels =====")
        models_success = await test_get_models(args.address)
        if not models_success:
            success = False
            print("❌ GetAvailableModels test failed")
        else:
            print("✅ GetAvailableModels test succeeded")
    
    if args.test in ['chat', 'both']:
        print("\n===== Testing StreamChat =====")
        chat_success = await test_chat(args.address, args.model, args.source, args.query)
        if not chat_success:
            success = False
            print("❌ StreamChat test failed")
        else:
            print("✅ StreamChat test succeeded")
    
    sys.exit(0 if success else 1)

if __name__ == '__main__':
    asyncio.run(main()) 