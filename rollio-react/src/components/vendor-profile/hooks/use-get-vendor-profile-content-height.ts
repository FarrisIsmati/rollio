// DEPENDENCIES
import { useLayoutEffect, useRef } from 'react';

// HOOKS
import windowSizeEffects from '../../common/hooks/use-window-size';

const useGetVendorProfileContentHeight = (ref:any) => {
    const height = useRef(0);
    const prevHeight = useRef(0);
    const windowHeight = windowSizeEffects.useWindowHeight();

    // UI Effects
    useLayoutEffect(() => {
        if (ref.current) {
            const newHeight = windowHeight - ref.current.offsetHeight;
            if (height.current === 0 || prevHeight.current !== newHeight) {
                height.current = newHeight;
                prevHeight.current = height.current;
            }
        }
    });
    
    console.log(height.current)
    console.log(windowHeight)
    if (ref.current)
        console.log(ref.current.offsetHeight)

    return height.current;
}

export default useGetVendorProfileContentHeight;
