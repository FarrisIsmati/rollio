// DEPENDENCIES
import React from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { useCallbackRef } from 'use-callback-ref';

// HOOKS
import useGetVendors from './hooks/use-get-vendors';
import useGetHeightDifference from './hooks/use-get-height-difference';

const DashboardDesktop = (props:any) => {
  // Region Content Height
  const { regionContentHeight } = props;

  // Refs
  const topRef = useCallbackRef(null, () => {});
  
  // Hooks
  const cards = useGetVendors('card');
  // Height = Height of desktop region - height of the top content - top margin 24px
  const height = useGetHeightDifference([topRef], parseInt(regionContentHeight.substring(0, regionContentHeight.length - 2)) - 24 );

  return (
    <div className='dashboard_desktop'>
      <div ref={topRef} className='dashboard_desktop__top_info font__dashboard_desktop_topbar'>
        <p>12 Vendors</p>
      </div>
      <Scrollbars 
        className="dashboard_desktop__scrollbar" 
        style={{ width: '100%', height: height }} 
        // Hide scrollbar when vendor profile is being animated on
        renderThumbVertical={            
          ({ style }:any) => <div style={{ ...style, borderRadius: 'inherit', backgroundColor: 'rgba(0, 0, 0, 0.2)' }} /> 
        }
      >
        <div className='dashboard__cards'>
          { cards }
        </div>
      </Scrollbars>
    </div>
  );
}

export default DashboardDesktop;
