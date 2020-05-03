import useGetAppState from "../common/hooks/use-get-app-state";
import React, {useEffect, useState} from "react";
import { withRouter } from 'react-router';
import {VENDOR_API} from "../../config";
import ReactTable from 'react-table';
import 'react-table/react-table.css'
import axios, {AxiosResponse} from "axios";
import moment from 'moment';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import queryString from 'query-string';
import useAuthentication from "../common/hooks/use-authentication";
import { VendorNameAndId, Tweet } from "./interfaces";

const getTweetTableDates = () => {
    // the dates below are just used for the date filtering functionality, where we only display tweets during a certain time period
    const now = moment(new Date());
    const remainder = 30 - (now.minute() % 30);
    // initialStartDate is the default date/time of the earliest tweet to show (can be adjusted by user)
    // initialEndDate is the default date/time of the last tweet to show (can be adjusted by user)
    const initialEndDate = moment(now).add(remainder, "minutes").toDate();
    const initialStartDate = moment(initialEndDate).subtract(1, 'days').toDate();
    // minDate is as far back in the calendar as a user can go when filtering dates.  It's arbitrary
    const minDate = moment(initialEndDate).subtract(1000000, 'days').toDate();
    return { minDate, initialStartDate, initialEndDate };
};

const TweetTable = (props:any) => {
    const { minDate, initialStartDate, initialEndDate } = getTweetTableDates();

    // initial state
    const [loading, setLoading] = useState<boolean>(true);
    const [tweetsLoaded, setTweetsLoaded] = useState<boolean>(false);
    const [vendorsLoaded, setVendorsLoaded] = useState<boolean>(false);
    const [vendorID, setVendorID] = useState<string>('all');
    const [vendorNameLookup, setVendorNameLookup] = useState<any>({});
    const [startDate, setStartDate] = useState<Date | null>(initialStartDate);
    const [endDate, setEndDate] = useState<Date | null>(initialEndDate);
    const [tweets, setTweets] = useState<Tweet[]>([]);

    const { user } = useGetAppState();
    const { isAuthenticated } = user;
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
                const vendorNameLookup = res.data.vendors.reduce((acc:any, vendor:VendorNameAndId) => {
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

    const selectDate = (date:Date | null, startOrEnd:string) => {
        if (startOrEnd === 'start') {
            setStartDate(date);
        } else {
            setEndDate(date)
        }
    };


    const mapVendorsOntoTweets = (tweets:Tweet[]) => {
        const tweetsWithVendorsMapped = tweets.reduce((acc:any, tweet:Tweet) => {
            tweet.locations.forEach(location => {
                acc.push({ ...tweet, vendorName: vendorNameLookup[tweet.vendorID] || 'Unknown Vendor', locations: undefined, location})
            })
            return acc;
        }, []);
        setTweets(tweetsWithVendorsMapped);
        setTweetsLoaded(true);
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
            id: 'truckNum',
            Header: 'Truck Number',
            accessor: (d:any) => d.location ? d.location.truckNum : 'N/A'
        },
        {
            id: 'location',
            Header: 'Location',
            accessor: (d:any) => d.location ? d.location.address : 'N/A'
        },
        {
            id: 'startDate',
            Header: 'Start Date',
            accessor: (d:any) => d.location ? moment(d.location.startDate).format('YYYY-MM-DD LT') : 'N/A'
        },
        {
            id: 'endDate',
            Header: 'End Date',
            accessor: (d:any) => d.location ? moment(d.location.endDate).format('YYYY-MM-DD LT') : 'N/A'
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

    useAuthentication(props, true, true);
    useEffect(() => {
        // first, get vendors if they haven't been loaded, yet
        if (isAuthenticated && !vendorsLoaded) {
            fetchVendors();
            // then get the tweets, if they haven't been loaded yet or if startDate, endDate, or vendorID changes
        } else if (isAuthenticated) {
            fetchTweets();
        }
    }, [isAuthenticated, vendorsLoaded, tweetsLoaded, startDate, endDate, vendorID]);




    const contentText = !(loading || tweetsLoaded) && !user.isAuthenticated ? 'You must be logged in' : 'Loading...';
    const content = tweetsLoaded ?
        (
            <div className="table_wrapper">
                <select value={vendorID} onChange={e=>setVendorID(e.target.value)}>
                    <option value="all">All Vendors</option>
                    {Object.entries(vendorNameLookup).map((entry:[any, any]) => {
                        const [id, name] = entry;
                        return <option key={id} value={id}>{name}</option>
                    })}
                </select>
                <DatePicker
                    selected={startDate}
                    onChange={date=>selectDate(date, 'start')}
                    showTimeSelect
                    dateFormat="MMM d, yyyy h:mm aa"
                    minDate={minDate}
                    maxDate={initialEndDate}
                />
                <DatePicker
                    selected={endDate}
                    onChange={date=>selectDate(date, 'end')}
                    showTimeSelect
                    dateFormat="MMM d, yyyy h:mm aa"
                    minDate={startDate}
                    maxDate={initialEndDate}
                />
                <div className="table_spacing">
                    <ReactTable
                        data={tweets}
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
};

export default withRouter(TweetTable);
