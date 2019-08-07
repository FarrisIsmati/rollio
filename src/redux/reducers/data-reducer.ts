// CONSTANTS
import {
    RECIEVE_VENDOR_PROFILE,
}                            from "../constants/constants"

// INTERFACES
import { DataDefaultState } from "./interfaces";

const defaultState:DataDefaultState = {
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
    default:
        return state
    }
}
  