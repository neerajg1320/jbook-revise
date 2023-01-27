"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serve = void 0;
const serve = (port, filename, dir) => {
    console.log('Serving tracffic on port', port);
    console.log('Cells stored and fetched from file:', filename);
    console.log('folder:', dir);
};
exports.serve = serve;
