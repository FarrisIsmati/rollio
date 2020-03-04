// DEPENDENCIES
import { useEffect, useLayoutEffect, useState } from 'react';

const useGetLinksHeight = (refs:any[], vendorSelectorLinksHeight:number) => {
    const [height, setHeight] = useState('0px');

    // Reducer sums up the total offSetHeight of all refs passed in as an arugment to the refs array
    const reduceRefs = (refs:any[]) => refs.reduce((a,b) => {
        return a + b.current.offsetHeight
      }, 0);
    
    useEffect(() => {
      if (refs[0].current) {
        const totalRefsOffsetHeight:number = reduceRefs(refs);
        setHeight(`${vendorSelectorLinksHeight - totalRefsOffsetHeight}px`)
      }
    }, [vendorSelectorLinksHeight])

    useLayoutEffect(() => {
      const totalRefsOffsetHeight:number = reduceRefs(refs);
      setHeight(`${vendorSelectorLinksHeight - totalRefsOffsetHeight}px`)
    }, [])

    return height
}

export default useGetLinksHeight;
