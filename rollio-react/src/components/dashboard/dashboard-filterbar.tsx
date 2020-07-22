// DEPENDENCIES
import React from 'react';
import Switch from '../common/other/switch';
import { useDispatch  } from 'react-redux';

// ACTIONS
import { setDashboardVendorsDisplay } from '../../redux/actions/ui-actions';

const DashboardFilterBar = React.forwardRef((props:any, ref:any) =>  {
  const { state } = props;
  
  // Hooks
  const dispatch = useDispatch();

  return (      
    <div className='dashboard__filterbar' ref={ref}>
      <Switch
        onClick={ (opt:string)=>{ dispatch(setDashboardVendorsDisplay(opt === 'a' ? 'active' : 'all')) } }
        vendorTypeName={ 'Trucks' } 
        isOptionA={ state.ui.dashboardVendorsDisplay === 'all' ? true : false } 
        font='font__dashboard_switch'
        type='round'
      />
    </div>
  );
});

export default DashboardFilterBar;
