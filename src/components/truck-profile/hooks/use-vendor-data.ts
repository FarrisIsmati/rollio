// DEPENDENCIES
import { useSelector, useDispatch  } from 'react-redux';

// ACTIONS
import { fetchVendorProfile } from '../../../redux/actions/data-actions';

const useVendorData = () => {    
    const FetchVendorProfileData = (props: any) => {
        const { regionId, vendorId } = props;
        const dispatch = useDispatch();
        dispatch( fetchVendorProfile({ regionId, vendorId }) );
    }

    const GetCommentsFromState = () => {
        return useSelector((state:any) => state.data.selectedVendor.comments)
    }

    return {
        FetchVendorProfileData,
        GetCommentsFromState
    }
}

export default useVendorData;