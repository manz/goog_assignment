'use strict';

const http = require('./http');
const RetryingGeocoder = require('./retryinggeocoder');
const SearchBox = require('./searchbox');
const ListPanel = require('./searchpanel');
const Map = require('./map');

/**
 * @typedef {Object} StoreLocatorOptions
 * @property parentSelector
 * @property {String} dataUrl
 */

/**
 * StoreLocator main
 */
class StoreLocator {
    /**
     *
     * @param {StoreLocatorOptions} [options]
     */
    constructor(options) {
        this.parent = document.querySelector(options.parentSelector);
        this.storeLocatorContainer = document.createElement('div');

        this.options = options;

        this.storeLocatorContainer.style.position = 'absolute';
        this.storeLocatorContainer.style.top = 0;
        this.storeLocatorContainer.style.bottom = 0;
        this.storeLocatorContainer.style.right = 0;
        this.storeLocatorContainer.style.left = 0;

        this._storesFeatures = [];
        this.parent.appendChild(this.storeLocatorContainer);

        this.initializeMap();
        this._distanceMatrixService = new google.maps.DistanceMatrixService();
        this._retryigGeocoder = new RetryingGeocoder();

    }

    initializeSearchBox() {
        this.searchBox = new SearchBox(this.parent);
        this.searchBox.addListener('place', (value) => {
            this.nearest5State(value.geometry.location);
        });

        this.searchBox.addListener('clear', (event) => {
            this.initialState();
        })
    }

    initializeMap() {
        this._mapComponent = new Map(this.storeLocatorContainer);

        this.loadGeoJsonData().then((data) => {
            var promises = [];

            data.bars.forEach((bar, index) => {
                let promise = this.generateFeature(index, bar);
                promises.push(promise);
            });

            Promise.all(promises).then(() => {
                this.initialState();
            })
        });
    }

    /**
     *
     * @param data
     * @returns {Promise.<T>|*}
     */
    generateFeature(id, data) {
        return this._retryigGeocoder.geocode(data).then(
            (results) => {
                var location = results[0].geometry.location;

                var feature = {
                    type: 'Feature',
                    id: id,
                    properties: data,
                    geometry: {coordinates: [location.lng(), location.lat()], type: 'Point'}
                };

                this._storesFeatures.push(feature);
            });
    }

    initialState() {
        if (!this._listPanel ) {
            this._listPanel = new ListPanel(this.parent);
        }
        this._listPanel.setVisible(false);
        this._listPanel.clear();

        this._mapComponent.displayStores(this._storesFeatures);
        this._mapComponent._userLocationMarker.setVisible(false);
        if (!this.searchBox) {
            this.initializeSearchBox();
        }
    }

    nearest5State(location) {
        this._mapComponent._userLocationMarker.setPosition(location);
        this._mapComponent._userLocationMarker.setVisible(true);

        this.computeDistancesFrom(location).then((result) => {
            var elements = result.rows[0].elements;

            elements.forEach((element, index) => {
                let feature = this._storesFeatures[index];
                feature.properties.distance = element.distance;
                feature.properties.duration = element.duration;
            });

            this._storesFeatures.sort((a, b) => a.properties.distance.value - b.properties.distance.value);

            let top5 = this._storesFeatures.slice(0, 5);

            this._listPanel.setVisible(true);
            this._listPanel.render(top5);
            this._mapComponent.displayStores(top5);
        });
    }

    computeDistancesFrom(location) {
        var request = {
            travelMode: google.maps.TravelMode.WALKING,
            origins: [{location: location}],
            destinations: this._storesFeatures.map((feature) => {
                return {
                    location: new google.maps.LatLng(
                        feature.geometry.coordinates[1],
                        feature.geometry.coordinates[0]
                    )
                }
            })
        };
        return new Promise((resolve, reject) => {
            this._distanceMatrixService.getDistanceMatrix(
                request,
                (response, status) => {
                    if (status === google.maps.DistanceMatrixStatus.OK) {
                        resolve(response);
                    }
                    else {
                        reject(status)
                    }
                });
        });
    }

    loadGeoJsonData() {
        return new Promise((resolve, reject) => {
            http.get(this.options.dataUrl).then((response) => {
                    resolve(JSON.parse(response));
                })
                .catch((reason) => {
                    reject(reason);
                });
        })
    }
}

module.exports = StoreLocator;
