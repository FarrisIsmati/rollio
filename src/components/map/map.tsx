// DEPENDENCIES
import React from 'react';
import mapboxgl from 'mapbox-gl';
import PropTypes from 'prop-types';

// CONFIG
import { MAPBOX_API_KEY } from '../../config'

// INTERFACES
import { MapProps } from './interfaces';


const Map = (props: MapProps) => {
  const { mapType } = props;

  const renderMap = (mapContainer: any) => {
    //@ts-ignore
    mapboxgl.accessToken = MAPBOX_API_KEY;
    let map = new mapboxgl.Map({
        container: mapContainer,
        style: 'mapbox://styles/farrisismati/ck04ma9xw0mse1cp25m11fgqs',
        center: [-77.0369, 38.9072],
        zoom: 12,
        interactive: true
    })

    if ( mapType === 'region') {
      // CURRENTLY THINKING THROUGH THIS LOGIC
      // GOING IN THE HOOKS :)
      // Load up the regional 
      // Goal is to place all the appropiate vendors from the data.vendorsAll redux object
      // - into the single and group pins array
      // First check the filters -- SKIP THIS STEP FOR NOW
      // Create a coords set, 
      // Loop through the data.vendorsAll object
      // 
    }

    // create a HTML element for each feature
    const el = document.createElement('div');
    el.className = 'marker';

    // make a marker for each feature and add to the map
    new mapboxgl.Marker(el)
        .setLngLat([-77.032, 38.913])
        .addTo(map);
  }

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

