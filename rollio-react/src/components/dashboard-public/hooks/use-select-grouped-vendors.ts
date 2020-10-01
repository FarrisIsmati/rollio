// DEPENDENCIES
import { useDispatch } from 'react-redux';

// HOOKS
import useGetAppState from '../../common/hooks/use-get-app-state';

// ACTIONS
import { deselectAllVendors } from '../../../redux/actions/data-actions';
import { toggleGroupSelectMenu } from '../../../redux/actions/ui-actions';
import { setTemporarilySelectedGroup } from '../../../redux/actions/map-actions';

// Selecting a vendor profile, called from dashboard link or from map point
const useSelectGroupedVendors = () => {
    const state = useGetAppState();
    const dispatch = useDispatch();

    const regionId = state.data.regionId;

    return (key: string) => {
        dispatch(deselectAllVendors());
        dispatch(setTemporarilySelectedGroup({id: key}))
        dispatch(toggleGroupSelectMenu());
    }
}

export default useSelectGroupedVendors;
