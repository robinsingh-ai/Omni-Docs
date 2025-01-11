import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@nextui-org/react';

const ServiceStatus: React.FC = () => {
    const [status, setStatus] = useState<'online' | 'offline'>('offline');
    const [loading, setLoading] = useState<boolean>(true);
    const [ws, setWs] = useState<WebSocket | null>(null);
    const checkStatus = async () => {
        try {
            const url = `${process.env.REACT_APP_BACKEND_URL}/api/v1/status`;
            const response = await axios.get(url);
            if (response.data.status === 'success') {
                setStatus('online');
            } else {
                setStatus('offline');
            }
        } catch (error) {
            console.error('Error fetching status:', error);
            setStatus('offline');
        } finally {
            setLoading(false);
        }
    };

    const setupWebSocket = () => {
        const webSocketUrl = process.env.REACT_APP_BACKEND_WS_URL || 'ws://localhost:8080';  // Ensure this URL is correct

        const websocket = new WebSocket(webSocketUrl);

        websocket.onopen = () => {
            setLoading(false);
            websocket.send(JSON.stringify({ type: 'ping' }));
        };

        websocket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.status === 'online') {
                    setStatus('online');
                } else {
                    setStatus('offline');
                }
            } catch (err) {
                console.error('Error parsing WebSocket message:', err);
            }
        };

        websocket.onclose = () => {
            console.log('WebSocket connection closed');
            setStatus('offline');
        };

        websocket.onerror = (err) => {
            console.error('WebSocket error:', err);
            setStatus('offline');
        };

        setWs(websocket);
    };


    useEffect(() => {
        // Initial WebSocket connection
        setupWebSocket();
        return () => {
            if (ws) {
                ws.close();
            }
        };
    }, []);

    const RetryButton = () => {
        return (
            <Button
                className='text-red-500'
                onPress={() => {
                    setLoading(true);
                    if (ws) {
                        ws.close();
                    }
                    setupWebSocket();
                }}
            >
                Offline tap to retry
            </Button>
        );
    }

    return (
        <div className="status-container">
            {loading ? (
                <div className="animate-pulse h-4 w-4 bg-gray-300 rounded-full" />
            ) : (
                <div className='flex gap-2 items-center'>
                    {status === 'online' ? 'Online' : <RetryButton />}
                    <div className={` h-4 w-4 rounded-full ${status === 'online' ? 'bg-green-500' : 'bg-red-500'}`}
                    />
                </div>
            )
            }
        </div >
    );
};

export default ServiceStatus;
