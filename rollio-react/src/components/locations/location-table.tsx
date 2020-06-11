import useGetAppState from "../common/hooks/use-get-app-state";
import React, {useState} from "react";
import { withRouter } from 'react-router';
import ReactTable from 'react-table';
import 'react-table/react-table.css'
import moment from 'moment';
import "react-datepicker/dist/react-datepicker.css";
import useAuthentication from "../common/hooks/use-authentication";
import {isLocationActive} from "../../util/index";
import useFetchLocationsAndVendors from "./hooks/use-fetch-locations-and-vendors";
import ButtonBare from "../common/buttons/button-bare";
import { VENDOR_API } from "../../config";
import axios from "axios";
import {get} from "lodash";

const LocationTable = (props:any) => {
    // initial state
    const [vendorID, setVendorID] = useState<string>('all');
    const { user } = useGetAppState();
    const { isAuthenticated } = user;

    const goToLoginPage = () => {
        props.history.push('/login');
    };

    const goToNewLocation = () => {
        props.history.push('/newlocation')
    }

    const goToLocationPage = (location:any) => {
        const { tweetID, vendorID: locationVendorId, _id: locationId } = location
        const tweet = vendorLookUp[locationVendorId].tweetHistory.find((x:any) => x.tweetID === tweetID);
        const route = tweetID && locationVendorId ? `/tweets/vendor/${locationVendorId}/tweet/${tweet._id}` : `/newlocation/${locationVendorId}/${locationId}`;
        props.history.push(route);
    }

    const leaveNow = async (location:any) => {
        axios({
            method: "PATCH",
            data: {endDate: new Date()},
            url: `${VENDOR_API}/vendor/${location.vendorID}/editlocation/location/${location._id}`,
            headers: {'Authorization': "Bearer " + localStorage.token}
        }).then(() => {
            const routeVendorID = get(props, 'match.params.vendorId', '');
            props.history.push(`/locations/${routeVendorID}`);
        }).catch(err => {
            console.error(err);
            throw err;
        })
    }

    const columns = [
        {
            accessor: 'vendorName',
            Header: 'Vendor',
        },
        {
            id: 'date',
            Header: 'Date',
            accessor: (d:any) => moment(d.date).format('YYYY-MM-DD LT')
        },
        {
            id: 'truckNum',
            Header: 'Truck Number',
            accessor: (d:any) => d.truckNum
        },
        {
            id: 'location',
            Header: 'Location',
            accessor: (d:any) => d.address
        },
        {
            id: 'startDate',
            Header: 'Start Date',
            accessor: (d:any) => moment(d.startDate).format('YYYY-MM-DD LT')
        },
        {
            id: 'endDate',
            Header: 'End Date',
            accessor: (d:any) => moment(d.endDate).format('YYYY-MM-DD LT')
        },
        {
            id: 'overridden',
            Header: 'Overridden',
            accessor: (d:any) => (d.overridden ? 'Yes' : 'No')
        },
        {
            id: 'matchMethod',
            Header: 'Source',
            accessor: (d:any) => d.matchMethod
        },
        {
            id: 'isActive',
            Header: 'Currently Active',
            accessor: (d:any) => ({...d}),
            Cell: (props:any) => {
                return isLocationActive(props.value) ? <ButtonBare id={props.value._id} text={'LEAVE LOCATION NOW'} handleClick={() => leaveNow(props.value)}/> : <p>No</p>
            }
        },
        {
            id: 'actions',
            Header: 'Actions',
            accessor: (d:any) => ({...d}),
            Cell: (props:any) => ( props.value.overridden ? 'N/A' :
                    <button
                        id={props.id}
                        onClick={() => goToLocationPage(props.value)}
                    >
                        Edit Location
                    </button>
            )
        }
    ];

    const { locationsLoaded, locations, vendorLookUp } = useFetchLocationsAndVendors(props, vendorID);
    useAuthentication(props, true, true);

    const contentText = !isAuthenticated ? 'You must be logged in' : 'Loading...';
    const content = locationsLoaded ?
        (
            <div className="table_wrapper">
                <select value={vendorID} onChange={e=>setVendorID(e.target.value)}>
                    <option value="all">All Vendors</option>
                    {Object.entries(vendorLookUp).map((entry:[any, any]) => {
                        const [id, {name}] = entry;
                        return <option key={id} value={id}>{name}</option>
                    })}
                </select>
                <div className="table_spacing">
                    <ReactTable
                        data={locations.filter((location:any) => vendorID === 'all' ? location : location.vendorID === vendorID)}
                        columns={columns}
                        defaultPageSize={10}
                    />
                </div>
                <div>
                    <button
                        onClick={goToNewLocation}
                    >
                        Create Location From Scratch
                    </button>
                </div>
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
};

export default withRouter(LocationTable);
