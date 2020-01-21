// DEPENDENCIES
import axios, { AxiosResponse, AxiosError } from 'axios';
import moment from 'moment';

// ENV
import { VENDOR_API } from '../../config';

// CONSTANTS
import {
    FETCH_VENDOR_DATA,
    FETCH_VENDOR_DATA_SUCCESS,
    RECIEVE_VENDOR_DATA,

    FETCH_REGION_DATA,
    FETCH_REGION_DATA_SUCCESS,
    RECIEVE_REGION_DATA,

    FETCH_ALL_VENDORS,
    FETCH_ALL_VENDORS_SUCCESS,
    RECIEVE_ALL_VENDORS,

    CLEAR_SELECTED_VENDOR,
    
    FETCH_ALL_REGIONS,
    FETCH_ALL_REGIONS_SUCCESS,
    RECEIVE_ALL_REGIONS,

    UPDATE_VENDOR,

    UPDATE_DAILY_ACTIVE_VENDORS,

    POST_VENDOR_COMMENT,
} from '../constants/constants'

// INTERFACES
import {
    VendorDataAsyncPayload,
    RegionDataAsyncPayload,
    UpdateVendorPayload,
    UpdateDailyActiveVendorsPayload
} from './interfaces';

// -------
// VENDOR PROFILE
// -------

// Gets the detailed set of vendor profile data
export function recieveVendorData(vendor:any) {
    let location = null;
    console.log(vendor)
    // If the vendor is active set its location
    if (vendor.dailyActive) {
        location = vendor.locationHistory[vendor.locationHistory.length - 1];
    }

    const profile = {
        categories: vendor.categories,
        comments: vendor.comments,
        creditCard: vendor.creditCard,
        description: vendor.description,
        email: vendor.email,
        id: vendor._id,
        location,
        name: vendor.name,
        phonenumber: vendor.phonenumber,
        profileImageLink: vendor.profileImageLink,
        price: vendor.price,
        rating: vendor.rating,
        twitterID: vendor.twitterID,
        website: vendor.website,
        isActive: vendor.dailyActive,
        lastUpdated: vendor.updateDate,
    }

    return {
        type: RECIEVE_VENDOR_DATA,
        payload: {
            ...profile
        }
    }
}

function fetchVendorDataSuccess() {
    return {
        type: FETCH_VENDOR_DATA_SUCCESS,
        payload: {
            isVendorLoaded: true
        }
    }
}

function fetchVendorDataStart() {
    return {
        type: FETCH_VENDOR_DATA,
        payload: {
            isVendorLoaded: false
        }
    }
}

export function fetchVendorDataAsync(payload:VendorDataAsyncPayload) {
    const { regionId, vendorId, cb, cbSuccess } = payload;

    return (dispatch:any) => {
        dispatch(fetchVendorDataStart())
        axios.get(`${VENDOR_API}/vendor/${regionId}/${vendorId}`)
            .then((res: AxiosResponse<any>) => {
                console.log(res)
                dispatch(recieveVendorData(res.data));
                dispatch(fetchVendorDataSuccess());
                // Any function you want to run after successful get of all data
                if (cbSuccess) {
                    cbSuccess();
                }
            })
            .catch((err:any) => {
                console.error(err)
                cb();
            })
    }
}

export function clearSelectedVendor() {
    return {
        type: CLEAR_SELECTED_VENDOR
    }
}

// --------
// COMMENTS
// --------

export function postVendorComment(commentBody:any) {
    return {
        type: POST_VENDOR_COMMENT,
        payload: {
            ...commentBody
        }
    }
}

export function requestPostVendorComment(payload:any) {
    const { regionId, vendorId, name, text } = payload;
    return (dispatch:any) => axios.put(`${VENDOR_API}/vendor/${regionId}/${vendorId}/comments`, {
            name,
            text
        })
        .then((res:any) => {
            dispatch(postVendorComment({
                commentDate: moment().format('YYYY-MM-DDTHH:mm:SS'),
                _id: res.data._id,
                name,
                text,
            }))
            return res;
        })
        .catch((err:AxiosError) => {
            console.error(err);
            return err;
        })
}

// -----------
// REGION DATA
// -----------

export function recieveRegionData(region:any) {
    return {
        type: RECIEVE_REGION_DATA,
        payload: {
            regionId: region._id,
            regionName: region.name,
            dailyActiveVendors: new Set(region.dailyActiveVendorIDs),
            regionCoordinates: {
                lat: region.coordinates.coordinates[0],
                long: region.coordinates.coordinates[1]
            },
            regionTimezone: region.timezone
        }
    }
}


function fetchRegionDataSuccess() {
    return {
        type: FETCH_REGION_DATA_SUCCESS,
        payload: {
            isRegionLoaded: true
        }
    }
}

function fetchRegionDataStart() {
    return {
        type: FETCH_REGION_DATA,
        payload: {
            isRegionLoaded: false
        }
    }
}

// Get Region data with either a region name or region ID
export function fetchRegionDataAsync(payload:RegionDataAsyncPayload) {
    const { regionName, regionId, shouldFetchVendors, cb } = payload;
    // Set route based on payload params
    const route = regionId === '' || regionId === undefined ? `${VENDOR_API}/region/name/${regionName}` : `${VENDOR_API}/region/${regionId}`

    return (dispatch:any) => {
        // Set region load status to false when fetching a new region
        dispatch(fetchRegionDataStart());
        axios.get(route)
        .then((res: AxiosResponse<any>) => {
            dispatch(recieveRegionData(res.data));
            dispatch(fetchRegionDataSuccess());
            if ( shouldFetchVendors ) {
                dispatch(fetchAllVendorsAsync({regionId: res.data._id}))
            }
        })
        .catch((err:AxiosError) => {
            console.error(err)
            cb()
            return err
        })
    }
}

// -----------
// VENDOR DATA
// -----------

export function recieveAllVendors(vendors:any) {
    return {
        type: RECIEVE_ALL_VENDORS,
        payload: {
            ...vendors
        }
    }
}


function fetchAllVendorsSuccess() {
    return {
        type: FETCH_ALL_VENDORS_SUCCESS,
        payload: {
            areVendorsLoaded: true
        }
    }
}

function fetchAllVendorsStart() {
    return {
        type: FETCH_ALL_VENDORS,
        payload: {
            areVendorsLoaded: false
        }
    }
}

// Get all vendors with a region ID
export function fetchAllVendorsAsync(payload: any) {
    const { regionId } = payload;

    return (dispatch:any) => {
        // Set region load status to false when fetching a new region
        dispatch(fetchAllVendorsStart());
        axios.get(`${VENDOR_API}/vendor/${regionId}/object`)
            .then((res: AxiosResponse<any>) => {
                dispatch(recieveAllVendors(res.data));
                dispatch(fetchAllVendorsSuccess());
            })
            .catch((err:AxiosError) => {
                console.error(err)
            })
    }
}

// Update the vendorsAll data
export function updateVendor(payload: UpdateVendorPayload) {
    return {
        type: UPDATE_VENDOR,
        payload
    }
}

// Add a vendorID to dailyActiveVendors
export function updateDailyActiveVendors(payload: UpdateDailyActiveVendorsPayload) {
    return {
        type: UPDATE_DAILY_ACTIVE_VENDORS,
        payload
    }
}

// -----------
// REGIONS DATA
// -----------

export function receiveAllRegions(regions:any) {
    return {
        type: RECEIVE_ALL_REGIONS,
        payload: [
            ...regions
        ]
    }
}


function fetchAllRegionsSuccess() {
    return {
        type: FETCH_ALL_REGIONS_SUCCESS,
        payload: {
            areRegionsLoaded: true
        }
    }
}

function fetchAllRegionsStart() {
    return {
        type: FETCH_ALL_REGIONS,
        payload: {
            areRegionsLoaded: false
        }
    }
}

// Get all regions
export function fetchAllRegionsAsync() {
    return (dispatch:any) => {
        // Set regions load status to false when fetching all regions
        dispatch(fetchAllRegionsStart());
        axios.get(`${VENDOR_API}/region/all`)
            .then((res: AxiosResponse<any>) => {
                dispatch(receiveAllRegions(res.data.regions));
                dispatch(fetchAllRegionsSuccess());
            })
            .catch((err:AxiosError) => {
                console.error(err)
            })
    }
}
