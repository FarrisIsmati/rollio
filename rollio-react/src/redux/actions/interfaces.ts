// INTERFACES
import { 
  Pin,
  GroupPin,
  Comment,
  Location
} from '../reducers/interfaces'

export interface VendorDataAsyncPayload {
  regionId: string,
  vendorId: string,
  cb: () => void,
  cbSuccess?: () => void
}

export interface SelectVendorAsyncPayload {
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

export interface UpdateVendorPayload {
  location: { lat: number, long: number },
  vendorID: string,
  isActive: boolean
}

export interface UpdateDailyActiveVendorsPayload {
  vendorID: string
}

// Pin on map
export interface PinPayload {
  vendorsDisplayedSingle: { [key: string]: Pin },
  vendorsDisplayedGroup: { [key: string]: GroupPin }
}

export interface MapPinsLoadStatePayload {
  areMapPinsLoaded: boolean
}

export interface SetVendorsAllPayload {
  id: string,
  name?: string,
  categories?: string[],
  consecutiveDaysInactive?: number,
  profileImageLink?: string,
  description?: string,
  location?: Location[] | Location | null,
  selected?: boolean,
  isActive?: boolean,
  lastUpdated?: Date | null,
}

export interface SetPreviouslySelectedVendorPayload {
  id: string
}

export interface SetRegionMapVendorPayload {
  id: string,
  vendorID: string,
  isSingle: boolean
  data: {
    selected?: boolean
  }
}

export interface SetPreviouslySelectedRegionMapPayload {
  id: string,
  isSingle?: boolean | null
}

export interface SetCurrentlySelectedRegionMapPayload {
  id: string,
  isSingle?: boolean | null
}

export interface updateVendorLocationAccuracyPayload {
  amount: number,
  locationID: string,
  regionID: string,
  vendorID: string,
  cb?: () => void,
  cbSuccess?: () => void
}