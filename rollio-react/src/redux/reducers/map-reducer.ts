// INTERFACES
import { MapDefaultState } from "./interfaces";

// CONSTANTS
import {
  SET_MAP_PINS,
  SET_VENDORS_DISPLAYED_SINGLE,
  SET_VENDORS_DISPLAYED_GROUP
} from "../constants/constants"

const defaultState:MapDefaultState = {
  vendorsDisplayedSingle: {},
  vendorsDisplayedGroup: {},
  activeFilters: []
}

export function mapReducer(state = defaultState, action: any) {
  switch (action.type) {
    case SET_MAP_PINS:
        return {
            ...state,
            ...action.payload
        }
  case SET_VENDORS_DISPLAYED_SINGLE:
    return {
        ...state,
        ...action.payload
    }
  case SET_VENDORS_DISPLAYED_GROUP:
    return {
        ...state,
        ...action.payload
    }
  default:
      return state
  }
}
