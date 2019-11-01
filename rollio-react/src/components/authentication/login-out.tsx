import useGetAppState from "../common/hooks/use-get-app-state";
import React, {useEffect} from "react";
import TwitterLogin from 'react-twitter-auth';
import { withRouter } from 'react-router';
import {VENDOR_API} from "../../config";
import {receiveUser, logOut, fetchUserAsync, fetchUserSuccess} from "../../redux/actions/user-actions";
import {useDispatch} from "react-redux";

const Login = (props:any) => {
    const dispatch = useDispatch();
    const {user} = useGetAppState();
    const twitterLoginUrl = `${VENDOR_API}/api/auth/twitter`;
    const twitterRequestTokenUrl = `${VENDOR_API}/api/auth/twitter/reverse`;
    const logout = () => {
        localStorage.clear()
        dispatch(logOut());
    };
    const onFailure = (error:any) => {
        alert(error);
    };

    const twitterResponse = (response:any) => {
        const token = response.headers.get('x-auth-token');
        response.json().then((user:any) => {
            if (token) {
                localStorage.token = token;
                dispatch(receiveUser(user));
                dispatch(fetchUserSuccess());
            }
        });
    };

    useEffect(() => {
        if(localStorage.token && localStorage.token.length && !user.isAuthenticated) {
            dispatch(fetchUserAsync())
        }
    });
    // Render Content
    const content = user.isAuthenticated ?
            (
                <div>
                    <p>Authenticated</p>
                    <div>
                        {user.email}
                    </div>
                    <div>
                        <button onClick={logout} className="button">
                            Log out
                        </button>
                    </div>
                </div>
            ) :
            (
                <div>
                    <TwitterLogin
                        loginUrl={twitterLoginUrl}
                        onFailure={onFailure}
                        onSuccess={twitterResponse}
                        requestTokenUrl={twitterRequestTokenUrl}
                    />
                </div>
            );


    return (
        <div>
            { content }
        </div>
    );
}

export default withRouter(Login);
