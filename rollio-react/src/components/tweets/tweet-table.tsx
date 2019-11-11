import useGetAppState from "../common/hooks/use-get-app-state";
import React, {useEffect} from "react";
import { withRouter } from 'react-router';
import {VENDOR_API} from "../../config";
import {fetchUserAsync} from "../../redux/actions/user-actions";
import {useDispatch} from "react-redux";
import ReactTable from 'react-table';
import 'react-table/react-table.css'

const TweetTable = (props:any) => {
    const dispatch = useDispatch();
    const {user, loadState} = useGetAppState();
    const twitterLoginUrl = `${VENDOR_API}/api/auth/twitter`;
    const onFailure = (error:any) => {
        alert(error);
    };
    const data = [{
        name: 'Tanner Linsley',
        age: 26,
        friend: {
            name: 'Jason Maurer',
            age: 23,
        }
    }];

    const columns = [{
        Header: 'Name',
        accessor: 'name' // String-based value accessors!
    }, {
        Header: 'Age',
        accessor: 'age',
        Cell: (props:any) => <span className='number'>{props.value}</span> // Custom cell components!
    }, {
        id: 'friendName', // Required because our accessor is not a string
        Header: 'Friend Name',
        accessor: (d:any) => d.friend.name // Custom value accessors!
    }, {
        Header: (props:any) => <span>Friend Age</span>, // Custom header components!
        accessor: 'friend.age'
    }];


    useEffect(() => {
        if(localStorage.token && localStorage.token.length && !user.isAuthenticated && !loadState.isUserLoading) {
            dispatch(fetchUserAsync())
        }
    });
    // Render Content
    const content = user.isAuthenticated ?
        (
            <div className="table_wrapper">
                <ReactTable
                    data={data}
                    columns={columns}
                />
            </div>
        ) :
        (
            <div>
                <p>You must be logged in</p>
            </div>
        );


    return (
        <div>
            { content }
        </div>
    );
}

export default withRouter(TweetTable);
