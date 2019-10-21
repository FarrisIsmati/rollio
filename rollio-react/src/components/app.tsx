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
import Navbar from './navbar/navbar';
import VendorProfile from './vendor-profile/vendor-profile';
import RegionHome from './region/region-home';
import PageInvalid from './error/page-invalid';
import Login from './login/login';

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
          <Navbar/>
          <Switch>
            <Route exact path="/region/:regionId" component={ RegionHome } />
            <Route exact path="/region/:regionId/vendor/:vendorId" component={ VendorProfile } />
            <Route exact path="/login" component={ Login } />
            <Route exact path="/invalid" component={ PageInvalid } />
            <Route path="/*" component={ PageInvalid } />
          </Switch>
        </div>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
