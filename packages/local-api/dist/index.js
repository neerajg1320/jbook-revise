"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.serve = void 0;
const express_1 = __importDefault(require("express"));
const http_proxy_middleware_1 = require("http-proxy-middleware");
const path_1 = __importDefault(require("path"));
const debug = false;
const serve = (port, filename, dir, useProxy) => {
    if (debug) {
        console.log('Serving traffic on port', port);
        console.log('Cells stored and fetched from file:', filename);
        console.log('folder:', dir);
    }
    const app = (0, express_1.default)();
    if (useProxy) {
        app.use((0, http_proxy_middleware_1.createProxyMiddleware)({
            target: 'http://localhost:3000',
            ws: true,
            logLevel: 'silent'
        }));
    }
    else {
        // The following does not work as express.static does not work with local-client symbolic link
        // app.use(express.static('../node_modules/local-client/build'));
        // The require.resolve will apply node's path resolution algorithm and return an absolute path
        const packagePath = require.resolve('local-client/build/index.html');
        app.use(express_1.default.static(path_1.default.dirname(packagePath)));
    }
    return new Promise((resolve, reject) => {
        app.listen(port, resolve)
            .on('error', (err) => reject(err));
    });
};
exports.serve = serve;
