// DEPENDENCIES
import React, { ReactComponentElement } from 'react';

// COMPONENTS
import Chip from '../common/other/chip';

// Toggles open/close a dashboard menu item (ex twitter, about items)
const VendorProfileCategories = (props:any) => {
    const { 
      vendor
    } = props;

    const Categories:ReactComponentElement<any>[] = vendor.categories.map((category:string) => {
      return <Chip key={category} text={category} />
    })
    if (vendor.price) {
      Categories.unshift(<Chip key={vendor.price} text={vendor.price}/>)
    }

    return <React.Fragment>{Categories}</React.Fragment>;
};

export default VendorProfileCategories;
