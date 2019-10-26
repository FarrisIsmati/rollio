import axios from "axios";
import { VENDOR_API } from "../../config";
// CONSTANTS
import {
    RECEIVE_USER, LOG_OUT
} from '../constants/constants'

// INTERFACES
import { UserDefaultState} from "../reducers/interfaces";


export function setUser(payload: UserDefaultState) {
    return {
        type: RECEIVE_USER,
        payload: {
            ...payload
        }
    }
}

export function logOut() {
    return {
        type: LOG_OUT
    }
}

export function fetchUser() {
    return function (dispatch:any) {
        return axios({
            method: "GET",
            url: `${VENDOR_API}/api/auth/users`,
            headers: {'Authorization': "Bearer " + localStorage.token}
        })
            .then(
                response => {
                    dispatch(setUser(response.data.user))
                }
            )
            .catch(err => {
                localStorage.clear();
                dispatch(logOut())
            })
    }
}
