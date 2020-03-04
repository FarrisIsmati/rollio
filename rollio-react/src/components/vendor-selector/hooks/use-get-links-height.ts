// DEPENDENCIES
import { useEffect, useLayoutEffect, useState } from 'react';

const useGetLinksHeight = (refs:any[], vendorSelectorLinksHeight:number) => {
    const [height, setHeight] = useState('0px');

    // Reducer sums up the total offSetHeight of all refs passed in as an arugment to the refs array
    const reduceRefs = (refs:any[]) => refs.reduce((a,b) => {
        if (!a.current) {
          a = { current: { offsetHeight: 0 } }
        }
        return a.current.offsetHeight + b.current.offsetHeight
      }, []);
    
    useEffect(() => {
      if (refs[0].current) {
        const totalRefsOffsetHeight:number = reduceRefs(refs);
        console.log(totalRefsOffsetHeight);
        setHeight(`${vendorSelectorLinksHeight - totalRefsOffsetHeight}px`)
      }
    }, [vendorSelectorLinksHeight])

    useLayoutEffect(() => {
      const totalRefsOffsetHeight:number = reduceRefs(refs);
      //@ts-ignore
      setHeight(`${vendorSelectorLinksHeight - totalRefsOffsetHeight}px`)
    }, [])

    return height
}

export default useGetLinksHeight;
