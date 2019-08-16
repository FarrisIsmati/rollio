// CONSTANTS
import {
    RECIEVE_VENDOR_PROFILE,
    POST_VENDOR_COMMENT,
    RECIEVE_REGION_DATA
}                            from "../constants/constants"

// INTERFACES
import { DataDefaultState } from "./interfaces";

const defaultState:DataDefaultState = {
    regionID: '',
    regionName: '',
    dailyActiveVendors: [],
    regionCoordinates: {
        lat: null,
        long: null
    },
    regionTimezone: '',
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
    case RECIEVE_REGION_DATA:
        return {
            ...state,
            ...action.payload
        }
    default:
        return state
    }
}
  