export interface Coordinates {
    lat: number | null,
    long: number | null
}
  
// Preview set of vendor data
export interface VendorCard {
    id: string,
    name: string,
    description: string,
    coordinates: Coordinates,
    selected: boolean,
    lastUpdated: string
}

export interface Location {
    coordinates: Coordinates,
    address: string,
    neighborhood: string,
    municipality: string
}

// Full set of vendor data
export interface VendorFull {
    id: string,
    name: string,
    description: string,
    email: string,
    website: string,
    phonenumber: number | null,
    categories: string[],
    price: string,
    rating: number | null,
    twitterID: string,
    comments: Comment[],
    creditCard: boolean | null,
    closedDate: string,
    location: Location
}

export interface Comment {
    name: string,
    date: string,
    text: string
}

// Pin on map
export interface Pin {
    id: string,
    vendorId: string,
    selected: boolean,
    location: Location,
}

// Pin with multiple vendors
export interface GroupPin {
    id: string,
    vendorIds: string[], // All the vendorsAll[] indecies to quickly look up the data
    selected: boolean,
    location: Location
}

// Filters for map
export interface Filter {
    price: string,
    rating: number[],
    categories: string[]
}

export interface DataDefaultState {
    vendorsAll: { [key: string]: VendorCard }
    selectedVendor: VendorFull
}

export interface MapDefaultState {
    vendorsDisplayedSingle: Pin[],
    vendorsDisplayedGroup: GroupPin[],
    activeFilters: Filter[]
}
