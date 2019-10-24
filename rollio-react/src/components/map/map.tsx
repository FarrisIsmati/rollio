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
      // Consider how map should take in points
      // What types of maps will be rendered
        // Region maps, single vendor maps
        // Should map look at redux or be fed data from Parent => Child props
        // Currently think I should expand its functionality once I determine what all the parameters will be so scale it after I build it
        // All data should be takin in from props, not directly from Redux
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

