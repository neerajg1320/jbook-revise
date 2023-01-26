import React, {useEffect, useState} from "react";
import {debug} from "../../global/config";
import CodeEditor from "../editor/code-editor";
import Preview from "../preview/preview";
import bundle from "../../bundler";
import * as preset from "../../presets/code";
import Resizable from "./resizable";

const CodeCell = () => {
    const [input, setInput] = useState(preset.defaultReactNewCode);
    const [code, setCode] = useState('');

    useEffect(() => {
        const timer = setTimeout(async () => {
            const output = await bundle(input);
            setCode(output);
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
                <Preview code={code} />
            </div>
        </Resizable>
    );
}

export default CodeCell;
