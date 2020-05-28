import useGetAppState from "../common/hooks/use-get-app-state";
import React, {useState} from "react";
import { withRouter } from 'react-router';
import ReactTable from 'react-table';
import 'react-table/react-table.css'
import moment from 'moment';
import "react-datepicker/dist/react-datepicker.css";
import useAuthentication from "../common/hooks/use-authentication";
import {isLocationActive} from "../../util/index";
import useFetchLocationsAndVendorNameLookup from "./hooks/use-fetch-locations-and-vendor-name-lookup";

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
        const { tweetID, vendorID: locationVendorId } = location
        const tweet = vendorNameLookup[locationVendorId].tweetHistory.find((x:any) => x.tweetID === tweetID);
        // TODO: SET UP ROUTE FOR EDITING LOCATIONS THAT DO NOT HAVE A TWEET ASSOCIATED
        const route = tweetID && locationVendorId ? `/tweets/vendor/${locationVendorId}/tweet/${tweet._id}` : '';
        props.history.push(route);
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
            accessor: (d:any) => isLocationActive(d) ? 'Yes' : 'No'
        },
        {
            id: 'actions',
            Header: 'Actions',
            accessor: (d:any) => ({...d}),
            Cell: (props:any) => (
                <button
                    id={props.id}
                    onClick={() => goToLocationPage(props.value)}
                >
                    Edit Location
                </button>
            )
        }
    ];

    const { vendorNameLookup, locationsLoaded, locations } = useFetchLocationsAndVendorNameLookup(props);
    useAuthentication(props, true, true);

    const contentText = !isAuthenticated ? 'You must be logged in' : 'Loading...';
    const content = locationsLoaded ?
        (
            <div className="table_wrapper">
                <select value={vendorID} onChange={e=>setVendorID(e.target.value)}>
                    <option value="all">All Vendors</option>
                    {Object.entries(vendorNameLookup).map((entry:[any, any]) => {
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
