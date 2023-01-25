import * as esbuild from 'esbuild-wasm';
import React, {useEffect, useState, useRef} from "react";
import { createRoot } from "react-dom/client";
import {unpkgPathPlugin} from "./plugins/unpkg-path-plugin";

const App = () => {
    const serviceRef = useRef<any>();
    const [input, setInput] = useState('');
    const [code, setCode] = useState('');
    const debug = true;

    const startService = async () => {
        serviceRef.current =  await esbuild.startService({
            worker: true,
            wasmURL: '/esbuild.wasm' // picks esbuild.wasm placed in public folder
        });
    };

    useEffect(() => {
        startService()
    }, []);

    const onSubmit = async () => {
        console.log(input);
        if (!serviceRef.current) {
            return;
        }

        // Disabled when we switched over to build instead of transform
        //
        // console.log(serviceRef.current);
        // const result = await serviceRef.current.transform(input, {
        //     loader: 'jsx',
        //     target: 'es2015'
        // });

        // The build call using esbuild which creates a bundle
        const result = await serviceRef.current.build({
            entryPoints: ['index.js'],
            bundle: true,
            write: false,
            // TBVE: Check if we can create an inmemory file and pass path to it
            plugins: [unpkgPathPlugin(input)],
            define: {
                'process.env.NODE_ENV': '"production"',
                global: 'window'
            }
        })

        if (debug) {
            console.log(`result:`, result.outputFiles[0].text);
        }

        setCode(result.outputFiles[0].text);
    }

    const fontSize = "1.2em";

    return (
        <div>
            <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                cols={80}
                rows={10}
                style={{fontSize}}
            />
            <div>
                <button
                    onClick={onSubmit}
                    style={{fontSize}}
                >
                    Submit
                </button>
            </div>

            <pre style={{fontSize}}>{code}</pre>
        </div>
    );
}

const rootElement = document.getElementById("root") as HTMLElement;
const root = createRoot(rootElement);
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);