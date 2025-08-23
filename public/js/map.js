let mapToken = tokenForMap;
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v12',
    center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 10 // starting zoom
});

const marker = new mapboxgl.Marker({color : '#fe424d'})
        .setLngLat(listing.geometry.coordinates) // listing.geometry.coordinates ko yha pr paas krna pdega.
        .setPopup(new mapboxgl.Popup({offset: 25})
        .setHTML(`<h4>${listing.location}!</h4><p>Exact location provided after booking.</p>`))
        .addTo(map);