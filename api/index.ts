import { createApp } from '../src/main';

let cachedServer: any;

export default async function handler(req, res) {
    if (!cachedServer) {
        cachedServer = await createApp();
    }

    return cachedServer(req, res);
}
