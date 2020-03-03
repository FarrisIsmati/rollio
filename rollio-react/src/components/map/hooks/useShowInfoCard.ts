// HOOKS
import useGetAppState from '../../common/hooks/use-get-app-state';
import windowSizeEffects from '../../common/hooks/use-window-size';

const useShowInfoCard = () => {
    // Effects
    const state = useGetAppState();
    const isMobile = windowSizeEffects.useIsMobile();
    
    return isMobile && !state.ui.isMobileMenuExpanded && state.regionMap.currentlySelected.id !== ''
}

export default useShowInfoCard;
