import "./code-cell.css";
import React, {useEffect} from "react";
import CodeEditor from "../code-editor/code-editor";
import Preview from "../code-run-preview/preview";
import Resizable from "./resizable";
import {Cell} from "../../state";
import {useActions} from "../../hooks/use-actions";
import {useTypedSelector} from "../../hooks/use-typed-selector";

interface CodeCellProps {
    cell: Cell;
}

const CodeCell: React.FC<CodeCellProps> = ({cell}) => {
    const { updateCell, createBundle } = useActions();
    const bundle = useTypedSelector((state) => {
        return state.bundles[cell.id];
    });
    const cumulativeCode = useTypedSelector((state) => {
        const {data, order} = state.cells;
        const orderedCells = order.map(id => data[id]);

        const cumCode = [
        `
        import _React from 'react';
        import {createRoot as _createRoot} from 'react-dom/client';
        const show = (value) => {
            if (typeof(value) ==='object') {
                const rootElement = document.querySelector('#root');
                
                if (value.$$typeof && value.props) {
                    _createRoot(rootElement).render(value); 
                } else {
                    rootElement.innerHTML = JSON.stringify(value);
                }
            } else {
                rootElement.innerHTML = value;
            }
        }
        `
        ];
        for (let c of orderedCells) {
            if (c.type === 'code') {
                cumCode.push(c.content);
            }
            if (c.id === cell.id) {
                break;
            }
        }

        return cumCode;
    })

    // console.log(cumulativeCode);

    useEffect(() => {
        if (!bundle) {
            createBundle(cell.id, cumulativeCode.join('\n'));
            return;
        }

        const timer = setTimeout(async () => {
            createBundle(cell.id, cumulativeCode.join('\n'));
        }, 750);

        return () => {
          clearTimeout(timer);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cumulativeCode.join('\n'), cell.id, createBundle]);


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
                <div className="progress-wrapper">
                {
                    !bundle || bundle.loading ?

                            <div className="progress-cover">
                                <progress className="progress is-small is-primary" max="100">
                                    Loading
                                </progress>
                            </div>

                        : <Preview code={bundle.code || ''} err={bundle?.err || ''} />
                }
                </div>
            </div>
        </Resizable>
    );
}

export default CodeCell;
