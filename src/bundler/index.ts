import * as esbuild from 'esbuild-wasm';
import {unpkgPathPlugin} from "./plugins/unpkg-path-plugin";
import {fetchPlugin} from "./plugins/fetch-plugin";

let service: esbuild.Service;

const bundle = async (rawCode: string) => {
    if (!service) {
        service = await esbuild.startService({
            worker: true,
            // wasmURL: '/esbuild.wasm' // picks esbuild.wasm placed in public folder
            wasmURL: 'https://unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm'
        });
    }

    const result = await service.build({
        entryPoints: ['index.jsx'],
        bundle: true,
        write: false,
        // TBVE: Check if we can create an inmemory file and pass path to it
        plugins: [
            unpkgPathPlugin(),
            fetchPlugin(rawCode)
        ],
        define: {
            'process.env.NODE_ENV': '"production"',
            global: 'window'
        }
    });

    return result.outputFiles[0].text;
}

export default bundle;
