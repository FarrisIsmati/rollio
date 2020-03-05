// DEPENDENCIES
import React from 'react';

// INTERFACES
import { TwoOptionSwitchProps } from './interfaces';

const TwoOptionSwitch = React.forwardRef((props:TwoOptionSwitchProps, ref:any) => {
  const { vendorTypeName, isOptionA, onClick, font } = props;

  return ( 
    <div ref={ ref } className="twooptionswitch__wrapper">
      {/* Option A */}
      <div onClick={ () => onClick('a') } className={`${ isOptionA ? 'twooptionswitch__text_inactive' : 'twooptionswitch__text' } ${ font }` }>
          <h2>Active { vendorTypeName }</h2>
      </div>
      {/* Option B  */}
      <div onClick={ () => onClick('b') } className={`${ isOptionA ? 'twooptionswitch__text' : 'twooptionswitch__text_inactive'} ${ font }` }>
          <h2>All { vendorTypeName }</h2>
      </div>
    </div>
  );
});

export default TwoOptionSwitch;
