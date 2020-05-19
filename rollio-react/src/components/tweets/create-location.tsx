import useGetAppState from "../common/hooks/use-get-app-state";
import React, { useEffect, useState } from "react";
import { withRouter } from 'react-router';
import { VENDOR_API } from "../../config";
import 'react-table/react-table.css'
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import axios, {AxiosResponse} from "axios";
import moment from 'moment';
import Autocomplete from 'react-google-autocomplete';
import useAuthentication from "../common/hooks/use-authentication";

const CreateLocation = (props:any) => {
    const defaultLocation = {truckNum: 1, startDate: moment().toDate(), endDate: moment().add(1, 'days').toDate()};
    const [loading, setLoading] = useState<boolean>(true);
    const [vendors, setVendors] = useState<any>([]);
    const [vendorsLoaded, setVendorsLoaded] = useState<boolean>(false);
    const [selectedVendor, setSelectedVendor] = useState<any>({...defaultLocation});
    const [location, setLocation] = useState<any>({...defaultLocation});
    const { user } = useGetAppState();
    const { isAuthenticated } = user;
    const tweetUrl = `${VENDOR_API}/tweets`;
    const vendorUrl = `${VENDOR_API}/vendor`;

    const dateValid = () => {
        const {startDate, endDate} = location;
        return startDate < endDate;
    }


    const goToLoginPage = () => {
        props.history.push('/login');
    };

    const setLocationInformation = (data:any) => {
        setLocation({...location, ...data})
    }

    const saveSearchedLocation = () => {
        setLoading(true);
        const data = {
            truckNum: location.truckNum,
            address: location.formatted_address,
            city: location.address_components.find((component:any) => component.types.includes('locality')).long_name,
            coordinates: {lat: location.geometry.location.lat(), long: location.geometry.location.lng()},
            startDate: location.startDate,
            endDate: location.endDate
        };
        axios({
            method: "POST",
            data,
            url: `${vendorUrl}/${selectedVendor._id}/newlocation`,
            headers: {'Authorization': "Bearer " + localStorage.token}
        })
            .then((res: AxiosResponse<any>) => {
                setLoading(false);
                // TODO: link to a different page (either list of locations OR vendor profile)
            }).catch((err:any) => {
            setLoading(false);
            console.error(err);
            throw err;
        })
    };

    const fetchVendors = () => {
        setLoading(true);
        axios({
            method: "GET",
            url: `${tweetUrl}/vendors`,
            headers: {'Authorization': "Bearer " + localStorage.token}
        })
            .then((res: AxiosResponse<any>) => {
                setVendors(res.data.vendors);
                if (res.data.vendors.length === 1) {
                    setSelectedVendor(res.data.vendors[0]);
                }
                setVendorsLoaded(true);
                setLoading(false);
            }).catch((err:any) => {
            console.error(err);
            throw err;
        })
    };

    useAuthentication(props, true, false);
    useEffect(() => {
        if (isAuthenticated && !vendorsLoaded) {
            fetchVendors();
        }
    }, [isAuthenticated, vendorsLoaded]);


    const contentText = !loading && !isAuthenticated ? 'You must be logged in' : 'Loading...';
    const content = !loading ?
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
                                onClick={() => saveSearchedLocation()}
                            >
                                Add the location and dates for Truck #{location.truckNum}
                            </button>
                        </td>
                    </tr>
                    </tbody>
                </table>
                {/*<div>*/}
                {/*    <button*/}
                {/*        onClick={goToAllTweets}*/}
                {/*    >*/}
                {/*        Go to */}
                {/*    </button>*/}
                {/*</div>*/}
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
