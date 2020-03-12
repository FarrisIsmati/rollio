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

    UPDATE_VENDOR,

    UPDATE_DAILY_ACTIVE_VENDORS,

    POST_VENDOR_COMMENT,
} from '../constants/constants'

// ACTIONS
import { toggleMobileDashboard, setIsVendorSelected } from './ui-actions';
import { setRegionMapVendor, setPreviouslySelectedRegionMap, setCurrentlySelectedRegionMap } from './map-actions';

// INTERFACES
import {
    VendorDataAsyncPayload,
    RegionDataAsyncPayload,
    UpdateVendorPayload,
    UpdateDailyActiveVendorsPayload,
    SelectVendorAsyncPayload,
    SetVendorsAllPayload
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

    // If an empty object is passed as an arg then reset all data
    const profile = {
        categories: vendor.categories ? vendor.categories : '',
        comments: vendor.comments ? vendor.comments : [],
        creditCard: vendor.creditCard ? vendor.creditCard : '',
        description: vendor.description ? vendor.description : '',
        email: vendor.email ? vendor.email : '',
        id: vendor._id ? vendor._id : '',
        location: vendor.dailyActive ? location : {
            id: "",
            coordinates: {
                lat: null,
                long: null
            },
            address: "",
            neighborhood: "",
            municipality: "",
            matchMethod: "",
            tweetID: null,
            accuracy: 0
        },
        name: vendor.name ?  vendor.name : '',
        phoneNumber: vendor.phonenumber ? vendor.phonenumber : '',
        profileImageLink: vendor.profileImageLink ? vendor.profileImageLink : '',
        bannerImageLink: vendor.bannerImageLink ? vendor.bannerImageLink : '',
        price: vendor.price ? vendor.price : '',
        rating: vendor.rating ? vendor.rating : '',
        twitterID: vendor.twitterID ? vendor.twitterID : '',
        website: vendor.website ? vendor.website : '',
        isActive: vendor.dailyActive ? vendor.dailyActive : false,
        lastUpdated: vendor.updateDate ? vendor.updateDate : null
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

export function setVendorsAll(payload:SetVendorsAllPayload) {
    return {
        type: SET_VENDORS_ALL,
        payload
    }
}

// Will get the ID/isSingle status of the vendor or ID of the group depending on whether the vendor was in a group or not
const getRegionMapVendorData = (args: {stateRegionMap:MapDefaultState , vendorID:string, regionMapID:string, regionMapIDInit?:string}) => {
    const { stateRegionMap, vendorID, regionMapID } = args;
    // Set vendor in region map to active
    let regionMapIDRes:string = regionMapID;
    let isSingle:boolean = true;
    if (!stateRegionMap.vendorsDisplayedSingle[regionMapID]) {
        const vendorsDisplayedGroup = stateRegionMap.vendorsDisplayedGroup;
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
                const state = getState();

                const stateRegionMap = state.regionMap;

                const stateRegionMapPreviouslySelectedID = state.regionMap.previouslySelected.id;
                const stateRegionMapPreviouslySelectedIsSingle = state.regionMap.previouslySelected.isSingle;

                const stateRegionMapCurrentID = state.regionMap.currentlySelected.id;

                dispatch(setIsVendorSelected(true));

                // Set current vendor to active
                dispatch(setVendorsAll({id: payload.vendorId, selected: true}));

                // Get regionVendorMap data whether it's in a group or not and the ID of the vendor or the group
                const { isSingle, regionMapID } = getRegionMapVendorData({
                    stateRegionMap, 
                    vendorID: payload.vendorId, 
                    regionMapID: payload.vendorId
                })

                if (stateRegionMapCurrentID !== regionMapID) {
                    dispatch(setCurrentlySelectedRegionMap({ id: regionMapID, isSingle }));
                }

                // Set the new region map vendor/group status to selected
                dispatch(setRegionMapVendor({id: regionMapID, vendorID: payload.vendorId, isSingle, data: { selected: true }}));

                // If there is a stateRegionMapID and the same case as above
                if (stateRegionMapPreviouslySelectedID && stateRegionMapPreviouslySelectedID !== regionMapID) {
                    // Set previous region map vendor to unselected
                    dispatch(setRegionMapVendor({id: stateRegionMapPreviouslySelectedID, vendorID: payload.vendorId, isSingle: stateRegionMapPreviouslySelectedIsSingle, data: { selected: false }}));
                }
            }
        }))
    }
}

// Sets all selected vendor states to deselected, resets selectedVender object to original states
// Doesn't need a payload thanks to previouslySelected Vendor state being stored
export function deSelectVendor(vendorID:string, cb:()=>void = ()=>{}) {
    return (dispatch:any, getState:any) => {
        const state = getState();

        const stateRegionMapCurrentlySelectedID = state.regionMap.currentlySelected.id;
        const stateRegionMap = state.regionMap;

        dispatch(setIsVendorSelected(false));

        if (stateRegionMapCurrentlySelectedID) {
            const { isSingle, regionMapID } = getRegionMapVendorData({
                stateRegionMap, 
                vendorID: vendorID, 
                regionMapID: stateRegionMapCurrentlySelectedID
            });

            // Set the new region map vendor/group status to selected
            dispatch(setRegionMapVendor({id: regionMapID, vendorID, isSingle, data: { selected: false }}));
            
            // Set previously selected vendor
            dispatch(setPreviouslySelectedRegionMap({ id: stateRegionMapCurrentlySelectedID, isSingle }));

            // Remove the currently selected vendor
            dispatch(setCurrentlySelectedRegionMap({ id: '', isSingle: null }));
        }

        // Any additional code to execute after vendor is deselected
        cb();
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
