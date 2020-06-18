// DEPENDENCIES
import { useState, useEffect, useRef } from 'react';

const effects = {
    useWindowWidth() {
        const [width, setWidth] = useState(window.innerWidth);

        useEffect(() => {
            const handleResize = () => setWidth(window.innerWidth);
            window.addEventListener('resize', handleResize);
            return () => {
                window.removeEventListener('resize', handleResize);
            };
        });

        return width;
    }, 
    useWindowHeight() {
        const [height, setHeight] = useState(window.innerHeight);

        useEffect(() => {
            const handleResize = () => setHeight(window.innerHeight);
            window.addEventListener('resize', handleResize);
            return () => {
                window.removeEventListener('resize', handleResize);
            };
        });

        return height;
    },
    useIsMobile() {
        const [width, setWidth] = useState(window.innerWidth);

        useEffect(() => {
            const handleResize = () => setWidth(window.innerWidth);
            window.addEventListener('resize', handleResize);
            return () => {
                window.removeEventListener('resize', handleResize);
            };
        });

        if (width < 768) {
            return true;
        }

        return false;
    }
}
export default effects;