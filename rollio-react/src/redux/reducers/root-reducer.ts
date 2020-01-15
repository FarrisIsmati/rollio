//DEPENDENCIES
import { combineReducers } from 'redux'

//REDUCERS
import { userReducer} from "./user-reducer";
import { dataReducer } from './data-reducer'
import { mapReducer } from './map-reducer'
import { loadStateReducer } from './load-state-reducer'
import { uiReducer } from './ui-reducer'

const rootReducer = combineReducers({
  data: dataReducer,
  regionMap: mapReducer,
  user: userReducer,
  loadState: loadStateReducer,
  ui: uiReducer
})

export default rootReducer
