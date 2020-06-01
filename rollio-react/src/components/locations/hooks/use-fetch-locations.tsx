// DEPENDENCIES
import React, {useEffect, useState} from 'react';
// HOOKS
import useGetAppState from '../../common/hooks/use-get-app-state';
import useFetchVendors from "../../common/hooks/use-fetch-vendors";
// UTILS
import {get} from "lodash";
import axios, {AxiosResponse} from "axios";
import {VENDOR_API} from "../../../config";
import queryString from "query-string";

const useFetchLocations = (props:any, vendorID?:string) => {
    const [locationsLoaded, setLocationsLoaded] = useState<boolean>(false);
    const [locations, setLocations] = useState<Location[]>([]);
    const routeVendorID = get(props, 'match.params.vendorId', '');

    const { user } = useGetAppState();
    const { isAuthenticated } = user;

    const fetchLocations = () => {
        const query = { vendorID: routeVendorID || vendorID === 'all' ? null : vendorID };
        axios({
            method: "GET",
            url: `${VENDOR_API}/locations/filter/?${queryString.stringify(query)}`,
            headers: {'Authorization': "Bearer " + localStorage.token}
        })
            .then((res: AxiosResponse<any>) => {
                mapVendorsOntoLocations(res.data.locations);
            }).catch((err:any) => {
            console.error(err);
            throw err;
        })
    };
    const mapVendorsOntoLocations = (locations:any[]) => {
        const locationsWithVendorsMapped = locations.map((location:any) => {
            return { ...location, vendorName: get(vendorLookUp, `${location.vendorID}.name`, 'Unknown Vendor') }
        });
        setLocations(locationsWithVendorsMapped);
        console.log('loaded');
        setLocationsLoaded(true);
    };
    const { vendorLookUp, vendorLookupLoaded } = useFetchVendors(props);
    useEffect(() => {
        // first, get vendors if they haven't been loaded, yet
        if (isAuthenticated && vendorLookupLoaded) {
            fetchLocations();
        }
    }, [isAuthenticated, vendorID, vendorLookupLoaded]);

    return { locationsLoaded, locations, vendorLookUp }
}

export default useFetchLocations;
