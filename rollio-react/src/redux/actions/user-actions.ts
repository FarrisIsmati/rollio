// CONSTANTS
import {
    RECEIVE_USER
} from '../constants/constants'

// INTERFACES
import { UserDefaultState} from "../reducers/interfaces";

// -------
// MAP
// -------

export function setUser(payload: UserDefaultState) {
    return {
        type: RECEIVE_USER,
        payload: {
            ...payload
        }
    }
}
