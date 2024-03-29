// DEPENDENCIES
import React, { ReactElement } from 'react';
import { useDispatch  } from 'react-redux';
import { isLocationActive } from "../../util/index";

// ACTIONS
import { setshowSelectedVendor } from '../../redux/actions/ui-actions';

// HOOKS
import useUpdateVendorLocationAccuracy from './hooks/use-update-vendor-location-accuracy';

// INTERFACES
import { accuracyAsyncStateEnum } from './hooks/interfaces';


const VendorProfileContentAccuracy = (props:any) => {
    const { state, vendor, findOnMap } = props;
    const { updateVendorLocationAccuracy, accuracyAsyncState } = useUpdateVendorLocationAccuracy(state.data.regionId,state.data.selectedVendor.id, state.data.selectedVendor.locations);

    // Hooks
    const dispatch = useDispatch();

    const vendorAccuracyComponent = (locationID:string, accuracy:number) => {
      return (
        <div className='vendorprofile__info_address_accuracy font__vendor_profile_info'>
          <p className='vendorprofile__info_address_accuracy_question'>Is this location accurate?</p>

          <div className='vendorprofile__info_address_accuracy_voter'>
            { accuracyAsyncState[locationID] === accuracyAsyncStateEnum.FAILED ?
              <div className='flex'>
                <i className='material-icons-outlined'>error_outline</i>
                <p>Only one vote per location</p> 
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
      const setAddress = (address:ReactElement, location:any) => (
        <div key={location._id} className='vendorprofile__info_detail'>
            <div className='vendorprofile__info_icon_wrapper_alt_center'>
              <i className="material-icons-outlined">room</i> 
            </div>

            <p className='vendorprofile__info_detail_address flex__verticle_center' onClick={ () => onClickAddress(location) }>
              { location.address }
            </p>
            {/* Empty div to properly order row/columns */}
            <div></div> 
            { vendorAccuracyComponent(location._id, location.accuracy) }
          </div>
      )

      const onClickAddress = (location:any) => {
        findOnMap(location);

        // If desktop hide modal
        dispatch(setshowSelectedVendor(false))
      }

      return vendor.locations.filter((location:any) => isLocationActive(location)).map((location:any, i:number) => {
        return setAddress(<h2 key={location._id} onClick={ () => onClickAddress(location) }>{location.address}</h2>, location);
      })
    }

    return (
      <React.Fragment>
        { vendorAddressComponent() }
      </React.Fragment>
    )
    
};

export default VendorProfileContentAccuracy;
