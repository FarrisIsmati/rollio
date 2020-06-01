// DEPENDENCIES
import React, { ReactElement } from 'react';

// HOOKS
import useUpdateVendorLocationAccuracy from './hooks/use-update-vendor-location-accuracy';

// INTERFACES
import { accuracyAsyncStateEnum } from './hooks/interfaces';


const VendorProfileContentAccuracy = (props:any) => {
    const { state, vendor, findOnMap } = props;
    const { updateVendorLocationAccuracy, accuracyAsyncState } = useUpdateVendorLocationAccuracy(state.data.regionId,state.data.selectedVendor.id, state.data.selectedVendor.locations);

    const vendorAccuracyComponent = (locationID:string, accuracy:number) => {
      return (
        <div className='vendorprofile__info_address_accuracy font__vendor_profile_info'>
          <p className='vendorprofile__info_address_accuracy_question'>Is this location accurate?</p>

          <div className='vendorprofile__info_address_accuracy_voter'>
            { accuracyAsyncState[locationID] === accuracyAsyncStateEnum.FAILED ?
              <div className='flex'>
                <i className='material-icons-outlined'>error_outline</i>
                <p>Can't vote on a vendor more than once per day</p> 
              </div>
              :
              <React.Fragment>
                <i onClick={() => updateVendorLocationAccuracy(1, locationID)} className="material-icons-outlined vendorprofile__info_address_accuracy_plus">arrow_upward</i>
                  <p>{accuracy}</p>
                <i onClick={() => updateVendorLocationAccuracy(-1, locationID)} className="material-icons-outlined vendorprofile__info_address_accuracy_minus">arrow_downward</i>
              </React.Fragment>
            }

          </div>
        </div>
      )
    }

    // Vendor Address Component
    const vendorAddressComponent = () => {
      const setAddress = (address:ReactElement, location:any, i:number|null = null) => (
        <div key={location._id} className='vendorprofile__info_detail'>
            <div className='vendorprofile__info_icon_wrapper_alt_center'>
              <i className="material-icons-outlined">room</i> 
            </div>

            <p className='vendorprofile__info_detail_address flex__verticle_center' onClick={ () => findOnMap(vendor.locations[i !== null ? i : 0]) }>
              { i !== null ? state.data.selectedVendor.locations[i].address : state.data.selectedVendor.locations[0].address }
            </p>
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
