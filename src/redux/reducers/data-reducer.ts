import { DataDefaultState } from "./interfaces";

const defaultState:DataDefaultState = {
    vendorsAll: {},
    selectedVendor: {
        id: '',
        name: '',
        description: '',
        email: '',
        website: '',
        phonenumber: null,
        categories: [],
        price: '',
        rating: null,
        twitterID: '',
        comments: [],
        creditCard: null,
        closedDate: '',
        location: {
            coordinates: { lat: null, long: null },
            address: '',
            neighborhood: '',
            municipality: ''
        }
    },
}

export function dataReducer(state = defaultState, action) {
    switch (action.type) {
    default:
        return state
    }
}
  