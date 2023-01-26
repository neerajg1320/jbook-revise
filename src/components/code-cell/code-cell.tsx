import React, {useEffect, useState} from "react";
import CodeEditor from "../editor/code-editor";
import Preview from "../preview/preview";
import bundle from "../../bundler";
import * as preset from "../../presets/code";
import Resizable from "./resizable";

const CodeCell = () => {
    const [input, setInput] = useState(preset.defaultAsyncErrorCode);
    const [err, setErr] = useState('');
    const [code, setCode] = useState('');

    useEffect(() => {
        const timer = setTimeout(async () => {
            const output = await bundle(input);
            setCode(output.code);
            setErr(output.err);
        }, 500);

        return () => {
          clearTimeout(timer);
        };
    }, [input]);


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
                        }}
                    />
                </Resizable>
                <Preview code={code} err={err} />
            </div>
        </Resizable>
    );
}

export default CodeCell;
