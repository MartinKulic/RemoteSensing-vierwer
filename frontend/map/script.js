document.addEventListener('DOMContentLoaded', function() {

    const sidepannel = document.getElementById('sidepannel');
    const sellected_collection = document.getElementById("select-collection").value;
    const map_controller = new MapController(sellected_collection)

    map_controller.fit_bounds(initBounds)
    map_controller.fit_slider()

    map_controller.set_ith_tiff(document.getElementById("timeserie-slider").value)


    // input  - Fires continuously while dragging
    // change - Fires when dragging stops or focus is lost
    document.getElementById("timeserie-slider").addEventListener("input", function(event) {
        let new_value = event.target.value;
        map_controller.set_ith_tiff(new_value)
    })

    document.getElementById("opacity-slider").addEventListener("input", function(event) {
        let new_value = event.target.value;
        map_controller.set_opacity(new_value)
    })

    document.getElementById("cache-all-button").addEventListener("click", function(event) {
        map_controller.add_all_layers()
    })

    let map = map_controller.get_map()
    map.on("click", function(event) {
        console.log("clicked");
        sidepannel.classList.remove("hidden");
        map_controller.handle_map_click(event)
    })
});

