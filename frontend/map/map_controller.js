class MapController {
    constructor(selected_collection, timeseries_slider_id = "timeserie-slider", loading_icon_id="loading-icon",
                ready_icon_id = "ready-icon", date_indicator_id = "timeserie-curDate",) {
        this.map = L.map('map');
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(this.map);


        this.sellected_collection = selected_collection;

        this.timeseries_slider = document.getElementById(timeseries_slider_id);
        this.loading_icon = document.getElementById(loading_icon_id);
        this.ready_icon = document.getElementById(ready_icon_id);
        this.current_date_indicator = document.getElementById(date_indicator_id);

        this.current_layer = null
        this.caschedLayer = new Map()

        this.opacity = 1
    }

    // collection_change(new_collection) {
    // }

    fit_bounds(bounds) {
        this.map.fitBounds(bounds);
    }

    fit_slider(){
        if ((availableTimes === null) || (availableKeys === null)){
            return;
        }
        this.timeseries_slider.setAttribute("max", (availableTimes.length-1));
    }

    set_displayed_status_loading(){
        this.ready_icon.style.display = "none";
        this.loading_icon.style.display = "block";
        this.current_date_indicator.textContent = "Loading...";
    }
    set_displayed_status_current_date(i){
        this.loading_icon.style.display = "none";
        this.ready_icon.style.display = "block";
        this.current_date_indicator.textContent = availableTimes[i];
    }

    set_ith_tiff(i){
        this.set_displayed_status_loading()

        let key = availableKeys[i]
        let map_key = availableTimes[i]
        let wanted_layer = null

        if(this.caschedLayer.has(map_key)){
            wanted_layer = this.caschedLayer.get(map_key);
        }
        else{
            wanted_layer = this.add_new_layer(key, map_key);
        }

        this.show_layer(wanted_layer)

        this.set_displayed_status_current_date(i)
    }

    show_layer(layer){
        layer.setOpacity(this.opacity);

        if(this.current_layer){
            this.current_layer.setOpacity(0);
        }
        this.current_layer = layer;
    }

    add_new_layer(key, map_key){
        let stringified_key = key.join("_")
        let band = 1

        console.log(stringified_key)
        console.log(band)

        let url = `/tiles/${encodeURIComponent(this.sellected_collection)}/${stringified_key}/{x}/{y}/{z}.png?band=${band}`
        console.log(url)

        let new_layer = L.tileLayer(url, {
            maxZoom: 19,
            bounds: initBounds,   // keeps requests inside the raster extent
            opacity: this.opacity,
        }).addTo(this.map);

        this.caschedLayer.set(map_key, new_layer);

        return new_layer;
    }

    set_opacity(val){
        this.opacity = val

        if (this.current_layer) {
            this.current_layer.setOpacity(this.opacity)
        }
    }

}
