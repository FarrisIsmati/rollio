// TODO: update to allow for multiple locations on one tweet!
import useGetAppState from "../common/hooks/use-get-app-state";
import React, { useEffect, useState } from "react";
import { withRouter } from 'react-router';
import { VENDOR_API } from "../../config";
import 'react-table/react-table.css'
import "react-datepicker/dist/react-datepicker.css";
import axios, {AxiosResponse} from "axios";
import moment from 'moment';
import Autocomplete from 'react-google-autocomplete';
import useAuthentication from "../common/hooks/use-authentication";
import {Tweet, TweetDefaultState } from "./interfaces";

const UpdateLocation = (props:any) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [tweet, setTweet] = useState<Tweet>(TweetDefaultState);
    const [searchedLocationLookUp, setSearchedLocationLookUp] = useState<any>({});
    const { user } = useGetAppState();
    const { isAuthenticated, type } = user;
    const tweetUrl = `${VENDOR_API}/tweets`;

    const setSearchedLocationByIndex = (location:any, index:number) => {
        setSearchedLocationLookUp({...searchedLocationLookUp[index], [index]: location})
    }

    const fetchTweet = () => {
        setLoading(true);
        axios({
            method: "GET",
            url: `${tweetUrl}/usetweet/${props.match.params.tweetId}`,
            headers: {'Authorization': "Bearer " + localStorage.token}
        })
            .then((res: AxiosResponse<any>) => {
                setTweet(res.data.tweet);
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
                // TODO: need to also update the state.data.allVendors somehow
                setTweet(res.data.tweet);
                setLoading(false);
            }).catch((err:any) => {
            setLoading(false);
            console.error(err);
            throw err;
        })
    };

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
            coordinates: {lat: searchedLocationLookUp[truckNum].geometry.location.lat(), long: searchedLocationLookUp[truckNum].geometry.location.lng()}
            // TODO: add startDate and endDate options
        };
        axios({
            method: "POST",
            data,
            url: `${tweetUrl}/createnewlocation/${props.match.params.tweetId}`,
            headers: {'Authorization': "Bearer " + localStorage.token}
        })
            .then((res: AxiosResponse<any>) => {
                // TODO: need to also update the state.data.allVendors somehow
                setTweet(res.data.tweet);
                setLoading(false);
            }).catch((err:any) => {
            setLoading(false);
            console.error(err);
            throw err;
        })
    };

    const saveDatesOnly = (location:any) => {
        // TODO: wire this up
    };

    useAuthentication(props, true, true);
    useEffect(() => {
        if (isAuthenticated && type === 'admin') {
            fetchTweet();
        }
    }, [isAuthenticated, type]);

    const searchAndSaveButton = (truckNum:number) => {
        return (
            <>
                <tr>
                    <td colSpan={2}>
                        {/* TODO: possibly restrict based on region of vendor */}
                        <Autocomplete
                            style={{width: '30%'}}
                            onPlaceSelected={(place:any) => {
                                setSearchedLocationByIndex(place, truckNum);
                            }}
                            types={['address']}
                            componentRestrictions={{country: "us"}}
                        />
                    </td>
                </tr>
                <tr>
                    <td colSpan={2}>
                        <button
                            disabled={!searchedLocationLookUp[truckNum]}
                            onClick={() => saveSearchedLocation(truckNum)}
                        >
                            Update the location for this tweet
                        </button>
                    </td>
                </tr>
            </>
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
                                    return (<>
                                        <tr>
                                            <td>Location - Truck #{location.truckNum}</td>
                                            <td>{location.address}</td>
                                        </tr>
                                        <tr>
                                            <td>Start Date - Truck #{location.truckNum}</td>
                                            <td>{moment(location.startDate).format('YYYY-MM-DD LT')}</td>
                                        </tr>
                                        <tr>
                                            <td>End Date - Truck #{location.truckNum}</td>
                                            <td>{moment(location.endDate).format('YYYY-MM-DD LT')}</td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <button
                                                    onClick={() => saveDatesOnly(location)}
                                                >
                                                    Update the start and end date only
                                                </button>
                                            </td>
                                        </tr>
                                        {searchAndSaveButton(location.truckNum)}
                                        <tr>
                                            <td>
                                                <button
                                                    onClick={() => noLongerUserTweetForLocation(location)}
                                                >
                                                    Delete this location
                                                </button>
                                            </td>
                                        </tr>
                                    </>)
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
