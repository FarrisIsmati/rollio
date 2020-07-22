// DEPENDENCIES
import React from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import Modal from 'react-modal';

// HOOKS
import useGetGroupLinks from './hooks/use-get-group-links';
import useGetAppState from '../common/hooks/use-get-app-state';

const DashboardGroupSelectDesktopModal= React.forwardRef((props:any, ref:any) => {
  const state = useGetAppState();

  const links = useGetGroupLinks();// CREATE NEW GET GROUP MENU LINKS

  const isVendorSelected = state.ui.isVendorSelected;
  const isOpen = state.ui.isGroupSelectMenuActive;

  // Makes modal fully accessible
  Modal.setAppElement('#root');

  const customModalStyle = {
    overlay: {
      zIndex: 2
    },
    content : {
        height : '300px',
        width : '400px',
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
      isOpen={isOpen}
      onAfterOpen={()=>{}}
      onRequestClose={()=>{}}
      style={customModalStyle}
      contentLabel="Grouped Vendors"
    >
      <Scrollbars
        className={'dashboard_group_select_mobile'}
        style={{ width: '400px', height: '300px' }} 
        // Hide scrollbar when vendor profile is being animated on
        renderThumbVertical={            
          ({ style }:any) => <div style={{ ...style, borderRadius: 'inherit', backgroundColor: isVendorSelected ? 'transparent' : 'rgba(0, 0, 0, 0.2)' }} /> 
        }
      >
        { links }
      </Scrollbars>
    </ Modal>
  );
})

export default DashboardGroupSelectDesktopModal;
