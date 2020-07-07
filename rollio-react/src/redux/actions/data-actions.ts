// DEPENDENCIES
import axios, { AxiosResponse, AxiosError } from 'axios';
import moment from 'moment';
import { isEqual } from 'lodash';

// ENV
import { VENDOR_API } from '../../config';

// CONSTANTS
import {
    FETCH_VENDOR_DATA,
    FETCH_VENDOR_DATA_SUCCESS,
    RECEIVE_VENDOR_DATA,

    FETCH_REGION_DATA,
    FETCH_REGION_DATA_SUCCESS,
    RECEIVE_REGION_DATA,

    FETCH_ALL_VENDORS,
    FETCH_ALL_VENDORS_SUCCESS,
    RECEIVE_ALL_VENDORS,

    CLEAR_SELECTED_VENDOR,

    FETCH_ALL_REGIONS,
    FETCH_ALL_REGIONS_SUCCESS,
    RECEIVE_ALL_REGIONS,

    SET_VENDORS_ALL,

    UPDATE_VENDOR,

    UPDATE_VENDOR_LOCATION_ACCURACY_START,
    UPDATE_VENDOR_LOCATION_ACCURACY_SUCCESS,
    RECIEVE_VENDOR_LOCATION_ACCURACY,

    UPDATE_DAILY_ACTIVE_VENDORS,

    POST_VENDOR_COMMENT,

    ADD_TWEET_TO_SELECTED_VENDOR_TWEET_HISTORY,

    UPDATE_SELECTED_VENDOR_LOCATIONS,
} from '../constants/constants'

// ACTIONS
import { setIsVendorSelected } from './ui-actions';
import { setRegionMapVendor, setPreviouslySelectedRegionMap, setCurrentlySelectedRegionMap } from './map-actions';

// INTERFACES
import {
    VendorDataAsyncPayload,
    RegionDataAsyncPayload,
    UpdateVendorPayload,
    SelectVendorAsyncPayload,
    SetVendorsAllPayload,
    UpdateVendorLocationAccuracyPayload,
    UpdateDailyActiveVendorsPayload,
    TweetHistoryPayload,
} from './interfaces';
import {
    MapDefaultState, VendorCard
} from '../reducers/interfaces'
import { isLocationActive, isLocationActiveOrWillBeActive } from "../../util";

// -------
// SELECTED VENDOR DATA
// -------

// Gets the detailed set of vendor profile data
export function receiveVendorData(vendor:any) {
    const locations = vendor.locationHistory.filter(isLocationActiveOrWillBeActive);

    // If an empty object is passed as an arg then reset all data
    const profile = {
        categories: vendor.categories || '',
        comments: vendor.comments || [],
        creditCard: vendor.creditCard || '',
        description: vendor.description || '',
        email: vendor.email || '',
        id: vendor._id || '',
        locations,
        name: vendor.name || '',
        phoneNumber: vendor.phonenumber || '',
        profileImageLink: vendor.profileImageLink || '',
        bannerImageLink: vendor.bannerImageLink || '',
        price: vendor.price || '',
        rating: vendor.rating || '',
        twitterID: vendor.twitterID || '',
        twitterUserName: vendor.twitterUserName,
        twitterHandle: vendor.twitterHandle,
        tweetHistory: vendor.tweetHistory,
        website: vendor.website || '',
        isActive: vendor.dailyActive ? vendor.dailyActive : false,
        lastUpdated: vendor.updateDate || null,
        approved: vendor.approved || false
    };

    return {
        type: RECEIVE_VENDOR_DATA,
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
        axios.get(`${VENDOR_API}/vendor/${regionId}/${vendorId}`, {
            params: {
              tweetLimit: 3
            }
          })
            .then((res: AxiosResponse<any>) => {
                dispatch(receiveVendorData(res.data));
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
    if (stateRegionMap.vendorsDisplayedGroup[regionMapID]) {
        regionMapIDRes = regionMapID;
        isSingle = false;
    } else if (!stateRegionMap.vendorsDisplayedSingle[regionMapID]) {
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
                const { previouslySelected, currentlySelected } = state.regionMap;
                dispatch(setIsVendorSelected(true));

                // Set current vendor to active
                dispatch(setVendorsAll({id: payload.vendorId, selected: true}));
                const activeTrucksNumbers = state.data.vendorsAll[payload.vendorId].locations.filter(isLocationActive).map((location:any) => location.truckNum);
                const newSelectedVendorInfo = activeTrucksNumbers.map((truckNum:number) => {
                    const vendorID = `${payload.vendorId}-${truckNum}`;
                    // Get regionVendorMap data whether it's in a group or not and the ID of the vendor or the group
                    const { isSingle, regionMapID } = getRegionMapVendorData({
                        stateRegionMap,
                        vendorID: vendorID,
                        regionMapID: vendorID
                    });
                    return {vendorID, isSingle, regionMapID};
                });
                const regionMapIDs = newSelectedVendorInfo.map((x:any) => x.regionMapID);
                const currentlySelectedMapIDs = currentlySelected.map((x:any) => x.id);

                if (!isEqual(regionMapIDs, currentlySelectedMapIDs)) {
                    dispatch(setCurrentlySelectedRegionMap(newSelectedVendorInfo.map((x:any) => ({id: x.regionMapID, isSingle: x.isSingle}))));
                }
                previouslySelected.filter((x:any) => regionMapIDs.includes(x.id)).forEach((x:any) => {
                    // Set previous region map vendor to unselected
                    const {id, isSingle} = x;
                    dispatch(setRegionMapVendor({id, isSingle, data: { selected: false }}));
                })
                newSelectedVendorInfo.forEach((marker:any) => {
                    // Set the new region map vendor/group status to selected
                    const {regionMapID, vendorID, isSingle} = marker;
                    dispatch(setRegionMapVendor({id: regionMapID, vendorID, isSingle, data: { selected: true }}));
                })
            }
        }))
    }
}

// Sets all selected vendor states to deselected, resets selectedVender object to original states
// Doesn't need a payload thanks to previouslySelected Vendor state being stored
export function deselectAllVendors(props?:{cb?:any, preventIfSameID?: boolean, id?: string}) {
    return (dispatch:any, getState:any) => {
        const state = getState();

        const stateRegionMapCurrentlySelectedID = state.regionMap.currentlySelected.id;
        const stateRegionMap = state.regionMap;
        const stateSelectedVendorID = state.data.selectedVendor.id;

        // Stops deselection action if you are selecting the vendor ID that is already selected
        if (props && props.preventIfSameID && props.id === stateSelectedVendorID) {
            return;
        }
        
        if (stateSelectedVendorID) {
            dispatch(setIsVendorSelected(false));
    
            if (state.regionMap.currentlySelected.length) {
                const { isSingle, regionMapID } = getRegionMapVendorData({
                    stateRegionMap,
                    vendorID: stateSelectedVendorID,
                    regionMapID: stateRegionMapCurrentlySelectedID
                });
    
                // Set the new region map vendor/group status to not selected
                state.regionMap.currentlySelected.forEach((selected:any) => {
                    const {id, isSingle} = selected;
                    dispatch(setRegionMapVendor({id, vendorID: stateSelectedVendorID, isSingle, data: { selected: false }}));
                })
    
                // Set previously selected vendor
                dispatch(setPreviouslySelectedRegionMap(state.regionMap.currentlySelected));
    
                // Remove the currently selected vendor
                // dispatch(setCurrentlySelectedRegionMap([{ id: '', isSingle: null }]));
                dispatch(setCurrentlySelectedRegionMap([]));
            }
            
            if (props && props.cb) {
                // Any additional code to execute after vendor is deselected
                props.cb();
            }
        }
    }
}

// -------
// SELECTED VENDOR TWEETS
// -------

export function addTweetToSelectedVendorTweetHistory(tweet:TweetHistoryPayload) {
    return {
        type: ADD_TWEET_TO_SELECTED_VENDOR_TWEET_HISTORY,
        payload: {
            ...tweet,
        }
    }
}

// ------
// SELECTED VENDOR LOCATIONS
// ------

export function updateSelectedVendorLocations(locations:any) {
    return {
        type: UPDATE_SELECTED_VENDOR_LOCATIONS,
        payload: locations
    }
}

// --------
// SELECTED VENDOR LOCATIONS ACCURACY
// --------

export function recieveVendorLocationAccuracy(locationAccuracy:number, locationID:string) {
    return {
        type: RECIEVE_VENDOR_LOCATION_ACCURACY,
        payload: {
            locationID,
            locationAccuracy
        }
    }
}

function updateVendorLocationAccuracySuccess() {
    return {
        type: UPDATE_VENDOR_LOCATION_ACCURACY_SUCCESS,
        payload: {
            isVendorLocationAccuracyUpdated: true
        }
    }
}

function updateVendorLocationAccuracyStart() {
    return {
        type: UPDATE_VENDOR_LOCATION_ACCURACY_START,
        payload: {
            isVendorLocationAccuracyUpdated: false
        }
    }
}

export function updateVendorLocationAccuracyAsync(payload:UpdateVendorLocationAccuracyPayload) {
    const { amount, locationID, regionID, vendorID, cbError, cbSuccess } = payload;

    return (dispatch:any) => {
        dispatch(updateVendorLocationAccuracyStart())

        // Amount can only be 1 or -1
        if (amount === 0 || amount > 1 || amount < -1) {
            const amountErr = new Error('Update vendor location accuracy amount is not equal to 1 or -1')
            console.error(amountErr);

            if (cbError) {
                cbError(amountErr);
            }
            return;
        }

        axios.put(`${VENDOR_API}/vendor/${regionID}/${vendorID}/locationaccuracy`, {
            params: {
                amount,
                locationID
            }
        })
        .then((res: AxiosResponse<any>) => {
            if (res.data.level === 'error') {
                if (cbError) {
                    console.error(res.data);
                    cbError(res.data);
                }
                return;
            }
            dispatch(recieveVendorLocationAccuracy(res.data.locationAccuracy, locationID));
            dispatch(updateVendorLocationAccuracySuccess());

            if (cbSuccess) {
                cbSuccess(res);
            }
        })
        .catch((err:any) => {
            console.error(err);

            if (cbError) {
                cbError(err);
            }
        })
    }
}

// --------
// SELECTED VENDOR COMMENTS
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

// Add a vendorID to dailyActiveVendors
export function updateDailyActiveVendors(payload: UpdateDailyActiveVendorsPayload) {
    return {
        type: UPDATE_DAILY_ACTIVE_VENDORS,
        payload
    }
}


// -----------
// REGION DATA
// -----------

export function receiveRegionData(region:any) {
    return {
        type: RECEIVE_REGION_DATA,
        payload: {
            regionId: region._id,
            regionName: region.name,
            regionCoordinates: region.coordinates,
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
    const route = regionId ? `${VENDOR_API}/region/${regionId}` : `${VENDOR_API}/region/name/${regionName}`;
    return (dispatch:any) => {
        // Set region load status to false when fetching a new region
        dispatch(fetchRegionDataStart());
        axios.get(route)
        .then((res: AxiosResponse<any>) => {
            dispatch(receiveRegionData(res.data));
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
// ALL VENDORS DATA
// -----------

export function receiveAllVendors(vendorLookUp: { [key: string]: VendorCard }) {
    return {
        type: RECEIVE_ALL_VENDORS,
        payload: {
            ...Object.entries(vendorLookUp).reduce((acc, entry) => {
                const [vendorId, vendorInfo] = entry;
                const {locations} = vendorInfo;
                const filteredLocations = locations.filter(isLocationActiveOrWillBeActive);
                // @ts-ignore
                acc[vendorId] = {...vendorInfo, locations: filteredLocations};
                return acc;
            }, {})
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
                dispatch(receiveAllVendors(res.data));
                dispatch(fetchAllVendorsSuccess());
            })
            .catch((err:AxiosError) => {
                console.error(err)
            })
    }
}

// Update the vendorsAll array
export function updateVendorsAll(payload: UpdateVendorPayload) {
    return {
        type: UPDATE_VENDOR,
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
