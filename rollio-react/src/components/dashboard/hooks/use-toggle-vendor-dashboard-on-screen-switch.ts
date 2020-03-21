// DEPENDENCIES
import { useEffect } from 'react';
import { useDispatch  } from 'react-redux';

// ACTIONS
import { toggleMobileDashboard } from '../../../redux/actions/ui-actions';

// HOOKS
import useGetAppState from '../../common/hooks/use-get-app-state';

// Get data from redux state
const useToggleVendorDashboardOnScreenSwitch = () => {
    // Effects
    const state = useGetAppState();
    const dispatch = useDispatch();

    useEffect(() => {
        // Expands or contracts dashboard pending desktop/mobile state when window changes from desktop/mobile
        if (state.ui.isVendorSelected && !state.ui.isMobileDashboardExpanded) {
            dispatch(toggleMobileDashboard())
        }
    }, [state.ui.isVendorSelected]);
}

export default useToggleVendorDashboardOnScreenSwitch;
