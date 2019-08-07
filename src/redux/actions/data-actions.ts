// DEPENDENCIES
import axios, { AxiosResponse } from 'axios'

// ENV
import { VENDOR_API } from '../../config'

// CONSTANTS
import {
    RECIEVE_VENDOR_PROFILE,
}                            from "../constants/constants"

// Gets the detailed set of vendor profile data
export function recieveVendorProfile(vendor:any) {
    // LOCATION HISTORY ONLY IF IT"S LOCATION IS TODAY CREATE THAT CHECK
    const profile = {
        categories: vendor.categories,
        comments: vendor.comments,
        creditCard: vendor.creditCard,
        description: vendor.description,
        email: vendor.email,
        id: vendor._id,
        location: vendor.locationHistory[0],
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
    const { regionId, vendorId } = payload
    return (dispatch:any) => {
        axios.get(`${VENDOR_API}/vendor/${regionId}/${vendorId}`)
        .then((res: AxiosResponse<any>) => res.data,
            error => console.log('An error occurred.', error)
        )
        .then((json)=>{
            dispatch(recieveVendorProfile(json))
        })
    }
  }