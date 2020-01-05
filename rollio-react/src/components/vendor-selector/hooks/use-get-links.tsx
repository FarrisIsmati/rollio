// DEPENDENCIES
import React from 'react';

// HOOKS
import useGetAppState from '../../common/hooks/use-get-app-state';
import windowSizeEffects from '../../common/hooks/use-window-size';

// INTERFACES
import { VendorSelectedLinkProps } from '../interfaces';

const VendorSelectorLink = (props:VendorSelectedLinkProps) => {
  const { name, id, img } = props;

  return (
    // Mobile resize this flex centers
    <div className="menu_link__wrapper"> 
      <div className="menu_link__image_wrapper">
          <div className="menu_link__image">
            <img alt={`${name} logo`} src={img} />
          </div>
      </div>
      <div>
        <h2 className="font__menu_link">{name}</h2>
      </div>
    </div>
  )
}

// Get data from redux state
const useGetLinks = () => {
    const state = useGetAppState();
    let links = null;
    const allVendors = Object.values(state.data.vendorsAll);

    if (allVendors.length) {
      links = allVendors.map((vendor:any) => {
        return <VendorSelectorLink name={vendor.name} id={vendor.id} img={vendor.profileImageLink} key={vendor.id}/>
      })
    }

    return links ? links : <p>loading</p>
}

export default useGetLinks;
