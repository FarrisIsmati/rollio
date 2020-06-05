// DEPENDENCIES
import React from 'react';
import { startCase } from 'lodash';

// INTERFACES
import { VendorProfileToggleComponentProps } from './interfaces'

// Toggles open/close a dashboard menu item (ex twitter, about items)
const VendorProfileContentItemToggle = (props:VendorProfileToggleComponentProps) => {
    const { 
      componentName,
      components,
      toggleComponents,
      children,
      componentDisplayName,
    } = props;

    return (   
        <React.Fragment>
            <div className='vendorprofile__info_row_clickable' onClick={() => toggleComponents(componentName.toUpperCase())}>
              <div className='vendorprofile__info_text_wrapper font__vendor_profile_info flex__verticle_center'>
                <h2>{startCase(componentDisplayName)}</h2>
              </div>

              <div className='vendorprofile__info_icon_wrapper'>
                <i className="material-icons-outlined">{components[componentName.toUpperCase()] ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}</i> 
              </div>
            </div>

            <div className={`vendorprofile__info_row_expanded${components[componentName.toUpperCase()] ? '': '_hidden'} font__vendor_profile_info_desc`}>
              {children}
            </div>
        </React.Fragment>
    )
};

export default VendorProfileContentItemToggle;
