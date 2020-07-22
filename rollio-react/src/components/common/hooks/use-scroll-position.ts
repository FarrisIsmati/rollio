// DEPENDENCIES
import { useRef, useLayoutEffect } from 'react';

const useScrollPosition = (args:{ scrollRef?:any, isLoaded:boolean, cb?:any }) => {
    // Use scrollref only for traditional scrolling
    const { scrollRef, isLoaded, cb } = args;

    const prevScrollHeight:any = useRef(0);
    const prevScrollDir:any = useRef('');
    const prevScrollTimeStamp:any = useRef(0);
    
    // If using plugin just pass scroll event to handle scroll
    const handleScroll = (e:any) => {
        let scrollDir:null|string = null;
        const window = e.target;
        const scrollHeight = window.scrollHeight;
        const distanceToTop = window.scrollTop;
        const scrollPos = scrollHeight - distanceToTop
        const distanceToBottom = scrollPos - window.clientHeight;
        
        if (!prevScrollHeight.current || scrollPos < prevScrollHeight.current) {
            scrollDir = 'down'
            prevScrollDir.current = scrollDir
        } else if (scrollPos > prevScrollHeight.current) {
            scrollDir = 'up'
            prevScrollDir.current = scrollDir
        } else if (scrollPos === prevScrollHeight.current) {
            scrollDir = prevScrollDir.current;
        }

        prevScrollHeight.current = scrollPos;

        // In Seconds
        const scrollTimeStampDelta = Math.round( e.timeStamp - prevScrollTimeStamp.current ) / 1000;

        if (cb) {
          cb({scrollDir, distanceToTop, distanceToBottom, scrollTimeStampDelta});
        }

        // Distance to bottom scrollPos - clientHeight
        prevScrollTimeStamp.current = e.timeStamp;
    }

    // UI Effects
    useLayoutEffect(() => {
      if (isLoaded && scrollRef) {
        scrollRef.current.addEventListener('scroll', handleScroll);
      }
  
      return () => {
        if (isLoaded && scrollRef) {
            scrollRef.current.removeEventListener('scroll', handleScroll);
        }
      }
    })

    return handleScroll;
}

export default useScrollPosition;
