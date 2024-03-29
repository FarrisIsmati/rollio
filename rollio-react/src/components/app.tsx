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
import Region from './region/region';
import PageInvalid from './error/page-invalid';
import PermissionDenied from './error/page-invalid';
import Authentication from './authentication/authentication';

const loggerMiddleware = createLogger();

const App:FC = () => {
  // Redux
  const store = createStore(
      rootReducer,
      applyMiddleware(
          thunkMiddleware,
          loggerMiddleware
      )
  );
  const { dispatch } = store;
  const { user } = store.getState();
  
  // Hooks
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
            <Route exact path="/region/:regionName" component={ Region } />
            <Route exact path="/login" render={ () => <Authentication isLogin={true}/> } />
            <Route exact path="/signup" render={ () => <Authentication isLogin={false}/> } />
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
