// INTERFACES
import { MapDefaultState } from "./interfaces";

// CONSTANTS
import {
  SET_MAP_PINS,
  SET_VENDORS_DISPLAYED_SINGLE,
  SET_VENDORS_DISPLAYED_GROUP,
  SET_REGION_MAP_VENDOR,
  SET_PREVIOUSLY_SELECTED_REGION_MAP,
  SET_CURRENTLY_SELECTED_REGION_MAP
} from "../constants/constants"

const defaultState:MapDefaultState = {
  vendorsDisplayedSingle: {},
  vendorsDisplayedGroup: {},
  activeFilters: [],
  previouslySelected: [],
  currentlySelected: []
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
  case SET_REGION_MAP_VENDOR:
    let payload = {
      ...state
    }

    if (action.payload.isSingle) {
      payload = {
        ...state,
        vendorsDisplayedSingle: {
          ...state.vendorsDisplayedSingle,
          [action.payload.id]: {
            ...state.vendorsDisplayedSingle[action.payload.id],
            ...action.payload.data
          }
        }
      }
    } else {
      const group = { ...state.vendorsDisplayedGroup[action.payload.id] }

      // Set sepcific vendor in group to selected
      if (action.payload.data.selected) {
        const vendorIndex = state.vendorsDisplayedGroup[action.payload.id].vendors.findIndex((vendor) => vendor.vendorId === action.payload.vendorID);
        group.vendors[vendorIndex].selected = true;
        // Set all vendors in group to not selected
      } else if (!action.payload.data.selected) {
        group.vendors = group.vendors.map((vendor) => { return {...vendor, selected: false} })
      }

      payload = {
        ...state,
        vendorsDisplayedGroup: {
          ...state.vendorsDisplayedGroup,
          [action.payload.id]: {
            ...group,
            ...action.payload.data,
          }
        }
      }
    }

    return payload
  case SET_PREVIOUSLY_SELECTED_REGION_MAP:
    return {
      ...state,
      previouslySelected: [
        ...action.payload
      ]
    }
  case SET_CURRENTLY_SELECTED_REGION_MAP:
    return {
      ...state,
      currentlySelected: [
        ...action.payload
      ]
    }
  default:
      return state
  }
}
