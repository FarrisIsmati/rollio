// DEPENDENCIES
import React from "react";
import TwitterLogin from 'react-twitter-auth';
import { VENDOR_API } from "../../config";
import { IconContext } from 'react-icons';
import { IoLogoTwitter } from 'react-icons/io';

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
                customHeaders={{action: props.authMethod}}
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
        </div>
    );
}

export default TwitterAuthentication
