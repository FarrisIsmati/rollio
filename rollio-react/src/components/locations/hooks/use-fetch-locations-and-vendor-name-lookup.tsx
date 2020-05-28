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
import {VendorNameAndId} from "../../tweets/interfaces";

// Get data from redux state
const useFetchLocationsAndVendorNameLookup = (props:any) => {
    // initial state
    const [locationsLoaded, setLocationsLoaded] = useState<boolean>(false);
    const [vendorID, setVendorID] = useState<string>('all');
    const [vendorNameLookup, setVendorNameLookup] = useState<any>({});
    const [vendorNameLookupLoaded, setVendorNameLookupLoaded] = useState<boolean>(false);
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
            return { ...location, vendorName: get(vendorNameLookup, `${location.vendorID}.name`, 'Unknown Vendor') }
        });
        setLocations(locationsWithVendorsMapped);
        console.log('locations loaded')
        setLocationsLoaded(true);
    };
    const createVendorNameLookup = () => {
        const vendorNameLookup = vendors.reduce((acc:any, vendor:VendorNameAndId) => {
            const {name, tweetHistory, _id} = vendor;
            acc[_id] = { name, tweetHistory };
            return acc;
        }, {});
        if (vendors.length === 1) {
            setVendorID(vendors[0]._id)
        }
        setVendorNameLookup(vendorNameLookup);
        setVendorNameLookupLoaded(true);
    }
    const { vendors, vendorsLoaded } = useFetchVendors(props);
    useEffect(() => {
        // first, get vendors if they haven't been loaded, yet
        if (isAuthenticated && vendorsLoaded && !vendorNameLookupLoaded) {
            createVendorNameLookup()
            if (vendors.length === 1) {
                setVendorID(vendors[0]._id)
            }
            // then get the locations, if they haven't been loaded yet
        } else if (isAuthenticated && vendorsLoaded && vendorNameLookupLoaded && !locationsLoaded) {
            fetchLocations();
        }
    }, [isAuthenticated, vendorsLoaded, locationsLoaded, vendorID, vendorNameLookupLoaded]);
    return { vendorNameLookup, locationsLoaded, locations }
}

export default useFetchLocationsAndVendorNameLookup;
