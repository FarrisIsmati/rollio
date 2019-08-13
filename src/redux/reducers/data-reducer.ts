// CONSTANTS
import {
    RECIEVE_VENDOR_PROFILE,
    POST_VENDOR_COMMENT
}                            from "../constants/constants"

// INTERFACES
import { DataDefaultState } from "./interfaces";

const defaultState:DataDefaultState = {
    regionID: '',
    vendorsAll: {},
    selectedVendor: {
        id: '',
        name: '',
        description: '',
        email: '',
        website: '',
        phonenumber: null,
        categories: [],
        price: '',
        rating: null,
        twitterID: '',
        comments: [],
        creditCard: null,
        location: {
            coordinates: { lat: null, long: null },
            address: '',
            neighborhood: '',
            municipality: ''
        }
    },
}

export function dataReducer(state = defaultState, action: any) {
    switch (action.type) {
    case RECIEVE_VENDOR_PROFILE:
        return {
            ...state, 
            selectedVendor: { ...state.selectedVendor, ...action.payload }
        }
    case POST_VENDOR_COMMENT:
        return {
            ...state,
            selectedVendor: {
                ...state.selectedVendor,
                comments: [
                    action.payload,
                    ...state.selectedVendor.comments
                ]
            }
        }
    default:
        return state
    }
}
  