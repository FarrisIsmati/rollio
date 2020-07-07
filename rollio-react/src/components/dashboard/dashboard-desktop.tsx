// DEPENDENCIES
import React from 'react';

// COMPONENTS
import DashboardCard from './dashboard-card';

const DashboardDesktop = (props:any) => {
  return (      
    <div className='dashboard_desktop'>
      <div className='dashboard_desktop__top_info'>
        <p>12 Vendors</p>
      </div>
      <DashboardCard name='lol' id='1' />
    </div>
  );
}

export default DashboardDesktop;
