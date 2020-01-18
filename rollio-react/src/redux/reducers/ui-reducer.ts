// INTERFACES
import { UiDefaultState } from "./interfaces";

// CONSTANTS
import {
    TOGGLE_MOBILE_MENU, SET_IS_VENDOR_SELECTED
} from "../constants/constants"

const defaultState:UiDefaultState = {
    isMobileMenuExpanded: false,
    isVendorSelected: false
}

export function uiReducer(state = defaultState, action: any) {
    switch (action.type) {
        case TOGGLE_MOBILE_MENU:
            return {
                ...state,
                isMobileMenuExpanded: !state.isMobileMenuExpanded
            }
        case SET_IS_VENDOR_SELECTED:
            return {
                ...state,
                ...action.payload
            }
        default:
            return state
    }
}
