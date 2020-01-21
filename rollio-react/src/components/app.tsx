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

//REDUX
import rootReducer from '../redux/reducers/root-reducer';

// COMPONENTS
import RegionHome from './region/region-home';
import PageInvalid from './error/page-invalid';
import LoginOut from './authentication/login-out';
import UserProfileForm from './authentication/user-profile';
import VendorProfileForm from './authentication/vendor-profile';
import TweetTable from './tweets/tweet-table';
import UpdateLocation from './tweets/update-location'

const loggerMiddleware = createLogger()

export const store = createStore(
  rootReducer,
  applyMiddleware(
    thunkMiddleware,
    loggerMiddleware
  )
)

const App:FC = () => {
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
            <Route exact path="/profile/region/:regionId/vendor/:vendorId?" component={ VendorProfileForm } />
            <Route exact path="/tweets" component={ TweetTable } />
            <Route exact path="/tweets/:tweetId" component={ UpdateLocation } />
            <Route exact path="/invalid" component={ PageInvalid } />
            <Route path="/*" component={ PageInvalid } />
          </Switch>
        </div>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
