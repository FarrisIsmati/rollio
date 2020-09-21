// DEPENDENCIES
import {useEffect} from "react";
import {useDispatch} from "react-redux";

// REDUX
import {fetchAllRegionsAsync} from "../../../redux/actions/data-actions";

// HOOKS
import useGetAppState from "../../common/hooks/use-get-app-state";

const useLoginFrame = () => {
    // const { loadState } = useGetAppState();
    // const { areRegionsLoaded } = loadState;
    // const dispatch = useDispatch();

    // useEffect(() => {
    //     if (!areRegionsLoaded) {
    //         dispatch(fetchAllRegionsAsync());
    //     }
    // }, [areRegionsLoaded]);
};

export default useLoginFrame;
