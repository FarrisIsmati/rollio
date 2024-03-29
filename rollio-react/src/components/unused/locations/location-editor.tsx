import useGetAppState from "../../common/hooks/use-get-app-state";
import React, { useEffect, useState } from "react";
import { withRouter } from 'react-router';
import { VENDOR_API } from "../../../config";
import '../unused/admin/node_modules/react-table/react-table.css'
import "../unused/admin/node_modules/react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import axios from "axios";
import moment from 'moment';
import Autocomplete from 'react-google-autocomplete';
import useAuthenticateRoute from "../../authentication/hooks/use-authenticate-route";
import useFetchLocationsAndVendors from "./hooks/use-fetch-locations-and-vendors";
import {get, pick} from "lodash";
import { isLocationActive } from "../../../util";
import ButtonBare from "../../common/buttons/button-bare";

const LocationEditor = (props:any) => {
    const defaultLocation = {truckNum: 1, startDate: moment().toDate(), endDate: moment().add(1, 'days').toDate()};
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedVendor, setSelectedVendor] = useState<any>({});
    const [location, setLocation] = useState<any>({...defaultLocation});
    const [existingLocation, setExistingLocation] = useState<any>({});
    const { user } = useGetAppState();
    const { isAuthenticated } = user;
    const vendorUrl = `${VENDOR_API}/vendor`;
    const routeLocationID = get(props, 'match.params.locationId', '');
    const routeVendorID = get(props, 'match.params.vendorID', '');
    const editUrl = `${vendorUrl}/${selectedVendor._id}/editlocation/location/${routeLocationID}`;
    const newUrl = `${vendorUrl}/${selectedVendor._id}/newlocation`;


    const pickVendor = (vendor:string) => {
        setSelectedVendor(JSON.parse(vendor));
    }

    const dateValid = () => {
        const {startDate, endDate} = location;
        return startDate < endDate;
    }

    const goToLoginPage = () => {
        props.history.push('/login');
    };

    const goToAllLocations = () => {
        const vendorId = get(user, 'vendorID', '');
        props.history.push(`/locations/${vendorId}`);
    };

    const setLocationInformation = (data:any, isAddress?:boolean) => {
        const locationUpdates = isAddress ? {
            address: data.formatted_address,
            city: data.address_components.find((component:any) => component.types.includes('locality')).long_name,
            coordinates: { lat: data.geometry.location.lat(), long: data.geometry.location.lng() },
        } : data;
        setLocation({...location, ...locationUpdates})
    }

    const updateDateOnly = () => {
        saveSearchedLocation({
            data: { startDate: location.startDate, endDate: location.endDate },
            method: "PATCH",
            url: editUrl
        })
    }

    const updateOverridden = (overridden:boolean) => {
        saveSearchedLocation({
            data: { overridden },
            method: "PATCH",
            url: editUrl
        })
    }

    const leaveNow = () => {
        saveSearchedLocation({
            data: { endDate: new Date() },
            method: "PATCH",
            url: editUrl
        })
    }

    const saveLocation = () => {
        const data = pick(location, ['truckNum', 'address', 'city', 'coordinates', 'startDate', 'endDate']);
        const {method, url} = routeLocationID ?
            { method: "PATCH", url: editUrl } :
            { method: "POST", url: newUrl }
        saveSearchedLocation({data, method, url});
    };

    const saveSearchedLocation = (x:any) => {
        const {data, method, url} = x;
        setLoading(true);
        axios({
            method,
            data,
            url,
            headers: {'Authorization': "Bearer " + localStorage.token}
        })
            .then(() => {
                setLoading(false);
                props.history.push(`/locations/${selectedVendor._id}`)
            }).catch((err:any) => {
            setLoading(false);
            console.error(err);
            throw err;
        })
    };
    useAuthenticateRoute(props, true, false);
    const { locationsLoaded, locations, vendors, vendorsLoaded } = useFetchLocationsAndVendors(props);
    useEffect(() => {
        if ((!routeLocationID || locationsLoaded) && vendorsLoaded) {
            if (routeLocationID && locationsLoaded) {
                const [queriedLocation] = locations;
                const { startDate, endDate } = queriedLocation;
                const queriedLocationWithDates = { ...queriedLocation, startDate: moment(startDate).toDate(), endDate: moment(endDate).toDate() };
                setSelectedVendor(vendors.find((vendor) => vendor._id === queriedLocation.vendorID))
                setLocation(queriedLocationWithDates);
                setExistingLocation(queriedLocationWithDates);
            }
            const vendor = routeVendorID ? vendors.find(v => v._id === routeVendorID) : vendors[0];
            setSelectedVendor(vendor);
            setLoading(false);
        }
    }, [vendorsLoaded, locationsLoaded]);
    const anythingLoading = loading || !vendorsLoaded;
    const contentText = !anythingLoading && !isAuthenticated ? 'You must be logged in' : 'Loading...';
    const content = !anythingLoading ?
        (
            <div>
                <table>
                    <tbody>
                    <tr>
                        <td>
                            Vendor:
                        </td>
                        <td>
                            <select onChange={e=>pickVendor(e.target.value)}>
                                {vendors.filter((v:any) => !routeVendorID || v._id === routeVendorID).map((vendor:any) => {
                                    return <option key={vendor._id} value={JSON.stringify(vendor)}>{vendor.name}</option>
                                })}
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            Truck Number:
                        </td>
                        <td>
                            <input
                                type='number'
                                onChange={e=>{setLocationInformation({truckNum: e.target.value})}}
                                value={location.truckNum}
                                min={1}
                                max={selectedVendor.truckNum || 1}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>Start Date - Truck #{location.truckNum}</td>
                        <td>
                            <DatePicker
                                selected={location.startDate}
                                onChange={startDate => setLocationInformation({startDate})}
                                showTimeSelect
                                dateFormat="MMM d, yyyy h:mm aa"
                                minDate={moment().toDate()}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>End Date - Truck #{location.truckNum}</td>
                        <td>
                            <DatePicker
                                selected={location.endDate}
                                onChange={endDate => setLocationInformation({endDate})}
                                showTimeSelect
                                dateFormat="MMM d, yyyy h:mm aa"
                                minDate={moment().toDate()}
                            />
                        </td>
                    </tr>
                    {!dateValid() && <tr><td colSpan={2}><i>Problem! Start Date After End Date</i></td></tr>}
                    {
                        routeLocationID &&
                        <tr>
                            <td>Overridden</td>
                            <td>{location.overridden ? 'Yes' : 'No'}</td>
                        </tr>
                    }
                    {
                        routeLocationID &&
                        <tr>
                            <td>Address</td>
                            <td>{location.address}</td>
                        </tr>
                    }
                    <tr>
                        <td colSpan={2}>
                            {/* TODO: possibly restrict based on region of vendor */}
                            <Autocomplete
                                style={{width: '100%'}}
                                onPlaceSelected={(place:any) => {
                                    setLocationInformation(place, true);
                                }}
                                types={['address']}
                                placeholder={`Search for a new location for Truck #${location.truckNum}`}
                                componentRestrictions={{country: "us"}}
                            />
                        </td>
                    </tr>
                    {
                        routeLocationID &&
                        <tr>
                            <td colSpan={2}>
                                <button
                                    disabled={!dateValid()}
                                    onClick={() => updateDateOnly()}
                                >
                                    Update date only for Truck #{location.truckNum}
                                </button>
                            </td>
                        </tr>
                    }
                    {
                        routeLocationID &&
                        <tr>
                            <td colSpan={2}>
                                <button
                                    onClick={() => updateOverridden(!existingLocation.overridden)}
                                >
                                    {existingLocation.overridden ? 'Re-active' : 'Delete'} location for Truck #{location.truckNum}
                                </button>
                            </td>
                        </tr>
                    }
                    {
                        routeLocationID && isLocationActive(existingLocation) &&
                        <tr>
                            <td colSpan={2}>
                                <ButtonBare handleClick={leaveNow} text={'LEAVE LOCATION NOW'} id={existingLocation._id}/>
                            </td>
                        </tr>
                    }
                    <tr>
                        <td colSpan={2}>
                            <button
                                disabled={!location.address || !dateValid()}
                                onClick={() => saveLocation()}
                            >
                                {routeLocationID ? 'Edit' : 'Add'} the location and dates for Truck #{location.truckNum}
                            </button>
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={2}>
                            <button
                                onClick={() => goToAllLocations()}
                            >
                                Go back to all locations
                            </button>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        ) :
        (
            <div>
                <p>{contentText}</p>
                { !isAuthenticated &&
                    <button
                        onClick={() => goToLoginPage()}
                    >
                        Login
                    </button>
                }
            </div>
        );


    return (
        <div>
            { content }
        </div>
    );
}

export default withRouter(LocationEditor);
