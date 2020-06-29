// INTERFACES
export interface MarkerComparisonObject  {
    coordinates: {lat: number, long: number},
    vendorTruckID: string
  }

export interface CreateMapMarkerProps {
  vendor?: any, 
  vendors?: [any], 
  numberOfGroupedVendors?: boolean | number, 
  selected: boolean, 
  location: any, 
  onClickVendor?: any,
  key?: string
}

export interface AddSingleVendorToMapProps {
  vendor: any, 
  map:any, 
  selected: boolean, 
  location:any, 
  onClickVendor: any 
}

export interface AddGroupedVendorsToMapProps {
  vendors: any, 
  map:any, 
  selected: boolean, 
  location:any, 
  onClickVendor: any,
  key: string
}