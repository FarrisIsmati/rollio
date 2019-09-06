export interface VendorDataAsyncPayload  {
  regionId: string,
  vendorId: string,
  cb: () => void
}

export type RegionDataAsyncPayload = {
  regionId?: string,
  regionName: string,
  cb: () => void
} | {
  regionId: string,
  regionName?: string,
  cb: () => void
}
