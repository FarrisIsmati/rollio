// DEPENDENCIES
import uuid  from 'uuid/v1';

// CONSTANTS
import {
    SET_MAP_PIN,
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

export function setMapPin(payload: PinPayload) {
    let id = '';

    if (!payload.id) {
        id = uuid();    
    }
    return {
        type: SET_MAP_PIN,
        payload: {
            id,
            vendorId: payload.vendorId,
            selected: payload.selected,
            location: payload.location,
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
