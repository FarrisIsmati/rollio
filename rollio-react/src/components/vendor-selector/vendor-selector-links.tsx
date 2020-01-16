// DEPENDENCIES
import React, { useEffect, useLayoutEffect, useState } from 'react';

// HOOKS
import windowSizeEffects from '../common/hooks/use-window-size';
import useGetVendorSelectorLinks from './hooks/use-get-links';

const VendorSelectorLinks = React.forwardRef((props, ref)=> {
  const [refHeight, setRefHeight] = useState('0px');

  const links = useGetVendorSelectorLinks();

  const windowHeight = windowSizeEffects.useWindowHeight();

  useLayoutEffect(() => {
    //@ts-ignore
    setRefHeight(`${windowHeight - 26 - ref.current.offsetHeight}px`)
  }, [])

  return (
    // Mobile resize this flex centers
    <div className="menu_links__wrapper" style={{height: refHeight}}> 
      { links }
    </div>
  );
})

export default VendorSelectorLinks;
