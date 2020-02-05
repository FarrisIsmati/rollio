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

    SET_VENDORS_ALL,

    SET_PREVIOUSLY_SELECTED_VENDOR,

    UPDATE_VENDOR,

    UPDATE_DAILY_ACTIVE_VENDORS,

    POST_VENDOR_COMMENT,
} from '../constants/constants'

// ACTIONS
import { setIsVendorSelected } from './ui-actions';
import { setRegionMapVendor, setPreviouslySelectedRegionMap } from './map-actions';

// INTERFACES
import {
    VendorDataAsyncPayload,
    RegionDataAsyncPayload,
    UpdateVendorPayload,
    UpdateDailyActiveVendorsPayload,
    SelectVendorAsyncPayload,
    SetVendorsAllPayload,
    SetPreviouslySelectedVendorPayload
} from './interfaces';
import {
    MapDefaultState
} from '../reducers/interfaces'

// -------
// VENDOR PROFILE
// -------

// Gets the detailed set of vendor profile data
export function recieveVendorData(vendor:any) {
    let location = null;
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

export function setPrevouslySelectedVendor(payload:SetPreviouslySelectedVendorPayload) {
    return {
        type: SET_PREVIOUSLY_SELECTED_VENDOR,
        payload
    }
}

export function setVendorsAll(payload:SetVendorsAllPayload) {
    return {
        type: SET_VENDORS_ALL,
        payload
    }
}

// Will get the ID/isSingle status of the vendor or ID of the group depending on whether the vendor was in a group or not
const getRegionMapVendorData = (args: {previousStateRegionMap:MapDefaultState , vendorID:string, regionMapID:string, regionMapIDInit?:string}) => {
    const { previousStateRegionMap, vendorID, regionMapID, regionMapIDInit } = args;
    // Set vendor in region map to active
    let regionMapIDRes:string = regionMapIDInit ? regionMapIDInit : '';
    let isSingle:boolean = true;
    if (!previousStateRegionMap.vendorsDisplayedSingle[regionMapID]) {
        const vendorsDisplayedGroup = previousStateRegionMap.vendorsDisplayedGroup;
        let groupId:string = '';
        // Label the loop to break out of the nested loop instead of writing a function for the loop
        vendorsDisplayedGroupLoop:
        for (const id in vendorsDisplayedGroup) {
            const group = vendorsDisplayedGroup[id].vendors;
            for (const i in group) {
                const vendor = group[i]
                if (vendor.vendorId === vendorID) {
                    groupId = id;
                    isSingle = false;
                    break vendorsDisplayedGroupLoop;
                }
            }
        }
        regionMapIDRes = groupId;
    }

    return {
        regionMapID : regionMapIDRes,
        isSingle
    };
}

// Performs all stateful actions needed when you select a vendor
// Selects and deselects selected state accordingly
// Currently only supports selecting one vendor at a time
export function selectVendorAsync(payload:SelectVendorAsyncPayload) {
    return (dispatch:any, getState:any) => {
        // Get Vendor Data
        dispatch(fetchVendorDataAsync({
            ...payload,
            cbSuccess: () => {
                const previousState = getState();
                const previousStateSelectedVendorID = previousState.data.previouslySelected.id;
                const previousStateRegionMapID = previousState.regionMap.previouslySelected.id;
                const previousStateRegionMapIsSingle = previousState.regionMap.previouslySelected.isSingle;
                const previousStateRegionMap = previousState.regionMap;

                dispatch(setIsVendorSelected(true));

                // Set current vendor to active
                dispatch(setVendorsAll({id: payload.vendorId, selected: true}));

                // If previous vendor set to inactive
                if (previousStateSelectedVendorID && previousStateSelectedVendorID !== payload.vendorId) {
                    dispatch(setVendorsAll({id: previousStateSelectedVendorID, selected: false}));
                }
                
                // Set currently selected vendor to previously selected vendor
                dispatch(setPrevouslySelectedVendor({id: payload.vendorId}));

                // Get regionVendorMap data whether it's in a group or not and the ID of the vendor or the group
                const { isSingle, regionMapID } = getRegionMapVendorData({
                    previousStateRegionMap, 
                    vendorID: payload.vendorId, 
                    regionMapID: payload.vendorId,
                    regionMapIDInit: payload.vendorId
                })

                // Case when newly selected vendor is in the same group as the previous vendor that was selected
                // Then there's no need to update selected status for group again
                if (previousStateRegionMapID !== regionMapID) {
                    // Set the new region map vendor/group status to selected
                    dispatch(setRegionMapVendor({id: regionMapID, isSingle, data: { selected: true }}));

                    // Set currently selected region map id to previously selected region map id
                    dispatch(setPreviouslySelectedRegionMap({id: regionMapID, isSingle}));
                }

                // If there is a previousStateRegionMapID and the same case as above
                if (previousStateRegionMapID && previousStateRegionMapID !== regionMapID) {
                    // Set previous region map vendor to unselected
                    dispatch(setRegionMapVendor({id: previousStateRegionMapID, isSingle: previousStateRegionMapIsSingle, data: { selected: false }}));
                }
            }
        }))
    }
}

// Doesn't need a payload thanks to previouslySelected Vendor state being stored
export function deselectVendor() {
    return (dispatch:any, getState:any) => {
        const previousState = getState();
        const previousStateSelectedVendorID = previousState.data.previouslySelected.id;
        const previousStateRegionMapID = previousState.regionMap.previouslySelected.id;
        const previousStateRegionMapIsSingle = previousState.regionMap.previouslySelected.isSingle;
        const previousStateRegionMap = previousState.regionMap;

        if (previousStateRegionMapID) {
            const { isSingle, regionMapID } = getRegionMapVendorData({
                previousStateRegionMap, 
                vendorID: previousStateSelectedVendorID, 
                regionMapID: previousStateRegionMapID
            })

            // If previous vendor set to inactive in data.vendorsAll
            dispatch(setVendorsAll({id: previousStateSelectedVendorID, selected: false}));

            // Set the new region map vendor/group status to selected
            dispatch(setRegionMapVendor({id: regionMapID, isSingle, data: { selected: true }}));

            // Set currently selected region map id to previously selected region map id
            dispatch(setPreviouslySelectedRegionMap({id: regionMapID, isSingle}));

            // Set previous region map vendor to unselected
            dispatch(setRegionMapVendor({id: previousStateRegionMapID, isSingle: previousStateRegionMapIsSingle, data: { selected: false }}));
        }
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
                if (!res.data) {
                    // If issue persists add more robust error handling
                    console.error(res);
                } else {
                    dispatch(receiveAllRegions(res.data.regions));
                    dispatch(fetchAllRegionsSuccess());
                }
            })
            .catch((err:AxiosError) => {
                console.error(err)
            })
    }
}
