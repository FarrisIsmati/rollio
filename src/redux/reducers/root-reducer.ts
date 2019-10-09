//DEPENDENCIES
import { combineReducers } from 'redux'

//REDUCERS
import { dataReducer } from './data-reducer'
import { mapReducer } from './map-reducer'
import { asyncReducer } from './async-reducer'

const rootReducer = combineReducers({
  data: dataReducer,
  regionMap: mapReducer,
  async: asyncReducer
})

export default rootReducer