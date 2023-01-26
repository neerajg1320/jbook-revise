import 'bulmaswatch/superhero/bulmaswatch.min.css';

import React from "react";
import { createRoot } from "react-dom/client";
import {Provider} from 'react-redux';
import {store} from "./state";
import CellList from "./components/cell-list/cell-list";


const App = () => {
    return (
        <Provider store={store}>
            <div>
                <CellList />
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