// DEPENDENCIES
import axios, { AxiosResponse } from 'axios';
import moment from 'moment';

// ENV
import { VENDOR_API } from '../../config';

// CONSTANTS
import {
    RECIEVE_VENDOR_PROFILE,
    POST_VENDOR_COMMENT,
    RECIEVE_REGION_DATA
} from "../constants/constants";


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

export function fetchVendorProfile(payload:any) {
    const { regionId, vendorId } = payload;
    return (dispatch:any) => {
        axios.get(`${VENDOR_API}/vendor/${regionId}/${vendorId}`)
        .then((res: AxiosResponse<any>) => res.data,
            error => console.log('An error occurred: ', error)
        )
        .then((json)=>{
            dispatch(recieveVendorProfile(json))
        })
    }
}

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
    return (dispatch:any) => {
        axios.put(`${VENDOR_API}/vendor/${regionId}/${vendorId}/comments`, {
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
        })
        .catch((err) => {
            console.error(err);
        })
    }
}

export function recieveRegionData(region:any) {
    return {
        type: RECIEVE_REGION_DATA,
        payload: {
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

export function fetchRegionData(payload:any) {
    const { regionName } = payload;
    return (dispatch:any) => {
        axios.get(`${VENDOR_API}/region/name/${regionName}`)
        .then((res: AxiosResponse<any>) => res.data,
            error => console.log('An error occurred: ', error)
        )
        .then((json)=>{
            dispatch(recieveRegionData(json))
        })
    }
}