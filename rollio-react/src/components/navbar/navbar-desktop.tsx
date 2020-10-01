// DEPENDENCIES
import React  from 'react';

const NavbarDesktop = React.forwardRef((props:any, ref:any) => {
  return (
      // Mobile resize this flex centers
    <div ref={ref} className="navbar__wrapper"> 
        <div className="navbar__content">
          <div>
            <h1 className="font__navbar">ROLLIO</h1>
          </div>

          <div className="navbar__menu font__navbar_menu_desktop">
            <h1>About</h1>
            <h1 onClick={() => props.history.push('/login')}>Sign In</h1>
          </div>
        </div>
    </div>
  );
})

export default NavbarDesktop;

