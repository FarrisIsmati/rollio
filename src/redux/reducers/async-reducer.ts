// CONSTANTS
import {
    FETCH_REGION_DATA,
    FETCH_VENDOR_DATA,
    FETCH_ALL_VENDORS
}                            from "../constants/constants"

// INTERFACES
import { AsyncDefaultState } from "./interfaces";

const defaultState:AsyncDefaultState = {
    isRegionLoaded: false,
    isVendorLoaded: false,
    areVendorsLoaded: false
}

export function asyncReducer(state = defaultState, action: any) {
    switch (action.type) {
    case FETCH_REGION_DATA:
        return {
            ...state,
            ...action.payload
        }
    case FETCH_VENDOR_DATA:
        return {
            ...state,
            ...action.payload
        }
    case FETCH_ALL_VENDORS:
        return {
            ...state,
            ...action.payload
        }
    default:
        return state
    }
}
  