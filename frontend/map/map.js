var map = L.map('map');
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

map.fitBounds(initBounds);

timeseries_slider = document.getElementById("timeserie-slider");
collection_sellect = document.getElementById('select-collection');

function fit_slider(){
    if ((availableTimes === null) || (availableKeys === null)){
        return;
    }

    timeseries_slider.setAttribute("max", (availableTimes.length-1));
}


function get_tile(key){

}


collection_sellect.addEventListener('change', function() {
    console.log('Selected value:', this.value);
})




fit_slider()