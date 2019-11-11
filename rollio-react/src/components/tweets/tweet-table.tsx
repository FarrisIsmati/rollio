import useGetAppState from "../common/hooks/use-get-app-state";
import React, {useEffect, useState} from "react";
import { withRouter } from 'react-router';
import {VENDOR_API} from "../../config";
import {fetchUserAsync} from "../../redux/actions/user-actions";
import {useDispatch} from "react-redux";
import ReactTable from 'react-table';
import 'react-table/react-table.css'
import axios, {AxiosResponse} from "axios";

const TweetTable = (props:any) => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState<boolean>(true);
    const [rows, setRows] = useState([]);
    const {user, loadState} = useGetAppState();
    const tweetSearchUrl = `${VENDOR_API}/tweets/all`;
    const onFailure = (error:any) => {
        alert(error);
    };

    const columns = [
        {
        Header: 'Date',
        accessor: 'date'
    },
    {
        Header: 'Text',
        accessor: 'text'
    }
    // , {
    //     Header: 'Age',
    //     accessor: 'age',
    //     Cell: (props:any) => <span className='number'>{props.value}</span> // Custom cell components!
    // }
    // , {
    //     id: 'friendName', // Required because our accessor is not a string
    //     Header: 'Friend Name',
    //     accessor: (d:any) => d.friend.name // Custom value accessors!
    // }, {
    //     Header: (props:any) => <span>Friend Age</span>, // Custom header components!
    //     accessor: 'friend.age'
    // }
    ];


    useEffect(() => {
        if(localStorage.token && localStorage.token.length && !user.isAuthenticated && !loadState.isUserLoading) {
            dispatch(fetchUserAsync())
        }
        // TODO: set up for this to run after fetchUserAsync
        if (user.isAuthenticated) {
            setLoading(true);
            axios({
                method: "GET",
                url: tweetSearchUrl,
                headers: {'Authorization': "Bearer " + localStorage.token}
            })
                .then((res: AxiosResponse<any>) => {
                    console.log('res.data.tweets', res.data.tweets);
                    setRows(res.data.tweets);
                    setLoading(false);
                }).catch((err:any) => {
                    setLoading(false);
                    console.error(err);
                    throw err;
                })
        }
    }, []);
    // Render Content
    const contentText = !user.isAuthenticated ? 'You must be logged in' : 'Loading...';
    const content = loading ?
        (
            <div>
                <p>{contentText}</p>
            </div>
        ):
        (
            <div className="table_wrapper">
                <ReactTable
                    data={rows}
                    columns={columns}
                />
            </div>
        );


    return (
        <div>
            { content }
        </div>
    );
}

export default withRouter(TweetTable);
