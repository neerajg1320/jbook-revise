import 'bulmaswatch/superhero/bulmaswatch.min.css';

import React from "react";
import { createRoot } from "react-dom/client";
import {Provider} from 'react-redux';
import {store} from "./state";
// import CodeCell from "./components/code-cell/code-cell";
import TextEditor from "./components/text-cell/text-editor";


const App = () => {
    return (
        <Provider store={store}>
            <div>
                {/*<CodeCell />*/}
                <TextEditor />
            </div>
        </Provider>
    );
}


const rootElement = document.getElementById("root") as HTMLElement;
const root = createRoot(rootElement);
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);