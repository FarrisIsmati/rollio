// DEPENDENCIES
import React from 'react';
import { Scrollbars } from 'react-custom-scrollbars';

// HOOKS
import useGetHeightDifference from './hooks/use-get-height-difference';
import useGetAppState from '../common/hooks/use-get-app-state';

const MenuLinksDesktop = React.forwardRef((props:any, ref:any) => {

  const { vendorLinksHeight, refs } = props;

  // Hooks
  const state = useGetAppState();
  const height = useGetHeightDifference(refs, vendorLinksHeight);

  // Quick variable references
  const isVendorSelected = state.ui.isVendorSelected;
  
  return (
    // Mobile resize this flex centers
    <Scrollbars 
      className="dashboard_links__wrapper" 
      style={{ width: '100%', height: height }} 
      // Hide scrollbar when vendor profile is being animated on
      renderThumbVertical={            
        ({ style }:any) => <div style={{ ...style, borderRadius: 'inherit', backgroundColor: isVendorSelected ? 'transparent' : 'rgba(0, 0, 0, 0.2)' }} /> 
      }
    >
    </Scrollbars>
  );
})

export default MenuLinksDesktop;
