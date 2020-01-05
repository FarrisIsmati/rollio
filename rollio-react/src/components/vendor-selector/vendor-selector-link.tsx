// DEPENDENCIES
import React from 'react';

// INTERFACES
import { VendorSelectedLinkProps } from './interfaces';

const openVendorProfile = (id:any) => {
    console.log(id);
}

const VendorSelectorLink = (props:VendorSelectedLinkProps) => {
  const { name, id, img } = props;

  return (
    // Mobile resize this flex centers
    <div onClick={() => { openVendorProfile(id) }} className="menu_link__wrapper"> 
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
