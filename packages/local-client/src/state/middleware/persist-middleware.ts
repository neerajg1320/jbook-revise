import {Dispatch} from "redux";
import {Action} from "../actions";
import {ActionType} from "../action-types";
import {saveCells} from "../action-creators";
import {RootState} from "../reducers";

// store:{dispatch, getState} : is not exactly redux store but an object which is similar
// next: is the next middleware
// action: that is under process

export const persistMiddleware = (
    {dispatch, getState}: {dispatch: Dispatch<Action>, getState: () => RootState}
) => {
    let saveTimer:any;

    return (next: (action:Action) => void) => {
        return (action: Action) => {
            next(action);

            if ([ActionType.MOVE_CELL,
                ActionType.UPDATE_CELL,
                ActionType.DELETE_CELL,
                ActionType.INSERT_CELL_AFTER
            ].includes(action.type)) {
                // The saveCells() returns a function which needs to be called with dispatch and getState

                if (saveTimer) {
                    clearTimeout(saveTimer);
                }
                saveTimer = setTimeout(() => {
                    saveCells()(dispatch, getState);
                }, 250);
            }
        }
    }
}