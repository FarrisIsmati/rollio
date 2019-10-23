//DEPENDENCIES
import { combineReducers } from 'redux'

//REDUCERS
import { userReducer} from "./user-reducer";
import { dataReducer } from './data-reducer'
import { mapReducer } from './map-reducer'
import { loadStateReducer } from './load-state-reducer'

const rootReducer = combineReducers({
  data: dataReducer,
  regionMap: mapReducer,
  user: userReducer,
  loadState: loadStateReducer
})

export default rootReducer
