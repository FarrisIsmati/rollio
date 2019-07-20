import { MapDefaultState } from "./interfaces";

const defaultState:MapDefaultState = {
  vendorsDisplayedSingle: [],
  vendorsDisplayedGroup: [],
  activeFilters: []
}

export function mapReducer(state = defaultState, action) {
  switch (action.type) {
  default:
    return state
  }
}
