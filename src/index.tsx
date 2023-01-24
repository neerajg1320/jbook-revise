import * as esbuild from 'esbuild-wasm';
import React, {useEffect, useState, useRef} from "react";
import { createRoot } from "react-dom/client";

const App = () => {
    const serviceRef = useRef<any>();
    const [input, setInput] = useState('');
    const [code, setCode] = useState('');

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
        // console.log(input);
        if (!serviceRef.current) {
            return;
        }

        if (!input) {
            return;
        }

        // console.log(serviceRef.current);
        const result = await serviceRef.current.transform(input, {
            loader: 'jsx',
            target: 'es2015'
        });

        // console.log(`result:`, result);
        setCode(result.code);
    }

    return (
        <div>
            <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                cols={80}
                rows={10}
            />
            <div>
                <button onClick={onSubmit}>Submit</button>
            </div>

            <pre>{code}</pre>
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