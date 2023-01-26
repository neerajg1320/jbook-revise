import {useTypedSelector} from "./use-typed-selector";

export const useCumulativeCode = (cellId: string) => {
    return useTypedSelector((state) => {
        const {data, order} = state.cells;
        const orderedCells = order.map(id => data[id]);

        const showFunc = `\
        import _React from 'react';
        import {createRoot as _createRoot} from 'react-dom/client';
        var show = (value) => {
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
        `;

        const showFuncNoop = 'var show = () => {}';

        const cumCode = [showFuncNoop];

        for (let c of orderedCells) {
            if (c.type === 'code') {
                if (c.id === cellId) {
                    cumCode.push(showFunc);
                }
                cumCode.push(c.content);
            }
            if (c.id === cellId) {
                break;
            }
        }

        return cumCode;
    }).join('\n');
}