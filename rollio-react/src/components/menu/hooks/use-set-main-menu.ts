// DEPENDENCIES
import { useDispatch  } from 'react-redux';

// HOOKS
import useGetAppState from '../../common/hooks/use-get-app-state';
import useOutsideClick from '../../common/hooks/use-outside-click';

// REDUX
import { toggleMainDropDownMenu } from '../../../redux/actions/ui-actions';

// Get data from redux state
const useSetMainMenu = (props:any) => {
    const { menuRef } = props;

    // Hooks
    const dispatch = useDispatch();
    const state = useGetAppState();

    // Hides menu if click event outside menu
    useOutsideClick(menuRef, () => {
        if (state.ui.isMainDropDownMenuExpanded) {
            dispatch(toggleMainDropDownMenu());
        }
    })
}

export default useSetMainMenu;
