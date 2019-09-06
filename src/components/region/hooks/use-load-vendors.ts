// DEPENDENCIES
import { useEffect } from 'react';
import { useDispatch  } from 'react-redux';

// HOOKS
import useGetAppState from '../../common/hooks/use-get-app-state';

// Hook acts as a component did mount, loads the region if given via props
const useLoadVendors = (props:any) => {
    const isRegionLoaded = useGetAppState().async.isRegionLoaded;
    let hasVendorsBeenRequested = false;

    // Load vendors only if the region is successfully loaded and the vendors have not been requested yet
    if (isRegionLoaded && !hasVendorsBeenRequested) {
        // MAKE DISPATCH TO ASYNC ACTION THAT GETS ALL VENDORS!!!!!!!!!
    }

}

export default useLoadVendors;
