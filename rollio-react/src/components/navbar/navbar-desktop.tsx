// DEPENDENCIES
import React  from 'react';
import { useDispatch  } from 'react-redux';

// HOOKS
import useGetAppState from '../common/hooks/use-get-app-state';

// ACTIONS
import { toggleMainDropDownMenu } from '../../redux/actions/ui-actions';

const NavbarDesktop = React.forwardRef((props:any, ref:any) => {
  // Hooks
  const dispatch = useDispatch();
  const state = useGetAppState();

  // Variables
  const isMainDropDownMenuExpanded = state.ui.isMainDropDownMenuExpanded;

  return (
      // Mobile resize this flex centers
    <div ref={ref} className="navbar__wrapper"> 
        <div className="navbar__content_wrapper">
          <div>
            <h1 className="font__navbar">ROLLIO</h1>
          </div>

          { isMainDropDownMenuExpanded ?
            <div onClick={() => dispatch(toggleMainDropDownMenu())} className="navbar__icon_close">
              <i className="material-icons-outlined">close</i>
            </div> :
            <div onClick={() => dispatch(toggleMainDropDownMenu())} className="navbar__icon">
              <i className="material-icons-outlined">menu</i>
            </div>
          }

        </div>
    </div>
  );
})


export default NavbarDesktop;
