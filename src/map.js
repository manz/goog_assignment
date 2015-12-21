'use strict';

const BoundsManager = require('./boundsmanager');

var mapStyle = [
    {
        "featureType": "landscape",
        "stylers": [
            {"hue": "#FFBB00"},
            {"saturation": 43.400000000000006},
            {"lightness": 37.599999999999994},
            {"gamma": 1}
        ]
    },
    {
        "featureType": "road.highway",
        "stylers": [
            {"hue": "#FFC200"},
            {"saturation": -61.8},
            {"lightness": 45.599999999999994},
            {"gamma": 1}]
    },
    {
        "featureType": "road.arterial",
        "stylers": [
            {"hue": "#FF0300"},
            {"saturation": -100},
            {"lightness": 51.19999999999999},
            {"gamma": 1}]
    },
    {
        "featureType": "road.local",
        "stylers": [
            {"hue": "#FF0300"},
            {"saturation": -100},
            {"lightness": 52},
            {"gamma": 1}]
    },
    {
        "featureType": "water",
        "stylers": [
            {"hue": "#0078FF"},
            {"saturation": -13.200000000000003},
            {"lightness": 2.4000000000000057},
            {"gamma": 1}]
    },
    {
        featureType: "poi",
        elementType: "labels",
        stylers: [
            {visibility: "off"}
        ]
    }
];

class Map {
    constructor(parent) {
        this._selectedStorePositionCallback = null;
        this.mapContainer = document.createElement('div');
        this.mapContainer.style.width = '100%';
        this.mapContainer.style.height = '100%';
        parent.appendChild(this.mapContainer);
        this._padding = {};
        this._map = new google.maps.Map(this.mapContainer, {
            center: {lat: 43.609571288668455, lng: 3.878150566101093},
            zoom: 16,
            styles: mapStyle,
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

            if (this._selectedStorePositionCallback) {
                this._selectedStorePositionCallback(point);
            }

            this._infoWindow.open(this._map, anchor);

        });
    }

    getMap() {
        return this._map;
    }

    setSelectedStoreCallback(callback) {
        this._selectedStorePositionCallback = callback;
    }

    setPadding(padding) {
        this._padding = padding;
    }

    clearStores() {
        this._infoWindow.close();
        this._map.data.revertStyle();
        this._map.data.forEach((feature) => {
            this._map.data.remove(feature);
        });
    }

    getBounds(features) {
        var bounds = new google.maps.LatLngBounds();

        for (let index in features) {
            if (features.hasOwnProperty(index)) {
                let coordinates = features[index].geometry.coordinates;
                bounds.extend(new google.maps.LatLng(coordinates[1], coordinates[0]))
            }
        }

        if (this._userLocationMarker.getVisible()) {
            bounds.extend(this._userLocationMarker.getPosition());
        }
        return bounds;
    }

    displayStores(storesFeatures) {
        this.clearStores();

        let computedStyle = window.getComputedStyle(this.mapContainer);

        var boundsManager = new BoundsManager({
            mapHeight: parseFloat(computedStyle.height),
            mapWidth: parseFloat(computedStyle.width),
            padding: this._padding
        });

        var centerAndZoom = boundsManager.getBoundsCenterAndZoom(this.getBounds(storesFeatures));

        this._map.data.addGeoJson({
            type: 'FeatureCollection',
            features: storesFeatures
        });

        this._map.setCenter(centerAndZoom.center);
        this._map.setZoom(centerAndZoom.zoom);
    }
}

module.exports = Map;
