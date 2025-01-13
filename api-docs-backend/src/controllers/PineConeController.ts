import { Pinecone } from '@pinecone-database/pinecone';

import { Request, Response } from 'express';

export default class PineConeController {

    // create methods to create, query indexes from Vector Database
    // requests go through pincconeService

    // async createIndex(req: Request, res: Response): Promise<void> {
    //     try {
    //         const { indexName, indexData } = req.body;
    //         const pinecone = new Pinecone();
    //         const response = await pinecone.createIndex(indexName, indexData);
    //         res.status(201).json(response);
    //     } catch (error) {
    //         console.error('Error in createIndex:', error);
    //         res.status(500).json({ error: 'Internal Server Error' });
    //     }
    // }

    // async queryIndex(req: Request, res: Response): Promise<void> {
    //     try {
    //         const { indexName, queryData } = req.body;
    //         const pinecone = new Pinecone();
    //         const response = await pinecone.queryIndex(indexName, queryData);
    //         res.status(200).json(response);
    //     } catch (error) {
    //         console.error('Error in queryIndex:', error);
    //         res.status(500).json({ error: 'Internal Server Error' });
    //     }
    // }

}