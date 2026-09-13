var map = L.map('map');
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

map.fitBounds([
    [40.712, -74.227],
    [40.774, -74.125]
]);

async function get_init_bounds(){
    try {

    }
    catch (e){
        bounds = [
    [40.712, -74.227],
    [40.774, -74.125]
]
    }

    return bounds
}