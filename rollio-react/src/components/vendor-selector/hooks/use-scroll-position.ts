import { useRef, useLayoutEffect } from 'react'

const isBrowser = typeof window !== `undefined`

function getScrollPosition(element:any) {
  if (!isBrowser) return { x: 0, y: 0 }

  const target = element ? element.current : document.body
  const position = target.getBoundingClientRect()

  return { x: position.left, y: position.top }
}

const useScrollPosition = (ref:any, scrollState:any) => {
    const { scrollHeight, setScrollHeight } = scrollState;
    //   let throttleTimeout:any = null
    
    //   const callBack = () => {
        //     const currPos = getScrollPosition({ element, useWindow })
        //     effect({ prevPos: position.current, currPos })
        //     position.current = currPos
        //     throttleTimeout = null
        //   }
        
    useLayoutEffect(() => {
        const position = getScrollPosition(ref);
        console.log(position)
        const handleScroll = () => {
        console.log('scrolliio')
    //   if (wait) {
    //     if (throttleTimeout === null) {
    //       throttleTimeout = setTimeout(callBack, wait)
    //     }
    //   } else {
    //     callBack()
    //   }
    }

    window.addEventListener('scroll', handleScroll)

    return () => window.removeEventListener('scroll', handleScroll)
  })
}

export default useScrollPosition;