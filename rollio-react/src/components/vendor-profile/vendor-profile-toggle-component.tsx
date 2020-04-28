// DEPENDENCIES
import React from 'react';

// HOOKS
import useToggleComponents from './hooks/use-toggle-components';

interface VendorProfileToggleComponentProps  {
  componentName: string,
  components: any,
  toggleComponents: any,
  children: any,
}

const VendorProfileToggleComponent = (props:VendorProfileToggleComponentProps) => {
    const { 
      componentName,
      components,
      toggleComponents,
      children,
    } = props;

    return (     
        <React.Fragment>
            <div className='vendorprofile__info_row_clickable' onClick={() => toggleComponents(componentName.toUpperCase())}>
              <div className='vendorprofile__info_icon_wrapper'>
                <i className="material-icons-outlined">local_shipping</i> 
              </div>
              <div className='vendorprofile__info_text_wrapper font__vendor_profile_info flex__verticle_center'>
                <h2>{componentName.toUpperCase()}</h2>
              </div>
            </div>
            <div className={`vendorprofile__info_row_expanded${components[componentName.toUpperCase()] ? '': '_hidden'} font__vendor_profile_info_desc`}>
              {children}
            </div>
        </React.Fragment>
    )
};

export default VendorProfileToggleComponent;
