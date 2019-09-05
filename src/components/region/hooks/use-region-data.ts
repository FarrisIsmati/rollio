// DEPENDENCIES
import { useSelector  } from 'react-redux';

// Get data from redux state
const useRegionData = {
    GetRegionLoadStatus: () => {
        return useSelector((state:any) => state.data.isRegionLoaded)
    }
}

export default useRegionData;
