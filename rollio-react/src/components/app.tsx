// DEPENDENCIES
import React, {FC} from 'react';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import {
  createStore,
  applyMiddleware
} from 'redux'
import {
  Route,
  Switch,
  BrowserRouter
} from 'react-router-dom';
import {useEffect} from "react";

//REDUX
import rootReducer from '../redux/reducers/root-reducer';
import {fetchUserAsync} from "../redux/actions/user-actions";

// COMPONENTS
import RegionHome from './region/region-home';
import PageInvalid from './error/page-invalid';
import PermissionDenied from './error/permission-denied';
import LoginOut from './authentication/login-out';
import UserProfileForm from './authentication/user-profile';
import VendorProfileForm from './authentication/vendor-profile';
import TweetTable from './tweets/tweet-table';
import UpdateLocation from './tweets/update-location'
import CreateLocation from './tweets/create-location'

const loggerMiddleware = createLogger();

const App:FC = () => {
  const store = createStore(
      rootReducer,
      applyMiddleware(
          thunkMiddleware,
          loggerMiddleware
      )
  );
  const { dispatch } = store;
  const { user } = store.getState();

  useEffect(() => {
    if (localStorage.token && !user.isAuthenticated) {
      fetchUserAsync()(dispatch);
    }
  }, [user]);

  return (
    <Provider store={store}>
      <BrowserRouter>
        <div className="App">
          <Switch>
            <Route exact path="/region/:regionName" component={ RegionHome } />
            {/* <Route exact path="/region/:regionId/vendor/:vendorId" component={ VendorProfile } /> */}
            <Route exact path="/login" component={ () => <LoginOut isLogin={true}/> } />
            <Route exact path="/signup" component={ () => <LoginOut isLogin={false}/> } />
            <Route exact path="/profile/user" component={ UserProfileForm } />
            <Route exact path="/profile/region/:regionName/vendor/:vendorId?" component={ VendorProfileForm } />
            <Route exact path="/newlocation" component={ CreateLocation } />
            <Route exact path="/tweets/:vendorId?" component={ TweetTable } />
            <Route exact path="/tweets/vendor/:vendorId/tweet/:tweetId" component={ UpdateLocation } />
            <Route exact path="/invalid" component={ PageInvalid } />
            <Route exact path="/permission-denied" component={ PermissionDenied } />
            <Route path="/*" component={ PageInvalid } />
          </Switch>
        </div>
      </BrowserRouter>
    </Provider>
  );
};

export default App;
