// DEPENDENCIES
import { useDispatch } from 'react-redux';

// HOOKS
import useGetAppState from '../../common/hooks/use-get-app-state';

// ACTIONS
import { deselectAllVendors } from '../../../redux/actions/data-actions';
import { toggleMobileDashboard } from '../../../redux/actions/ui-actions';

// Selecting a vendor profile, called from dashboard link or from map point
const useSelectGroupedVendors = () => {
    const state = useGetAppState();
    const dispatch = useDispatch();

    const regionId = state.data.regionId;

    return (vendorID: string) => {
        dispatch(deselectAllVendors());
        dispatch(toggleMobileDashboard());
    }
}

export default useSelectGroupedVendors;
