// DEPENDENCIES
import React from 'react';

// COMPONENTS
import DashboardCard from './dashboard-card';

// HOOKS
import useGetVendors from './hooks/use-get-vendors';

const DashboardDesktop = (props:any) => {
  // Hooks
  const cards = useGetVendors('card');

  return (      
    <div className='dashboard_desktop'>
      <div className='dashboard_desktop__top_info'>
        <p>12 Vendors</p>
      </div>
      { cards }
    </div>
  );
}

export default DashboardDesktop;
