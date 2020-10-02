import { uniqBy } from 'lodash';

// CONSTANTS
import {
    RECEIVE_REGION_DATA,
    RECEIVE_VENDOR_DATA,
    RECEIVE_ALL_VENDORS,
    CLEAR_SELECTED_VENDOR,
    RECEIVE_ALL_REGIONS,
    SET_VENDORS_ALL,
    POST_VENDOR_COMMENT,
    UPDATE_VENDOR,
    RECIEVE_VENDOR_LOCATION_ACCURACY,// <--Issue
    ADD_TWEET_TO_SELECTED_VENDOR_TWEET_HISTORY,
    UPDATE_SELECTED_VENDOR_LOCATIONS,
} from "../constants/constants"

// INTERFACES
import { DataDefaultState } from "./interfaces";

const defaultState:DataDefaultState = {
    regionID: '',
    regionName: '',
    regionCoordinates: {
        lat: null,
        long: null
    },
    regionTimezone: '',
    vendorsAll: {},
    regionsAll: [],
    selectedVendor: {
        id: '',
        type: '',
        name: '',
        description: '',
        email: '',
        website: '',
        phoneNumber: '',
        profileImageLink: '',
        bannerImageLink: '',
        categories: [],
        price: '',
        rating: null,
        twitterID: '',
        twitterUserName: '',
        twitterHandle: '',
        tweetHistory: [],
        comments: [],
        creditCard: 'u',
        numTrucks: 1,
        locations: [
            {
            id: '',
            vendorID: '',
            coordinates: { lat: null, long: null },
            address: '',
            neighborhood: '',
            municipality: '',
            matchMethod: '',
            tweetID: null,
            accuracy: 0,
            startDate: null,
            endDate: null,
            truckNum: 1,
            overridden: true
        }
        ],
        lastUpdated: null,
        approved: false
    },
    error: {
        code: '',
        message: ''
    }
}

export function dataReducer(state = defaultState, action: any) {
    switch (action.type) {
    case RECEIVE_REGION_DATA:
        return {
            ...state,
            ...action.payload
        }
    case RECEIVE_VENDOR_DATA:
        return {
            ...state,
            selectedVendor: { ...state.selectedVendor, ...action.payload },
        }
    case RECEIVE_ALL_VENDORS:
        return {
            ...state,
            vendorsAll: { ...action.payload }
        }
    case CLEAR_SELECTED_VENDOR:
        return {
            ...state,
            selectedVendor: { ...defaultState.selectedVendor }
        }
    case RECEIVE_ALL_REGIONS:
        return {
            ...state,
            regionsAll: [ ...action.payload.map((region:any) => ({id: region._id, name: region.name})) ]
        }
    case SET_VENDORS_ALL:
        // If the vendor doesn't exist
        if (!state.vendorsAll[action.payload.id]) {
            return {
                ...state,
                error: {
                    code: 'VENDOR_ID_INVALID',
                    message: 'Could not find the vendor id'
                }
            }
        }

        return {
            ...state,
            vendorsAll: {
                ...state.vendorsAll,
                [action.payload.id]: {
                    ...state.vendorsAll[action.payload.id],
                    ...action.payload
                }
            }
        }
    case UPDATE_VENDOR:
        const { vendorsAll, selectedVendor} = state;
        const { payload } = action;
        const { vendorID, locations } = payload;
        const currentVendorData = vendorsAll[vendorID] || {};
        const selectedVendorUpdate = selectedVendor.id === vendorID && locations ? { selectedVendor: {...selectedVendor, locations } } : {};
        return {
            ...state,
            ...selectedVendorUpdate,
            vendorsAll: { ...vendorsAll, [vendorID]: { ...currentVendorData, ...payload } }
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
    case RECIEVE_VENDOR_LOCATION_ACCURACY:
        const locationIndex = state.selectedVendor.locations.findIndex((location:any) => location._id === action.payload.locationID);
        const updatedLocations = [...state.selectedVendor.locations];
        updatedLocations[locationIndex].accuracy = action.payload.locationAccuracy;
            
        return {
            ...state,
            selectedVendor: {
                ...state.selectedVendor,
                locations: [
                    ...updatedLocations
                ]
            }
        }
    case ADD_TWEET_TO_SELECTED_VENDOR_TWEET_HISTORY:
        // Logic to check if vendorID in payload is same as the currently selected vendor
        if (action.payload.vendorID === state.selectedVendor.id) {
            return {
                ...state,
                selectedVendor: {
                    ...state.selectedVendor,
                    // the tweet might already have been in the array, just updated
                    tweetHistory: [
                        action.payload,
                        ...state.selectedVendor.tweetHistory.slice(0, 2)
                    ]
                }
            }
        }

        return {
            ...state
        }
    case UPDATE_SELECTED_VENDOR_LOCATIONS:
        return {
            ...state,
            selectedVendor: {
                ...state.selectedVendor,
                locations: [
                    ...action.payload
                ]
            }
        }
    default:
        return state
    }
}
