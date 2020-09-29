// DEPENDENCIES
import React from "react";
import TwitterLogin from 'react-twitter-auth';
import { VENDOR_API } from "../../config";
import { useDispatch } from "react-redux";
import { IconContext } from 'react-icons';
import { IoLogoTwitter } from 'react-icons/io';
import constants from './utils/constants';

// REDUX
import { receiveUser, fetchUserSuccess } from "../../redux/actions/user-actions";
import { UserDefaultState } from "../../redux/reducers/interfaces";
import { constant } from "lodash";

const SIGN_IN = 'Sign In';
const SIGN_UP = 'Sign Up';

const LoginFrame = (props:any) => {
    const dispatch = useDispatch();

    const twitterLoginUrl = `${VENDOR_API}/api/auth/twitter`;
    const twitterRequestTokenUrl = `${VENDOR_API}/api/auth/twitter/reverse`;
    console.log(`${twitterLoginUrl}/vendor/`)

    const twitterLoginFailure = (error:any) => {
        console.log(error);
        // Redirect away
    };

    const twitterLoginSuccess = (response:any) => {
        const token = response.headers.get('x-auth-token');

        response.json().then((user: UserDefaultState) => {
            if (user.status === constants.INACTIVE) {
                // Redirect away to signup
                console.log('inactive');
            } else if (user.status === constants.REQUESTED) {
                // Redirect to notification page
                console.log('requested');
            } else if (token) {
                localStorage.token = token;
                dispatch(receiveUser(user));
                dispatch(fetchUserSuccess());
            }
        });
    };

    return (
        <div className='loginframe__wrappper'>
            <TwitterLogin
                loginUrl={`${twitterLoginUrl}/vendor/`}
                onFailure={twitterLoginFailure}
                onSuccess={twitterLoginSuccess}
                requestTokenUrl={twitterRequestTokenUrl}
                customHeaders={{action: constants.LOGIN}}
                style={{margin: '0 0', padding: '0 0', border: '0'}}
            >
                <div className="twitter_login__login_button">
                    <IconContext.Provider value={{ size: '32', color: 'white' }}>
                        <div className="twitter_login__login_content twitter_login__pointer">
                            <IoLogoTwitter/>
                            CONTINUE WITH TWITTER
                        </div>
                    </IconContext.Provider>
                </div>
            </TwitterLogin>
            {/* <p>{isLogin ? "Don't" : "Already"} have an account? <a className="twitter_login__sign_up_link twitter_login__pointer" onClick={goToOtherLoginPage}>{ isLogin ? SIGN_UP : SIGN_IN }</a></p> */}
        </div>
    );
}

export default LoginFrame
