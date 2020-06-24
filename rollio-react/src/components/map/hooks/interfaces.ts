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
  onClick?: any
}

export interface AddSingleVendorToMapProps {
  vendor: any, 
  map:any, 
  selected: boolean, 
  location:any, 
  selectVendorProfile: any 
}

export interface AddGroupedVendorsToMapProps {
  vendors: any, 
  map:any, 
  selected: boolean, 
  location:any, 
  selectVendorProfile: any 
}