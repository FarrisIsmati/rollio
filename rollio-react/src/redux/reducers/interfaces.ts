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
    id: string,
}

// Full set of vendor data
export interface VendorFull {
    id: string,
    name: string,
    description: string,
    email: string,
    website: string,
    phonenumber: number | null,
    profileImageLink: string | null,
    categories: string[],
    price: string,
    rating: number | null,
    twitterID: string,
    comments: Comment[],
    creditCard: boolean | null,
    location: Location[] | Location | null,
    isActive: boolean,
    lastUpdated: Date | null,
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
    selectedVendor: VendorFull,
}

export interface UserDefaultState {
    isAuthenticated: boolean,
    id: string,
    email: string,
    isAdmin: boolean,
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
    areMapPinsLoaded: boolean,
    isUserLoaded: boolean
}

