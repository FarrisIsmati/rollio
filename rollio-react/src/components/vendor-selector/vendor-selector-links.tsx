// DEPENDENCIES
import React, { useEffect } from 'react';

// HOOKS
import windowSizeEffects from '../common/hooks/use-window-size';
import useGetVendorSelectorLinks from './hooks/use-get-links';

const VendorSelectorLinks = React.forwardRef((props, ref)=> {
  const links = useGetVendorSelectorLinks();

  const windowHeight = windowSizeEffects.useWindowHeight();

  // Using ref to get the exact height of div so we can do a scrollbar inside a div
  // @ts-ignore
  let heightStyle = ref.current ? {
    // @ts-ignore
    height: `${windowHeight - 26 - ref.current.offsetHeight}px`
  } : {
    height: '0px'
  }

  // Use Effect runs when the ref gets a value
  useEffect( () => {
    heightStyle = {
      // @ts-ignore
      height: `${windowHeight - 26 - ref.current.offsetHeight}px`
    }
    //@ts-ignore
  }, [ref.current])

  return (
    // Mobile resize this flex centers
    <div className="menu_links__wrapper" style={heightStyle}> 
      { links }
    </div>
  );
})

export default VendorSelectorLinks;
