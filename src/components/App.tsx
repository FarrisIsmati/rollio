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
import TruckProfile from './truck-profile/truck-profile'

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
            <Route exact path="/5d50bc3f6013b802bcaec400/5d50bc3f6013b802bcaec408" component={ TruckProfile } />
          </Switch>
        </div>
      </BrowserRouter>
    </Provider>
  );
}

export default App;