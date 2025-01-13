import axios from 'axios';
import { Request, Response } from 'express';

export default class NotionController {


    async authorizeNotion(req: Request, res: Response): Promise<void> {
        try {
            // authorization flow
            const authorizeUrl = process.env.NOTION_AUTHORIZATION_URL || '';
            res.redirect(authorizeUrl);
        } catch (error) {
            console.error('Error in authorizeNotion:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async callbackNotion(req: Request, res: Response): Promise<void> {
        try {
            const code = req.query.code as string;
            console.log('Code:', code);
            // Exchange the code for an access token
            const clientId = process.env.NOTION_OAUTH_CLIENT_ID;
            const clientSecret = process.env.NOTION_OAUTH_CLIENT_SECRET;
            const redirectUri = process.env.NOTION_REDIRECT_URI;
            const encoded = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

            const response = await fetch("https://api.notion.com/v1/oauth/token", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: `Basic ${encoded}`,
                },
                body: JSON.stringify({
                    grant_type: "authorization_code",
                    code: "your-temporary-code",
                    redirect_uri: redirectUri,
                }),
            });

            const data = await response.json();
            console.log(data);

            // Store the token securely (e.g., database or session)
            // Then redirect to the frontend with a success status
            res.redirect(`${process.env.FRONTEND_URL}?auth=success`);
        } catch (error) {
            console.error('Error in callbackNotion:', error);
            res.redirect(`${process.env.FRONTEND_URL}?auth=failed`);
        }
    }

    async getToken(req: Request, res: Response): Promise<void> {
        try {
            const { code } = req.body;

            if (!code) {
                res.status(400).json({ error: 'Authorization code is required' });
                return
            }

            const tokenUrl = process.env.NOTION_TOKEN_URL || '';
            const clientId = process.env.NOTION_CLIENT_ID || '';
            const clientSecret = process.env.NOTION_CLIENT_SECRET || '';
            const redirectUri = process.env.NOTION_REDIRECT_URI || '';

            const response = await axios.post(
                tokenUrl,
                {
                    grant_type: 'authorization_code',
                    code,
                    redirect_uri: redirectUri,
                    client_id: clientId,
                    client_secret: clientSecret,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            const { access_token } = response.data;

            // Save the access token securely (e.g., in your database)
            res.status(200).json({ access_token });
        } catch (error: any) {
            console.error('Error in getToken:', error.response?.data || error.message);
            res.status(500).json({ error: 'Failed to exchange code for access token' });
        }
    }


}