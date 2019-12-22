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


const UpdateLocation = (props:any) => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState<boolean>(true);
    const [tweet, setTweet] = useState<any>(null);
    const [searching, setSearching] = useState<boolean>(true);
    const {user} = useGetAppState();
    const tweetUrl = `${VENDOR_API}/tweets`;
    const fetchTweets = () => {
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
                // TODO: might need to also update the state.data.allVendors
                setTweet(res.data.tweet);
                setLoading(false);
            }).catch((err:any) => {
            setLoading(false);
            console.error(err);
            throw err;
        })
    };

    const searchForNewLocation = () => {
        setSearching(true);
    };

    const handlePlaceChanged = () => {
    };

    useEffect(() => {
        if (user.isAuthenticated) {
            fetchTweets();
        } else if(localStorage.token && localStorage.token.length) {
            dispatch(fetchUserAsync(fetchTweets));
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
                        {
                            usedForLocation &&
                            <tr>
                                <td>
                                    <button
                                        onClick={() => searchForNewLocation()}
                                    >
                                        Update the location for this tweet
                                    </button>
                                </td>
                            </tr>
                        }
                    </tbody>
                </table>
                {
                    searching &&
                    <div>
                        SEARCHBOX
                    </div>
                }

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
