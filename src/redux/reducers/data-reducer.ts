import { DataDefaultState } from "./interfaces";

const defaultState:DataDefaultState = {
    vendorsAll: [],
    selectedVendor: {
        id: ''
    },
}

export function dataReducer(state = defaultState, action) {
switch (action.type) {
default:
    return state
}
}
  