// CONSTANTS
import {
    FETCH_REGION_DATA_SUCCESS,
    FETCH_VENDOR_DATA_SUCCESS,
    FETCH_ALL_VENDORS_SUCCESS,
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
    case FETCH_REGION_DATA_SUCCESS:
        return {
            ...state,
            ...action.payload
        }
    case FETCH_VENDOR_DATA_SUCCESS:
        return {
            ...state,
            ...action.payload
        }
    case FETCH_ALL_VENDORS_SUCCESS:
        return {
            ...state,
            ...action.payload
        }
    default:
        return state
    }
}
  