// DEPENDENCIES
import React from "react";
import { withRouter } from 'react-router';
import constants from './utils/constants';

// COMPONENTS
import TwitterAuthentication from './twitter-authentication';

const Authentication = (props:any) => {
    return (
        <div className='authentication__wrapper flex__center'>
            {
                props.isLogin ?
                <div>
                    <p>Login bro</p>
                </div> :
                <div>
                    <p>Wanna signup, enter your email bro</p>
                </div>
            }
            <div className='authentication__login flex__center_column'>
                <h2>Vendors</h2>
                <p>Vendor login/sign up via twitter</p>
                <TwitterAuthentication {...props} authMethod={ props.isLogin ? constants.LOGIN : constants.SIGNUP } />
            </div>
        </div>
    );
}

export default withRouter(Authentication);
