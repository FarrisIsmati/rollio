// TODO: finish this - WIP
import useGetAppState from "../common/hooks/use-get-app-state";
import React, { useEffect, useState } from "react";
import { withRouter } from 'react-router';
import { VENDOR_API } from "../../config";
import 'react-table/react-table.css'
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import axios from "axios";
import moment from 'moment';
import Autocomplete from 'react-google-autocomplete';
import useAuthentication from "../common/hooks/use-authentication";
import useFetchVendors from "../common/hooks/use-fetch-vendors";
import {get, pick} from "lodash";

const CreateLocation = (props:any) => {
    const defaultLocation = {truckNum: 1, startDate: moment().toDate(), endDate: moment().add(1, 'days').toDate()};
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedVendor, setSelectedVendor] = useState<any>({...defaultLocation});
    const [location, setLocation] = useState<any>({...defaultLocation});
    const { user } = useGetAppState();
    const { isAuthenticated } = user;
    const vendorUrl = `${VENDOR_API}/vendor`;
    const routeLocationID = get(props, 'match.params.locationId', '');

    const dateValid = () => {
        const {startDate, endDate} = location;
        return startDate < endDate;
    }

    const goToLoginPage = () => {
        props.history.push('/login');
    };

    const goToAllLocations = () => {
        const vendorId = get(user, 'vendorId', '');
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
            url: ''
        })
    }

    const saveLocation = () => {
        const data = pick(location, ['truckNum', 'address', 'city', 'coordinates', 'startDate', 'endDate']);
        const {method, url} = routeLocationID ?
            { method: "PATCH", url: `${vendorUrl}/${selectedVendor._id}/editlocation/${routeLocationID}` } :
            { method: "POST", url: `${vendorUrl}/${selectedVendor._id}/newlocation` }
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
    useAuthentication(props, true, false);
    const { vendors, vendorsLoaded } = useFetchVendors(props);
    useEffect(() => {
        if (vendorsLoaded) {
            setSelectedVendor(vendors[0]);
            setLoading(false);
        }
    }, [vendorsLoaded]);
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
                            <select value={selectedVendor} onChange={e=>setSelectedVendor(e.target.value)}>
                                {vendors.map((vendor:any) => {
                                    return <option key={vendor._id} value={vendor}>{vendor.name}</option>
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
                    <tr>
                        <td colSpan={2}>
                            {/* TODO: possibly restrict based on region of vendor */}
                            <Autocomplete
                                style={{width: '100%'}}
                                onPlaceSelected={(place:any) => {
                                    setLocationInformation(place);
                                }}
                                types={['address']}
                                placeholder={`Search for a new location for Truck #${location.truckNum}`}
                                componentRestrictions={{country: "us"}}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={2}>
                            <button
                                disabled={!location.formatted_address || !dateValid()}
                                onClick={() => saveLocation()}
                            >
                                Add the location and dates for Truck #{location.truckNum}
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

export default withRouter(CreateLocation);
