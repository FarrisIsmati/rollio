// HOOKS
import useGetAppState from '../../common/hooks/use-get-app-state';
import useWindowSize from '../../common/hooks/use-window-size';

// Get data from redux state
const useSetMobileDashboardStyle = () => {
    const state = useGetAppState();
    
    const isDashboardExpanded = state.ui.isMobileDashboardExpanded;

    const windowHeight = useWindowSize.useWindowHeight();

    const expandedDashboardStyle = {
        // .81 golden ratio number
        height: `${windowHeight * .81}px`,
        transition: 'height .35s',
        transitionTimingFunction: 'cubic-bezier(.7,1.1,.67,.97)'
    }

    const contractedDashboardStyle = {
        height: '56px',
        transition: 'height .15s',
        transitionTimingFunction: 'ease-out'
    }

    return { isDashboardExpanded, expandedDashboardStyle, contractedDashboardStyle }
}

export default useSetMobileDashboardStyle;
