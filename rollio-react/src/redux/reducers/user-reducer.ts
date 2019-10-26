// INTERFACES
import { UserDefaultState } from "./interfaces";

// CONSTANTS
import {
    RECEIVE_USER, LOG_OUT
} from "../constants/constants"

const defaultState:UserDefaultState = {
    isAuthenticated: false,
    _id: '',
    email: '',
    isAdmin: false
}

export function userReducer(state = defaultState, action: any) {
    switch (action.type) {
        case RECEIVE_USER:
            return Object.assign({}, state, {
                isAuthenticated: true,
                _id: action.payload._id,
                email: action.payload.email
            })
        case LOG_OUT:
            return Object.assign({}, state, defaultState)
        default:
            return state
    }
}
