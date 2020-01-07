// DEPENDENCIES
import React from 'react';
import { useDispatch } from 'react-redux';

// INTERFACES
import { VendorSelectedLinkProps } from './interfaces';

// HOOKS
import useGetAppState from '../common/hooks/use-get-app-state';

// ACTIONS
import { fetchVendorDataAsync } from '../../redux/actions/data-actions';

const selectVendorProfile = (dispatch:any, regionID:string, vendorID:string) => {

  dispatch(fetchVendorDataAsync({ 
    regionId: regionID,
    vendorId: vendorID,
    cb: () => console.error('Invalid ID')
  }))
}

const VendorSelectorLink = (props:VendorSelectedLinkProps) => {
  const { name, id: vendorID, img } = props;
  const state = useGetAppState();
  const dispatch = useDispatch();

  return (
    // Mobile resize this flex centers
    <div onClick={() => { selectVendorProfile(dispatch, state.data.regionId, vendorID) }} className="menu_link__wrapper"> 
      <div className="menu_link__image_wrapper">
          <div className="menu_link__image">
            <img alt={`${name} logo`} src={img} />
          </div>
      </div>
      <div>
        <h2 className="font__menu_link">{name}</h2>
      </div>
    </div>
  )
}

export default VendorSelectorLink;
