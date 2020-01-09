import useGetAppState from "../common/hooks/use-get-app-state";
import React, {useEffect, useState} from "react";
import { withRouter } from 'react-router';
import {fetchUserAsync} from "../../redux/actions/user-actions";
import {useDispatch} from "react-redux";

const Profile = (props:any) => {
    const dispatch = useDispatch();
    const [userType, setUserType] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const appState = useGetAppState();
    console.log('appState', appState);
    const user = appState.user;

    useEffect(() => {
        if (!user.isAuthenticated && localStorage.token && localStorage.token.length) {
            dispatch(fetchUserAsync());
        } else if (user.isAuthenticated && !userType) {
            setUserType(user.type);
        } else if (userType) {
            setLoading(false)
        } else {
            props.history.push('/login')
        }
    }, [user, userType]);

    // only customer field needed is regionID
    const customerFields = [ {value: 'regionID', label: '', type: 'text'} ];

    //
    const vendorFields = [ { value: '', label: '', type: 'text'} ];

    let content;
    if (loading) {
        content = 'Loading...';
    } else if (userType === 'vendor' && !user.vendorID) {
        content = 'Need to select vendor or create one';
    } else if (userType === 'vendor') {
        content = 'Need to fill in missing user profile info (for a vendor), whatever that might be';
    } else if (userType === 'customer') {
        content = 'Need to fill in missing user profile info (for a customer), whatever that might be';
    }

    return (
        <div className="twitter_login__wrapper">
            {content}
        </div>
    )
};

export default withRouter(Profile);
