'use strict';

const http = require('./http');
/**
 * @typedef {Object} MapsLoaderOptions
 * @property {String} [version]
 * @property {String} [channel]
 * @property {String} [clientId]
 * @property {Array.<String>} extraLibraries
 */

class MapsLoader {
    /**
     *
     * @param {MapsLoaderOptions}[options]
     */
    constructor(options) {
        /**
         *
         * @type {MapsLoaderOptions}
         */
        this.options = {
            version: '3.22',
            extraLibraries: ['places']
        };

        for (let option in options) {
            if (options.hasOwnProperty(option)) {
                this.options[option] = options[option];
            }
        }
    }

    /**
     *
     * @param {Function} callback
     */
    load(callback) {
        http.getScript('https://www.google.com/jsapi').then(
            () => {
                google.load('maps', this.options.version, {
                    callback: callback,
                    other_params: 'libraries=' + this.options.extraLibraries.join(',')
                })
            }
        );

    }
}

module.exports = MapsLoader;
