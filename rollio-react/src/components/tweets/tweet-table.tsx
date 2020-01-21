import useGetAppState from "../common/hooks/use-get-app-state";
import React, {useEffect, useState} from "react";
import { withRouter } from 'react-router';
import {VENDOR_API} from "../../config";
import {fetchUserAsync} from "../../redux/actions/user-actions";
import {useDispatch} from "react-redux";
import ReactTable from 'react-table';
import 'react-table/react-table.css'
import axios, {AxiosResponse} from "axios";
import moment from 'moment';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import queryString from 'query-string';

const TweetTable = (props:any) => {
    // TODO: move much of the logic into a /hooks folder
    const dispatch = useDispatch();
    // the dates below are just used for the date filtering functionality, where we only display tweets during a certain time period
    const now = moment(new Date());
    const remainder = 30 - (now.minute() % 30);
    // initialStartDate is the default date/time of the earliest tweet to show (can be adjusted by user)
    // initialEndDate is the default date/time of the last tweet to show (can be adjusted by user)
    const initialEndDate = moment(now).add(remainder, "minutes").toDate();
    const initialStartDate = moment(initialEndDate).subtract(1, 'days').toDate();
    // minDate is as far back in the calendar as a user can go when filtering dates.  It's arbitrary
    const minDate = moment(initialEndDate).subtract(1000000, 'days').toDate();

    const [loading, setLoading] = useState<boolean>(true);
    const [rowsLoaded, setRowsLoaded] = useState<boolean>(false);
    const [vendorsLoaded, setVendorsLoaded] = useState<boolean>(false);
    const [vendorID, setVendorID] = useState<string>('all');
    const [vendorNameLookup, setVendorNameLookup] = useState<any>({});
    const [startDate, setStartDate] = useState<Date>(initialStartDate);
    const [endDate, setEndDate] = useState<Date>(initialEndDate);
    const [rows, setRows] = useState([]);

    const {user} = useGetAppState();
    const tweetUrl = `${VENDOR_API}/tweets`;

    const fetchTweets = () => {
        setLoading(true);
        const query = { startDate, endDate, vendorID: vendorID === 'all' ? null : vendorID };
        axios({
            method: "GET",
            url: `${tweetUrl}/filter/?${queryString.stringify(query)}`,
            headers: {'Authorization': "Bearer " + localStorage.token}
        })
            .then((res: AxiosResponse<any>) => {
                mapVendorsOntoTweets(res.data.tweets);
                setLoading(false);
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
                const vendorNameLookup = res.data.vendors.reduce((acc:any, vendor:any) => {
                    acc[vendor._id] = vendor.name;
                    return acc;
                }, {});
                setVendorNameLookup(vendorNameLookup);
                setVendorsLoaded(true);
            }).catch((err:any) => {
            console.error(err);
            throw err;
        })
    };

    const selectDate = (date:any, startOrEnd:string) => {
        if (startOrEnd === 'start') {
            setStartDate(date);
        } else {
            setEndDate(date)
        }
    };


    const mapVendorsOntoTweets = async (tweets:any) => {
        const tweetsWithVendorsMapped = tweets.map((tweet:any) => ({...tweet, vendorName: vendorNameLookup[tweet.vendorID] || 'Unknown Vendor' }));
        setRows(tweetsWithVendorsMapped);
        setRowsLoaded(true);
    };

    const goToTweetPage = (tweetID:string) => {
        props.history.push(`tweets/${tweetID}`);
    };

    const goToLoginPage = () => {
        props.history.push('/login');
    };

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
            Header: 'Text',
            accessor: 'text'
        },
        {
            id: 'location',
            Header: 'Location',
            accessor: (d:any) => d.location ? d.location.address : 'N/A'
        },
        {
            id: 'usedForLocation',
            Header: 'Used For Location',
            accessor: (d:any) => d.usedForLocation ? 'Yes' : 'No'
        },
        {
            id: 'actions',
            Header: 'Actions',
            accessor: (d:any) => ({...d}),
            Cell: (props:any) => (
                <button
                id={props.id}
                onClick={() => goToTweetPage(props.value._id)}
                >
                Edit Tweet
            </button>
            )
        }
    ];

    useEffect(() => {
        if (vendorsLoaded) {
            fetchTweets();
        } else if (user.isAuthenticated) {
            fetchVendors();
        } else if(localStorage.token && localStorage.token.length) {
            dispatch(fetchUserAsync(fetchVendors));
        } else {
            setLoading(false);
        }
    }, [vendorID, startDate, endDate, vendorsLoaded]);

    const contentText = !(loading || rowsLoaded) && !user.isAuthenticated ? 'You must be logged in' : 'Loading...';
    const content = rowsLoaded ?
        (
            <div className="table_wrapper">
                <select value={vendorID} onChange={e=>setVendorID(e.target.value)}>
                    <option value="all">All Vendors</option>
                    {Object.entries(vendorNameLookup).map((entry:any) => {
                        const [id, name] = entry;
                        return <option key={id} value={id}>{name}</option>
                    })}
                </select>
                <DatePicker
                    selected={startDate}
                    onChange={e=>selectDate(e, 'start')}
                    showTimeSelect
                    dateFormat="MMM d, yyyy h:mm aa"
                    minDate={minDate}
                    maxDate={initialEndDate}
                />
                <DatePicker
                    selected={endDate}
                    onChange={e=>selectDate(e, 'end')}
                    showTimeSelect
                    dateFormat="MMM d, yyyy h:mm aa"
                    minDate={startDate}
                    maxDate={initialEndDate}
                />
                <div className="table_spacing">
                    <ReactTable
                        data={rows}
                        columns={columns}
                        defaultPageSize={10}
                    />
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
}

export default withRouter(TweetTable);
