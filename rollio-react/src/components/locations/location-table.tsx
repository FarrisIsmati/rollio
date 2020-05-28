import useGetAppState from "../common/hooks/use-get-app-state";
import React, {useEffect, useState} from "react";
import { withRouter } from 'react-router';
import {VENDOR_API} from "../../config";
import ReactTable from 'react-table';
import 'react-table/react-table.css'
import axios, {AxiosResponse} from "axios";
import moment from 'moment';
import "react-datepicker/dist/react-datepicker.css";
import queryString from 'query-string';
import useAuthentication from "../common/hooks/use-authentication";
import {VendorNameAndId} from "../tweets/interfaces";
import { get } from "lodash";
import {isLocationActive} from "../../util/index";

const LocationTable = (props:any) => {
    // initial state
    const [loading, setLoading] = useState<boolean>(true);
    const [locationsLoaded, setLocationsLoaded] = useState<boolean>(false);
    const [vendorsLoaded, setVendorsLoaded] = useState<boolean>(false);
    const [vendorID, setVendorID] = useState<string>('all');
    const [vendorNameLookup, setVendorNameLookup] = useState<any>({});
    const [locations, setLocations] = useState<Location[]>([]);
    const routeVendorID = get(props, 'match.params.vendorId', '');

    const { user } = useGetAppState();
    const { isAuthenticated } = user;

    const fetchLocations = () => {
        setLoading(true);
        const query = { vendorID: routeVendorID || vendorID === 'all' ? null : vendorID };
        axios({
            method: "GET",
            url: `${VENDOR_API}/locations/filter/?${queryString.stringify(query)}`,
            headers: {'Authorization': "Bearer " + localStorage.token}
        })
            .then((res: AxiosResponse<any>) => {
                mapVendorsOntoLocations(res.data.locations);
                setLoading(false);
            }).catch((err:any) => {
                setLoading(false);
                console.error(err);
                throw err;
            })
    };

    const fetchVendors = () => {
        setLoading(true);
        const query = routeVendorID ? { _id: routeVendorID } : {};
        axios({
            method: "GET",
            url: `${VENDOR_API}/tweets/vendors/?${queryString.stringify(query)}`,
            headers: {'Authorization': "Bearer " + localStorage.token}
        })
            .then((res: AxiosResponse<any>) => {
                const vendorNameLookup = res.data.vendors.reduce((acc:any, vendor:VendorNameAndId) => {
                    const {name, tweetHistory, _id} = vendor;
                    acc[_id] = { name, tweetHistory };
                    return acc;
                }, {});
                if (res.data.vendors.length === 1) {
                    setVendorID(res.data.vendors[0]._id)
                }
                setVendorNameLookup(vendorNameLookup);
                setVendorsLoaded(true);
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
        setLocationsLoaded(true);
    };

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

    useAuthentication(props, true, true);
    useEffect(() => {
        // first, get vendors if they haven't been loaded, yet
        if (isAuthenticated && !vendorsLoaded) {
            fetchVendors();
            // then get the locations, if they haven't been loaded yet or if startDate, endDate, or vendorID changes
        } else if (isAuthenticated) {
            fetchLocations();
        }
    }, [isAuthenticated, vendorsLoaded, locationsLoaded, vendorID]);




    const contentText = !(loading || locationsLoaded) && !user.isAuthenticated ? 'You must be logged in' : 'Loading...';
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
                { !user.isAuthenticated &&
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
