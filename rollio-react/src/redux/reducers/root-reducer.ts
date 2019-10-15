//DEPENDENCIES
import { combineReducers } from 'redux'

//REDUCERS
import { dataReducer } from './data-reducer'
import { mapReducer } from './map-reducer'
import { loadStateReducer } from './load-state-reducer'

const rootReducer = combineReducers({
  data: dataReducer,
  regionMap: mapReducer,
  loadState: loadStateReducer
})

export default rootReducer