'use strict';

class ListPanel {
    constructor(parent) {
        this._container = document.createElement('div');

        this._container.style.position = 'absolute';
        this._container.style.top = '40px';
        this._container.style.left = '5px';
        this._container.style.width = '300px';
        this._container.style.maxHeight = '100%';
        this._container.style.bottom = '0';
        this._container.style.backgroundColor = 'white';
        this._container.style.overflowY = 'scroll';
        this._container.style.display = 'none';

        parent.appendChild(this._container);
    }

    setVisible(visibilty) {
        var display = 'none';
        if (visibilty) {
            display = 'block';
        }
        this._container.style.display = display;
    }

    clear() {
        this._container.innerHTML = null;
    }

    _renderStore(store) {
        var cell = document.createElement('div');
        var streetView = 'https://maps.googleapis.com/maps/api/streetview?size=200x200&location={latlng}'.replace('{latlng}', store.geometry.coordinates[1] + ',' + store.geometry.coordinates[0]);
        cell.innerHTML = '<b>' + store.properties.name + '</b>' + '<br/>' +
                store.properties.distance.text +'&nbsp;' + store.properties.duration.text +'<br/>' +
                '<img src="'+ streetView +'"/>';
        return cell;
    }

    render(stores) {
        this.clear();
        for (let store of stores) {
            this._container.appendChild(this._renderStore(store));
        }
    }
}

module.exports = ListPanel;
