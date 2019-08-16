// DEPENDENCIES
import React, {FC} from 'react';
import { Provider } from 'react-redux'
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import {  createStore,
          applyMiddleware
        } from 'redux'

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
      <div className="App">
        <Navbar/>
        <TruckProfile/>
      </div>
    </Provider>
  );
}

export default App;