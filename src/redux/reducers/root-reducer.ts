//DEPENDENCIES
import { combineReducers }      from 'redux'

//REDUCERS
import { dataReducer }          from './data-reducer'
import { mapReducer }        from './map-reducer'

const rootReducer = combineReducers({
  ...dataReducer,
  ...mapReducer
})

export default rootReducer