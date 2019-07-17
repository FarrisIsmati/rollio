export interface Coordinates {
    lat: number,
    long: number
}
  
// Preview set of vendor data
export interface VendorPrev {
    id: string
    name: string
    description: string,
    coordinates: Coordinates,
    selected: boolean,
    lastUpdated: string,
    groupPinId: string
}

// Full set of vendor data
export interface VendorFull {
    id: string
}

// Pin on map
export interface Pin {
    id: string,
    vendorId: string,
    selected: boolean,
    coordinates: Coordinates
}

// Pin with multiple vendors
export interface GroupPin {
    id: string,
    vendorIndecies: number[], // All the vendors[] indecies to quickly look up the data
    selected: boolean,
    coordinates: Coordinates
}

export interface DataDefaultState {
    vendorsAll: VendorPrev[],
    selectedVendor: VendorFull
}

export interface MapDefaultState {
    vendorsDisplayedSingle: Pin[],
    vendorsDisplayedGroup: GroupPin[],
}