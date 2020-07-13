// CONSTANTS
import {
    TOGGLE_MOBILE_DASHBOARD,
    TOGGLE_MAIN_DROPDOWN_MENU,
    TOGGLE_GROUP_SELECT_MENU,
    SET_IS_VENDOR_SELECTED,
    SET_DASHBOARD_VENDORS_DISPLAY,
    SET_SHOW_SELECTED_VENDOR
} from '../constants/constants'

export function toggleMobileDashboard() {
    return {
        type: TOGGLE_MOBILE_DASHBOARD
    }
}

export function toggleMainDropDownMenu() {
    return {
        type: TOGGLE_MAIN_DROPDOWN_MENU
    }
}

export function toggleGroupSelectMenu() {
    return {
        type: TOGGLE_GROUP_SELECT_MENU
    }
}

export function setIsVendorSelected(payload:boolean) {
    return {
        type: SET_IS_VENDOR_SELECTED,
        payload: { isVendorSelected: payload}
    }
}

export function setshowSelectedVendor(payload:boolean) {
    return {
        type: SET_SHOW_SELECTED_VENDOR,
        payload: { showSelectedVendor: payload }
    }
}

export function setDashboardVendorsDisplay(payload:string) {
    return {
        type: SET_DASHBOARD_VENDORS_DISPLAY,
        payload: { dashboardVendorsDisplay: payload}
    }
}