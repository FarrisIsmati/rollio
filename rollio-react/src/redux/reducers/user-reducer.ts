// INTERFACES
import { UserDefaultState } from "./interfaces";

// CONSTANTS
import {
    RECEIVE_USER, LOG_OUT
} from "../constants/constants"

const defaultState:UserDefaultState = {
    isAuthenticated: false,
    id: '',
    email: '',
    type: '',
    vendorID: '',
    regionID: '',
    hasAllRequiredFields: false
};

export function userReducer(state = defaultState, action: any) {
    switch (action.type) {
        case RECEIVE_USER:
            return Object.assign({}, state, {
                isAuthenticated: true,
                id: action.payload._id,
                email: action.payload.email,
                type: action.payload.type,
                vendorID: action.payload.vendorID || '',
                regionID: action.payload.regionID || 'WASHINGTONDC',
                hasAllRequiredFields: !!action.payload.hasAllRequiredFields
            });
        case LOG_OUT:
            return Object.assign({}, state, defaultState);
        default:
            return state
    }
}
