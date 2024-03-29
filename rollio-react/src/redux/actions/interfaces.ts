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

// TODO!: Farris, what about all the other location keys ?
interface LimitedLocation {
  lat: number,
  long: number,
  startDate: Date | null,
  endDate: Date | null
}

export interface UpdateVendorPayload {
  locations: LimitedLocation[],
  vendorID: string,
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
  lastUpdated?: Date | null,
}

export interface SetPreviouslySelectedVendorPayload {
  id: string
}

export interface SetRegionMapVendorPayload {
  id: string,
  vendorID?: string,
  isSingle: boolean
  data: {
    selected?: boolean
  }
}

export interface SetTemporarilySelectedGroupPayload {
  id: string
}

export interface SetPreviouslySelectedRegionMapPayload {
  [index: number]: { id: string, isSingle?: boolean | null }
}

export interface SetCurrentlySelectedRegionMapPayload {
  [index: number]: { id: string, isSingle?: boolean | null }
}

export interface updateVendorLocationAccuracyPayload {
  amount: number,
  locationID: string,
  regionID: string,
  vendorID: string,
  cb?: () => void,
  cbSuccess?: () => void
}

export interface UpdateVendorLocationAccuracyPayload {
  amount: number,
  locationID: string,
  regionID: string,
  vendorID: string,
  cbError?:(res:any) => void,
  cbSuccess?: (err:any) => void
}

export interface UpdateDailyActiveVendorsPayload {
  vendorID: string
}

export interface TweetHistoryPayload {
  date: string,
  locations: [string],
  text: string,
  tweetID: string,
  usedForLocation: boolean,
  vendorID: string
}