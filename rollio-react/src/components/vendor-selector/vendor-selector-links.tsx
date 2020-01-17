// DEPENDENCIES
import React from 'react';

// HOOKS
import useGetLinksHeight from './hooks/use-get-links-height';
import useGetVendorSelectorLinks from './hooks/use-get-links';

const VendorSelectorLinks = React.forwardRef((props:any, ref)=> {
  const links = useGetVendorSelectorLinks();

  const { vendorSelectorLinksHeight } = props;
  
  const height = useGetLinksHeight(ref, vendorSelectorLinksHeight);

  return (
    // Mobile resize this flex centers
    <div className="menu_links__wrapper" style={{height}}> 
      { links }
    </div>
  );
})

export default VendorSelectorLinks;
