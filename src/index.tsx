import 'bulmaswatch/superhero/bulmaswatch.min.css';

import React from "react";
import { createRoot } from "react-dom/client";
import CodeCell from "./components/code-cell";

const App = () => {
    return (
        <div>
            <CodeCell />
            <CodeCell />
            <CodeCell />
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