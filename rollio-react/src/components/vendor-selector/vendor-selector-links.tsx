// DEPENDENCIES
import React, { FC } from 'react';

// HOOKS
import useGetAppState from '../common/hooks/use-get-app-state';

// INTERFACES
import { VendorSelectedLinkProps } from './interfaces';

const VendorSelectorLink = (props:VendorSelectedLinkProps) => {
  return (
    // Mobile resize this flex centers
    <div className="menu_link__wrapper"> 
      <div className="menu_link__image_wrapper">
          <img alt="Zesty Kabob Logo" src={''} />
      </div>
      <h2>Zesty Kabob</h2>
    </div>
  )
}

const VendorSelectorLinks:FC = () => {
  const state = useGetAppState();
  let links = null;
  const allVendors = Object.values(state.data.vendorsAll);

  if (allVendors.length) {
    links = allVendors.map((vendor:any) => {
      return <VendorSelectorLink name={vendor.name} id={vendor.id} />
    })
  }

  return (
    // Mobile resize this flex centers
    <div className="menu_links__wrapper"> 
      {
        links ? links : <p>loading</p>
      }
    </div>
  );
}


export default VendorSelectorLinks;
