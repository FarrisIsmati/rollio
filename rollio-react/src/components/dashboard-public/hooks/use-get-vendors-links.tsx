// DEPENDENCIES
import React from 'react';
import constants from '../../../util/constants';

// COMPONENTS
import VendorSelectorLink from '../dashboard-menu-link';
import DashboardCard from '../dashboard-card';
import ReactLoading from 'react-loading';

// HOOKS
import useGetAppState from '../../common/hooks/use-get-app-state';

// UTILS
import {isActive} from "../../../util";

// Get data from redux state
const useGetVendors:any = (type: string) => {

    const state = useGetAppState();

    const allVendors:any = Object.values(state.data.vendorsAll);

    if (allVendors.length) {
      let list:Element[] = [];
      const dashboardVendorsDisplayState = state.ui.dashboardVendorsDisplay;

      // Get vendors based on menu state
      if (dashboardVendorsDisplayState === 'active') {
        list = allVendors.filter(isActive);
      } else if (dashboardVendorsDisplayState === 'all') {
        list = allVendors.filter((vendor:any) => vendor.approved);
      }

      const vendorsFormatted:(JSX.Element | never[])[] = list.sort((a:any, b:any) => (a.name > b.name) ? 1 : -1).map((vendor:any) => {
        if (type === 'link') {
          return <VendorSelectorLink name={vendor.name} id={vendor.id} img={vendor.profileImageLink} key={vendor.id}/>
        } else if (type === 'card') {
          return <DashboardCard state={state} vendor={vendor} img={vendor.bannerImageLink ? vendor.bannerImageLink : vendor.profileImageLink} key={vendor.id}/>
        } else {
          return []
        }
      })

      return vendorsFormatted ? vendorsFormatted : <div className='flex__center_full_height'><ReactLoading type={'spokes'} color={constants.LOADING_COLOR} height={64} width={64} /></div>
    } else {
      return <div className='flex__center_full_height'><ReactLoading type={'spokes'} color={constants.LOADING_COLOR} height={64} width={64} /></div>
    }

}

export default useGetVendors;
