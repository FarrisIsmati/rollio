// DEPENDENCIES
import React from "react";
import { withRouter } from 'react-router';

const Authentication = (props:any) => {
    return (
        <div className='authentication__wrapper'>
            <h2 className="twitter_login__pointer">Vendor Login</h2>
            <p>Login My Dude?</p>
        </div>
    );
}

export default withRouter(Authentication);
