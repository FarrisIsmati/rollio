// HOOKS
import useGetAppState from '../../common/hooks/use-get-app-state';

const useGetInfoCardData = () => {
    // Effects
    const state = useGetAppState();

    const vendor = state.data.selectedVendor;

    return {
        profileImageLink: vendor.profileImageLink,
        name: vendor.name
    }
}

export default useGetInfoCardData;
