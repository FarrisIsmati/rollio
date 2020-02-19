// CONSTANTS
import {
    TOGGLE_MOBILE_MENU,
    SET_IS_VENDOR_SELECTED
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