'use strict';

class RetryingGeocoder {
    constructor() {
        this.geocoder = new google.maps.Geocoder();
    }

    _geocode(address, resolve, reject) {
        this.geocoder.geocode({address: address}, (results, status) => {
            if (status === google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
                setTimeout(() => this._geocode(address, resolve, reject), 1000);
            }
            else if (status === google.maps.GeocoderStatus.OK) {
                resolve(results);
            }
            else {
                reject(status);
            }
        });
    }

    geocode(data) {
        var self = this;
        return new Promise((resolve, reject) => {
            self._geocode(data.address + ', ' + data.city, resolve, reject);
        });
    }
}

module.exports = RetryingGeocoder;
