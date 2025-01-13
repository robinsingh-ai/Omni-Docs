import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import publicRoutes from './routes/publicRoutes';
import RequestService from './services/RequestService';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import http from 'http';
import { setupWebSocketServer } from './webSocketHandler';

dotenv.config();
const app = express();
const PORT = process.env.PORT;

dotenv.config();

const corsOptions = {
    origin: ['https://api-docs-ai.vercel.app', 'http://localhost:3000', 'https://www.getpostman.com'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'], // Ensure all methods are listed
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
    allowedHeaders: ['Content-Type', 'Authorization'], // Explicitly list allowed headers
    optionsSuccessStatus: 200, // Standard success status for OPTIONS requests
};

app.use(cors(corsOptions));
app.use("*", cors(corsOptions));

app.use(express.json());
app.use(bodyParser.json());
// Mount the checkout routes
app.use('/api/v1', publicRoutes);

const server = http.createServer(app);

setupWebSocketServer(server);

server.listen(PORT, async () => {
    console.log('Server is running on port ' + PORT);
    const markdownPath = path.resolve(__dirname, 'data.md');
    const examplesPath = path.resolve(__dirname, 'examples.md');
    const markdownData: string = fs.readFileSync(markdownPath, 'utf-8');
    const examplesData: string = fs.readFileSync(examplesPath, 'utf-8');
    await new RequestService().loadFromText(markdownData);
    // Run only once
    // const siteMapUrl = 'https://nextjs.org/sitemap.xml';
    // const dataSource = 'flutter-sitemap';
    // new RequestService().loadFromSitemap(siteMapUrl);
});
