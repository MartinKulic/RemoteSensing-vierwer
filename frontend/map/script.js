document.addEventListener('DOMContentLoaded', function() {

    const sidepannel = document.getElementById('sidepannel');
    const sellected_collection = document.getElementById("select-collection").value;
    const bandSelector = document.getElementById("select-layer");
    const timeseriesSlider  = document.getElementById("timeserie-slider")
    const map_controller = new MapController(sellected_collection, bandSelector);

    map_controller.fit_bounds(initBounds)
    map_controller.fit_slider()

    map_controller.set_ith_tiff(document.getElementById("timeserie-slider").value, bandSelector.value)


    // input  - Fires continuously while dragging
    // change - Fires when dragging stops or focus is lost
    timeseriesSlider.addEventListener("input", function(event) {
        let new_value = event.target.value;
        let band = bandSelector.value;
        // console.log("set_ith_tiff",new_value, band);

        map_controller.set_ith_tiff(new_value, band)
    })

    document.getElementById("opacity-slider").addEventListener("input", function(event) {
        let new_value = event.target.value;
        map_controller.set_opacity(new_value)
    })

    bandSelector.addEventListener("change", function(event) {
        let new_band = event.target.value;
        let time = timeseriesSlider.value;
        map_controller.set_ith_tiff(time, new_band)

    })

    document.getElementById("cache-all-button").addEventListener("click", function(event) {
        map_controller.add_all_layers()
    })

    map_controller.get_map().on("click", function(event) {
        sidepannel.classList.remove("hidden");
        map_controller.handle_map_click(event)
    })

    document.getElementById("sidepannel_close_btn").addEventListener("click", function(event) {
        sidepannel.classList.add("hidden");
        map_controller.clean_selection()
    })
});

