// DEPENDENCIES
import React, {FC} from 'react';
import { Provider } from 'react-redux'
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import {  
  createStore,
  applyMiddleware
} from 'redux'
import { 
  Route,
  Switch,
  BrowserRouter
} from 'react-router-dom'

//REDUX
import rootReducer from '../redux/reducers/root-reducer'

// COMPONENTS
import Navbar from './navbar/navbar';
import VendorProfile from './vendor-profile/vendor-profile'

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
            <Route exact path="/region/5d5ca1887f0c493e4016dd90/vendor/5d5ca1887f0c493e4016dd98" component={ VendorProfile } />
          </Switch>
        </div>
      </BrowserRouter>
    </Provider>
  );
}

export default App;