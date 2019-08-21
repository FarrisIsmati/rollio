// DEPENDENCIES
import React from 'react';

const VendorData = (props:any) => {
    const vendor = props.getVendorData()

    return (
    <div className='vendordata__wrapper'>
        <div className='col1'>
            <img src={vendor.profileImageLink}/>
            <p>Astro Donuts</p>
        </div>
        <div className='col2'>
            <p>Thingy</p>
        </div>
        <div className='col3'>
            <p>descrip</p> 
        </div>
        <div className='col4'>
            <p>bottom</p>
        </div>
    </div>
  );
}

export default VendorData;
