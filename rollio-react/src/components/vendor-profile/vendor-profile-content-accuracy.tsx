// DEPENDENCIES
import React, { ReactElement } from 'react';

// HOOKS
import useUpdateVendorLocationAccuracy from './hooks/use-update-vendor-location-accuracy';

// INTERFACES
import { accuracyAsyncStateEnum } from './hooks/interfaces';


const VendorProfileContentAccuracy = (props:any) => {
    const { state, vendor, findOnMap } = props;
    const { updateVendorLocationAccuracy, accuracyAsyncState } = useUpdateVendorLocationAccuracy(state.data.regionId,state.data.selectedVendor.id, state.data.selectedVendor.locations);

  console.log(accuracyAsyncState);

    const vendorAccuracyComponent = (locationID:string, accuracy:number) => {
      return (
        <div className='vendorprofile__info_address_accuracy font__vendor_profile_info'>
          <h2 className='vendorprofile__info_address_accuracy_number'>{accuracy}</h2>
          <i onClick={() => updateVendorLocationAccuracy(1, locationID)} className="material-icons-outlined vendorprofile__info_address_accuracy_plus">add</i>
          <i onClick={() => updateVendorLocationAccuracy(-1, locationID)} className="material-icons-outlined vendorprofile__info_address_accuracy_minus">remove</i>
          { accuracyAsyncState[locationID] === accuracyAsyncStateEnum.FAILED ? <p>error</p> : null }
        </div>
      )
    }

    // Vendor Address Component
    const vendorAddressComponent = () => {
      const setAddress = (address:ReactElement, location:any, i:number|null = null) => (
        <div key={location._id} className='vendorprofile__info_row_clickable'>
            <div className='vendorprofile__info_icon_wrapper'>
              <i className="material-icons-outlined">room</i> 
            </div>
            <div className='vendorprofile__info_address vendorprofile__info_text_wrapper font__vendor_profile_info flex__verticle_center'>
              <h2 onClick={ () => findOnMap(vendor.locations[i !== null ? i : 0]) }>
                { i !== null ? state.data.selectedVendor.locations[i].address : state.data.selectedVendor.locations[0].address }
              </h2>
            </div>
            {/* Empty div to properly order row/columns */}
            <div></div> 
            { vendorAccuracyComponent(location._id, location.accuracy) }
          </div>
      )

      if (vendor.locations.length > 1) {
        return vendor.locations.map((location:any, i:number) => {
          return setAddress(<h2 key={location._id} onClick={ () => findOnMap(location) }>{location.address}</h2>, location, i);
        })
      }
      return setAddress(<h2 onClick={ () => findOnMap(vendor.locations[0]) }>{state.data.selectedVendor.locations[0].address}</h2>, vendor.locations[0])
    }

    return vendorAddressComponent()
    
};

export default VendorProfileContentAccuracy;
