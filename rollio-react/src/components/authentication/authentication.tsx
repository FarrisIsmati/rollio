// DEPENDENCIES
import React from "react";
import { withRouter } from 'react-router';

// COMPONENTS
import TwitterAuthentication from './twitter-authentication';

const Authentication = (props:any) => {
    return (
        <div className='authentication__wrapper flex__center'>
            <div className='authentication__login flex__center_column'>
                <h2>Vendors</h2>
                <p>Vendor login/sign up via twitter</p>
                <TwitterAuthentication {...props} />
            </div>
        </div>
    );
}

export default withRouter(Authentication);
