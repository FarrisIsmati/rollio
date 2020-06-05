// DEPENDENCIES
import React from 'react';

const Menu = React.forwardRef((props:any, ref:any) => {
  return (      
    <div ref={ref} className='menu__wrapper'>
        <div className='menu__link font__menu_link'>
            <h1>SIGN IN</h1>
        </div>
        <div className='menu__link font__menu_link'>
            <h1>ABOUT</h1>
        </div>
        <div className='menu__link font__menu_link'>
            <h1>CONTACT</h1>
        </div>
    </div>
  );
});

export default Menu;
