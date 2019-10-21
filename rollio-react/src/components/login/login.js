import React from 'react';
import TwitterLogin from 'react-twitter-auth';
import FacebookLogin from 'react-facebook-login';
import { GoogleLogin } from 'react-google-login';
import { VENDOR_API } from '../../config';

class Login extends React.Component {

    constructor() {
        super();
        this.state = { isAuthenticated: false, user: null, token: ''};
    }

    logout = () => {
        this.setState({isAuthenticated: false, token: '', user: null})
    };

    onFailure = (error) => {
        alert(error);
    };

    twitterResponse = (response) => {
        const token = response.headers.get('x-auth-token');
        response.json().then(user => {
            if (token) {
                this.setState({isAuthenticated: true, user, token});
            }
        });
    };

    // facebookResponse = (response) => {
    //     const tokenBlob = new Blob([JSON.stringify({access_token: response.accessToken}, null, 2)], {type : 'application/json'});
    //     const options = {
    //         method: 'POST',
    //         body: tokenBlob,
    //         mode: 'cors',
    //         cache: 'default'
    //     };
    //     fetch('http://localhost:4000/api/v1/auth/facebook', options).then(r => {
    //         const token = r.headers.get('x-auth-token');
    //         r.json().then(user => {
    //             if (token) {
    //                 this.setState({isAuthenticated: true, user, token})
    //             }
    //         });
    //     })
    // };

    // googleResponse = (response) => {
    //     const tokenBlob = new Blob([JSON.stringify({access_token: response.accessToken}, null, 2)], {type : 'application/json'});
    //     const options = {
    //         method: 'POST',
    //         body: tokenBlob,
    //         mode: 'cors',
    //         cache: 'default'
    //     };
    //     fetch('http://localhost:4000/api/v1/auth/google', options).then(r => {
    //         const token = r.headers.get('x-auth-token');
    //         r.json().then(user => {
    //             if (token) {
    //                 this.setState({isAuthenticated: true, user, token})
    //             }
    //         });
    //     })
    // };

    render() {
        const twitterLoginUrl = `${VENDOR_API}/api/auth/twitter`;
        const twitterRequestTokenUrl = `${VENDOR_API}/api/auth/twitter/reverse`;
        let content = !!this.state.isAuthenticated ?
            (
            <div>
            <p>Authenticated</p>
            <div>
            {this.state.user.email}
            </div>
            <div>
            <button onClick={this.logout} className="button">
            Log out
        </button>
        </div>
        </div>
    ) :
        (
        <div>
        <TwitterLogin
            loginUrl={twitterLoginUrl}
            onFailure={this.onFailure}
            onSuccess={this.twitterResponse}
            requestTokenUrl={twitterRequestTokenUrl}
        />
        {/*    <FacebookLogin*/}
        {/*appId={config.FACEBOOK_APP_ID}*/}
        {/*autoLoad={false}*/}
        {/*fields="name,email,picture"*/}
        {/*callback={this.facebookResponse} />*/}
        {/*<GoogleLogin*/}
        {/*clientId={config.GOOGLE_CLIENT_ID}*/}
        {/*buttonText="Login"*/}
        {/*onSuccess={this.googleResponse}*/}
        {/*onFailure={this.onFailure}*/}
        {/*/>*/}
        </div>
    );

        return (
            <div className="App">
            {content}
            </div>
    );
    }
}
export default Login;
