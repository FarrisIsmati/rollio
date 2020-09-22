// DEPENDENCIES
import React from "react";
import { withRouter } from 'react-router';

// COMPONENTS
import LoginFrame from './login-frame';

const Authentication = (props:any) => {
    return (
        <div className='authentication__wrapper flex__center'>
            <div className='authentication__login flex__center_column'>
                <h2>Vendors</h2>
                <p>Vendor login/sign up via twitter</p>
                <LoginFrame />
            </div>
        </div>
    );
}

export default withRouter(Authentication);
