import useGetAppState from "../../common/hooks/use-get-app-state";
import React, {useEffect, useState} from "react";
import { withRouter } from 'react-router';
import {VENDOR_API} from "../../../config";
import ReactTable from 'react-table';
import '../unused/admin/node_modules/react-table/react-table.css'
import axios, {AxiosResponse} from "axios";
import moment from 'moment';
import DatePicker from "react-datepicker";
import "../unused/admin/node_modules/react-datepicker/dist/react-datepicker.css";
import queryString from 'query-string';
import useAuthenticateRoute from "../../authentication/hooks/use-authenticate-route";
import useFetchVendors from "../../common/hooks/use-fetch-vendors";
import { Tweet } from "./interfaces";
import { get } from "lodash";

const getTweetTableDates = () => {
    // the dates below are just used for the date filtering functionality, where we only display tweets during a certain time period
    const now = moment(new Date());
    const remainder = 30 - (now.minute() % 30);
    // initialStartDate is the default date/time of the earliest tweet to show (can be adjusted by user)
    // initialEndDate is the default date/time of the last tweet to show (can be adjusted by user)
    const initialEndDate = moment(now).add(remainder, "minutes").toDate();
    const initialStartDate = moment(initialEndDate).subtract(2, 'days').toDate();
    // minDate is as far back in the calendar as a user can go when filtering dates.  It's arbitrary
    const minDate = moment(initialEndDate).subtract(1000000, 'days').toDate();
    return { minDate, initialStartDate, initialEndDate };
};

const TweetTable = (props:any) => {
    const { minDate, initialStartDate, initialEndDate } = getTweetTableDates();

    // initial state
    const [tweetsLoaded, setTweetsLoaded] = useState<boolean>(false);
    const [vendorID, setVendorID] = useState<string>('all');
    const [startDate, setStartDate] = useState<Date | null>(initialStartDate);
    const [endDate, setEndDate] = useState<Date | null>(initialEndDate);
    const [tweets, setTweets] = useState<Tweet[]>([]);
    const routeVendorID = get(props, 'match.params.vendorId', '');

    const { user } = useGetAppState();
    const { isAuthenticated } = user;
    const tweetUrl = `${VENDOR_API}/tweets`;

    const fetchTweets = () => {
        setTweetsLoaded(true);
        const query = { startDate, endDate, vendorID: routeVendorID || vendorID === 'all' ? null : vendorID };
        axios({
            method: "GET",
            url: `${tweetUrl}/filter/?${queryString.stringify(query)}`,
            headers: {'Authorization': "Bearer " + localStorage.token}
        })
            .then((res: AxiosResponse<any>) => {
                mapVendorsOntoTweets(res.data.tweets);
                setTweetsLoaded(true);
            }).catch((err:any) => {
                setTweetsLoaded(false);
                console.error(err);
                throw err;
            })
    };

    const { vendorLookupLoaded, vendorLookUp } = useFetchVendors(props);

    const selectDate = (date:Date | null, startOrEnd:string) => {
        if (startOrEnd === 'start') {
            setStartDate(date);
        } else {
            setEndDate(date)
        }
    };


    const mapVendorsOntoTweets = (tweets:Tweet[]) => {
        const tweetsWithVendorsMapped = tweets.reduce((acc:any, tweet:Tweet) => {
            const baseTweetData = { ...tweet, vendorName: get(vendorLookUp, `${tweet.vendorID}.name`, 'Unknown Vendor'), locations: undefined }
            if (tweet.locations.length) {
                // we break each location into its own line, so that it is easier to read
                tweet.locations.forEach(location => {
                    acc.push({ ...baseTweetData, location})
                })
            } else {
                acc.push({ ...baseTweetData, location: null})
            }
            return acc;
        }, []);
        setTweets(tweetsWithVendorsMapped);
        setTweetsLoaded(true);
    };

    const goToTweetPage = (tweet:any) => {
        const {_id: tweetID, vendorID} = tweet;
        props.history.push(`/tweets/vendor/${vendorID}/tweet/${tweetID}`);
    };

    const goToLoginPage = () => {
        props.history.push('/login');
    };

    const goToNewLocation = () => {
        props.history.push('/newlocation')
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
            id: 'overridden',
            Header: 'Overridden',
            accessor: (d:any) => d.location ? (d.location.overridden ? 'Yes' : 'No') : 'N/A'
        },
        {
            id: 'actions',
            Header: 'Actions',
            accessor: (d:any) => ({...d}),
            Cell: (props:any) => (
                <button
                id={props.id}
                onClick={() => goToTweetPage(props.value)}
                >
                Edit Tweet
            </button>
            )
        }
    ];
    useAuthenticateRoute(props, true, true);
    useEffect(() => {
        if (isAuthenticated && vendorLookupLoaded) {
                fetchTweets();
        }
    }, [isAuthenticated, vendorLookupLoaded, startDate, endDate, vendorID]);




    const contentText = isAuthenticated ? 'Loading...' : 'You must be logged in';
    const content = tweetsLoaded ?
        (
            <div className="table_wrapper">
                { Object.entries(vendorLookUp).length > 1 &&
                    <select value={vendorID} onChange={e=>setVendorID(e.target.value)}>
                        <option value="all">All Vendors</option>
                        {Object.entries(vendorLookUp).map((entry:[any, any]) => {
                            const [id, {name}] = entry;
                            return <option key={id} value={id}>{name}</option>
                        })}
                    </select>
                }
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

export default withRouter(TweetTable);
