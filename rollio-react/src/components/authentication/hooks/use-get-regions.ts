import {useEffect} from "react";
import {useDispatch} from "react-redux";
import useGetAppState from "../../common/hooks/use-get-app-state";
import {fetchAllRegionsAsync} from "../../../redux/actions/data-actions";

const useGetRegions = () => {
    const { loadState } = useGetAppState();
    const { areRegionsLoaded } = loadState;
    const dispatch = useDispatch();

    useEffect(() => {
        if (!areRegionsLoaded) {
            dispatch(fetchAllRegionsAsync());
        }
    }, [areRegionsLoaded]);
};

export default useGetRegions;
