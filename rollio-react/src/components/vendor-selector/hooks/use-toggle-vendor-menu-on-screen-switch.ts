// DEPENDENCIES
import { useEffect } from 'react';
import { useDispatch  } from 'react-redux';

// ACTIONS
import { toggleMobileMenu } from '../../../redux/actions/ui-actions';

// HOOKS
import useGetAppState from '../../common/hooks/use-get-app-state';

// Get data from redux state
const useToggleVendorMenuOnScreenSwitch = () => {
    // Effects
    const state = useGetAppState();
    const dispatch = useDispatch();

    useEffect(() => {
        // Expands or contracts menu pending desktop/mobile state when window changes from desktop/mobile
        if (state.ui.isVendorSelected && !state.ui.isMobileMenuExpanded) {
            dispatch(toggleMobileMenu())
        }
    }, [state.ui.isVendorSelected]);
}

export default useToggleVendorMenuOnScreenSwitch;
