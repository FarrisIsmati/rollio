// DEPENDENCIES
import React from 'react';

// HOOKS
import useMap from './hooks/use-map';

const Map = () => {
  const { renderMap } = useMap();

  return (
    <div className='map__wrapper' ref={renderMap}></div>
  );
}

export default Map;
