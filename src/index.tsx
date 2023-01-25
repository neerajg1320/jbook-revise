import 'bulmaswatch/superhero/bulmaswatch.min.css';

import React, {useEffect, useState, useRef} from "react";
import { createRoot } from "react-dom/client";
import {debug} from "./global/config";
import CodeEditor from "./components/editor/code-editor";
import Preview from "./components/preview";
import bundle from "./bundler";


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

const showCodePreview = false;
const eagerBundling = true;

const App = () => {
    const [input, setInput] = useState(defaultReactNewCode);
    const [code, setCode] = useState('');

    const onSubmit = async (value: string|null) => {
        if (debug) {
            console.log(input);
        }

        let startCode;
        if (eagerBundling) {
            startCode = value as string;
        } else {
            startCode = input;
        }

        // The build call using esbuild which creates a bundle
        const output = await bundle(startCode);
        setCode(output);
    }

    const fontSize = "1.2em";

    return (
        <div>
            <CodeEditor
                initialValue={input}
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

            <Preview code={code} />

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