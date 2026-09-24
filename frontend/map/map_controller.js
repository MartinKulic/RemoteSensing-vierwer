class MapController {
    constructor(selected_collection, timeseries_slider_id = "timeserie-slider", loading_icon_id = "loading-icon",
                ready_icon_id = "ready-icon", date_indicator_id = "timeserie-curDate", chart_id = "point-chart") {
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

        this.chart = document.getElementById(chart_id)
        this.chart_content = null
        this.map_click_highlight = null

        this.current_layer = null
        this.caschedLayer = new Map()

        this.opacity = 1
    }

    get_map() {
        return this.map;
    }

    fit_bounds(bounds) {
        this.map.fitBounds(bounds);
    }

    fit_slider() {
        if ((availableTimes === null) || (availableKeys === null)) {
            return;
        }
        this.timeseries_slider.setAttribute("max", (availableTimes.length - 1));
    }

    set_displayed_status_loading() {
        this.ready_icon.style.display = "none";
        this.loading_icon.style.display = "block";
        this.current_date_indicator.textContent = "Loading...";
    }

    set_displayed_status_current_date(i) {
        this.loading_icon.style.display = "none";
        this.ready_icon.style.display = "block";
        this.current_date_indicator.textContent = availableTimes[i];
    }

    set_ith_tiff(i) {
        this.set_displayed_status_loading()

        let key = availableKeys[i]
        let map_key = availableTimes[i]
        let wanted_layer = null

        if (this.caschedLayer.has(map_key)) {
            wanted_layer = this.caschedLayer.get(map_key);
        } else {
            wanted_layer = this.add_new_layer(key, map_key);
        }

        this.change_shown_layer(wanted_layer)

        this.set_displayed_status_current_date(i)
    }

    change_shown_layer(layer) {
        layer.setOpacity(this.opacity);

        if (this.current_layer) {
            this.current_layer.setOpacity(0);
        }
        this.current_layer = layer;
    }

    add_new_layer(key, map_key) {
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

    async add_all_layers() {
        if ((availableTimes === null) || (availableKeys === null)) {

            return;
        }
        this.set_displayed_status_loading()

        this.caschedLayer.clear()

        for (let i = 0; i < availableTimes.length; i++) {
            let map_key = availableTimes[i]
            // if (this.caschedLayer.has(map_key)){
            //     continue;
            // }

            let new_layer = this.add_new_layer(availableKeys[i], map_key);
            new_layer.setOpacity(0);
        }

        this.set_displayed_status_current_date(this.timeseries_slider.value)

    }

    set_opacity(val) {
        this.opacity = val

        if (this.current_layer) {
            this.current_layer.setOpacity(this.opacity)
        }
    }

    async handle_map_click(event) {
        let {lat, lng} = event.latlng;
        let band = 1

        // Mark selection at map
        this.clean_selection() // if previous selection clear it
        this.map_click_highlight = L.circleMarker([lat, lng], {
            radius: 8,
            color: "#333",
            weight: 2,
            fillColor: "#ff5252",
            fillOpacity: 0.9,
        }).addTo(this.map);

        // Fetch
        let url = `/point/${encodeURIComponent(this.sellected_collection)}/${lat}/${lng}?band=${band}`;
        let response = await fetch(url, {
        method: "POST",

        })
        if (!response.ok) throw new Error(`${url} -> ${response.status}`);

        let data = await response.json();

        let ctx = this.chart.getContext("2d");

            if (this.chart_content) {
                this.chart_content.destroy();
            }

            this.chart_content = new Chart(ctx,
                data.draw_instructions
            )

        // Draw to graph
        // if (data.type === "simple") {
        //     let ctx = this.chart.getContext("2d");
        //
        //     if (this.chart_content) {
        //         this.chart_content.destroy();
        //     }
        //
        //     this.chart_content = new Chart(ctx, {
        //         type: "line",
        //         data: {
        //             labels: data.times,
        //             datasets: [{
        //                 label: "Value",
        //                 data: data.values,
        //                 spanGaps: true,
        //                 tension: 0.2,
        //             }],
        //         },
        //         options: {
        //             responsive: true,
        //             scales: {
        //                 x: {
        //                     title: {display: true, text: "Time"},},
        //                 y: {
        //                     title: {display: true, text: "Value"},
        //                     min: -1,
        //                     max: 1,},
        //             },
        //         },
        //     });
        // }

    }

    clean_selection() {
        if (this.map_click_highlight) {
            this.map.removeLayer(this.map_click_highlight);
            this.map_click_highlight = null;
        }
    }


}
