// INTERFACES
import { MapDefaultState } from "./interfaces";

// CONSTANTS
import {
  SET_MAP_PIN
} from "../constants/constants"

const defaultState:MapDefaultState = {
  vendorsDisplayedSingle: [],
  vendorsDisplayedGroup: [],
  activeFilters: []
}

export function mapReducer(state = defaultState, action: any) {
  switch (action.type) {
    case SET_MAP_PIN:
        return {
            ...state,
            vendorsDisplayedSingle: [...state.vendorsDisplayedSingle, action.payload]
        }
    default:
        return state
    }
}
