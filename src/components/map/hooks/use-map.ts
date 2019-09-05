// DEPENDENCIES
import mapboxgl from 'mapbox-gl';

// CONFIG
import { MAPBOX_API_KEY } from '../../../config'

function useMap() {
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

        // create a HTML element for each feature
        const el = document.createElement('div');
        el.className = 'marker';

        // make a marker for each feature and add to the map
        new mapboxgl.Marker(el)
            .setLngLat([-77.032, 38.913])
            .addTo(map);
    }

    return {
        renderMap
    }
}

export default useMap;

// To do
// Get a pin to work
// Style the pin
// Upon loading the region ensure all vendors are up in state
// Display them in pins
// Account for pins that are close together