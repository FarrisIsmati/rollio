// DEPENDENCIES
import uuid  from 'uuid/v1';

// CONSTANTS
import {
    SET_MAP_PIN
} from '../constants/constants'

// INTERFACES
import {
    Pin
} from './interfaces';

// -------
// MAP
// -------

export function setMapPin(payload: Pin) {
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