import React, {useState} from "react";
import {debug} from "../global/config";
import CodeEditor from "./editor/code-editor";
import Preview from "./preview";
import bundle from "../bundler";
import * as preset from "../presets/code";

const showCodePreview = false;
const eagerBundling = false;

const CodeCell = () => {
    const [input, setInput] = useState(preset.defaultReactNewCode);
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

export default CodeCell;
