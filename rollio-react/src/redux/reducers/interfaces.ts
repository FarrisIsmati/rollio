export interface Coordinates {
    lat: number | null,
    long: number | null,
}

// Preview set of vendor data
export interface VendorCard {
    id: string,
    name: string,
    description: string,
    categories: [],
    consecutiveDaysInactive: number,
    location: Location[] | Location | null,
    selected: boolean,
    isActive: boolean,
    lastUpdated: string,
}

export interface Location {
    coordinates: Coordinates,
    address: string,
    neighborhood: string,
    municipality: string,
    accuracy: number | null,
    matchMethod: string,
    tweetID: string | null,
    id: string,
}

// Full set of vendor data
export interface VendorFull {
    id: string,
    type: string,
    name: string,
    description: string,
    email: string,
    website: string,
    phoneNumber: string | null,
    profileImageLink: string | null,
    categories: string[],
    price: string,
    rating: number | null,
    twitterID: string,
    comments: Comment[],
    creditCard: string | null,
    location: Location[] | Location | null,
    isActive: boolean,
    lastUpdated: Date | null,
    approved: boolean
}

export interface Region {
    id: string,
    name: string
}

export interface Comment {
    name: string,
    date: string,
    text: string,
}

// Pin on map
export interface Pin {
    vendorId: string,
    selected: boolean
}

// Pin with multiple vendors
export interface GroupPin {
    vendorIds: any[], // All the vendorsAll[] indecies to quickly look up the data
    selected: boolean
}

// Filters for map
export interface Filter {
    price: string,
    rating: number[],
    categories: string[],
}

export interface DataDefaultState {
    regionID: string,
    regionName: string,
    dailyActiveVendors: Set<string>,
    regionCoordinates: Coordinates,
    regionTimezone: string,
    vendorsAll: { [key: string]: VendorCard },
    regionsAll: Region[],
    selectedVendor: VendorFull,
}

export interface UserDefaultState {
    isAuthenticated: boolean,
    id: string,
    email: string,
    type: string,
    vendorID: string,
    regionID: string,
    hasAllRequiredFields: boolean
}

export interface MapDefaultState {
    vendorsDisplayedSingle: { [key: string]: Pin },
    vendorsDisplayedGroup: { [key: string]: GroupPin },
    activeFilters: Filter[]
}

// Async
export interface LoadStateDefaultState {
    isRegionLoaded: boolean,
    isVendorLoaded: boolean,
    areVendorsLoaded: boolean,
    areRegionsLoaded: boolean,
    areMapPinsLoaded: boolean,
    isUserLoaded: boolean
}

