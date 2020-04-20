// DEPENDENCIES
import React from 'react';

// COMPONENTS
import VendorSelectorLink from '../dashboard-link';

// HOOKS
import useGetAppState from '../../common/hooks/use-get-app-state';

// Get data from redux state
const useGetLinks = () => {
    const state = useGetAppState();
    let links = null;
    const allVendors = Object.values(state.data.vendorsAll);

    if (allVendors.length) {
      let list:any[] = [];
      const dashboardVendorsDisplayState = state.ui.dashboardVendorsDisplay;

      // Links are dependent on menu state
      // May be changed if used else where than single menu
      if (dashboardVendorsDisplayState === 'active') {
        list = allVendors.filter((vendor:any) => vendor.isActive);
      } else if (dashboardVendorsDisplayState === 'all') {
        list = allVendors;
      } 
      links = list.sort((a:any, b:any) => (a.name > b.name) ? 1 : -1).map((vendor:any) => {
        return <VendorSelectorLink name={vendor.name} id={vendor.id} img={vendor.profileImageLink} key={vendor.id}/>
      })
    }

    return links ? links : <p>loading</p>
}

export default useGetLinks;
