// requestRoutes.ts
import express from 'express';
import RequestService from '../services/RequestService';
const publicRoutes = express.Router();
const requestService = new RequestService()

publicRoutes.post('/query', requestService.queryData);
publicRoutes.post('/fetch', requestService.loadContentFromWebUrl);
publicRoutes.post('/vectorize', requestService.vectorize);

publicRoutes.get('/status', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Service is running'
    })
});
export default publicRoutes;

