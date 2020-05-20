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

const UpdateLocation = (props:any) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [tweet, setTweet] = useState<Tweet>(TweetDefaultState);
    const [searchedLocationLookUp, setSearchedLocationLookUp] = useState<any>({});
    const { user } = useGetAppState();
    const { isAuthenticated, type } = user;
    const tweetUrl = `${VENDOR_API}/tweets`;

    const setTweetAndDates = (tweet: any) => {
        const filteredLocations = tweet.locations.filter((location:any) => !location.overridden)
        const locationInfo = filteredLocations.reduce((acc:any, location:any) => {
            acc[location._id] = {startDate: moment(location.startDate).toDate(), endDate: moment(location.endDate).toDate()};
            return acc;
        }, {});
        setSearchedLocationLookUp(locationInfo);
        setTweet({...tweet, locations: filteredLocations})
    }

    const setLocationInfoByID = (locationInfo:any, id: string) => {
        setSearchedLocationLookUp({...searchedLocationLookUp, [id]: {...(searchedLocationLookUp[id] || {}), ...locationInfo}})
    }

    const fetchTweet = () => {
        setLoading(true);
        axios({
            method: "GET",
            url: `${tweetUrl}/usetweet/${props.match.params.tweetId}`,
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

    const enterNewLocation = () => {
        setSearchedLocationLookUp({...searchedLocationLookUp, newLocation: { startDate: moment(tweet.date).toDate(), endDate: moment(tweet.date).add(1, 'days').toDate(), truckNum: 1 }})
    }

    const dateValid = (id:string) => {
        const {startDate, endDate} = searchedLocationLookUp[id];
        return startDate < endDate;
    }

    const goToAllTweets = () => {
        const vendorId = get(props, 'match.params.vendorId', '');
        props.history.push(`/tweets/${vendorId}`);
    };

    const goToLoginPage = () => {
        props.history.push('/login');
    };

    const saveSearchedLocation = (id:string, truckNum:number) => {
        setLoading(true);
        const { date, tweetID } = tweet;
        const locationToOverride = tweet.locations.find(location => location._id === id);
        const data = {
            locationToOverride,
            locationDate: date,
            tweetID,
            truckNum,
            address: searchedLocationLookUp[id].formatted_address,
            city: searchedLocationLookUp[id].address_components.find((component:any) => component.types.includes('locality')).long_name,
            coordinates: {lat: searchedLocationLookUp[id].geometry.location.lat(), long: searchedLocationLookUp[id].geometry.location.lng()},
            startDate: searchedLocationLookUp[id].startDate,
            endDate: searchedLocationLookUp[id].endDate
        };
        postLocationUpdate(data);
    };

    // in the future, we might want to create a custom route to just edit locations
    // but does not seem like a priority now.  Only downside is that the old location will be 'overriden', which seems a little aggressive
    const saveDatesOnly = (locationID:string) => {
        setLoading(true);
        const locationToOverride = tweet.locations.find(location => location._id === locationID);
        const data = {
            locationToOverride,
            ...locationToOverride,
            _id: undefined,
            startDate: searchedLocationLookUp[locationID].startDate,
            endDate: searchedLocationLookUp[locationID].endDate
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
        if (isAuthenticated) {
            fetchTweet();
        }
    }, [isAuthenticated, type]);

    const searchAndSaveButton = (id:string, truckNum:number) => {
        return (
            <React.Fragment key={truckNum}>
                <tr>
                    <td>Start Date - Truck #{truckNum}</td>
                    <td>
                        <DatePicker
                            selected={searchedLocationLookUp[id].startDate}
                            onChange={startDate => setLocationInfoByID({startDate}, id)}
                            showTimeSelect
                            dateFormat="MMM d, yyyy h:mm aa"
                            minDate={moment(tweet.date).toDate()}
                        />
                    </td>
                </tr>
                <tr>
                    <td>End Date - Truck #{truckNum}</td>
                    <td>
                        <DatePicker
                            selected={searchedLocationLookUp[id].endDate}
                            onChange={endDate => setLocationInfoByID({endDate}, id)}
                            showTimeSelect
                            dateFormat="MMM d, yyyy h:mm aa"
                            minDate={moment(tweet.date).toDate()}
                        />
                    </td>
                </tr>
                {!dateValid(id) && <tr><td colSpan={2}><i>Problem! Start Date After End Date</i></td></tr>}
                <tr>
                    <td colSpan={2}>
                        {/* TODO: possibly restrict based on region of vendor */}
                        <Autocomplete
                            style={{width: '100%'}}
                            onPlaceSelected={(place:any) => {
                                setLocationInfoByID(place, id);
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
                            disabled={!get(searchedLocationLookUp, `${id}.formatted_address`) && !dateValid(id)}
                            onClick={() => saveSearchedLocation(id, truckNum)}
                        >
                            { id === 'newLocation' ? 'Add' : 'Update'} the location and dates for Truck #{truckNum}
                        </button>
                    </td>
                </tr>
            </React.Fragment>
            )
    }

    const contentText = !(loading || tweet) && !isAuthenticated ? 'You must be logged in' : 'Loading...';
    const content = tweet && !loading ?
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
                                        {searchAndSaveButton(location._id, location.truckNum)}
                                        <tr>
                                            <td>
                                                <button
                                                    disabled={!dateValid(location._id)}
                                                    onClick={() => saveDatesOnly(location._id)}
                                                >
                                                    Update the start and end date only for Truck #{location.truckNum}
                                                </button>
                                            </td>
                                        </tr>
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
                                </>
                            )
                        }
                        {
                            searchedLocationLookUp.newLocation &&
                                <>
                                    <tr>
                                        <td><b>ADD NEW LOCATION INFO BELOW</b></td>
                                    </tr>
                                    <tr>
                                        <td>Truck Number</td>
                                        <td>
                                            <input
                                                type='number'
                                                onChange={e=>{setLocationInfoByID({truckNum: e.target.value}, 'newLocation')}}
                                                value={searchedLocationLookUp.newLocation.truckNum}
                                                min={1}
                                                max={tweet.vendorID.numTrucks}
                                            />
                                        </td>
                                    </tr>
                                    {searchAndSaveButton('newLocation', searchedLocationLookUp.newLocation.truckNum)}
                                </>
                        }
                    </tbody>
                </table>
                <div>
                    <button
                        onClick={enterNewLocation}
                    >
                        Enter a new location
                    </button>
                </div>
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
