// DEPENDENCIES
import React, {useEffect, useState} from 'react';

// HOOKS
import useGetAppState from "../../common/hooks/use-get-app-state";

// UTILS
import axios, {AxiosResponse} from "axios";
import {VENDOR_API} from "../../../config";

// Get data from redux state
const useFetchUnapprovedVendors = (props:any) => {
    const [vendorsLoaded, setVendorsLoaded] = useState<boolean>(false);
    const [vendors, setVendors] = useState<Location[]>([]);
    const { user } = useGetAppState();
    const { isAuthenticated } = user;
    const fetchUnapprovedVendors = () => {
        axios({
            method: "GET",
            url: `${VENDOR_API}/vendor/unapproved-vendors`,
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
    const approveVendor = (vendor:any) => {
        const { regionID, _id: vendorID } = vendor;
        axios({
            method: "PUT",
            data: {
                regionID, vendorID, field: 'approved', data: true,
            },
            url: `${VENDOR_API}/vendor/${regionID}/${vendorID}/update`,
            headers: {'Authorization': "Bearer " + localStorage.token}
        })
            .then(() => {
                setVendors(vendors.filter((v:any) => v._id !== vendorID));
            }).catch((err:any) => {
            console.error(err);
            throw err;
        })
    };
    useEffect(() => {
        if (isAuthenticated && !vendorsLoaded) {
            fetchUnapprovedVendors();
        }
    }, [isAuthenticated, vendorsLoaded]);
    return { vendors, vendorsLoaded, approveVendor }
}

export default useFetchUnapprovedVendors;
