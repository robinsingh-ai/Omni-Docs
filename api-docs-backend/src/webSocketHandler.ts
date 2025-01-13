import { WebSocket, WebSocketServer } from 'ws';

// Define the server status type and its possible values
type ServerStatus = 'online' | 'offline';

let serverStatus: ServerStatus = 'online'; // Default server status (should be updated based on actual logic)

var count = 0;

// Function to broadcast server status to all connected clients
export const broadcastStatus = (wss: WebSocketServer) => {
    const statusMessage = JSON.stringify({
        status: serverStatus,
        message: serverStatus === 'online' ? 'Service is running' : 'Service is unavailable',
        count: count++
    });

    // Broadcast the status to all clients connected to the WebSocket server
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(statusMessage);
        }
    });
};

export const handleConnection = (ws: WebSocket, req: any, wss: WebSocketServer) => {
    console.log(`New connection from ${req.socket.remoteAddress}`);

    // Send the current server status to the new WebSocket client
    ws.send(JSON.stringify({
        status: serverStatus,
        message: 'Connection established',
    }));

    // Handle incoming messages from the client
    ws.on('message', (message) => {
        console.log(`Received message: ${message}`);
    });

    ws.on('close', () => {
        console.log('Connection closed');
    });
};

// Function to handle WebSocket server startup
export const setupWebSocketServer = (server: any) => {
    const wss = new WebSocketServer({ server });

    setInterval(() => {
        broadcastStatus(wss);
    }, 60000);

    wss.on('connection', (ws, req) => {
        handleConnection(ws, req, wss);
    });

    return wss;
};