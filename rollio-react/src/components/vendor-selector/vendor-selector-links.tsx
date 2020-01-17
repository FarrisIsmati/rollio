// DEPENDENCIES
import React from 'react';

// HOOKS
import useGetLinksHeight from './hooks/use-get-links-height';
import useGetVendorSelectorLinks from './hooks/use-get-links';

const VendorSelectorLinks = React.forwardRef((props, ref)=> {
  const links = useGetVendorSelectorLinks();

  const menuLinksHeight = useGetLinksHeight(ref, 26);

  return (
    // Mobile resize this flex centers
    <div className="menu_links__wrapper" style={{height: menuLinksHeight}}> 
      { links }
    </div>
  );
})

export default VendorSelectorLinks;
