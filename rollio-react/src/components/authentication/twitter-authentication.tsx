// DEPENDENCIES
import React from "react";
import TwitterLogin from 'react-twitter-auth';
import { VENDOR_API } from "../../config";
import { IconContext } from 'react-icons';
import { IoLogoTwitter } from 'react-icons/io';
import constants from './utils/constants';

// HOOKS
import useTwitterAuthentication from './hooks/use-twitter-authentication';

const TwitterAuthentication= (props:any) => {
    const twitterAuth = useTwitterAuthentication(props.history);

    return (
        <div className='loginframe__wrappper'>
            <TwitterLogin
                loginUrl={`${VENDOR_API}/api/auth/twitter/vendor/`}
                onFailure={twitterAuth.twitterLoginFailure}
                onSuccess={twitterAuth.twitterLoginSuccess}
                requestTokenUrl={`${VENDOR_API}/api/auth/twitter/reverse`}
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

export default TwitterAuthentication
