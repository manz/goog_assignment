'use strict';
const addChangedListener = require('./mvcutils');

class SearchBox {
    /**
     *
     * @param {DOMNode} parentElement
     */
    constructor(parentElement) {
        var searchContainer = document.createElement('div');
        searchContainer.style.position = 'absolute';
        searchContainer.style.top = '5px';
        searchContainer.style.left = '5px';
        searchContainer.style.width = '300px';
        searchContainer.style.height = '35px';
        searchContainer.style.backgroundColor = 'red';

        var searchInput = document.createElement('input');
        searchInput.style.width = '100%';
        searchInput.type = 'text';

        var searchClear = document.createElement('input');
        searchClear.type = 'button';
        searchClear.value = 'Clear';

        searchClear.onclick = (event) => {
            searchInput.value = '';
            this.trigger('clear', event)
        };

        searchContainer.appendChild(searchInput);
        searchContainer.appendChild(searchClear);
        parentElement.appendChild(searchContainer);

        this._listeners = {};
        this._placesAutocomplete = new google.maps.places.Autocomplete(searchInput);

        addChangedListener(this._placesAutocomplete, 'place', (placesResult) => {
            this.trigger('place', placesResult);
        });
    }

    trigger(event, value) {
        var listeners = this._listeners[event] || [];
        listeners.forEach((listener) => {
            listener(value);
        })
    }

    addListener(event, listener) {
        this._listeners[event] = this._listeners[event] || [];

        this._listeners[event].push(listener);
    }
}

module.exports = SearchBox;
