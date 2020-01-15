// HOOKS
import useGetAppState from '../../common/hooks/use-get-app-state';
import useWindowSize from '../../common/hooks/use-window-size';

// Get data from redux state
const useSetMobileMenuStyle = () => {
    const state = useGetAppState();
    
    const isMenuExpanded = state.ui.isMobileMenuExpanded;

    const windowHeight = useWindowSize.useWindowHeight();

    const expandedMenuStyle = {
        // .81 golden ratio number
        height: `${windowHeight * .81}px`,
        transition: 'height .25s',
        transitionTimingFunction: 'ease-in'
    }

    const contractedMenuStyle = {
        height: '56px',
        transition: 'height .15s',
        transitionTimingFunction: 'ease-out'
    }

    return { isMenuExpanded, expandedMenuStyle, contractedMenuStyle }
}

export default useSetMobileMenuStyle;
