// DEPENDENCIES
import React from 'react';

// COMPONENTS
import VendorSelectorLink from '../dashboard-menu-link';
import DashboardCard from '../dashboard-card';
// HOOKS
import useGetAppState from '../../common/hooks/use-get-app-state';

// UTILS
import {isActive} from "../../../util";

// Get data from redux state
const useGetVendors = (type: string) => {
    const state = useGetAppState();
    let links = null;
    const allVendors = Object.values(state.data.vendorsAll);

    if (allVendors.length) {
      let list:any[] = [];
      const dashboardVendorsDisplayState = state.ui.dashboardVendorsDisplay;

      // Links are dependent on menu state
      // May be changed if used else where than single menu
      if (dashboardVendorsDisplayState === 'active') {
        list = allVendors.filter(isActive);
      } else if (dashboardVendorsDisplayState === 'all') {
        list = allVendors.filter((vendor:any) => vendor.approved);
      }
      links = list.sort((a:any, b:any) => (a.name > b.name) ? 1 : -1).map((vendor:any) => {
        if (type === 'link') {
          return <VendorSelectorLink name={vendor.name} id={vendor.id} img={vendor.profileImageLink} key={vendor.id}/>
        } else if (type === 'card') {
          return <DashboardCard name={vendor.name} id={vendor.id} img={vendor.bannerImageLink ? vendor.bannerImageLink : vendor.profileImageLink} key={vendor.id}/>

        }
      })
    }

    return links ? links : <p>loading</p>
}

export default useGetVendors;
