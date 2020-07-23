// DEPENDENCIES
import React from 'react';
import { LOADING_COLOR } from '../../common/constants/style_constants';

// COMPONENTS
import VendorSelectorLink from '../dashboard-menu-link';
import ReactLoading from 'react-loading';


// HOOKS
import useGetAppState from '../../common/hooks/use-get-app-state';

// Get data from redux state
const useGetGroupLinks = () => {
    const state = useGetAppState();

    if (state.regionMap.temporarilySelected) {
      let links = null;

      const vendors = state.regionMap.vendorsDisplayedGroup[state.regionMap.temporarilySelected].vendors;
  
      const vendorsFormatted = vendors.map((vendor:any) => {
          const vendorId = vendor.vendorId.split('-')[0];
          return state.data.vendorsAll[vendorId];
      })

      if (vendorsFormatted.length) {
        links = vendorsFormatted.sort((a:any, b:any) => (a.name > b.name) ? 1 : -1).map((vendor:any) => {
          return <VendorSelectorLink name={vendor.name} id={vendor.id} img={vendor.profileImageLink} key={vendor.id}/>
        })
      }
  
      return links ? links : <ReactLoading type={'spokes'} color={LOADING_COLOR} height={64} width={64} />
    } else {
      return <ReactLoading type={'spokes'} color={LOADING_COLOR} height={64} width={64} />
    }
}

export default useGetGroupLinks;
