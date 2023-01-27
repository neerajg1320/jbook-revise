"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.serve = void 0;
const express_1 = __importDefault(require("express"));
const http_proxy_middleware_1 = require("http-proxy-middleware");
const debug = false;
const serve = (port, filename, dir) => {
    if (debug) {
        console.log('Serving traffic on port', port);
        console.log('Cells stored and fetched from file:', filename);
        console.log('folder:', dir);
    }
    const app = (0, express_1.default)();
    app.use((0, http_proxy_middleware_1.createProxyMiddleware)({
        target: 'http://localhost:3000',
        ws: true,
        logLevel: 'silent'
    }));
    return new Promise((resolve, reject) => {
        app.listen(port, resolve)
            .on('error', (err) => reject(err));
    });
};
exports.serve = serve;
