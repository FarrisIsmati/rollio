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
    const [searchedLocation, setSearchedLocation] = useState<any>(null);
    const { user } = useGetAppState();
    const { isAuthenticated, type } = user;
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

    const saveSearchedLocation = () => {
        setLoading(true);
        const { date, tweetID } = tweet;
        const data = {
            locationDate: date,
            tweetID,
            address: searchedLocation.formatted_address,
            city: searchedLocation.address_components.find((component:any) => component.types.includes('locality')).long_name,
            coordinates: [searchedLocation.geometry.location.lat(), searchedLocation.geometry.location.lng()]
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

    const saveDatesOnly = () => {
        // TODO: wire this up
    };

    useAuthentication(props, true, true);
    useEffect(() => {
        if (isAuthenticated && type === 'admin') {
            fetchTweet();
        }
    }, [isAuthenticated, type]);

    const contentText = !(loading || tweet) && !isAuthenticated ? 'You must be logged in' : 'Loading...';
    const usedForLocation = tweet && tweet.usedForLocation;
    // TODO: fix to allow for multiple locations on each tweet
    const content = 'blah';
    // const content = tweet ?
    //     (
    //         <div>
    //             <table>
    //                 <tbody>
    //                     <tr>
    //                         <td>Date</td>
    //                         <td>{moment(tweet.date).format('YYYY-MM-DD LT')}</td>
    //                     </tr>
    //                     <tr>
    //                         <td>Text</td>
    //                         <td>{tweet.text}</td>
    //                     </tr>
    //                     <tr>
    //                         <td>Vendor</td>
    //                         <td>{tweet.vendorID.name}</td>
    //                     </tr>
    //                     <tr>
    //                         <td>UsedForLocation</td>
    //                         <td>{tweet.usedForLocation ? 'Yes' : 'No'}</td>
    //                     </tr>
    //                     <tr>
    //                         <td>Location</td>
    //                         <td>{tweet.location ? tweet.location.address : 'N/A'}</td>
    //                     </tr>
    //                     <tr>
    //                         <td>Start Date</td>
    //                         <td>{tweet.location ? moment(tweet.location.startDate).format('YYYY-MM-DD LT') : 'N/A'}</td>
    //                     </tr>
    //                     <tr>
    //                         <td>End Date</td>
    //                         <td>{tweet.location ? moment(tweet.location.endDate).format('YYYY-MM-DD LT') : 'N/A'}</td>
    //                     </tr>
    //                     {
    //                         usedForLocation &&
    //                             <tr>
    //                                 <td>
    //                                     <button
    //                                         onClick={() => noLongerUserTweetForLocation()}
    //                                     >
    //                                         No longer use this tweet for location
    //                                     </button>
    //                                 </td>
    //                             </tr>
    //                     }
    //                 </tbody>
    //             </table>
    //             {/* TODO: possibly restrict based on region of vendor */}
    //             <Autocomplete
    //                 style={{width: '30%'}}
    //                 onPlaceSelected={(place:any) => {
    //                     setSearchedLocation(place);
    //                 }}
    //                 types={['address']}
    //                 componentRestrictions={{country: "us"}}
    //             />
    //             <div>
    //                 <button
    //                     disabled={!searchedLocation}
    //                     onClick={saveSearchedLocation}
    //                 >
    //                     Update the location for this tweet
    //                 </button>
    //             </div>
    //             <div>
    //                 <button
    //                     onClick={saveDatesOnly}
    //                 >
    //                     Update the start and end date only
    //                 </button>
    //             </div>
    //             <div>
    //                 <button
    //                     onClick={goToAllTweets}
    //                 >
    //                     Return to all tweets
    //                 </button>
    //             </div>
    //         </div>
    //     ) :
    //     (
    //         <div>
    //             <p>{contentText}</p>
    //             { !isAuthenticated &&
    //                 <button
    //                     onClick={() => goToLoginPage()}
    //                 >
    //                     Login
    //                 </button>
    //             }
    //         </div>
    //     );


    return (
        <div>
            { content }
        </div>
    );
}

export default withRouter(UpdateLocation);
