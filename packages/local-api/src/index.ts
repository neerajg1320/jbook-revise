import express from 'express';
import {createProxyMiddleware} from "http-proxy-middleware";
import path from "path";

const debug = false;
export const serve = (
    port: number,
    filename: string,
    dir: string,
    useProxy: boolean
) => {
    if (debug) {
        console.log('Serving traffic on port', port);
        console.log('Cells stored and fetched from file:', filename);
        console.log('folder:', dir);
    }

    const app = express();

    if (useProxy) {
        app.use(createProxyMiddleware({
            target: 'http://localhost:3000',
            ws: true,
            logLevel: 'silent'
        }));
    } else {
        // The following does not work as express.static does not work with local-client symbolic link
        // app.use(express.static('../node_modules/local-client/build'));
        // The require.resolve will apply node's path resolution algorithm and return an absolute path
        const packagePath = require.resolve('local-client/build/index.html');
        app.use(express.static(path.dirname(packagePath)));
    }

    return new Promise<void>((resolve, reject) => {
        app.listen(port, resolve)
            .on('error', (err) => reject(err));
    });
}