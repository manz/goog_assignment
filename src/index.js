//required for IE.
require('es6-promise').polyfill();

const main = require('./main');
window.initializeStoreLocator = main;
