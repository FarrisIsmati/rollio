// DEPENDENCIES
import React from 'react';
import { useDispatch } from 'react-redux';

// INTERFACES
import { MenuLinkProps } from './interfaces';

// HOOKS
import useGetAppState from '../common/hooks/use-get-app-state';

// ACTIONS
import { selectVendorAsync } from '../../redux/actions/data-actions';

const selectVendorProfile = (dispatch:any, regionID:string, vendorID:string) => {
  dispatch(selectVendorAsync({ 
    regionId: regionID,
    vendorId: vendorID,
    cb: () => console.error('Invalid ID'),
  }))
}

const MenuLink = (props:MenuLinkProps) => {
  const { name, id: vendorID, img } = props;
  const state = useGetAppState();
  const dispatch = useDispatch();

  return (
    // Mobile resize this flex centers
    <div onClick={() => { selectVendorProfile(dispatch, state.data.regionId, vendorID) }} className="dashboard_link__wrapper"> 
      <div className="dashboard_link__image_wrapper">
          <div className="dashboard_link__image">
            <img alt={`${name} logo`} src={img} />
          </div>
      </div>
      <div>
        <h2 className="font__dashboard_link">{name}</h2>
      </div>
    </div>
  )
}

export default MenuLink;