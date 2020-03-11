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
        transition: 'height .35s',
        transitionTimingFunction: 'cubic-bezier(.7,1.1,.67,.97)'
    }

    const contractedMenuStyle = {
        height: '56px',
        transition: 'height .15s',
        transitionTimingFunction: 'ease-out'
    }

    return { isMenuExpanded, expandedMenuStyle, contractedMenuStyle }
}

export default useSetMobileMenuStyle;
