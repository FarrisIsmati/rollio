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
    }

    return {
        renderMap
    }
}

export default useMap;