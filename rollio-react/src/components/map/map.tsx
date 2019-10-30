// DEPENDENCIES
import React from 'react';
import mapboxgl from 'mapbox-gl';
import PropTypes from 'prop-types';
import { useState } from 'react';

// HOOKS
import useMapMarkers from './hooks/useMapMarkers';

// CONFIG
import { MAPBOX_API_KEY } from '../../config'

// INTERFACES
import { MapProps } from './interfaces';


const Map = (props: MapProps) => {
  const { mapType, mapData } = props;

  const renderMap = (mapContainer: any) => {
    //@ts-ignore
    mapboxgl.accessToken = MAPBOX_API_KEY;

    const map = new mapboxgl.Map({
        container: mapContainer,
        style: 'mapbox://styles/farrisismati/ck04ma9xw0mse1cp25m11fgqs',
        center: [-77.0369, 38.9072],
        zoom: 12,
        interactive: true
      })
  }
  
  // Cannot put hook in renderMap function
  // Must think do I not make these functions a hook?
  // Can the map be stored in state? 
  // I'm not sure!
  // useMapMarkers({mapType, mapData, map})

  return (
    <div className='map__wrapper'>
      <div ref={renderMap}></div>
    </div>
  );
}

Map.propTypes = {
  mapType: PropTypes.string.isRequired,
}

Map.defaultProps  = {
  mapType: 'region'
}

export default Map;

