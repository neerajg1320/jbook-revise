import React, {useEffect, useState} from "react";
import CodeEditor from "../code-editor/code-editor";
import Preview from "../code-run-preview/preview";
import bundle from "../../bundler";
import * as preset from "../../presets/code";
import Resizable from "./resizable";
import {Cell} from "../../state";
import {useActions} from "../../hooks/use-actions";

interface CodeCellProps {
    cell: Cell;
}

const CodeCell: React.FC<CodeCellProps> = ({cell}) => {
    const [err, setErr] = useState('');
    const [code, setCode] = useState('');
    const { updateCell } = useActions();

    useEffect(() => {
        const timer = setTimeout(async () => {
            const output = await bundle(cell.content);
            setCode(output.code);
            setErr(output.err);
        }, 500);

        return () => {
          clearTimeout(timer);
        };
    }, [cell.content]);


    return (
        <Resizable direction="vertical">
            <div style={{
                height: 'calc(100% - 10px)',
                display: "flex", flexDirection:"row"
            }}>
                <Resizable direction="horizontal">
                    <CodeEditor
                        initialValue={cell.content}
                        onChange={value => {
                            updateCell(cell.id, value);
                        }}
                    />
                </Resizable>
                <Preview code={code} err={err} />
            </div>
        </Resizable>
    );
}

export default CodeCell;
