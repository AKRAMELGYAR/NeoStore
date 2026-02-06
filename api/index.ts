import { VercelRequest, VercelResponse } from '@vercel/node';
import { createApp } from '../src/main';

let cachedServer: any;

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (!cachedServer) {
        cachedServer = await createApp();
    }

    // Express/NestJS will handle the request and response
    return cachedServer(req, res);
}
