'use strict';

class Map {
    constructor(parent) {
        var mapContainer = document.createElement('div');
        mapContainer.style.width = '100%';
        mapContainer.style.height = '100%';
        parent.appendChild(mapContainer);

        this._map = new google.maps.Map(mapContainer, {
            center: {lat: 43.600, lng: 3.883},
            zoom: 15,
            styles: [
                {
                    featureType: "poi",
                    elementType: "labels",
                    stylers: [
                        {visibility: "off"}
                    ]
                }
            ],
            mapTypeControlOptions: {
                style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
                position: google.maps.ControlPosition.TOP_RIGHT
            }
        });

        this._userLocationMarker = new google.maps.Marker({
            visible: false
        });

        this._userLocationMarker.setMap(this._map);

        this._map.data.setStyle((feature) => {
            return {
                icon: {
                    fillColor: feature.getProperty('type'),
                    path: google.maps.SymbolPath.CIRCLE,
                    fillOpacity: 0.8,
                    scale: 8,
                    strokeColor: 'gold',
                    strokeWeight: 2
                }
            }
        });

        this._infoWindow = new google.maps.InfoWindow();

        this._map.data.addListener('click', (event) => {
            this._map.data.revertStyle();

            let point = event.feature.getGeometry().get();

            this._map.data.overrideStyle(event.feature, {
                icon: 'http://developers.woosmap.com/img/markers/marker.png',
                zIndex: google.maps.Marker.MAX_ZINDEX
            });
            this._infoWindow.setContent(
                event.feature.getProperty('name') + '<br/>' +
                event.feature.getProperty('address') + '<br/>' +
                event.feature.getProperty('city'));

            var anchor = new google.maps.MVCObject();
            anchor.setValues({
                position: point,
                anchorPoint: new google.maps.Point(0, -30)
            });

            this._infoWindow.open(this._map, anchor);

        });
    }

    clearStores() {
        this._infoWindow.close();
        this._map.data.revertStyle();
        this._map.data.forEach((feature) => {
            this._map.data.remove(feature);
        });
    }

    displayStores(storesFeatures) {
        this.clearStores();
        this._map.data.addGeoJson({
            type: 'FeatureCollection',
            features: storesFeatures
        })
    }
}

module.exports = Map;
