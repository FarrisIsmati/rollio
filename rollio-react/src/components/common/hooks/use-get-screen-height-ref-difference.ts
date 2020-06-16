// DEPENDENCIES
import { useLayoutEffect, useRef } from 'react';

// HOOKS
import windowSizeEffects from './use-window-size';

const useGetScreenHeightRefDifferenc = (...args:any[]) => {
    const height = useRef(0);
    const prevHeight = useRef(0);
    const windowHeight = windowSizeEffects.useWindowHeight();

    // UI Effects
    useLayoutEffect(() => {
        let activeRef = false;
        let refsHeightSum = 0;

        args.forEach(ref => {
            if (ref && ref.current) {
                activeRef = true;
                refsHeightSum += ref.current.offsetHeight;
            }
        });

        if (activeRef) {
            const newHeight = windowHeight - refsHeightSum;
            if (height.current === 0 || prevHeight.current !== newHeight) {
                height.current = newHeight;
                prevHeight.current = height.current;
            }
        }
    });

    return height.current;
}

export default useGetScreenHeightRefDifferenc;
