// CONSTANTS
import {
    TOGGLE_MOBILE_DASHBOARD,
    TOGGLE_MAIN_DROPDOWN_MENU,
    SET_IS_VENDOR_SELECTED,
    SET_DASHBOARD_VENDORS_DISPLAY
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

export function setIsVendorSelected(payload:boolean) {
    return {
        type: SET_IS_VENDOR_SELECTED,
        payload: { isVendorSelected: payload}
    }
}

export function setDashboardVendorsDisplay(payload:string) {
    return {
        type: SET_DASHBOARD_VENDORS_DISPLAY,
        payload: { dashboardVendorsDisplay: payload}
    }
}