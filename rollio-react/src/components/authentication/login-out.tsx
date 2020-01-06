import useGetAppState from "../common/hooks/use-get-app-state";
import React, {useEffect} from "react";
import TwitterLogin from 'react-twitter-auth';
import { withRouter } from 'react-router';
import {VENDOR_API} from "../../config";
import {receiveUser, logOut, fetchUserAsync, fetchUserSuccess} from "../../redux/actions/user-actions";
import {useDispatch} from "react-redux";
import { IconContext } from 'react-icons';
import { IoLogoTwitter } from 'react-icons/io';

const Login = (props:any) => {
    const dispatch = useDispatch();
    const { user } = useGetAppState();
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
    }, []);
    // Render Content
    const content = user.isAuthenticated ?
            (
                <div>
                    <p>Authenticated</p>
                    <div>
                        {user.email}
                    </div>
                    <div>
                        <button onClick={logout} className="twitter_login_button">
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
                        style={{margin: '0 0', padding: '0 0', border: '0'}}
                    >
                        <div className="twitter_login_button">
                            <IconContext.Provider value={{ size: '32', color: 'white' }}>
                                <div className="twitter_login_content">
                                    <IoLogoTwitter/>
                                    CONTINUE WITH TWITTER
                                </div>
                            </IconContext.Provider>
                        </div>
                    </TwitterLogin>
                </div>
            );


    return (
        <div>
            { content }
        </div>
    );
}

export default withRouter(Login);
