// DEPENDENCIES
import { useSelector  } from 'react-redux';

// Get data from redux state
const useGetAppState = () => {
    return useSelector((state:any) => state.data)
}

export default useGetAppState;
