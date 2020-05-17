// TODO: update to allow for multiple locations on one tweet!
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
import {Tweet, TweetDefaultState } from "./interfaces";
import { get } from "lodash";

// TODO: allow adding a new location without deleting the old one
// set up date and time

const UpdateLocation = (props:any) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [tweet, setTweet] = useState<Tweet>(TweetDefaultState);
    const [numTrucks, setNumTrucks] = useState<number>(1);
    const [searchedLocationLookUp, setSearchedLocationLookUp] = useState<any>({});
    const { user } = useGetAppState();
    const { isAuthenticated, type } = user;
    const tweetUrl = `${VENDOR_API}/tweets`;

    const setTweetAndDates = (tweet: any) => {
        const filteredLocations = tweet.locations.filter((location:any) => !location.overridden)
        filteredLocations.forEach((location:any) => {
            const {truckNum, startDate, endDate} = location;
            setSearchedLocationByTruckNum({startDate: moment(startDate).toDate(), endDate: moment(endDate).toDate()}, truckNum)
        })
        setTweet({...tweet, locations: filteredLocations})
    }

    const setSearchedLocationByTruckNum = (locationInfo:any, truckNum:number) => {
        setSearchedLocationLookUp({...searchedLocationLookUp, [truckNum]: {...(searchedLocationLookUp[truckNum] || {}), ...locationInfo}})
    }

    const fetchTweet = () => {
        setLoading(true);
        axios({
            method: "GET",
            url: `${tweetUrl}/usetweet/${props.match.params.tweetId}`,
            headers: {'Authorization': "Bearer " + localStorage.token}
        })
            .then((res: AxiosResponse<any>) => {
                setNumTrucks(res.data.tweet.numTrucks);
                setTweetAndDates(res.data.tweet);
                setLoading(false);
            }).catch((err:any) => {
            setLoading(false);
            console.error(err);
            throw err;
        })
    };

    const noLongerUserTweetForLocation = (location:any) => {
        setLoading(true);
        axios({
            method: "PATCH",
            url: `${tweetUrl}/deletelocation/${props.match.params.tweetId}/${location._id}`,
            headers: {'Authorization': "Bearer " + localStorage.token}
        })
            .then((res: AxiosResponse<any>) => {
                setTweetAndDates(res.data.tweet);
                setLoading(false);
            }).catch((err:any) => {
            setLoading(false);
            console.error(err);
            throw err;
        })
    };

    const addLocation = () => {
        // TODO: think this through (!!!)
    }

    const goToAllTweets = () => {
        props.history.push(`/tweets`);
    };

    const goToLoginPage = () => {
        props.history.push('/login');
    };

    const saveSearchedLocation = (truckNum:number) => {
        setLoading(true);
        const { date, tweetID } = tweet;
        const locationToOverride = tweet.locations.find(location => Number(location.truckNum) === Number(truckNum));
        const data = {
            locationToOverride,
            locationDate: date,
            tweetID,
            truckNum,
            address: searchedLocationLookUp[truckNum].formatted_address,
            city: searchedLocationLookUp[truckNum].address_components.find((component:any) => component.types.includes('locality')).long_name,
            coordinates: {lat: searchedLocationLookUp[truckNum].geometry.location.lat(), long: searchedLocationLookUp[truckNum].geometry.location.lng()},
            startDate: searchedLocationLookUp[truckNum].startDate,
            endDate: searchedLocationLookUp[truckNum].endDate
        };
        postLocationUpdate(data);
    };

    // in the future, we might want to create a custom route to just edit locations
    // but does not seem like a priority now.  Only downside is that the old location will be 'overriden', which seems a little aggressive
    const saveDatesOnly = (truckNum:number) => {
        setLoading(true);
        const locationToOverride = tweet.locations.find(location => Number(location.truckNum) === Number(truckNum));
        const data = {
            locationToOverride,
            ...locationToOverride,
            _id: undefined,
            startDate: searchedLocationLookUp[truckNum].startDate,
            endDate: searchedLocationLookUp[truckNum].endDate
        };
        postLocationUpdate(data);
    };

    const postLocationUpdate = (data:any) => {
        axios({
            method: "POST",
            data,
            url: `${tweetUrl}/createnewlocation/${props.match.params.tweetId}`,
            headers: {'Authorization': "Bearer " + localStorage.token}
        })
            .then((res: AxiosResponse<any>) => {
                setTweetAndDates(res.data.tweet);
                setLoading(false);
            }).catch((err:any) => {
            setLoading(false);
            console.error(err);
            throw err;
        })
    }

    useAuthentication(props, true, true);
    useEffect(() => {
        if (isAuthenticated && type === 'admin') {
            fetchTweet();
        }
    }, [isAuthenticated, type]);

    const searchAndSaveButton = (truckNum:number) => {
        return (
            <React.Fragment key={truckNum}>
                <tr>
                    <td colSpan={2}>
                        {/* TODO: possibly restrict based on region of vendor */}
                        <Autocomplete
                            style={{width: '100%'}}
                            onPlaceSelected={(place:any) => {
                                setSearchedLocationByTruckNum(place, truckNum);
                            }}
                            types={['address']}
                            placeholder={`Search for a new location for Truck #${truckNum}`}
                            componentRestrictions={{country: "us"}}
                        />
                    </td>
                </tr>
                <tr>
                    <td colSpan={2}>
                        <button
                            disabled={!get(searchedLocationLookUp, `${truckNum}.formatted_address`)}
                            onClick={() => saveSearchedLocation(truckNum)}
                        >
                            Update the location and dates for Truck #{truckNum}
                        </button>
                    </td>
                </tr>
            </React.Fragment>
            )
    }

    const contentText = !(loading || tweet) && !isAuthenticated ? 'You must be logged in' : 'Loading...';
    const content = tweet ?
        (
            <div>
                <table>
                    <tbody>
                        <tr>
                            <td>Date</td>
                            <td>{moment(tweet.date).format('YYYY-MM-DD LT')}</td>
                        </tr>
                        <tr>
                            <td>Text</td>
                            <td>{tweet.text}</td>
                        </tr>
                        <tr>
                            <td>Vendor</td>
                            <td>{tweet.vendorID.name}</td>
                        </tr>
                        <tr>
                            <td>UsedForLocation</td>
                            <td>{tweet.usedForLocation ? 'Yes' : 'No'}</td>
                        </tr>
                        {
                            tweet.locations.length ?
                                (tweet.locations.sort((a,b) => Number(a.truckNum) - Number(b.truckNum)).map((location) => {
                                    return (<React.Fragment key={location._id}>
                                        <tr>
                                            <td>Location - Truck #{location.truckNum}</td>
                                            <td>{location.address}</td>
                                        </tr>
                                        <tr>
                                            <td>Start Date - Truck #{location.truckNum}</td>
                                            <td>
                                                <DatePicker
                                                    selected={searchedLocationLookUp[location.truckNum].startDate}
                                                    onChange={startDate => setSearchedLocationByTruckNum({startDate}, location.truckNum)}
                                                    showTimeSelect
                                                    dateFormat="MMM d, yyyy h:mm aa"
                                                    minDate={moment(tweet.date).toDate()}
                                                    maxDate={searchedLocationLookUp[location.truckNum].endDate}
                                                />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>End Date - Truck #{location.truckNum}</td>
                                            <td>
                                                <DatePicker
                                                    selected={searchedLocationLookUp[location.truckNum].endDate}
                                                    onChange={endDate => setSearchedLocationByTruckNum({endDate}, location.truckNum)}
                                                    showTimeSelect
                                                    dateFormat="MMM d, yyyy h:mm aa"
                                                    minDate={searchedLocationLookUp[location.truckNum].startDate}
                                                />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <button
                                                    onClick={() => saveDatesOnly(location.truckNum)}
                                                >
                                                    Update the start and end date only for Truck #{location.truckNum}
                                                </button>
                                            </td>
                                        </tr>
                                        {searchAndSaveButton(location.truckNum)}
                                        <tr>
                                            <td>
                                                <button
                                                    onClick={() => noLongerUserTweetForLocation(location)}
                                                >
                                                    Delete the location for Truck #{location.truckNum}
                                                </button>
                                            </td>
                                        </tr>
                                    </React.Fragment>)
                                })
                                    ) :
                            (
                                <>
                                    <tr>
                                        <td>Location</td>
                                        <td>N/A</td>
                                    </tr>
                                    <tr>
                                        <td>Start Date</td>
                                        <td>N/A</td>
                                    </tr>
                                    <tr>
                                        <td>End Date</td>
                                        <td>N/A</td>
                                    </tr>
                                    {searchAndSaveButton(1)}
                                </>
                            )
                        }
                    </tbody>
                </table>
                <div>
                    <button
                        onClick={addLocation}
                    >
                        Add new location
                    </button>
                    <button
                        onClick={goToAllTweets}
                    >
                        Return to all tweets
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
}

export default withRouter(UpdateLocation);
