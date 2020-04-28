// DEPENDENCIES
import React from 'react';

// COMPONENTS
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

type VendorProfileToggleComponentProps = {
  componentName: string,
  components: any,
  toggleComponents: any,
  children: any,
  iconMa?: string,
  iconFa?: any,
  } & ( { iconMa: string } | { iconFa: any } )

const VendorProfileToggleComponent = (props:VendorProfileToggleComponentProps) => {
    const { 
      componentName,
      components,
      toggleComponents,
      children,
      iconMa,
      iconFa,
    } = props;

    return (   
        <React.Fragment>
            <div className='vendorprofile__info_row_clickable' onClick={() => toggleComponents(componentName.toUpperCase())}>
              <div className='vendorprofile__info_icon_wrapper'>
                { iconMa ? <i className="material-icons-outlined">{iconMa}</i> : <FontAwesomeIcon icon={iconFa} /> }
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
