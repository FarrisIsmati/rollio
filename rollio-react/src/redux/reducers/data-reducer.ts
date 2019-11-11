// CONSTANTS
import {
    RECIEVE_REGION_DATA,
    RECIEVE_VENDOR_DATA,
    RECIEVE_ALL_VENDORS,
    POST_VENDOR_COMMENT,
    UPDATE_VENDOR
} from "../constants/constants"

// INTERFACES
import { DataDefaultState } from "./interfaces";

const defaultState:DataDefaultState = {
    regionID: '',
    regionName: '',
    dailyActiveVendors: new Set(),
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
        profileImageLink: '',
        categories: [],
        price: '',
        rating: null,
        twitterID: '',
        comments: [],
        creditCard: null,
        location: {
            id: '',
            coordinates: { lat: null, long: null },
            address: '',
            neighborhood: '',
            municipality: '',
            matchMethod: '',
            tweetID: null,
            accuracy: 0,
        },
        isActive: false,
        lastUpdated: null,
    },
}

export function dataReducer(state = defaultState, action: any) {
    switch (action.type) {
    case RECIEVE_REGION_DATA:
        return {
            ...state,
            ...action.payload
        }
    case RECIEVE_VENDOR_DATA:
        return {
            ...state, 
            selectedVendor: { ...state.selectedVendor, ...action.payload }
        }
    case RECIEVE_ALL_VENDORS:
        return {
            ...state,
            vendorsAll: { ...action.payload }
        }
    case UPDATE_VENDOR:
        const vendorsAll = { ...state.vendorsAll }
        
        return {
            ...state,
            vendorsAll: { ...vendorsAll, [action.payload.vendorID]: { ...vendorsAll[action.payload.vendorID], location: action.payload.location } }
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
  