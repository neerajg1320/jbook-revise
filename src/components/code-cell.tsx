import React, {useState} from "react";
import {debug} from "../global/config";
import CodeEditor from "./editor/code-editor";
import Preview from "./preview";
import bundle from "../bundler";
import * as preset from "../presets/code";
import Resizable from "./resizable";

const showCodePreview = false;

const CodeCell = () => {
    const [input, setInput] = useState(preset.defaultReactNewCode);
    const [code, setCode] = useState('');

    const onSubmit = async (value: string) => {
        if (debug) {
            console.log(input);
        }

        // The build call using esbuild which creates a bundle
        const output = await bundle(value);
        setCode(output);
    }

    const fontSize = "1.2em";

    return (
        <Resizable direction="vertical">
            <div style={{
                height: '100%',
                display: "flex", flexDirection:"row"
            }}>
                <Resizable direction="horizontal">
                    <CodeEditor
                        initialValue={input}
                        onChange={value => {
                            setInput(value);
                            onSubmit(value);
                        }}
                    />
                </Resizable>
                <Preview code={code} />

                {showCodePreview && <pre style={{fontSize}}>{code}</pre>}
            </div>
        </Resizable>
    );
}

export default CodeCell;
