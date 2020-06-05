// INTERFACES
import { UiDefaultState } from "./interfaces";

// CONSTANTS
import {
    TOGGLE_MOBILE_DASHBOARD,
    TOGGLE_MAIN_DROPDOWN_MENU,
    SET_IS_VENDOR_SELECTED,
    SET_DASHBOARD_VENDORS_DISPLAY
} from "../constants/constants"

const defaultState:UiDefaultState = {
    isMobileDashboardExpanded: false,
    isMainDropDownMenuExpanded: false,
    isVendorSelected: false,
    dashboardVendorsDisplay: 'active',
}

export function uiReducer(state = defaultState, action: any) {
    switch (action.type) {
        case TOGGLE_MOBILE_DASHBOARD:
            return {
                ...state,
                isMobileDashboardExpanded: !state.isMobileDashboardExpanded
            }
        case TOGGLE_MAIN_DROPDOWN_MENU:
            return {
                ...state,
                isMainDropDownMenuExpanded: !state.isMainDropDownMenuExpanded
            }
        case SET_IS_VENDOR_SELECTED:
            return {
                ...state,
                ...action.payload
            }
        case SET_DASHBOARD_VENDORS_DISPLAY:
            return {
                ...state,
                ...action.payload
            }
        default:
            return state
    }
}
