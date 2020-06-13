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

const useFetchLocationsAndVendors = (props:any, vendorID?:string) => {
    const [locationsLoaded, setLocationsLoaded] = useState<boolean>(false);
    const [locations, setLocations] = useState<any[]>([]);
    const routeVendorID = get(props, 'match.params.vendorId', '');
    const routeLocationID = get(props, 'match.params.locationId', '');

    const { user } = useGetAppState();
    const { isAuthenticated } = user;

    const fetchLocations = () => {
        const locationQuery = routeLocationID ? {_id: routeLocationID} : {};
        const query = { vendorID: routeVendorID || vendorID === 'all' ? null : vendorID, ...locationQuery };
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
        setLocationsLoaded(true);
    };
    const { vendorLookUp, vendorLookupLoaded, vendors, vendorsLoaded } = useFetchVendors(props);
    useEffect(() => {
        // first, get vendors if they haven't been loaded, yet
        if (isAuthenticated && vendorLookupLoaded) {
            fetchLocations();
        }
    }, [isAuthenticated, vendorID, vendorLookupLoaded]);
    return { locationsLoaded, locations, vendorLookUp, vendors, vendorsLoaded }
}

export default useFetchLocationsAndVendors;
