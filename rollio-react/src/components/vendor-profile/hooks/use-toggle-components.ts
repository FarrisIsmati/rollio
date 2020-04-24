// DEPENDENCIES
import { useEffect, useState, useRef } from 'react';

const useToggleComponents = (vendorID: string, initComponents:any) => {
    const [components, setComponents] = useState<any>(initComponents);

    // Get current vendor ID in ref, if vendorID changes then reset initComponents
    // This is because we never unmount this component so when opening a new vendor 
    // We want all the open/close states to be reset
    const currentVendor:any = useRef(vendorID);

    useEffect(() => {
        if (currentVendor.current !== vendorID) {
            setComponents(initComponents);
        }

        currentVendor.current = vendorID;
    })

    return {
        components,
        toggleComponents: function( component:string) {
            const updatedComponents:any = {
                ...components
            };
            updatedComponents[component] = !updatedComponents[component];

            setComponents(updatedComponents);
            return updatedComponents;
        }
    }
}

export default useToggleComponents;
