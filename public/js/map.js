// listing = JSON.parse(listing);
// console.log(listing);
console.log(listing.geometry);
if(listing.geometry.coordinates.length <1){
    listing.geometry.coordinates = [77.216721,28.644800]
}
mapboxgl.accessToken = maptoken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/standard-satellite',
    center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 13 // starting zoom
});

// console.log("cordinates: ",coordinates , typeof coordinates);
// cordinates:  [76.924,15.138675]

const marker = new mapboxgl.Marker({color : "red"})
    .setLngLat(listing.geometry.coordinates)
    .setPopup( new mapboxgl.Popup({offset: 25}).setHTML(`<h4>${listing.title}</h4><p>Exact Location will be provided after booking</p>`))
    .addTo(map);