// DEPENDENCIES
import axios, { AxiosResponse } from 'axios'

// ENV
import { VENDOR_API } from '../../config'

// CONSTANTS
import {
    GET_VENDOR_PROFILE,
}                            from "../constants/constants"

// Gets the detailed set of vendor profile data
export function recieveVendorProfile(profile:any){
    console.log(profile)
    return {
        type: GET_VENDOR_PROFILE,
        payload: {
            ...profile
        }
    }
}

export function fetchVendorProfile(payload:any){
    const { regionId, vendorId } = payload

    return (dispatch:any) => {
        axios.get(`${VENDOR_API}/vendor/${regionId}/${vendorId}`)
        .then((res: AxiosResponse<any>) => res,
            error => console.log('An error occurred.', error)
        )
        .then((json)=>{
            dispatch(recieveVendorProfile(json))
        })
    }
  }