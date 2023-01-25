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

const defaultErrorCode = `\
console.base();
`
const evalInMain = false;
const showCodePreview = false;
const eagerBundling = false;

const App = () => {
    const [input, setInput] = useState(defaultCode);
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

        if (evalInMain) {
            try {
                // The eval here causes the generated js and css to be applied on current application
                eval(output);
            } catch (error) {
                alert(error);
            }
        }
    }

    const fontSize = "1.2em";

    return (
        <div>
            <CodeEditor
                initialValue={input}
                onChange={setInput}
            />

            <div>
                {!eagerBundling &&
                    <button
                        onClick={e => onSubmit(null)}
                        style={{fontSize}}
                    >
                        Submit
                    </button>
                }
            </div>

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