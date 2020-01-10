// CONSTANTS
import {
    RECIEVE_REGION_DATA,
    RECIEVE_VENDOR_DATA,
    RECIEVE_ALL_VENDORS,
    RECEIVE_ALL_REGIONS,
    POST_VENDOR_COMMENT,
    UPDATE_VENDOR,
    UPDATE_DAILY_ACTIVE_VENDORS
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
    regionsAll: [],
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
    case RECEIVE_ALL_REGIONS:
        return {
            ...state,
            regionsAll: [ ...action.payload.map((region:any) => ({id: region._id, name: region.name})) ]
        }
    case UPDATE_VENDOR:
        const vendorsAll = { ...state.vendorsAll }

        return {
            ...state,
            vendorsAll: { ...vendorsAll, [action.payload.vendorID]: { ...vendorsAll[action.payload.vendorID], location: action.payload.location, isActive: action.payload.isActive } }
        }
    case UPDATE_DAILY_ACTIVE_VENDORS:
        return {
            ...state,
            dailyActiveVendors: state.dailyActiveVendors.add(action.payload.vendorID)
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
