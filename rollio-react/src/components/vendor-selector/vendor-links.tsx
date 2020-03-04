// DEPENDENCIES
import React from 'react';
import { Scrollbars } from 'react-custom-scrollbars';

// HOOKS
import useGetLinksHeight from './hooks/use-get-links-height';
import useGetVendorLinks from './hooks/use-get-links';
import useGetAppState from '../common/hooks/use-get-app-state';

const VendorLinks = React.forwardRef((props:any, ref:any) => {
  const links = useGetVendorLinks();

  const { vendorLinksHeight, refs } = props;

  // Hooks
  const state = useGetAppState();
  const height = useGetLinksHeight(refs, vendorLinksHeight);

  // Quick variable references
  const isVendorSelected = state.ui.isVendorSelected;
  
  return (
    // Mobile resize this flex centers
    <Scrollbars 
      className="menu_links__wrapper" 
      style={{ width: '100%', height: height }} 
      // Hide scrollbar when vendor profile is being animated on
      renderThumbVertical={            
        ({ style }:any) => <div style={{ ...style, borderRadius: 'inherit', backgroundColor: isVendorSelected ? 'transparent' : 'rgba(0, 0, 0, 0.2)' }} /> 
      }
    >
      { links }
    </Scrollbars>
  );
})

export default VendorLinks;
