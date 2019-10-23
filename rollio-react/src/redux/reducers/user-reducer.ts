// INTERFACES
import { UserDefaultState } from "./interfaces";

// CONSTANTS
import {
    RECEIVE_USER
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
                _id: action.payload.user._id,
                email: action.payload.user.email
            })
        default:
            return state
    }
}
