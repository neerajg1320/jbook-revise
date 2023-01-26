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

    try {
        const result = await service.build({
            entryPoints: ['index.jsx'],
            bundle: true,
            write: false,
            // TBVE: Check if we can create an in-memory file and pass path to it
            plugins: [
                unpkgPathPlugin(),
                fetchPlugin(rawCode)
            ],
            define: {
                'process.env.NODE_ENV': '"production"',
                global: 'window'
            },
            jsxFactory: '_React.createElement',
            jsxFragment: '_React.Fragment'
        });
        return {
            code: result.outputFiles[0].text,
            err: ''
        };
    } catch (err) {
        if (err instanceof Error) {
            return {
                code: '',
                err: err.message
            };
        } else {
            throw err;
        }
    }
}

export default bundle;