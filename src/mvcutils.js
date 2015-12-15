'use strict';

/**
 * Registers a callback on an MVCObject
 * @param {google.maps.MVCObject} object
 * @param {String} property
 * @param {Function} listener
 * @returns {google.maps.MVCObject}
 */
function addChangedListener(object, property, listener) {
    var tmp = function () {
        this[property] = null;
    };
    tmp.prototype = Object.create(google.maps.MVCObject.prototype);

    tmp.prototype[property + '_changed'] = function () {
        var propertyValue = this.get(property);
        listener(propertyValue);
    };

    var tmpInstance = new tmp();
    tmpInstance.bindTo(property, object, property, false);
    return tmpInstance;
}

module.exports = addChangedListener;
