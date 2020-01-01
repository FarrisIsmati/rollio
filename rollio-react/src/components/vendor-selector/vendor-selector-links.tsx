// DEPENDENCIES
import React, { FC } from 'react';

const VendorSelectorLink:FC = () => {
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

const VendorSelectorLinks:FC = (props:any) => {
  console.log(props)
  return (
    // Mobile resize this flex centers
    <div className="menu_links__wrapper"> 
      <p>lol</p>
    </div>
  );
}


export default VendorSelectorLinks;
