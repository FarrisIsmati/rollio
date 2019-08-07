//DEPENDENCIES
import { combineReducers }      from 'redux'

//REDUCERS
import { dataReducer }          from './data-reducer'
import { mapReducer }        from './map-reducer'

const rootReducer = combineReducers({
  data: dataReducer,
  map: mapReducer
})

export default rootReducer