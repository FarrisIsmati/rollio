// CONSTANTS
import {
    RECEIVE_USER, LOG_OUT
} from '../constants/constants'

// INTERFACES
import { UserDefaultState} from "../reducers/interfaces";


export function setUser(payload: UserDefaultState) {
    return {
        type: RECEIVE_USER,
        payload: {
            ...payload
        }
    }
}

export function logOut() {
    return {
        type: LOG_OUT
    }
}
