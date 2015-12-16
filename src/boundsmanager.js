"use strict";

var sb = require('./sphericalbounds');
var _extend = require('node.extend');

/**
 * @name MapZoomAndCenter
 * @private
 * @class This class represents the return of getBoundsCenterAndZoom {@link BoundsManager}. Cannot be instantiated.
 * @property center
 * @property zoom
 */

/**
 * @name BoundsPadding
 * @class This class represents the padding of Bounds. Cannot be instantiated.
 * @property {Number} top
 * @property {Number} bottom
 * @property {Number} right
 * @property {Number} left
 * @memberOf woosmap
 */

/**
 * @name BoundsOptions
 * @private
 * @class This class represents the {@link BoundsManager} available options. Cannot be instantiated.
 * @property {BoundsPadding} padding
 * @property {Number} maxZoom
 * @property {Number} mapHeight
 * @property {Number} mapWidth
 */

/**
 * Computes the zoom and the center of the map for fitting bounds
 * @param {BoundsOptions} options
 * @private
 * @constructor
 */
var BoundsManager = function (options) {
    this.options = _extend({
        padding: {},
        maxZoom: 21,
        mapHeight: 100,
        mapWidth: 100
    }, options);

    this.padding = _extend({top: 20, bottom: 20, left: 20, right: 20}, this.options.padding);
};

/**
 * Computes the center of the map to display the data.
 * Takes in account the padding.
 * @param {google.maps.LatLngBounds} bounds
 * @param {Number} zoom
 * @returns {google.maps.LatLng} the computed center
 */
BoundsManager.prototype.getCenterWithPadding = function (bounds, zoom) {
    var meterBounds = sb.fromLatLngBounds(bounds);

    var pixelBounds = meterBounds.toPixel(zoom);

    pixelBounds.sw.x -= this.padding.left;
    pixelBounds.ne.x += this.padding.right;
    pixelBounds.sw.y += this.padding.top;
    pixelBounds.ne.y -= this.padding.bottom;

    var newBounds = pixelBounds.toLatLngBounds(zoom);

    return newBounds.getCenter();
};

/**
 * Computes `zoom` for the `bounds` passed as parameter.
 * Takes in account the padding.
 * @param {google.maps.LatLngBounds} bounds
 * @returns {number}
 */
BoundsManager.prototype.getZoomForBounds = function (bounds) {
    var worldSize = {height: 256, width: 256};
    var mapSize = {
        width: this.options.mapWidth - (this.padding.left + this.padding.right),
        height: this.options.mapHeight - (this.padding.top + this.padding.bottom)
    };

    var ZOOM_MAX = this.options.maxZoom;

    function latRad(lat) {
        var sin = Math.sin(lat * Math.PI / 180);
        var radX2 = Math.log((1 + sin) / (1 - sin)) / 2;
        return Math.max(Math.min(radX2, Math.PI), -Math.PI) / 2;
    }

    function zoom(mapPx, worldPx, fraction) {
        return Math.floor(Math.log(mapPx / worldPx / fraction) / Math.LN2);
    }

    var ne = bounds.getNorthEast();
    var sw = bounds.getSouthWest();

    var latFraction = (latRad(ne.lat()) - latRad(sw.lat())) / Math.PI;

    var lngDiff = ne.lng() - sw.lng();
    var lngFraction = ((lngDiff < 0) ? (lngDiff + 360) : lngDiff) / 360;

    var latZoom = ZOOM_MAX;
    var lngZoom = ZOOM_MAX;

    if (lngFraction > 0) {
        lngZoom = zoom(mapSize.width, worldSize.width, lngFraction);
    }

    if (latFraction > 0) {
        latZoom = zoom(mapSize.height, worldSize.height, latFraction)
    }

    return Math.min(latZoom, lngZoom, ZOOM_MAX);
};

/**
 * Computes a `zoom` and a `center` for bounds with padding.
 * @param {google.maps.LatLngBounds} bounds
 * @returns {MapZoomAndCenter} the center and zoom.
 */
BoundsManager.prototype.getBoundsCenterAndZoom = function (bounds) {
    var zoom = this.getZoomForBounds(bounds);
    var center = this.getCenterWithPadding(bounds, zoom);

    return {
        center: center,
        zoom: zoom
    }
};

module.exports = BoundsManager;
