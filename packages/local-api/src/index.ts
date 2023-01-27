import express from 'express';
import {createProxyMiddleware} from "http-proxy-middleware";

const debug = false;
export const serve = (port: number, filename: string, dir: string) => {
    if (debug) {
        console.log('Serving traffic on port', port);
        console.log('Cells stored and fetched from file:', filename);
        console.log('folder:', dir);
    }

    const app = express();

    app.use(createProxyMiddleware({
        target: 'http://localhost:3000',
        ws: true,
        logLevel: 'silent'
    }));

    return new Promise<void>((resolve, reject) => {
        app.listen(port, resolve)
            .on('error', (err) => reject(err));
    });
}