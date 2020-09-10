// DEPENDENCIES
import React from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import Modal from 'react-modal';
import { useDispatch  } from 'react-redux';

// HOOKS
import useGetGroupLinks from './hooks/use-get-group-links';
import useGetAppState from '../common/hooks/use-get-app-state';

// ACTIONS
import { toggleGroupSelectMenu } from '../../redux/actions/ui-actions';

const DashboardGroupSelectDesktopModal= React.forwardRef((props:any, ref:any) => {
  const state = useGetAppState();
  const dispatch = useDispatch();

  const links = useGetGroupLinks(); // CREATE NEW GET GROUP MENU LINKS

  const isVendorSelected = state.ui.isVendorSelected;
  const isOpen = state.ui.isGroupSelectMenuActive;

  // Makes modal fully accessible
  Modal.setAppElement('#root');

  let vendorsCount = 0;

  if (links.length) {
    vendorsCount = links.length;
  }

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
        overflow: 'hidden',
        padding: 0
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onAfterOpen={()=>{}}
      onRequestClose={()=>{dispatch(toggleGroupSelectMenu())}}
      style={customModalStyle}
      contentLabel="Grouped Vendors"
    >
      <div className='dashboard__group_select_topbar_desktop font__dashboard_desktop_group_select'>
        <p>{vendorsCount} Vendors</p>

        <i className="material-icons-outlined" onClick={ () => { dispatch(toggleGroupSelectMenu()) } } >close</i>
      </div>

      <Scrollbars
        className={'dashboard__group_select'}
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
