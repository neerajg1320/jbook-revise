import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import reducers from './reducers';
import {reduxManualTest} from "../global/config";



export const store = createStore(
    reducers,
    {},
    applyMiddleware(thunk)
);


if (reduxManualTest) {
    // The import syntax doesn't work inside block
    const {ActionType} = require("./action-types");

    // Manually dispatch actions
    store.dispatch({
        type: ActionType.INSERT_CELL_AFTER,
        payload: {
            id: null,
            type: 'code',

        }
    });

    console.log(store.getState());

}


