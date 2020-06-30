// DEPENDENCIES
import React from 'react';

// COMPONENTS
import VendorSelectorLink from '../dashboard-link';

// HOOKS
import useGetAppState from '../../common/hooks/use-get-app-state';

// Get data from redux state
const useGetGroupLinks = () => {
    const state = useGetAppState();
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

    return links ? links : <p>loading</p>
}

export default useGetGroupLinks;
