// INTERFACES
import { MapDefaultState } from "./interfaces";

// CONSTANTS
import {
  SET_MAP_PINS
} from "../constants/constants"

const defaultState:MapDefaultState = {
  vendorsDisplayedSingle: new Set(),
  vendorsDisplayedGroup: [],
  activeFilters: []
}

export function mapReducer(state = defaultState, action: any) {
  switch (action.type) {
    case SET_MAP_PINS:
        return {
            ...state,
            ...action.payload
        }
    default:
        return state
    }
}
