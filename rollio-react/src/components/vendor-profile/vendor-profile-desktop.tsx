// DEPENDENCIES
import React from 'react';
import { useDispatch  } from 'react-redux';
import { Scrollbars } from 'react-custom-scrollbars';

// COMPONENTS
import VendorProfileContent from './vendor-profile-content';

// HOOKS
import useGetAppState from '../common/hooks/use-get-app-state';
import windowSizeEffects from '../common/hooks/use-window-size';
import useScrollPosition from '../common/hooks/use-scroll-position';
import useGetScreenHeightRefDifferenc from '../common/hooks/use-get-screen-height-ref-difference';
import useMap from '../map/hooks/useMap';

// ACTIONS
import { deSelectVendor } from '../../redux/actions/data-actions';

const VendorProfileDesktop = React.forwardRef((props:any, navbarRef)=> {
  // Hooks
  const dispatch = useDispatch();
  const state = useGetAppState();
  const { zoomToLocation } = useMap();

  // Height of the entire vendor profile (window height - navbarRef height)
  const vendorProfileHeight = useGetScreenHeightRefDifferenc(navbarRef) + 'px';

  const handleScroll = useScrollPosition({
    isLoaded: state.loadState.isVendorLoaded
  });

  // Variables
  const isMobile = windowSizeEffects.useIsMobile();
  const isVendorSelected = state.ui.isVendorSelected;
  const isLoaded = state.loadState.isVendorLoaded;
  const vendor = state.data.selectedVendor;

  // Difference between the Desktop and Mobile version is how it scrolls the content
  return (
    <div className={isVendorSelected ? 'vendorprofile__wrapper' : 'vendorprofile__wrapper_hidden'}>
      <Scrollbars
        style={{ width: '432px', height: vendorProfileHeight }}
        onScroll={handleScroll}
        // Hide scrollbar when vendor profile is being animated closed
        renderThumbVertical={
          ({ style }:any) => <div style={{ ...style, borderRadius: 'inherit', backgroundColor: isVendorSelected ? 'rgba(0, 0, 0, 0.2)' : 'transparent' }} />
        }
      >
        { isLoaded ?
          <VendorProfileContent
            isMobile={isMobile}
            closeVendor={() => dispatch(deSelectVendor())}
            findOnMap={(location:any) => { zoomToLocation(location) }}
            vendor={vendor}
            state={state} /> :
          <p>loading...</p>}
      </Scrollbars>
    </div>
  );
});

export default VendorProfileDesktop;
