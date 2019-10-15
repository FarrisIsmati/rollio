export interface VendorDataAsyncPayload  {
  regionId: string,
  vendorId: string,
  cb: () => void
}

export type RegionDataAsyncPayload = {
  regionId?: string,
  regionName: string,
  shouldFetchVendors?: boolean,
  cb: () => void
} | {
  regionId: string,
  regionName?: string,
  shouldFetchVendors?: boolean,
  cb: () => void
}

export type AllVendorsPayload = {
  regionId: string
}

// Pin on map
export interface PinPayload {
  id: string,
  vendorId: string,
  selected: boolean,
  location: Location,
}

export interface MapPinsLoadStatePayload {
  areMapPinsLoaded: boolean
}