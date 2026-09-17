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

        this.casched_rasters = new Map();

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

    async set_ith_tiff(i){
        this.set_displayed_status_loading()

        let key = availableKeys[i]
        let requested_tiff
        if(this.casched_rasters.has(key)){
            requested_tiff = this.casched_rasters.get(key);
        }
        else{
            requested_tiff = await this.request_tiff(key)
        }

        //make it display requested_tiff

        this.set_displayed_status_current_date(i)
    }

    async request_tiff(key){
        let url = "/map/" + encodeURIComponent(this.sellected_collection);
        let payload = {
            "time" : key
        }

        let response = await fetch(url, {
        method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload) // Sends the array/list as JSON
        });

        if (!response.ok) throw new Error(`${url} -> ${response.status}`);

        this.casched_rasters.set(key, response.data);

        return response.json();
    }
}
