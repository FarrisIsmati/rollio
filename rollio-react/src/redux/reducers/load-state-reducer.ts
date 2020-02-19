// CONSTANTS
import {
    FETCH_REGION_DATA_SUCCESS,
    FETCH_VENDOR_DATA_SUCCESS,
    FETCH_ALL_VENDORS_SUCCESS,
    CLEAR_SELECTED_VENDOR,
    FETCH_ALL_REGIONS_SUCCESS,
    SET_MAP_PIN_LOAD_STATE,
    FETCH_USER_SUCCESS,
    FETCH_USER,
    LOG_OUT
} from "../constants/constants"

// INTERFACES
import { LoadStateDefaultState } from "./interfaces";

const defaultState: LoadStateDefaultState = {
    isRegionLoaded: false,
    isVendorLoaded: false,
    areVendorsLoaded: false,
    areMapPinsLoaded: false,
    areRegionsLoaded: false,
    isUserLoaded: false
}

export function loadStateReducer(state = defaultState, action: any) {
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
    case CLEAR_SELECTED_VENDOR:
        return {
            ...state,
            isVendorLoaded: false
        }
    case FETCH_ALL_REGIONS_SUCCESS:
        return {
            ...state,
            ...action.payload
        }
    case SET_MAP_PIN_LOAD_STATE:
        return {
            ...state,
            ...action.payload
        }
    case FETCH_USER_SUCCESS:
        return {
            ...state,
            ...action.payload
        }
    case FETCH_USER:
        return {
            ...state,
            ...action.payload
        }
    case LOG_OUT:
        return {
            ...state,
            ...action.payload
        }
    default:
        return state
    }
}
