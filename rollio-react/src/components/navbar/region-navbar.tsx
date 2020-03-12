// DEPENDENCIES
import React  from 'react';
import { useDispatch  } from 'react-redux';

// ACTIONS
import { toggleMainDropDownMenu } from '../../redux/actions/ui-actions';

const RegionNavbar = React.forwardRef((props:any, ref:any) => {
  // Hooks
  const dispatch = useDispatch();

  return (
      // Mobile resize this flex centers
    <div ref={ref} className="navbar__wrapper"> 
        <div className="navbar__content_wrapper">
          <div>
            <h1 className="font__navbar">ROLLIO</h1>
          </div>

          <div onClick={() => dispatch(toggleMainDropDownMenu())} className="navbar__icon_wrapper">
            <i className="material-icons-outlined">menu</i>
          </div>
        </div>
    </div>
  );
})


export default RegionNavbar;
