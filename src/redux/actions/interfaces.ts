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