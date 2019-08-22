// DEPENDENCIES
import React from 'react';

const VendorData = (props:any) => {
    const vendor = props.getVendorData()

    const Categories = vendor.categories.map((category:string) => {
        return (            
            <div className='info__category_wrapper' key={category}>
                {category}
            </div>
        )
    })

    return (
    <div className='vendordata__wrapper'>
        <div className='col1'>
            <img src={vendor.profileImageLink} className='vendordata__vendor_profimg'/>
            <h1 className='font__vendordata_title'>{vendor.name}</h1>
        </div>
        <div className='col2'>
            {Categories}
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
