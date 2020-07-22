// DEPENDENCIES
import React from 'react';

// INTERFACES
import { SwitchProps } from './interfaces';

const SwitchFlat = React.forwardRef((props:SwitchProps, ref:any) => {
  const { vendorTypeName, isOptionA, onClick, font, type } = props;

  let switchType = '';

  // Two styles round and flat
  if (type === 'round') {
    switchType = 'switch__round';
  } else if (type === 'flat') {
    switchType = 'switch__flat';
  }

  return ( 
    <div ref={ ref ? ref : null } className={switchType}>
      {/* Option A */}
      <div onClick={ () => onClick('a') } className={`${ isOptionA ? `${switchType}_text_inactive` : `${switchType}_text` } ${ font }` }>
          <h2>Active { vendorTypeName }</h2>
      </div>
      {/* Option B  */}
      <div onClick={ () => onClick('b') } className={`${ isOptionA ? `${switchType}_text` : `${switchType}_text_inactive` } ${ font }` }>
          <h2>All { vendorTypeName }</h2>
      </div>
    </div>
  );
});

export default SwitchFlat;
