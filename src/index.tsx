import 'bulmaswatch/superhero/bulmaswatch.min.css';
import * as esbuild from 'esbuild-wasm';
import React, {useEffect, useState, useRef} from "react";
import { createRoot } from "react-dom/client";
import {debug} from "./global/config";
import {unpkgPathPlugin} from "./plugins/unpkg-path-plugin";
import {fetchPlugin} from "./plugins/fetch-plugin";
import CodeEditor from "./components/editor/code-editor";


const defaultCode = `\
const a = 1;
console.log(a);
`;

const defaultReactCode = `\
import React from 'react';
console.log(React);
`;

const defaultPackageTestCode = `\
import pkg from 'nested-test-pkg';
console.log(pkg);
`;

const defaultCssCode = `\
import 'bulma/css/bulma.css';
`

const defaultJsCssCode = `\
import pkg from 'tiny-test-pkg';
import 'bulma/css/bulma.css';
`
const defaultReactComponentCode = `\
import React from 'react';
import ReactDOM from 'react-dom';

const App = () => <h1>Hi there!</h1>

ReactDOM.render(
  <App/>,
  document.querySelector('#root')
);
`

const defaultReactNewCode = `\
import React from 'react';
import { createRoot } from 'react-dom/client';
const rootElement = document.getElementById('root');

const root = createRoot(rootElement);
const App = () => <h1>Hello and all</h1>;
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
`

const defaultErrorCode = `\
console.base();
`
const evalInMain = false;
const showCodePreview = false;
const eagerBundling = false;

const App = () => {
    const serviceRef = useRef<any>();
    const iframeRef = useRef<any>();
    const [input, setInput] = useState(defaultErrorCode);
    const [code, setCode] = useState('');

    const startService = async () => {
        serviceRef.current =  await esbuild.startService({
            worker: true,
            // wasmURL: '/esbuild.wasm' // picks esbuild.wasm placed in public folder
            wasmURL: 'https://unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm'
        });
    };

    useEffect(() => {
        startService()
    }, []);

    const onSubmit = async (value: string|null) => {
        if (debug) {
            console.log(input);
        }

        if (!serviceRef.current) {
            return;
        }

        iframeRef.current.srcdoc = html;

        let startCode;
        if (eagerBundling) {
            startCode = value as string;
        } else {
            startCode = input;
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
            entryPoints: ['index.jsx'],
            bundle: true,
            write: false,
            // TBVE: Check if we can create an inmemory file and pass path to it
            plugins: [
                unpkgPathPlugin(),
                fetchPlugin(startCode)
            ],
            define: {
                'process.env.NODE_ENV': '"production"',
                global: 'window'
            }
        })

        if (debug) {
            console.log(`result:`, result.outputFiles[0].text);
        }

        setCode(result.outputFiles[0].text);
        iframeRef.current.contentWindow.postMessage(result.outputFiles[0].text, '*');

        if (evalInMain) {
            try {
                // The eval here causes the generated js and css to be applied on current application
                eval(result.outputFiles[0].text);
            } catch (error) {
                alert(error);
            }
        }
    }

    const fontSize = "1.2em";

    const htmlSnippetUnsed = `
    <script>
        ${code}
    </script>
    `
    const html = `\
    <html>
    <head></head>
    <body>
        <div id="root"></div>
        <script>
            window.addEventListener('message', (event) => {
              try {
                eval(event.data);  
              } catch (err) {
                const root = document.querySelector('#root');
                root.innerHTML = '<div style="color: red;"><h4>Runtime Error</h4>' + err + '</div>';
                console.error(err);
              }
            }, false);
        </script>
    </body>
    </html>
    `;

    return (
        <div>
            <CodeEditor
                initialValue="const a = 1;"
                onChange={value => {
                    setInput(value);
                    if (eagerBundling) {
                        onSubmit(value);
                    }
                }}
            />

            {!eagerBundling &&
                <div>
                  <button
                      onClick={e => onSubmit(null)}
                      style={{fontSize}}
                  >
                    Submit
                  </button>
                </div>
            }

            <iframe
                ref={iframeRef}
                title="userCode"
                sandbox="allow-scripts"
                srcDoc={html}
            />

            {showCodePreview && <pre style={{fontSize}}>{code}</pre>}
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