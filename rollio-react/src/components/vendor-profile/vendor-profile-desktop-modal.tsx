// DEPENDENCIES
import React from 'react';
import { useDispatch  } from 'react-redux';
import { Scrollbars } from 'react-custom-scrollbars';
import Modal from 'react-modal';

// COMPONENTS
import VendorProfileContent from './vendor-profile-content';

// HOOKS
import useGetAppState from '../common/hooks/use-get-app-state';
import windowSizeEffects from '../common/hooks/use-window-size';
import useMap from '../map/hooks/useMap';

// ACTIONS
import { deselectAllVendors } from '../../redux/actions/data-actions';

const VendorProfileDesktopModal = React.forwardRef((props:any, navbarRef)=> {
  const state = useGetAppState();
  const dispatch = useDispatch();
  const { zoomToLocation } = useMap();

  const isMobile = windowSizeEffects.useIsMobile();
  const isVendorSelected = state.ui.isVendorSelected;
  const isOpen = state.ui.showSelectedVendor;
  const isLoaded = state.loadState.isVendorLoaded;
  const vendor = state.data.selectedVendor;

  // Makes modal fully accessible
  Modal.setAppElement('#root');

  const customModalStyle = {
    overlay: {
      zIndex: 2
    },
    content : {
      height : '740px',
      width : '692px',
      top : '50%',
      left : '50%',
      right : 'auto',
      bottom : 'auto',
      marginRight : '-50%',
      transform : 'translate(-50%, -50%)',
      overflow: 'hidden'
    }
  };

  return (
    <Modal
      isOpen={isOpen && isVendorSelected}
      onAfterOpen={()=>{}}
      onRequestClose={()=>{}}
      style={customModalStyle}
      contentLabel="Profile"
    >
      <div className='vendorprofile'>
        <Scrollbars
          style={{ width: '100%', height: '100%' }}
          // Hide scrollbar when vendor profile is being animated closed
          renderThumbVertical={
            ({ style }:any) => <div style={{ ...style, borderRadius: 'inherit', backgroundColor: isVendorSelected ? 'rgba(0, 0, 0, 0.2)' : 'transparent' }} />
          }>
          { isLoaded ?
            <VendorProfileContent
              isMobile={isMobile}
              closeVendor={() => dispatch(deselectAllVendors())}
              findOnMap={(location:any) => { zoomToLocation(location) }}
              vendor={vendor}
              state={state} />
            :
            <p>loading...</p>}
        </Scrollbars>
      </div>
    </Modal>
  );
});

export default VendorProfileDesktopModal;
