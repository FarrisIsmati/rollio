export interface VendorDataAsyncPayload {
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

export interface AllVendorsPayload {
  regionId: string
}

// Pin on map
export interface PinPayload {
  vendorsDisplayedSingle: Set<string>,
  vendorsDisplayedGroup: any[]
}

export interface MapPinsLoadStatePayload {
  areMapPinsLoaded: boolean
}