// DEPENDENCIES
import { useEffect, useLayoutEffect, useState } from 'react';

const useGetLinksHeight = (ref:any, vendorSelectorLinksHeight:number) => {
    const [height, setHeight] = useState('0px');
    
    useEffect(() => {
      setHeight(`${vendorSelectorLinksHeight - ref.current.offsetHeight}px`)
    }, [vendorSelectorLinksHeight])

    useLayoutEffect(() => {
      //@ts-ignore
      setHeight(`${vendorSelectorLinksHeight - ref.current.offsetHeight}px`)
    }, [])

    return height
}

export default useGetLinksHeight;
