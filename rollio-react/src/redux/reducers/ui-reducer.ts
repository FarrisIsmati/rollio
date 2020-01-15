// INTERFACES
import { UiDefaultState } from "./interfaces";

// CONSTANTS
import {
    TOGGLE_MOBILE_MENU
} from "../constants/constants"

const defaultState:UiDefaultState = {
    isMobileMenuExpanded: false
}

export function uiReducer(state = defaultState, action: any) {
    switch (action.type) {
        case TOGGLE_MOBILE_MENU:
            return {
                ...state,
                isMobileMenuExpanded: !state.isMobileMenuExpanded
            }
        default:
            return state
    }
}
