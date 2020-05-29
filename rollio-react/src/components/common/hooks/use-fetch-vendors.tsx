// DEPENDENCIES
import React, {useEffect, useState} from 'react';

// HOOKS
import useGetAppState from './use-get-app-state';

// UTILS
import {get} from "lodash";
import axios, {AxiosResponse} from "axios";
import {VENDOR_API} from "../../../config";
import queryString from "query-string";
import {VendorNameAndId} from "../../tweets/interfaces";

// Get data from redux state
const useFetchVendors = (props:any) => {
    const [vendorsLoaded, setVendorsLoaded] = useState<boolean>(false);
    const [vendors, setVendors] = useState<any[]>([]);
    const [vendorLookUp, setVendorLookUp] = useState<any>({});
    const [vendorLookupLoaded, setVendorLookupLoaded] = useState<boolean>(false);
    const routeVendorID = get(props, 'match.params.vendorId', '');

    const { user } = useGetAppState();
    const { isAuthenticated } = user;

    const fetchVendors = () => {
        const query = routeVendorID ? { _id: routeVendorID } : {};
        axios({
            method: "GET",
            url: `${VENDOR_API}/tweets/vendors/?${queryString.stringify(query)}`,
            headers: {'Authorization': "Bearer " + localStorage.token}
        })
            .then((res: AxiosResponse<any>) => {
                setVendors(res.data.vendors);
                setVendorsLoaded(true);
            }).catch((err:any) => {
            console.error(err);
            throw err;
        })
    };

    useEffect(() => {
        if (isAuthenticated && !vendorsLoaded) {
            fetchVendors();
        } else if (vendorsLoaded && !vendorLookupLoaded) {
            setVendorLookUp(vendors.reduce((acc:any, vendor:VendorNameAndId) => {
                const {name, tweetHistory, _id} = vendor;
                acc[_id] = { name, tweetHistory };
                return acc;
            }, {}));
            setVendorLookupLoaded(true);
        }
    }, [isAuthenticated, vendorsLoaded]);
    return { vendors, vendorsLoaded, vendorLookUp, vendorLookupLoaded }
}

export default useFetchVendors;
