import { VercelRequest, VercelResponse } from '@vercel/node';
import { createApp } from '../src/main';

let cachedServer: any;

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Origin', 'https://AKRAMELGYAR.github.io/NeoStore-FrontEnd/');
        res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        res.status(200).end();
        return;
    }
    if (!cachedServer) {
        cachedServer = await createApp();
    }

    // Express/NestJS will handle the request and response
    return cachedServer(req, res);
}
