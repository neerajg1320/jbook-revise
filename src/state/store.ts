import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import reducers from './reducers';
import {reduxManualTest} from "../global/config";
// import {ActionType} from "./action-types";


export const store = createStore(
    reducers,
    {},
    applyMiddleware(thunk)
);


export const populateStoreManual = () => {
    // The import syntax doesn't work inside block
    const {ActionType} = require("./action-types");
    const {defaultCode} = require('../presets/code');

    console.log(store.getState());

    // Manually dispatch actions

    store.dispatch({
        type: ActionType.INSERT_CELL_AFTER,
        payload: {
            id: null,
            type: 'code',
        }
    });

    console.log(store.getState());

    store.dispatch({
        type: ActionType.INSERT_CELL_AFTER,
        payload: {
            id: null,
            type: 'code',
            content: defaultCode
        }
    });

    console.log(store.getState());

    // Insert after first cell
    const firstCellId = store.getState().cells.order[0]
    store.dispatch({
        type: ActionType.INSERT_CELL_AFTER,
        payload: {
            id: firstCellId,
            type: 'text',
        }
    });

    console.log(store.getState());
}

if (reduxManualTest) {
    populateStoreManual();
}

