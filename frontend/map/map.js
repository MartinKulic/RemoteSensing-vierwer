var map = L.map('map');
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// fallback_bounds = [
//     [40.712, -74.227],
//     [40.774, -74.125]
//     ]
//initBounds = initBounds ?? fallbackBounds;

map.fitBounds(initBounds);
