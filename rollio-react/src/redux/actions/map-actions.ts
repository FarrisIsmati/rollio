// CONSTANTS
import {
    SET_MAP_PINS,
    SET_MAP_PIN_LOAD_STATE,
    SET_VENDORS_DISPLAYED_SINGLE,
    SET_VENDORS_DISPLAYED_GROUP
} from '../constants/constants'

// INTERFACES
import {
    PinPayload,
    MapPinsLoadStatePayload
} from './interfaces';

// -------
// MAP
// -------

export function setMapPins(payload: PinPayload) {
    return {
        type: SET_MAP_PINS,
        payload: {
            ...payload
        }
    }
}

// export function setMapPinsLoaded
export function setMapPinsLoadState(payload: MapPinsLoadStatePayload) {
    return {
        type: SET_MAP_PIN_LOAD_STATE,
        payload: {
            areMapPinsLoaded: payload.areMapPinsLoaded
        }
    }
}

export function setVendorsDisplayedSingle(payload: any) {
    return {
        type: SET_VENDORS_DISPLAYED_SINGLE,
        payload: {
            vendorsDisplayedSingle: payload.vendorsDisplayedSingle
        }
    }
}

export function setVendorsDisplayedGroup(payload: any) {
    return {
        type: SET_VENDORS_DISPLAYED_GROUP,
        payload: {
            vendorsDisplayedGroup: payload.vendorsDisplayedGroup
        }
    }
}
