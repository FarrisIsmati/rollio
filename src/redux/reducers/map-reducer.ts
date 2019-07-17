import { MapDefaultState } from "./interfaces";

const defaultState:MapDefaultState = {
  vendorsDisplayedSingle: [],
  vendorsDisplayedGroup: [],
}

export function mapReducer(state = defaultState, action) {
  switch (action.type) {
  default:
    return state
  }
}
