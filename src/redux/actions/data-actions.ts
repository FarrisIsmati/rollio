// DEPENDENCIES
import axios, { AxiosResponse } from 'axios';
import moment from 'moment';

// ENV
import { VENDOR_API } from '../../config';

// CONSTANTS
import {
    RECIEVE_VENDOR_PROFILE,
    POST_VENDOR_COMMENT,
    RECIEVE_REGION_DATA,
    FETCH_REGION_DATA
} from "../constants/constants";


// -------
// PROFILE
// -------

// Gets the detailed set of vendor profile data
export function recieveVendorProfile(vendor:any) {
    let location = null;

    // If the most recently updated of the vendor location history is today
    if (vendor.locationHistory.length && moment(Date.now()).isSame(vendor.locationHistory[0].locationDate, 'day')) {
        location = vendor.locationHistory[0];
    }
    // LOCATION HISTORY ONLY IF IT"S LOCATION IS TODAY CREATE THAT CHECK
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
        website: vendor.website
    }

    return {
        type: RECIEVE_VENDOR_PROFILE,
        payload: {
            ...profile
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
            console.log(res)
            return res;
        })
        .catch((err) => {
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
            isRegionLoaded: true,
            regionID: region._id,
            regionName: region.name,
            dailyActiveVendors: region.dailyActiveVendorIDs,
            regionCoordinates: {
                lat: region.coordinates.coordinates[0],
                long: region.coordinates.coordinates[1]
            },
            regionTimezone: region.timezone
        }
    }
}

export function fetchRegionData() {
    return {
        type: FETCH_REGION_DATA,
        payload: {
            isRegionLoaded: false
        }
    }
}

// Get Region data with either a region name or region ID
export function fetchRegionDataAsync(payload:any) {
    const { regionName, regionId, cb } = payload;
    // Set route based on payload params
    const route = regionId === '' || regionId === undefined ? `${VENDOR_API}/region/name/${regionName}` : `${VENDOR_API}/region/${regionId}`

    return (dispatch:any) => {
        // Set region load status to false when fetching a new region
        dispatch(fetchRegionData());
        axios.get(route)
        .then((res: AxiosResponse<any>) => dispatch(recieveRegionData(res.data)))
        .catch((err) => {
            if (cb) {
                cb()
            } else {
                console.error('This region does not exist')
            }
        })
    }
}