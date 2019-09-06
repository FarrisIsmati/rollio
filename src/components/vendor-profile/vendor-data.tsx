// DEPENDENCIES
import React from 'react';

const VendorData = (props:any) => {
    const vendor = props.vendorData

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
            <p className="font__vendordata_description">{vendor.description}</p> 
        </div>
        <div className='col4'>
            <p className="font__vendordata_description">{vendor.creditCard === 'y' ? 'Credit Cards Accepted' : 'Credit Card NOT Accepted'}</p>
            {
                vendor.website ?
                <p><a className="font__vendordata_link" href={vendor.website} target="_blank">Website</a></p>  :
                <p className="font__vendordata_description">No website</p>
            }
            {
                vendor.phonenumber ?
                <p><a className="font__vendordata_link" href={`tel:${vendor.phonenumber}`} target="_blank">{vendor.phonenumber}</a></p>  :
                <p className="font__vendordata_description">No phone number</p>
            }
        </div>
    </div>
  );
}

export default VendorData;
