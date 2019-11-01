import axios, {AxiosResponse, AxiosError} from "axios";
import { VENDOR_API } from "../../config";
// CONSTANTS
import {
    RECEIVE_USER, LOG_OUT, FETCH_USER_SUCCESS, FETCH_USER
} from '../constants/constants'

// INTERFACES
import { UserDefaultState} from "../reducers/interfaces";


export function receiveUser(user: UserDefaultState) {
    return {
        type: RECEIVE_USER,
        payload: {
            ...user
        }
    }
}

export function fetchUserSuccess() {
    return {
        type: FETCH_USER_SUCCESS,
        payload: {
            isUserLoaded: true
        }
    }
}

function fetchUserStart() {
    return {
        type: FETCH_USER,
        payload: {
            isUserLoaded: false
        }
    }
}

export function logOut() {
    return {
        type: LOG_OUT,
        payload: {
            isUserLoaded: false
        }
    }
}

export function fetchUserAsync() {
    return function (dispatch:any) {
        dispatch(fetchUserStart());
        return axios({
            method: "GET",
            url: `${VENDOR_API}/api/auth/users`,
            headers: {'Authorization': "Bearer " + localStorage.token}
        })
            .then((response: AxiosResponse<any>) => {
                    dispatch(receiveUser(response.data.user))
                    dispatch(fetchUserSuccess());
                }
            )
            .catch((err:AxiosError) => {
                localStorage.clear();
                dispatch(logOut())
            })
    }
}
