'use strict';

const MapsLoader = require('./mapsloader');
const StoreLocator = require('./storelocator');

/**
 *
 * @param {StoreLocatorOptions} options
 */
module.exports = function (options) {
    var mapsLoader = new MapsLoader();

    mapsLoader.load(() => {
        new StoreLocator(options)
    });
};
