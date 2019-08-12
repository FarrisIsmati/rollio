// DEPENDENCIES
import { useDispatch } from 'react-redux';

// ACTIONS
import { requestPostVendorComment } from '../../../redux/actions/data-actions';

const useCommentAdd = (props:any) => {
    const { regionId, vendorId, name, text } = props;
    const dispatch = useDispatch();
    dispatch( requestPostVendorComment({ regionId, vendorId, name, text: 'lol haha omg wow' }) );
}

export default useCommentAdd;
