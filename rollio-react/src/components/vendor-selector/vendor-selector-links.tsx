// DEPENDENCIES
import React, { FC, useEffect, useState } from 'react';

// HOOKS
import useGetAppState from '../common/hooks/use-get-app-state';
import windowSizeEffects from '../common/hooks/use-window-size';

// INTERFACES
import { VendorSelectedLinkProps } from './interfaces';

const VendorSelectorLink = (props:VendorSelectedLinkProps) => {
  const { name, id, img } = props;
  return (
    // Mobile resize this flex centers
    <div className="menu_link__wrapper"> 
      <div className="menu_link__image_wrapper">
          <img alt={`${name} logo`} src={'https://via.placeholder.com/56x56'} />
      </div>
      <div>
        <h2>{name}</h2>
      </div>
    </div>
  )
}

const VendorSelectorLinks = React.forwardRef((props, ref)=> {
  const state = useGetAppState();
  let links = null;
  const allVendors = Object.values(state.data.vendorsAll);

  const windowHeight = windowSizeEffects.useWindowHeight();

    // @ts-ignore
    let heightStyle = ref.current ? {
      // @ts-ignore
      height: `${windowHeight - 26 - ref.current.offsetHeight}px`
    } : {
      height: '0px'
    }

    if (allVendors.length) {
      links = allVendors.map((vendor:any) => {
        return <VendorSelectorLink name={vendor.name} id={vendor.id} />
      })
    }

  useEffect( () => {
    //@ts-ignore
    console.log(ref.current)
    // now it's just possible
    
    heightStyle = {
      // @ts-ignore
      height: `${windowHeight - 26 - ref.current.offsetHeight}px`
    }
    //@ts-ignore
  }, [ref.current]) // react to dom node change

  return (
    // Mobile resize this flex centers
    <div className="menu_links__wrapper" style={heightStyle}> 
      {
        links ? links : <p>loading</p>
      }
    </div>
  );
})

export default VendorSelectorLinks;
