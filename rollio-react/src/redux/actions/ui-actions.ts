// CONSTANTS
import {
    TOGGLE_MOBILE_MENU,
    SET_IS_VENDOR_SELECTED,
    SET_MENU_VENDORS_DISPLAY
} from '../constants/constants'

export function toggleMobileMenu() {
    return {
        type: TOGGLE_MOBILE_MENU
    }
}

export function setIsVendorSelected(payload:boolean) {
    return {
        type: SET_IS_VENDOR_SELECTED,
        payload: { isVendorSelected: payload}
    }
}

export function setMenuVendorsDisplay(payload:string) {
    return {
        type: SET_MENU_VENDORS_DISPLAY,
        payload: { menuVendorsDisplay: payload}
    }
}