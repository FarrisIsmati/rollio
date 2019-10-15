// CONSTANTS
import {
    SET_MAP_PINS,
    SET_MAP_PIN_LOAD_STATE
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
