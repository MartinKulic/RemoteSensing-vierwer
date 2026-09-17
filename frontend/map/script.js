sellected_collection = document.getElementById("select-collection").value;

map_controller = new MapController(sellected_collection)

document.addEventListener('DOMContentLoaded', function() {
    map_controller.fit_bounds(initBounds)
    map_controller.fit_slider()

    map_controller.set_ith_tiff(document.getElementById("timeserie-slider").value)
});

// input  - Fires continuously while dragging
// change - Fires when dragging stops or focus is lost
document.getElementById("timeserie-slider").addEventListener("input", function(event) {
    let new_value = event.target.value;
    map_controller.set_ith_tiff(new_value)
})
