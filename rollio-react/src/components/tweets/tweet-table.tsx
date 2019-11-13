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

const TweetTable = (props:any) => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState<boolean>(true);
    const [rowsLoaded, setRowsLoaded] = useState<boolean>(false);
    const [rows, setRows] = useState([]);
    const {user} = useGetAppState();
    const tweetSearchUrl = `${VENDOR_API}/tweets/all`;
    const onFailure = (error:any) => {
        alert(error);
    };

    const fetchTweets = () => {
        setLoading(true);
        axios({
            method: "GET",
            url: tweetSearchUrl,
            headers: {'Authorization': "Bearer " + localStorage.token}
        })
            .then((res: AxiosResponse<any>) => {
                setRows(res.data.tweets);
                setRowsLoaded(true);
                setLoading(false);
            }).catch((err:any) => {
                setLoading(false);
                console.error(err);
                throw err;
            })
    };

    const columns = [
        {
            id: 'vendorID',
            Header: 'Vendor',
            accessor: (d:any) => d.vendorID.name
        },
        {
            id: 'date',
            Header: 'Date',
            accessor: (d:any) => moment(d.date).format('YYYY-MM-DD LT')
        },
        {
            Header: 'Text',
            accessor: 'text'
        }, {
            id: 'usedForLocation',
            Header: 'Used For Location',
            accessor: (d:any) => d.usedForLocation ? 'Yes' : 'No'
        }
    ];


    useEffect(() => {
        if (user.isAuthenticated) {
            fetchTweets();
        } else if(localStorage.token && localStorage.token.length) {
            dispatch(fetchUserAsync(fetchTweets));
        } else {
            setLoading(false);
        }
    }, []);
    const contentText = !(loading || rowsLoaded) && !user.isAuthenticated ? 'You must be logged in' : 'Loading...';
    const content = rowsLoaded ?
        (
            <div className="table_wrapper">
                <ReactTable
                    data={rows}
                    columns={columns}
                    defaultPageSize={10}
                />
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

export default withRouter(TweetTable);
