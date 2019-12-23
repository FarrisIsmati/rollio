import useGetAppState from "../common/hooks/use-get-app-state";
import React, { useEffect, useState } from "react";
import { withRouter } from 'react-router';
import { VENDOR_API } from "../../config";
import { useDispatch } from "react-redux";
import 'react-table/react-table.css'
import "react-datepicker/dist/react-datepicker.css";
import axios, {AxiosResponse} from "axios";
import {fetchUserAsync} from "../../redux/actions/user-actions";
import moment from 'moment';
import Autocomplete from 'react-google-autocomplete';

const UpdateLocation = (props:any) => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState<boolean>(true);
    const [tweet, setTweet] = useState<any>(null);
    const [searchedLocation, setSearchedLocation] = useState<any>(null);
    const {user} = useGetAppState();
    const tweetUrl = `${VENDOR_API}/tweets`;
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

    const noLongerUserTweetForLocation = () => {
        setLoading(true);
        axios({
            method: "PATCH",
            url: `${tweetUrl}/deletelocation/${props.match.params.tweetId}`,
            headers: {'Authorization': "Bearer " + localStorage.token}
        })
            .then((res: AxiosResponse<any>) => {
                // TODO: need to also update the state.data.allVendors somehow
                // TODO: show success, somehow
                setTweet(res.data.tweet);
                setLoading(false);
            }).catch((err:any) => {
            setLoading(false);
            console.error(err);
            throw err;
        })
    };

    const saveSearchedLocation = () => {
        setLoading(true);
        axios({
            method: "POST",
            data: searchedLocation,
            url: `${tweetUrl}/createnewlocation/${props.match.params.tweetId}`,
            headers: {'Authorization': "Bearer " + localStorage.token}
        })
            .then((res: AxiosResponse<any>) => {
                // TODO: need to also update the state.data.allVendors somehow
                // TODO: show success, somehow
                setTweet(res.data.tweet);
                setLoading(false);
            }).catch((err:any) => {
            setLoading(false);
            console.error(err);
            throw err;
        })
    };

    useEffect(() => {
        if (user.isAuthenticated) {
            fetchTweet();
        } else if(localStorage.token && localStorage.token.length) {
            dispatch(fetchUserAsync(fetchTweet));
        } else {
            setLoading(false);
        }
    }, []);

    const contentText = !(loading || tweet) && !user.isAuthenticated ? 'You must be logged in' : 'Loading...';
    const usedForLocation = tweet && tweet.usedForLocation;
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
                            usedForLocation &&
                                <tr>
                                    <td>
                                        <button
                                            onClick={() => noLongerUserTweetForLocation()}
                                        >
                                            No longer use this tweet for location
                                        </button>
                                    </td>
                                </tr>
                        }
                    </tbody>
                </table>
                {/* TODO: possibly restrict based on region of vendor */}
                <Autocomplete
                    style={{width: '30%'}}
                    onPlaceSelected={(place:any) => {
                        setSearchedLocation(place);
                    }}
                    types={['address']}
                    componentRestrictions={{country: "us"}}
                />
                <div>
                    <button
                        disabled={!searchedLocation}
                        onClick={saveSearchedLocation}
                    >
                        Update the location for this tweet
                    </button>
                </div>
            </div>
        ) :
        (
            <div>
                <p>{contentText}</p>
            </div>
        );


    return (
        <div>
            { content }
        </div>
    );
}

export default withRouter(UpdateLocation);
