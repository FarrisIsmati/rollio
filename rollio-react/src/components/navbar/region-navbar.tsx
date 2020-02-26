// DEPENDENCIES
import React  from 'react';

const RegionNavbar = React.forwardRef((props:any, ref:any) => {
  return (
      // Mobile resize this flex centers
    <div ref={ref} className="navbar__wrapper"> 
        <div className="navbar__content_wrapper">
          <div>
            <h1 className="font__navbar">ROLLIO</h1>
          </div>

          <div className="navbar__icon_wrapper">
            <i className="material-icons-outlined">menu</i>
          </div>
        </div>
    </div>
  );
})


export default RegionNavbar;
