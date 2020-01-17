// DEPENDENCIES
import { useLayoutEffect, useState } from 'react';

// HOOKS
import windowSizeEffects from '../../common/hooks/use-window-size';

const useGetLinksHeight = (ref:any, fixedHeight:number) => {
    const [height, setHeight] = useState('0px');
    
    const windowHeight = windowSizeEffects.useWindowHeight();
  
    useLayoutEffect(() => {
      //@ts-ignore
      setHeight(`${windowHeight - fixedHeight - ref.current.offsetHeight}px`)
    }, [])

    return height
}


export default useGetLinksHeight;