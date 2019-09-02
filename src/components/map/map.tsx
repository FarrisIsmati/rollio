// DEPENDENCIES
import React from 'react';
import GoogleMapReact from 'google-map-react';

// CONFIG
import { GOOGLE_MAP_API_KEY } from '../../config'

const Map = () => {
  return (
    <div className='map__wrapper'>
       <GoogleMapReact
          // @ts-ignore
          bootstrapURLKeys={{ key: GOOGLE_MAP_API_KEY }}
          defaultCenter={{
            lat: 59.95,
            lng: 30.33
          }}
          defaultZoom={11}
        >
      </ GoogleMapReact>
    </div>
  );
}

export default Map;
