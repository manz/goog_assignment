/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	//required for IE.
	__webpack_require__(1).polyfill();
	
	var main = __webpack_require__(6);
	window.initializeStoreLocator = main;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var require;var __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(process, global, module) {/*!
	 * @overview es6-promise - a tiny implementation of Promises/A+.
	 * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
	 * @license   Licensed under MIT license
	 *            See https://raw.githubusercontent.com/jakearchibald/es6-promise/master/LICENSE
	 * @version   3.0.2
	 */
	
	(function() {
	    "use strict";
	    function lib$es6$promise$utils$$objectOrFunction(x) {
	      return typeof x === 'function' || (typeof x === 'object' && x !== null);
	    }
	
	    function lib$es6$promise$utils$$isFunction(x) {
	      return typeof x === 'function';
	    }
	
	    function lib$es6$promise$utils$$isMaybeThenable(x) {
	      return typeof x === 'object' && x !== null;
	    }
	
	    var lib$es6$promise$utils$$_isArray;
	    if (!Array.isArray) {
	      lib$es6$promise$utils$$_isArray = function (x) {
	        return Object.prototype.toString.call(x) === '[object Array]';
	      };
	    } else {
	      lib$es6$promise$utils$$_isArray = Array.isArray;
	    }
	
	    var lib$es6$promise$utils$$isArray = lib$es6$promise$utils$$_isArray;
	    var lib$es6$promise$asap$$len = 0;
	    var lib$es6$promise$asap$$toString = {}.toString;
	    var lib$es6$promise$asap$$vertxNext;
	    var lib$es6$promise$asap$$customSchedulerFn;
	
	    var lib$es6$promise$asap$$asap = function asap(callback, arg) {
	      lib$es6$promise$asap$$queue[lib$es6$promise$asap$$len] = callback;
	      lib$es6$promise$asap$$queue[lib$es6$promise$asap$$len + 1] = arg;
	      lib$es6$promise$asap$$len += 2;
	      if (lib$es6$promise$asap$$len === 2) {
	        // If len is 2, that means that we need to schedule an async flush.
	        // If additional callbacks are queued before the queue is flushed, they
	        // will be processed by this flush that we are scheduling.
	        if (lib$es6$promise$asap$$customSchedulerFn) {
	          lib$es6$promise$asap$$customSchedulerFn(lib$es6$promise$asap$$flush);
	        } else {
	          lib$es6$promise$asap$$scheduleFlush();
	        }
	      }
	    }
	
	    function lib$es6$promise$asap$$setScheduler(scheduleFn) {
	      lib$es6$promise$asap$$customSchedulerFn = scheduleFn;
	    }
	
	    function lib$es6$promise$asap$$setAsap(asapFn) {
	      lib$es6$promise$asap$$asap = asapFn;
	    }
	
	    var lib$es6$promise$asap$$browserWindow = (typeof window !== 'undefined') ? window : undefined;
	    var lib$es6$promise$asap$$browserGlobal = lib$es6$promise$asap$$browserWindow || {};
	    var lib$es6$promise$asap$$BrowserMutationObserver = lib$es6$promise$asap$$browserGlobal.MutationObserver || lib$es6$promise$asap$$browserGlobal.WebKitMutationObserver;
	    var lib$es6$promise$asap$$isNode = typeof process !== 'undefined' && {}.toString.call(process) === '[object process]';
	
	    // test for web worker but not in IE10
	    var lib$es6$promise$asap$$isWorker = typeof Uint8ClampedArray !== 'undefined' &&
	      typeof importScripts !== 'undefined' &&
	      typeof MessageChannel !== 'undefined';
	
	    // node
	    function lib$es6$promise$asap$$useNextTick() {
	      // node version 0.10.x displays a deprecation warning when nextTick is used recursively
	      // see https://github.com/cujojs/when/issues/410 for details
	      return function() {
	        process.nextTick(lib$es6$promise$asap$$flush);
	      };
	    }
	
	    // vertx
	    function lib$es6$promise$asap$$useVertxTimer() {
	      return function() {
	        lib$es6$promise$asap$$vertxNext(lib$es6$promise$asap$$flush);
	      };
	    }
	
	    function lib$es6$promise$asap$$useMutationObserver() {
	      var iterations = 0;
	      var observer = new lib$es6$promise$asap$$BrowserMutationObserver(lib$es6$promise$asap$$flush);
	      var node = document.createTextNode('');
	      observer.observe(node, { characterData: true });
	
	      return function() {
	        node.data = (iterations = ++iterations % 2);
	      };
	    }
	
	    // web worker
	    function lib$es6$promise$asap$$useMessageChannel() {
	      var channel = new MessageChannel();
	      channel.port1.onmessage = lib$es6$promise$asap$$flush;
	      return function () {
	        channel.port2.postMessage(0);
	      };
	    }
	
	    function lib$es6$promise$asap$$useSetTimeout() {
	      return function() {
	        setTimeout(lib$es6$promise$asap$$flush, 1);
	      };
	    }
	
	    var lib$es6$promise$asap$$queue = new Array(1000);
	    function lib$es6$promise$asap$$flush() {
	      for (var i = 0; i < lib$es6$promise$asap$$len; i+=2) {
	        var callback = lib$es6$promise$asap$$queue[i];
	        var arg = lib$es6$promise$asap$$queue[i+1];
	
	        callback(arg);
	
	        lib$es6$promise$asap$$queue[i] = undefined;
	        lib$es6$promise$asap$$queue[i+1] = undefined;
	      }
	
	      lib$es6$promise$asap$$len = 0;
	    }
	
	    function lib$es6$promise$asap$$attemptVertx() {
	      try {
	        var r = require;
	        var vertx = __webpack_require__(4);
	        lib$es6$promise$asap$$vertxNext = vertx.runOnLoop || vertx.runOnContext;
	        return lib$es6$promise$asap$$useVertxTimer();
	      } catch(e) {
	        return lib$es6$promise$asap$$useSetTimeout();
	      }
	    }
	
	    var lib$es6$promise$asap$$scheduleFlush;
	    // Decide what async method to use to triggering processing of queued callbacks:
	    if (lib$es6$promise$asap$$isNode) {
	      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$useNextTick();
	    } else if (lib$es6$promise$asap$$BrowserMutationObserver) {
	      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$useMutationObserver();
	    } else if (lib$es6$promise$asap$$isWorker) {
	      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$useMessageChannel();
	    } else if (lib$es6$promise$asap$$browserWindow === undefined && "function" === 'function') {
	      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$attemptVertx();
	    } else {
	      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$useSetTimeout();
	    }
	
	    function lib$es6$promise$$internal$$noop() {}
	
	    var lib$es6$promise$$internal$$PENDING   = void 0;
	    var lib$es6$promise$$internal$$FULFILLED = 1;
	    var lib$es6$promise$$internal$$REJECTED  = 2;
	
	    var lib$es6$promise$$internal$$GET_THEN_ERROR = new lib$es6$promise$$internal$$ErrorObject();
	
	    function lib$es6$promise$$internal$$selfFulfillment() {
	      return new TypeError("You cannot resolve a promise with itself");
	    }
	
	    function lib$es6$promise$$internal$$cannotReturnOwn() {
	      return new TypeError('A promises callback cannot return that same promise.');
	    }
	
	    function lib$es6$promise$$internal$$getThen(promise) {
	      try {
	        return promise.then;
	      } catch(error) {
	        lib$es6$promise$$internal$$GET_THEN_ERROR.error = error;
	        return lib$es6$promise$$internal$$GET_THEN_ERROR;
	      }
	    }
	
	    function lib$es6$promise$$internal$$tryThen(then, value, fulfillmentHandler, rejectionHandler) {
	      try {
	        then.call(value, fulfillmentHandler, rejectionHandler);
	      } catch(e) {
	        return e;
	      }
	    }
	
	    function lib$es6$promise$$internal$$handleForeignThenable(promise, thenable, then) {
	       lib$es6$promise$asap$$asap(function(promise) {
	        var sealed = false;
	        var error = lib$es6$promise$$internal$$tryThen(then, thenable, function(value) {
	          if (sealed) { return; }
	          sealed = true;
	          if (thenable !== value) {
	            lib$es6$promise$$internal$$resolve(promise, value);
	          } else {
	            lib$es6$promise$$internal$$fulfill(promise, value);
	          }
	        }, function(reason) {
	          if (sealed) { return; }
	          sealed = true;
	
	          lib$es6$promise$$internal$$reject(promise, reason);
	        }, 'Settle: ' + (promise._label || ' unknown promise'));
	
	        if (!sealed && error) {
	          sealed = true;
	          lib$es6$promise$$internal$$reject(promise, error);
	        }
	      }, promise);
	    }
	
	    function lib$es6$promise$$internal$$handleOwnThenable(promise, thenable) {
	      if (thenable._state === lib$es6$promise$$internal$$FULFILLED) {
	        lib$es6$promise$$internal$$fulfill(promise, thenable._result);
	      } else if (thenable._state === lib$es6$promise$$internal$$REJECTED) {
	        lib$es6$promise$$internal$$reject(promise, thenable._result);
	      } else {
	        lib$es6$promise$$internal$$subscribe(thenable, undefined, function(value) {
	          lib$es6$promise$$internal$$resolve(promise, value);
	        }, function(reason) {
	          lib$es6$promise$$internal$$reject(promise, reason);
	        });
	      }
	    }
	
	    function lib$es6$promise$$internal$$handleMaybeThenable(promise, maybeThenable) {
	      if (maybeThenable.constructor === promise.constructor) {
	        lib$es6$promise$$internal$$handleOwnThenable(promise, maybeThenable);
	      } else {
	        var then = lib$es6$promise$$internal$$getThen(maybeThenable);
	
	        if (then === lib$es6$promise$$internal$$GET_THEN_ERROR) {
	          lib$es6$promise$$internal$$reject(promise, lib$es6$promise$$internal$$GET_THEN_ERROR.error);
	        } else if (then === undefined) {
	          lib$es6$promise$$internal$$fulfill(promise, maybeThenable);
	        } else if (lib$es6$promise$utils$$isFunction(then)) {
	          lib$es6$promise$$internal$$handleForeignThenable(promise, maybeThenable, then);
	        } else {
	          lib$es6$promise$$internal$$fulfill(promise, maybeThenable);
	        }
	      }
	    }
	
	    function lib$es6$promise$$internal$$resolve(promise, value) {
	      if (promise === value) {
	        lib$es6$promise$$internal$$reject(promise, lib$es6$promise$$internal$$selfFulfillment());
	      } else if (lib$es6$promise$utils$$objectOrFunction(value)) {
	        lib$es6$promise$$internal$$handleMaybeThenable(promise, value);
	      } else {
	        lib$es6$promise$$internal$$fulfill(promise, value);
	      }
	    }
	
	    function lib$es6$promise$$internal$$publishRejection(promise) {
	      if (promise._onerror) {
	        promise._onerror(promise._result);
	      }
	
	      lib$es6$promise$$internal$$publish(promise);
	    }
	
	    function lib$es6$promise$$internal$$fulfill(promise, value) {
	      if (promise._state !== lib$es6$promise$$internal$$PENDING) { return; }
	
	      promise._result = value;
	      promise._state = lib$es6$promise$$internal$$FULFILLED;
	
	      if (promise._subscribers.length !== 0) {
	        lib$es6$promise$asap$$asap(lib$es6$promise$$internal$$publish, promise);
	      }
	    }
	
	    function lib$es6$promise$$internal$$reject(promise, reason) {
	      if (promise._state !== lib$es6$promise$$internal$$PENDING) { return; }
	      promise._state = lib$es6$promise$$internal$$REJECTED;
	      promise._result = reason;
	
	      lib$es6$promise$asap$$asap(lib$es6$promise$$internal$$publishRejection, promise);
	    }
	
	    function lib$es6$promise$$internal$$subscribe(parent, child, onFulfillment, onRejection) {
	      var subscribers = parent._subscribers;
	      var length = subscribers.length;
	
	      parent._onerror = null;
	
	      subscribers[length] = child;
	      subscribers[length + lib$es6$promise$$internal$$FULFILLED] = onFulfillment;
	      subscribers[length + lib$es6$promise$$internal$$REJECTED]  = onRejection;
	
	      if (length === 0 && parent._state) {
	        lib$es6$promise$asap$$asap(lib$es6$promise$$internal$$publish, parent);
	      }
	    }
	
	    function lib$es6$promise$$internal$$publish(promise) {
	      var subscribers = promise._subscribers;
	      var settled = promise._state;
	
	      if (subscribers.length === 0) { return; }
	
	      var child, callback, detail = promise._result;
	
	      for (var i = 0; i < subscribers.length; i += 3) {
	        child = subscribers[i];
	        callback = subscribers[i + settled];
	
	        if (child) {
	          lib$es6$promise$$internal$$invokeCallback(settled, child, callback, detail);
	        } else {
	          callback(detail);
	        }
	      }
	
	      promise._subscribers.length = 0;
	    }
	
	    function lib$es6$promise$$internal$$ErrorObject() {
	      this.error = null;
	    }
	
	    var lib$es6$promise$$internal$$TRY_CATCH_ERROR = new lib$es6$promise$$internal$$ErrorObject();
	
	    function lib$es6$promise$$internal$$tryCatch(callback, detail) {
	      try {
	        return callback(detail);
	      } catch(e) {
	        lib$es6$promise$$internal$$TRY_CATCH_ERROR.error = e;
	        return lib$es6$promise$$internal$$TRY_CATCH_ERROR;
	      }
	    }
	
	    function lib$es6$promise$$internal$$invokeCallback(settled, promise, callback, detail) {
	      var hasCallback = lib$es6$promise$utils$$isFunction(callback),
	          value, error, succeeded, failed;
	
	      if (hasCallback) {
	        value = lib$es6$promise$$internal$$tryCatch(callback, detail);
	
	        if (value === lib$es6$promise$$internal$$TRY_CATCH_ERROR) {
	          failed = true;
	          error = value.error;
	          value = null;
	        } else {
	          succeeded = true;
	        }
	
	        if (promise === value) {
	          lib$es6$promise$$internal$$reject(promise, lib$es6$promise$$internal$$cannotReturnOwn());
	          return;
	        }
	
	      } else {
	        value = detail;
	        succeeded = true;
	      }
	
	      if (promise._state !== lib$es6$promise$$internal$$PENDING) {
	        // noop
	      } else if (hasCallback && succeeded) {
	        lib$es6$promise$$internal$$resolve(promise, value);
	      } else if (failed) {
	        lib$es6$promise$$internal$$reject(promise, error);
	      } else if (settled === lib$es6$promise$$internal$$FULFILLED) {
	        lib$es6$promise$$internal$$fulfill(promise, value);
	      } else if (settled === lib$es6$promise$$internal$$REJECTED) {
	        lib$es6$promise$$internal$$reject(promise, value);
	      }
	    }
	
	    function lib$es6$promise$$internal$$initializePromise(promise, resolver) {
	      try {
	        resolver(function resolvePromise(value){
	          lib$es6$promise$$internal$$resolve(promise, value);
	        }, function rejectPromise(reason) {
	          lib$es6$promise$$internal$$reject(promise, reason);
	        });
	      } catch(e) {
	        lib$es6$promise$$internal$$reject(promise, e);
	      }
	    }
	
	    function lib$es6$promise$enumerator$$Enumerator(Constructor, input) {
	      var enumerator = this;
	
	      enumerator._instanceConstructor = Constructor;
	      enumerator.promise = new Constructor(lib$es6$promise$$internal$$noop);
	
	      if (enumerator._validateInput(input)) {
	        enumerator._input     = input;
	        enumerator.length     = input.length;
	        enumerator._remaining = input.length;
	
	        enumerator._init();
	
	        if (enumerator.length === 0) {
	          lib$es6$promise$$internal$$fulfill(enumerator.promise, enumerator._result);
	        } else {
	          enumerator.length = enumerator.length || 0;
	          enumerator._enumerate();
	          if (enumerator._remaining === 0) {
	            lib$es6$promise$$internal$$fulfill(enumerator.promise, enumerator._result);
	          }
	        }
	      } else {
	        lib$es6$promise$$internal$$reject(enumerator.promise, enumerator._validationError());
	      }
	    }
	
	    lib$es6$promise$enumerator$$Enumerator.prototype._validateInput = function(input) {
	      return lib$es6$promise$utils$$isArray(input);
	    };
	
	    lib$es6$promise$enumerator$$Enumerator.prototype._validationError = function() {
	      return new Error('Array Methods must be provided an Array');
	    };
	
	    lib$es6$promise$enumerator$$Enumerator.prototype._init = function() {
	      this._result = new Array(this.length);
	    };
	
	    var lib$es6$promise$enumerator$$default = lib$es6$promise$enumerator$$Enumerator;
	
	    lib$es6$promise$enumerator$$Enumerator.prototype._enumerate = function() {
	      var enumerator = this;
	
	      var length  = enumerator.length;
	      var promise = enumerator.promise;
	      var input   = enumerator._input;
	
	      for (var i = 0; promise._state === lib$es6$promise$$internal$$PENDING && i < length; i++) {
	        enumerator._eachEntry(input[i], i);
	      }
	    };
	
	    lib$es6$promise$enumerator$$Enumerator.prototype._eachEntry = function(entry, i) {
	      var enumerator = this;
	      var c = enumerator._instanceConstructor;
	
	      if (lib$es6$promise$utils$$isMaybeThenable(entry)) {
	        if (entry.constructor === c && entry._state !== lib$es6$promise$$internal$$PENDING) {
	          entry._onerror = null;
	          enumerator._settledAt(entry._state, i, entry._result);
	        } else {
	          enumerator._willSettleAt(c.resolve(entry), i);
	        }
	      } else {
	        enumerator._remaining--;
	        enumerator._result[i] = entry;
	      }
	    };
	
	    lib$es6$promise$enumerator$$Enumerator.prototype._settledAt = function(state, i, value) {
	      var enumerator = this;
	      var promise = enumerator.promise;
	
	      if (promise._state === lib$es6$promise$$internal$$PENDING) {
	        enumerator._remaining--;
	
	        if (state === lib$es6$promise$$internal$$REJECTED) {
	          lib$es6$promise$$internal$$reject(promise, value);
	        } else {
	          enumerator._result[i] = value;
	        }
	      }
	
	      if (enumerator._remaining === 0) {
	        lib$es6$promise$$internal$$fulfill(promise, enumerator._result);
	      }
	    };
	
	    lib$es6$promise$enumerator$$Enumerator.prototype._willSettleAt = function(promise, i) {
	      var enumerator = this;
	
	      lib$es6$promise$$internal$$subscribe(promise, undefined, function(value) {
	        enumerator._settledAt(lib$es6$promise$$internal$$FULFILLED, i, value);
	      }, function(reason) {
	        enumerator._settledAt(lib$es6$promise$$internal$$REJECTED, i, reason);
	      });
	    };
	    function lib$es6$promise$promise$all$$all(entries) {
	      return new lib$es6$promise$enumerator$$default(this, entries).promise;
	    }
	    var lib$es6$promise$promise$all$$default = lib$es6$promise$promise$all$$all;
	    function lib$es6$promise$promise$race$$race(entries) {
	      /*jshint validthis:true */
	      var Constructor = this;
	
	      var promise = new Constructor(lib$es6$promise$$internal$$noop);
	
	      if (!lib$es6$promise$utils$$isArray(entries)) {
	        lib$es6$promise$$internal$$reject(promise, new TypeError('You must pass an array to race.'));
	        return promise;
	      }
	
	      var length = entries.length;
	
	      function onFulfillment(value) {
	        lib$es6$promise$$internal$$resolve(promise, value);
	      }
	
	      function onRejection(reason) {
	        lib$es6$promise$$internal$$reject(promise, reason);
	      }
	
	      for (var i = 0; promise._state === lib$es6$promise$$internal$$PENDING && i < length; i++) {
	        lib$es6$promise$$internal$$subscribe(Constructor.resolve(entries[i]), undefined, onFulfillment, onRejection);
	      }
	
	      return promise;
	    }
	    var lib$es6$promise$promise$race$$default = lib$es6$promise$promise$race$$race;
	    function lib$es6$promise$promise$resolve$$resolve(object) {
	      /*jshint validthis:true */
	      var Constructor = this;
	
	      if (object && typeof object === 'object' && object.constructor === Constructor) {
	        return object;
	      }
	
	      var promise = new Constructor(lib$es6$promise$$internal$$noop);
	      lib$es6$promise$$internal$$resolve(promise, object);
	      return promise;
	    }
	    var lib$es6$promise$promise$resolve$$default = lib$es6$promise$promise$resolve$$resolve;
	    function lib$es6$promise$promise$reject$$reject(reason) {
	      /*jshint validthis:true */
	      var Constructor = this;
	      var promise = new Constructor(lib$es6$promise$$internal$$noop);
	      lib$es6$promise$$internal$$reject(promise, reason);
	      return promise;
	    }
	    var lib$es6$promise$promise$reject$$default = lib$es6$promise$promise$reject$$reject;
	
	    var lib$es6$promise$promise$$counter = 0;
	
	    function lib$es6$promise$promise$$needsResolver() {
	      throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
	    }
	
	    function lib$es6$promise$promise$$needsNew() {
	      throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
	    }
	
	    var lib$es6$promise$promise$$default = lib$es6$promise$promise$$Promise;
	    /**
	      Promise objects represent the eventual result of an asynchronous operation. The
	      primary way of interacting with a promise is through its `then` method, which
	      registers callbacks to receive either a promise's eventual value or the reason
	      why the promise cannot be fulfilled.
	
	      Terminology
	      -----------
	
	      - `promise` is an object or function with a `then` method whose behavior conforms to this specification.
	      - `thenable` is an object or function that defines a `then` method.
	      - `value` is any legal JavaScript value (including undefined, a thenable, or a promise).
	      - `exception` is a value that is thrown using the throw statement.
	      - `reason` is a value that indicates why a promise was rejected.
	      - `settled` the final resting state of a promise, fulfilled or rejected.
	
	      A promise can be in one of three states: pending, fulfilled, or rejected.
	
	      Promises that are fulfilled have a fulfillment value and are in the fulfilled
	      state.  Promises that are rejected have a rejection reason and are in the
	      rejected state.  A fulfillment value is never a thenable.
	
	      Promises can also be said to *resolve* a value.  If this value is also a
	      promise, then the original promise's settled state will match the value's
	      settled state.  So a promise that *resolves* a promise that rejects will
	      itself reject, and a promise that *resolves* a promise that fulfills will
	      itself fulfill.
	
	
	      Basic Usage:
	      ------------
	
	      ```js
	      var promise = new Promise(function(resolve, reject) {
	        // on success
	        resolve(value);
	
	        // on failure
	        reject(reason);
	      });
	
	      promise.then(function(value) {
	        // on fulfillment
	      }, function(reason) {
	        // on rejection
	      });
	      ```
	
	      Advanced Usage:
	      ---------------
	
	      Promises shine when abstracting away asynchronous interactions such as
	      `XMLHttpRequest`s.
	
	      ```js
	      function getJSON(url) {
	        return new Promise(function(resolve, reject){
	          var xhr = new XMLHttpRequest();
	
	          xhr.open('GET', url);
	          xhr.onreadystatechange = handler;
	          xhr.responseType = 'json';
	          xhr.setRequestHeader('Accept', 'application/json');
	          xhr.send();
	
	          function handler() {
	            if (this.readyState === this.DONE) {
	              if (this.status === 200) {
	                resolve(this.response);
	              } else {
	                reject(new Error('getJSON: `' + url + '` failed with status: [' + this.status + ']'));
	              }
	            }
	          };
	        });
	      }
	
	      getJSON('/posts.json').then(function(json) {
	        // on fulfillment
	      }, function(reason) {
	        // on rejection
	      });
	      ```
	
	      Unlike callbacks, promises are great composable primitives.
	
	      ```js
	      Promise.all([
	        getJSON('/posts'),
	        getJSON('/comments')
	      ]).then(function(values){
	        values[0] // => postsJSON
	        values[1] // => commentsJSON
	
	        return values;
	      });
	      ```
	
	      @class Promise
	      @param {function} resolver
	      Useful for tooling.
	      @constructor
	    */
	    function lib$es6$promise$promise$$Promise(resolver) {
	      this._id = lib$es6$promise$promise$$counter++;
	      this._state = undefined;
	      this._result = undefined;
	      this._subscribers = [];
	
	      if (lib$es6$promise$$internal$$noop !== resolver) {
	        if (!lib$es6$promise$utils$$isFunction(resolver)) {
	          lib$es6$promise$promise$$needsResolver();
	        }
	
	        if (!(this instanceof lib$es6$promise$promise$$Promise)) {
	          lib$es6$promise$promise$$needsNew();
	        }
	
	        lib$es6$promise$$internal$$initializePromise(this, resolver);
	      }
	    }
	
	    lib$es6$promise$promise$$Promise.all = lib$es6$promise$promise$all$$default;
	    lib$es6$promise$promise$$Promise.race = lib$es6$promise$promise$race$$default;
	    lib$es6$promise$promise$$Promise.resolve = lib$es6$promise$promise$resolve$$default;
	    lib$es6$promise$promise$$Promise.reject = lib$es6$promise$promise$reject$$default;
	    lib$es6$promise$promise$$Promise._setScheduler = lib$es6$promise$asap$$setScheduler;
	    lib$es6$promise$promise$$Promise._setAsap = lib$es6$promise$asap$$setAsap;
	    lib$es6$promise$promise$$Promise._asap = lib$es6$promise$asap$$asap;
	
	    lib$es6$promise$promise$$Promise.prototype = {
	      constructor: lib$es6$promise$promise$$Promise,
	
	    /**
	      The primary way of interacting with a promise is through its `then` method,
	      which registers callbacks to receive either a promise's eventual value or the
	      reason why the promise cannot be fulfilled.
	
	      ```js
	      findUser().then(function(user){
	        // user is available
	      }, function(reason){
	        // user is unavailable, and you are given the reason why
	      });
	      ```
	
	      Chaining
	      --------
	
	      The return value of `then` is itself a promise.  This second, 'downstream'
	      promise is resolved with the return value of the first promise's fulfillment
	      or rejection handler, or rejected if the handler throws an exception.
	
	      ```js
	      findUser().then(function (user) {
	        return user.name;
	      }, function (reason) {
	        return 'default name';
	      }).then(function (userName) {
	        // If `findUser` fulfilled, `userName` will be the user's name, otherwise it
	        // will be `'default name'`
	      });
	
	      findUser().then(function (user) {
	        throw new Error('Found user, but still unhappy');
	      }, function (reason) {
	        throw new Error('`findUser` rejected and we're unhappy');
	      }).then(function (value) {
	        // never reached
	      }, function (reason) {
	        // if `findUser` fulfilled, `reason` will be 'Found user, but still unhappy'.
	        // If `findUser` rejected, `reason` will be '`findUser` rejected and we're unhappy'.
	      });
	      ```
	      If the downstream promise does not specify a rejection handler, rejection reasons will be propagated further downstream.
	
	      ```js
	      findUser().then(function (user) {
	        throw new PedagogicalException('Upstream error');
	      }).then(function (value) {
	        // never reached
	      }).then(function (value) {
	        // never reached
	      }, function (reason) {
	        // The `PedgagocialException` is propagated all the way down to here
	      });
	      ```
	
	      Assimilation
	      ------------
	
	      Sometimes the value you want to propagate to a downstream promise can only be
	      retrieved asynchronously. This can be achieved by returning a promise in the
	      fulfillment or rejection handler. The downstream promise will then be pending
	      until the returned promise is settled. This is called *assimilation*.
	
	      ```js
	      findUser().then(function (user) {
	        return findCommentsByAuthor(user);
	      }).then(function (comments) {
	        // The user's comments are now available
	      });
	      ```
	
	      If the assimliated promise rejects, then the downstream promise will also reject.
	
	      ```js
	      findUser().then(function (user) {
	        return findCommentsByAuthor(user);
	      }).then(function (comments) {
	        // If `findCommentsByAuthor` fulfills, we'll have the value here
	      }, function (reason) {
	        // If `findCommentsByAuthor` rejects, we'll have the reason here
	      });
	      ```
	
	      Simple Example
	      --------------
	
	      Synchronous Example
	
	      ```javascript
	      var result;
	
	      try {
	        result = findResult();
	        // success
	      } catch(reason) {
	        // failure
	      }
	      ```
	
	      Errback Example
	
	      ```js
	      findResult(function(result, err){
	        if (err) {
	          // failure
	        } else {
	          // success
	        }
	      });
	      ```
	
	      Promise Example;
	
	      ```javascript
	      findResult().then(function(result){
	        // success
	      }, function(reason){
	        // failure
	      });
	      ```
	
	      Advanced Example
	      --------------
	
	      Synchronous Example
	
	      ```javascript
	      var author, books;
	
	      try {
	        author = findAuthor();
	        books  = findBooksByAuthor(author);
	        // success
	      } catch(reason) {
	        // failure
	      }
	      ```
	
	      Errback Example
	
	      ```js
	
	      function foundBooks(books) {
	
	      }
	
	      function failure(reason) {
	
	      }
	
	      findAuthor(function(author, err){
	        if (err) {
	          failure(err);
	          // failure
	        } else {
	          try {
	            findBoooksByAuthor(author, function(books, err) {
	              if (err) {
	                failure(err);
	              } else {
	                try {
	                  foundBooks(books);
	                } catch(reason) {
	                  failure(reason);
	                }
	              }
	            });
	          } catch(error) {
	            failure(err);
	          }
	          // success
	        }
	      });
	      ```
	
	      Promise Example;
	
	      ```javascript
	      findAuthor().
	        then(findBooksByAuthor).
	        then(function(books){
	          // found books
	      }).catch(function(reason){
	        // something went wrong
	      });
	      ```
	
	      @method then
	      @param {Function} onFulfilled
	      @param {Function} onRejected
	      Useful for tooling.
	      @return {Promise}
	    */
	      then: function(onFulfillment, onRejection) {
	        var parent = this;
	        var state = parent._state;
	
	        if (state === lib$es6$promise$$internal$$FULFILLED && !onFulfillment || state === lib$es6$promise$$internal$$REJECTED && !onRejection) {
	          return this;
	        }
	
	        var child = new this.constructor(lib$es6$promise$$internal$$noop);
	        var result = parent._result;
	
	        if (state) {
	          var callback = arguments[state - 1];
	          lib$es6$promise$asap$$asap(function(){
	            lib$es6$promise$$internal$$invokeCallback(state, child, callback, result);
	          });
	        } else {
	          lib$es6$promise$$internal$$subscribe(parent, child, onFulfillment, onRejection);
	        }
	
	        return child;
	      },
	
	    /**
	      `catch` is simply sugar for `then(undefined, onRejection)` which makes it the same
	      as the catch block of a try/catch statement.
	
	      ```js
	      function findAuthor(){
	        throw new Error('couldn't find that author');
	      }
	
	      // synchronous
	      try {
	        findAuthor();
	      } catch(reason) {
	        // something went wrong
	      }
	
	      // async with promises
	      findAuthor().catch(function(reason){
	        // something went wrong
	      });
	      ```
	
	      @method catch
	      @param {Function} onRejection
	      Useful for tooling.
	      @return {Promise}
	    */
	      'catch': function(onRejection) {
	        return this.then(null, onRejection);
	      }
	    };
	    function lib$es6$promise$polyfill$$polyfill() {
	      var local;
	
	      if (typeof global !== 'undefined') {
	          local = global;
	      } else if (typeof self !== 'undefined') {
	          local = self;
	      } else {
	          try {
	              local = Function('return this')();
	          } catch (e) {
	              throw new Error('polyfill failed because global object is unavailable in this environment');
	          }
	      }
	
	      var P = local.Promise;
	
	      if (P && Object.prototype.toString.call(P.resolve()) === '[object Promise]' && !P.cast) {
	        return;
	      }
	
	      local.Promise = lib$es6$promise$promise$$default;
	    }
	    var lib$es6$promise$polyfill$$default = lib$es6$promise$polyfill$$polyfill;
	
	    var lib$es6$promise$umd$$ES6Promise = {
	      'Promise': lib$es6$promise$promise$$default,
	      'polyfill': lib$es6$promise$polyfill$$default
	    };
	
	    /* global define:true module:true window: true */
	    if ("function" === 'function' && __webpack_require__(5)['amd']) {
	      !(__WEBPACK_AMD_DEFINE_RESULT__ = function() { return lib$es6$promise$umd$$ES6Promise; }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else if (typeof module !== 'undefined' && module['exports']) {
	      module['exports'] = lib$es6$promise$umd$$ES6Promise;
	    } else if (typeof this !== 'undefined') {
	      this['ES6Promise'] = lib$es6$promise$umd$$ES6Promise;
	    }
	
	    lib$es6$promise$polyfill$$default();
	}).call(this);
	
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2), (function() { return this; }()), __webpack_require__(3)(module)))

/***/ },
/* 2 */
/***/ function(module, exports) {

	// shim for using process in browser
	
	var process = module.exports = {};
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;
	
	function cleanUpNextTick() {
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}
	
	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = setTimeout(cleanUpNextTick);
	    draining = true;
	
	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    clearTimeout(timeout);
	}
	
	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        setTimeout(drainQueue, 0);
	    }
	};
	
	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};
	
	function noop() {}
	
	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;
	
	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};
	
	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ },
/* 4 */
/***/ function(module, exports) {

	/* (ignored) */

/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = function() { throw new Error("define cannot be used indirect"); };


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var MapsLoader = __webpack_require__(7);
	var StoreLocator = __webpack_require__(9);
	
	/**
	 *
	 * @param {StoreLocatorOptions} options
	 */
	module.exports = function (options) {
	    var mapsLoader = new MapsLoader();
	
	    mapsLoader.load(function () {
	        new StoreLocator(options);
	    });
	};

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var http = __webpack_require__(8);
	/**
	 * @typedef {Object} MapsLoaderOptions
	 * @property {String} [version]
	 * @property {String} [channel]
	 * @property {String} [clientId]
	 * @property {Array.<String>} extraLibraries
	 */
	
	var MapsLoader = (function () {
	    /**
	     *
	     * @param {MapsLoaderOptions}[options]
	     */
	
	    function MapsLoader(options) {
	        _classCallCheck(this, MapsLoader);
	
	        /**
	         *
	         * @type {MapsLoaderOptions}
	         */
	        this.options = {
	            version: '3.22',
	            extraLibraries: ['places']
	        };
	
	        for (var option in options) {
	            if (options.hasOwnProperty(option)) {
	                this.options[option] = options[option];
	            }
	        }
	    }
	
	    /**
	     *
	     * @param {Function} callback
	     */
	
	    _createClass(MapsLoader, [{
	        key: 'load',
	        value: function load(callback) {
	            var _this = this;
	
	            http.getScript('https://www.google.com/jsapi').then(function () {
	                google.load('maps', _this.options.version, {
	                    callback: callback,
	                    other_params: 'libraries=' + _this.options.extraLibraries.join(',')
	                });
	            });
	        }
	    }]);
	
	    return MapsLoader;
	})();
	
	module.exports = MapsLoader;

/***/ },
/* 8 */
/***/ function(module, exports) {

	'use strict';
	
	module.exports = {
	    get: function get(url) {
	        return new Promise(function (resolve, reject) {
	            var client = new XMLHttpRequest();
	            client.open('GET', url);
	            client.send();
	
	            client.onload = function () {
	                if (client.status >= 200 && client.status < 300) {
	                    resolve(client.response);
	                } else {
	                    reject(client.statusText);
	                }
	            };
	
	            client.onerror = function () {
	                reject(client.statusText);
	            };
	        });
	    },
	    getScript: function getScript(source) {
	        return new Promise(function (resolve, reject) {
	            var script = document.createElement('script');
	            var prior = document.getElementsByTagName('script')[0];
	            script.async = 1;
	            prior.parentNode.insertBefore(script, prior);
	
	            script.onload = script.onreadystatechange = function (_, isAbort) {
	                if (isAbort) {
	                    reject();
	                }
	                if (!script.readyState || /loaded|complete/.test(script.readyState)) {
	                    script.onload = script.onreadystatechange = null;
	                    script = undefined;
	                    resolve();
	                }
	            };
	
	            script.src = source;
	        });
	    }
	
	};

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var http = __webpack_require__(8);
	var RetryingGeocoder = __webpack_require__(10);
	var SearchBox = __webpack_require__(11);
	var ListPanel = __webpack_require__(13);
	var Map = __webpack_require__(14);
	
	/**
	 * @typedef {Object} StoreLocatorOptions
	 * @property parentSelector
	 * @property {String} dataUrl
	 */
	
	/**
	 * StoreLocator main
	 */
	
	var StoreLocator = (function () {
	    /**
	     *
	     * @param {StoreLocatorOptions} [options]
	     */
	
	    function StoreLocator(options) {
	        _classCallCheck(this, StoreLocator);
	
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
	        this._directionsService = new google.maps.DirectionsService();
	        this._retryigGeocoder = new RetryingGeocoder();
	        this._geocodingLoader = this._buildGeocodingLoader();
	        this.storeLocatorContainer.appendChild(this._geocodingLoader);
	        this._directionsRenderer = new google.maps.DirectionsRenderer({
	            preserveViewport: true
	        });
	    }
	
	    _createClass(StoreLocator, [{
	        key: '_buildGeocodingLoader',
	        value: function _buildGeocodingLoader() {
	            var geocodingLoader = document.createElement('div');
	
	            geocodingLoader.style.position = 'absolute';
	            geocodingLoader.style.top = '50%';
	            geocodingLoader.style.left = '50%';
	            geocodingLoader.style.width = '150px';
	            geocodingLoader.style.height = '20px';
	            geocodingLoader.style.backgroundColor = 'white';
	            geocodingLoader.style.marginTop = '-12px';
	            geocodingLoader.style.marginLeft = '-75px';
	            geocodingLoader.style.padding = '4px';
	            geocodingLoader.style.boxShadow = 'black 0px 0px 2px';
	            geocodingLoader.style.borderRadius = '2px';
	
	            geocodingLoader.innerHTML = 'Geocoding in progress';
	            return geocodingLoader;
	        }
	    }, {
	        key: 'initializeSearchBox',
	        value: function initializeSearchBox() {
	            var _this = this;
	
	            this.searchBox = new SearchBox(this.parent);
	            this.searchBox.addListener('place', function (value) {
	                _this.nearest5State(value.geometry.location);
	            });
	
	            this.searchBox.addListener('clear', function (event) {
	                _this.initialState();
	            });
	        }
	    }, {
	        key: 'initializeMap',
	        value: function initializeMap() {
	            var _this2 = this;
	
	            this._mapComponent = new Map(this.storeLocatorContainer);
	
	            this.loadGeoJsonData().then(function (data) {
	                var promises = [];
	
	                data.bars.forEach(function (bar, index) {
	                    var promise = _this2.generateFeature(index, bar).catch(function (error) {
	                        console.error(error);
	                    });
	                    promises.push(promise);
	                });
	
	                Promise.all(promises).then(function () {
	                    _this2.initialState();
	                });
	            });
	        }
	
	        /**
	         *
	         * @param id
	         * @param data
	         * @returns {Promise.<T>|*}
	         */
	
	    }, {
	        key: 'generateFeature',
	        value: function generateFeature(id, data) {
	            var _this3 = this;
	
	            return this._retryigGeocoder.geocode(data).then(function (results) {
	                var location = results[0].geometry.location;
	
	                var feature = {
	                    type: 'Feature',
	                    id: id,
	                    properties: data,
	                    geometry: { coordinates: [location.lng(), location.lat()], type: 'Point' }
	                };
	
	                _this3._storesFeatures.push(feature);
	            });
	        }
	    }, {
	        key: 'initialState',
	        value: function initialState() {
	            this._geocodingLoader.remove();
	            this._mapComponent.setPadding({});
	            if (!this._listPanel) {
	                this._listPanel = new ListPanel(this.parent);
	            }
	            this._listPanel.setVisible(false);
	            this._listPanel.clear();
	
	            this._mapComponent.displayStores(this._storesFeatures);
	            this._mapComponent._userLocationMarker.setVisible(false);
	            if (!this.searchBox) {
	                this.initializeSearchBox();
	            }
	            this._directionsRenderer.setMap(null);
	
	            this._mapComponent.setSelectedStoreCallback(null);
	        }
	    }, {
	        key: 'nearest5State',
	        value: function nearest5State(location) {
	            var _this4 = this;
	
	            this._mapComponent._userLocationMarker.setPosition(location);
	            this._mapComponent._userLocationMarker.setVisible(true);
	            this._mapComponent.setPadding({ left: 300 });
	            this.computeDistancesFrom(location).then(function (result) {
	                var elements = result.rows[0].elements;
	
	                elements.forEach(function (element, index) {
	                    var feature = _this4._storesFeatures[index];
	                    feature.properties.distance = element.distance;
	                    feature.properties.duration = element.duration;
	                });
	
	                _this4._storesFeatures.sort(function (a, b) {
	                    return a.properties.distance.value - b.properties.distance.value;
	                });
	
	                var top5 = _this4._storesFeatures.slice(0, 5);
	
	                _this4._listPanel.setVisible(true);
	                _this4._listPanel.render(top5);
	                _this4._mapComponent.displayStores(top5);
	            });
	
	            this._mapComponent.setSelectedStoreCallback(function (point) {
	                _this4._directionsService.route({
	                    origin: location,
	                    destination: point,
	                    travelMode: google.maps.TravelMode.WALKING
	                }, function (response, status) {
	                    if (status === google.maps.DirectionsStatus.OK) {
	                        _this4._directionsRenderer.setDirections(response);
	                        _this4._directionsRenderer.setMap(_this4._mapComponent.getMap());
	                    }
	                });
	            });
	        }
	    }, {
	        key: 'computeDistancesFrom',
	        value: function computeDistancesFrom(location) {
	            var _this5 = this;
	
	            var request = {
	                travelMode: google.maps.TravelMode.WALKING,
	                origins: [{ location: location }],
	                destinations: this._storesFeatures.map(function (feature) {
	                    return {
	                        location: new google.maps.LatLng(feature.geometry.coordinates[1], feature.geometry.coordinates[0])
	                    };
	                })
	            };
	            return new Promise(function (resolve, reject) {
	                _this5._distanceMatrixService.getDistanceMatrix(request, function (response, status) {
	                    if (status === google.maps.DistanceMatrixStatus.OK) {
	                        resolve(response);
	                    } else {
	                        reject(status);
	                    }
	                });
	            });
	        }
	    }, {
	        key: 'loadGeoJsonData',
	        value: function loadGeoJsonData() {
	            var _this6 = this;
	
	            return new Promise(function (resolve, reject) {
	                http.get(_this6.options.dataUrl).then(function (response) {
	                    resolve(JSON.parse(response));
	                }).catch(function (reason) {
	                    reject(reason);
	                });
	            });
	        }
	    }]);
	
	    return StoreLocator;
	})();
	
	module.exports = StoreLocator;

/***/ },
/* 10 */
/***/ function(module, exports) {

	'use strict';
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var RetryingGeocoder = (function () {
	    function RetryingGeocoder() {
	        _classCallCheck(this, RetryingGeocoder);
	
	        this.geocoder = new google.maps.Geocoder();
	    }
	
	    _createClass(RetryingGeocoder, [{
	        key: '_geocode',
	        value: function _geocode(address, resolve, reject) {
	            var _this = this;
	
	            this.geocoder.geocode({ address: address }, function (results, status) {
	                if (status === google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
	                    setTimeout(function () {
	                        return _this._geocode(address, resolve, reject);
	                    }, 1000);
	                } else if (status === google.maps.GeocoderStatus.OK) {
	                    resolve(results);
	                } else {
	                    reject(status);
	                }
	            });
	        }
	    }, {
	        key: 'geocode',
	        value: function geocode(data) {
	            var self = this;
	            return new Promise(function (resolve, reject) {
	                self._geocode(data.address + ', ' + data.city, resolve, reject);
	            });
	        }
	    }]);
	
	    return RetryingGeocoder;
	})();
	
	module.exports = RetryingGeocoder;

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var addChangedListener = __webpack_require__(12);
	
	var SearchBox = (function () {
	    /**
	     *
	     * @param {DOMNode} parentElement
	     */
	
	    function SearchBox(parentElement) {
	        var _this = this;
	
	        _classCallCheck(this, SearchBox);
	
	        var searchContainer = document.createElement('div');
	        searchContainer.style.position = 'absolute';
	        searchContainer.style.top = '5px';
	        searchContainer.style.left = '5px';
	        searchContainer.style.width = '305px';
	        searchContainer.style.height = '20px';
	        searchContainer.style.boxShadow = 'black 0px 0px 2px';
	        searchContainer.style.borderRadius = '2px';
	        searchContainer.style.backgroundColor = 'white';
	
	        var searchInput = document.createElement('input');
	        searchInput.style.width = '250px';
	        searchInput.type = 'text';
	
	        var searchClear = document.createElement('input');
	        searchClear.type = 'button';
	        searchClear.value = 'Clear';
	
	        searchClear.onclick = function (event) {
	            searchInput.value = '';
	            _this.trigger('clear', event);
	        };
	
	        searchContainer.appendChild(searchInput);
	        searchContainer.appendChild(searchClear);
	        parentElement.appendChild(searchContainer);
	
	        this._listeners = {};
	        this._placesAutocomplete = new google.maps.places.Autocomplete(searchInput);
	
	        addChangedListener(this._placesAutocomplete, 'place', function (placesResult) {
	            _this.trigger('place', placesResult);
	        });
	    }
	
	    _createClass(SearchBox, [{
	        key: 'trigger',
	        value: function trigger(event, value) {
	            var listeners = this._listeners[event] || [];
	            listeners.forEach(function (listener) {
	                listener(value);
	            });
	        }
	    }, {
	        key: 'addListener',
	        value: function addListener(event, listener) {
	            this._listeners[event] = this._listeners[event] || [];
	
	            this._listeners[event].push(listener);
	        }
	    }]);
	
	    return SearchBox;
	})();
	
	module.exports = SearchBox;

/***/ },
/* 12 */
/***/ function(module, exports) {

	'use strict';
	
	/**
	 * Registers a callback on an MVCObject
	 * @param {google.maps.MVCObject} object
	 * @param {String} property
	 * @param {Function} listener
	 * @returns {google.maps.MVCObject}
	 */
	
	function addChangedListener(object, property, listener) {
	    var tmp = function tmp() {
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

/***/ },
/* 13 */
/***/ function(module, exports) {

	'use strict';
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var ListPanel = (function () {
	    function ListPanel(parent) {
	        _classCallCheck(this, ListPanel);
	
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
	
	    _createClass(ListPanel, [{
	        key: 'setVisible',
	        value: function setVisible(visibilty) {
	            var display = 'none';
	            if (visibilty) {
	                display = 'block';
	            }
	            this._container.style.display = display;
	        }
	    }, {
	        key: 'clear',
	        value: function clear() {
	            this._container.innerHTML = '';
	        }
	    }, {
	        key: '_renderStore',
	        value: function _renderStore(store) {
	            var cell = document.createElement('div');
	            var streetView = 'https://maps.googleapis.com/maps/api/streetview?size=250x100&location={latlng}'.replace('{latlng}', store.geometry.coordinates[1] + ',' + store.geometry.coordinates[0]);
	            cell.innerHTML = '<b>' + store.properties.name + '</b>' + '<br/>' + store.properties.distance.text + '&nbsp;' + store.properties.duration.text + '<br/>' + '<img src="' + streetView + '"/>';
	            return cell;
	        }
	    }, {
	        key: 'render',
	        value: function render(stores) {
	            this.clear();
	            for (var storeIndex in stores) {
	                if (stores.hasOwnProperty(storeIndex)) {
	                    this._container.appendChild(this._renderStore(stores[storeIndex]));
	                }
	            }
	        }
	    }]);
	
	    return ListPanel;
	})();
	
	module.exports = ListPanel;

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var BoundsManager = __webpack_require__(15);
	
	var mapStyle = [{
	    "featureType": "landscape",
	    "stylers": [{ "hue": "#FFBB00" }, { "saturation": 43.400000000000006 }, { "lightness": 37.599999999999994 }, { "gamma": 1 }]
	}, {
	    "featureType": "road.highway",
	    "stylers": [{ "hue": "#FFC200" }, { "saturation": -61.8 }, { "lightness": 45.599999999999994 }, { "gamma": 1 }]
	}, {
	    "featureType": "road.arterial",
	    "stylers": [{ "hue": "#FF0300" }, { "saturation": -100 }, { "lightness": 51.19999999999999 }, { "gamma": 1 }]
	}, {
	    "featureType": "road.local",
	    "stylers": [{ "hue": "#FF0300" }, { "saturation": -100 }, { "lightness": 52 }, { "gamma": 1 }]
	}, {
	    "featureType": "water",
	    "stylers": [{ "hue": "#0078FF" }, { "saturation": -13.200000000000003 }, { "lightness": 2.4000000000000057 }, { "gamma": 1 }]
	}, {
	    featureType: "poi",
	    elementType: "labels",
	    stylers: [{ visibility: "off" }]
	}];
	
	var Map = (function () {
	    function Map(parent) {
	        var _this = this;
	
	        _classCallCheck(this, Map);
	
	        this._selectedStorePositionCallback = null;
	        this.mapContainer = document.createElement('div');
	        this.mapContainer.style.width = '100%';
	        this.mapContainer.style.height = '100%';
	        parent.appendChild(this.mapContainer);
	        this._padding = {};
	        this._map = new google.maps.Map(this.mapContainer, {
	            center: { lat: 43.609571288668455, lng: 3.878150566101093 },
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
	
	        this._map.data.setStyle(function (feature) {
	            return {
	                icon: {
	                    fillColor: feature.getProperty('type'),
	                    path: google.maps.SymbolPath.CIRCLE,
	                    fillOpacity: 0.8,
	                    scale: 8,
	                    strokeColor: 'gold',
	                    strokeWeight: 2
	                }
	            };
	        });
	
	        this._infoWindow = new google.maps.InfoWindow();
	
	        this._map.data.addListener('click', function (event) {
	            _this._map.data.revertStyle();
	
	            var point = event.feature.getGeometry().get();
	
	            _this._map.data.overrideStyle(event.feature, {
	                icon: 'http://developers.woosmap.com/img/markers/marker.png',
	                zIndex: google.maps.Marker.MAX_ZINDEX
	            });
	            _this._infoWindow.setContent(event.feature.getProperty('name') + '<br/>' + event.feature.getProperty('address') + '<br/>' + event.feature.getProperty('city'));
	
	            var anchor = new google.maps.MVCObject();
	            anchor.setValues({
	                position: point,
	                anchorPoint: new google.maps.Point(0, -30)
	            });
	
	            if (_this._selectedStorePositionCallback) {
	                _this._selectedStorePositionCallback(point);
	            }
	
	            _this._infoWindow.open(_this._map, anchor);
	        });
	    }
	
	    _createClass(Map, [{
	        key: 'getMap',
	        value: function getMap() {
	            return this._map;
	        }
	    }, {
	        key: 'setSelectedStoreCallback',
	        value: function setSelectedStoreCallback(callback) {
	            this._selectedStorePositionCallback = callback;
	        }
	    }, {
	        key: 'setPadding',
	        value: function setPadding(padding) {
	            this._padding = padding;
	        }
	    }, {
	        key: 'clearStores',
	        value: function clearStores() {
	            var _this2 = this;
	
	            this._infoWindow.close();
	            this._map.data.revertStyle();
	            this._map.data.forEach(function (feature) {
	                _this2._map.data.remove(feature);
	            });
	        }
	    }, {
	        key: 'getBounds',
	        value: function getBounds(features) {
	            var bounds = new google.maps.LatLngBounds();
	
	            for (var index in features) {
	                if (features.hasOwnProperty(index)) {
	                    var coordinates = features[index].geometry.coordinates;
	                    bounds.extend(new google.maps.LatLng(coordinates[1], coordinates[0]));
	                }
	            }
	
	            if (this._userLocationMarker.getVisible()) {
	                bounds.extend(this._userLocationMarker.getPosition());
	            }
	            return bounds;
	        }
	    }, {
	        key: 'displayStores',
	        value: function displayStores(storesFeatures) {
	            this.clearStores();
	
	            var computedStyle = window.getComputedStyle(this.mapContainer);
	
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
	    }]);
	
	    return Map;
	})();
	
	module.exports = Map;

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var sb = __webpack_require__(16);
	var _extend = __webpack_require__(17);
	
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
	var BoundsManager = function BoundsManager(options) {
	    this.options = _extend({
	        padding: {},
	        maxZoom: 21,
	        mapHeight: 100,
	        mapWidth: 100
	    }, options);
	
	    this.padding = _extend({ top: 20, bottom: 20, left: 20, right: 20 }, this.options.padding);
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
	    var worldSize = { height: 256, width: 256 };
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
	    var lngFraction = (lngDiff < 0 ? lngDiff + 360 : lngDiff) / 360;
	
	    var latZoom = ZOOM_MAX;
	    var lngZoom = ZOOM_MAX;
	
	    if (lngFraction > 0) {
	        lngZoom = zoom(mapSize.width, worldSize.width, lngFraction);
	    }
	
	    if (latFraction > 0) {
	        latZoom = zoom(mapSize.height, worldSize.height, latFraction);
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
	    };
	};
	
	module.exports = BoundsManager;

/***/ },
/* 16 */
/***/ function(module, exports) {

	'use strict';
	
	var originShift = 2.0 * Math.PI * 6378137.0 / 2.0;
	var initialResolution = 2.0 * Math.PI * 6378137.0 / 256.0;
	
	var _toPixel = function _toPixel(meterPoint, resolution) {
	    return new google.maps.Point((meterPoint.x + originShift) / resolution, (meterPoint.y + originShift) / resolution);
	};
	
	var _toMeter = function _toMeter(pixelPoint, resolution) {
	    return new google.maps.Point(pixelPoint.x * resolution - originShift, pixelPoint.y * resolution - originShift);
	};
	
	var _toLatLng = function _toLatLng(point) {
	    var lng = point.x / originShift * 180.0;
	    var lat = point.y / originShift * 180.0;
	
	    lat = 180 / Math.PI * (2 * Math.atan(Math.exp(lat * Math.PI / 180.0)) - Math.PI / 2.0);
	
	    return new google.maps.LatLng(lat, lng);
	};
	
	var _fromLatLng = function _fromLatLng(latLng) {
	    var mx = latLng.lng() * originShift / 180.0;
	    var my = Math.log(Math.tan((90 + latLng.lat()) * Math.PI / 360.0)) / (Math.PI / 180.0);
	
	    my = my * originShift / 180.0;
	
	    return new google.maps.Point(mx, my);
	};
	
	var UNITS = {
	    meter: 'meter',
	    pixel: 'pixel'
	};
	
	/**
	 * Constructs SphericalBounds instance from LatLngBounds instance.
	 * @param {google.maps.LatLngBounds} latLngBounds
	 */
	var fromLatLngBounds = function fromLatLngBounds(latLngBounds) {
	    var retVal = new SphericalBounds(_fromLatLng(latLngBounds.getSouthWest()), _fromLatLng(latLngBounds.getNorthEast()));
	
	    retVal.unit = UNITS.meter;
	
	    return retVal;
	};
	
	/**
	 * Constructs a SphericalBounds object
	 * @param {google.maps.Point} sw
	 * @param {google.maps.Point} ne
	 * @private
	 * @constructor
	 */
	var SphericalBounds = function SphericalBounds(sw, ne) {
	    this.sw = sw;
	    this.ne = ne;
	    this.unit = UNITS.meter;
	};
	
	SphericalBounds.prototype._convert = function (zoom, lambda, inner) {
	    if (this.unit == inner) {
	        throw "These bouds are already in " + inner;
	    }
	
	    var resolution = initialResolution / Math.pow(2, zoom);
	    var retVal = new SphericalBounds(lambda(this.sw, resolution), lambda(this.ne, resolution));
	
	    retVal.unit = inner;
	    return retVal;
	};
	
	/**
	 * Transforms the meters bound into pixel bounds.
	 * Returns a new instance of SphericalBounds in pixels units.
	 * @param {Number} zoom the zoom level
	 */
	SphericalBounds.prototype.toPixel = function (zoom) {
	    return this._convert(zoom, _toPixel, UNITS.pixel);
	};
	
	/**
	 * Transforms the pixel bound into meters bounds.
	 * Returns a new instance of SphericalBounds in meters units.
	 * @param {Number} zoom the zoom level
	 * @return {SphericalBounds}
	 */
	SphericalBounds.prototype.toMeter = function (zoom) {
	    return this._convert(zoom, _toMeter, UNITS.meter);
	};
	
	/**
	 * Builds a LatLngBounds from SphericalBounds.
	 * The unit can be pixel or meter.
	 * @param {Number} [zoom]
	 * @returns {google.maps.LatLngBounds}
	 */
	SphericalBounds.prototype.toLatLngBounds = function (zoom) {
	    if (this.unit == UNITS.pixel) {
	        if (!zoom) {
	            throw 'zoom must be supplied in order to convert to latLngBounds';
	        }
	        return this.toMeter(zoom).toLatLngBounds();
	    } else {
	        return new google.maps.LatLngBounds(_toLatLng(this.sw), _toLatLng(this.ne));
	    }
	};
	
	exports.SphericalBounds = SphericalBounds;
	exports.fromLatLngBounds = fromLatLngBounds;

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(18);
	


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	/*!
	 * node.extend
	 * Copyright 2011, John Resig
	 * Dual licensed under the MIT or GPL Version 2 licenses.
	 * http://jquery.org/license
	 *
	 * @fileoverview
	 * Port of jQuery.extend that actually works on node.js
	 */
	var is = __webpack_require__(19);
	
	function extend() {
	  var target = arguments[0] || {};
	  var i = 1;
	  var length = arguments.length;
	  var deep = false;
	  var options, name, src, copy, copy_is_array, clone;
	
	  // Handle a deep copy situation
	  if (typeof target === 'boolean') {
	    deep = target;
	    target = arguments[1] || {};
	    // skip the boolean and the target
	    i = 2;
	  }
	
	  // Handle case when target is a string or something (possible in deep copy)
	  if (typeof target !== 'object' && !is.fn(target)) {
	    target = {};
	  }
	
	  for (; i < length; i++) {
	    // Only deal with non-null/undefined values
	    options = arguments[i]
	    if (options != null) {
	      if (typeof options === 'string') {
	          options = options.split('');
	      }
	      // Extend the base object
	      for (name in options) {
	        src = target[name];
	        copy = options[name];
	
	        // Prevent never-ending loop
	        if (target === copy) {
	          continue;
	        }
	
	        // Recurse if we're merging plain objects or arrays
	        if (deep && copy && (is.hash(copy) || (copy_is_array = is.array(copy)))) {
	          if (copy_is_array) {
	            copy_is_array = false;
	            clone = src && is.array(src) ? src : [];
	          } else {
	            clone = src && is.hash(src) ? src : {};
	          }
	
	          // Never move original objects, clone them
	          target[name] = extend(deep, clone, copy);
	
	        // Don't bring in undefined values
	        } else if (typeof copy !== 'undefined') {
	          target[name] = copy;
	        }
	      }
	    }
	  }
	
	  // Return the modified object
	  return target;
	};
	
	/**
	 * @public
	 */
	extend.version = '1.1.3';
	
	/**
	 * Exports module.
	 */
	module.exports = extend;
	


/***/ },
/* 19 */
/***/ function(module, exports) {

	/* globals window, HTMLElement */
	/**!
	 * is
	 * the definitive JavaScript type testing library
	 *
	 * @copyright 2013-2014 Enrico Marino / Jordan Harband
	 * @license MIT
	 */
	
	var objProto = Object.prototype;
	var owns = objProto.hasOwnProperty;
	var toStr = objProto.toString;
	var symbolValueOf;
	if (typeof Symbol === 'function') {
	  symbolValueOf = Symbol.prototype.valueOf;
	}
	var isActualNaN = function (value) {
	  return value !== value;
	};
	var NON_HOST_TYPES = {
	  'boolean': 1,
	  number: 1,
	  string: 1,
	  undefined: 1
	};
	
	var base64Regex = /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{4}|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)$/;
	var hexRegex = /^[A-Fa-f0-9]+$/;
	
	/**
	 * Expose `is`
	 */
	
	var is = module.exports = {};
	
	/**
	 * Test general.
	 */
	
	/**
	 * is.type
	 * Test if `value` is a type of `type`.
	 *
	 * @param {Mixed} value value to test
	 * @param {String} type type
	 * @return {Boolean} true if `value` is a type of `type`, false otherwise
	 * @api public
	 */
	
	is.a = is.type = function (value, type) {
	  return typeof value === type;
	};
	
	/**
	 * is.defined
	 * Test if `value` is defined.
	 *
	 * @param {Mixed} value value to test
	 * @return {Boolean} true if 'value' is defined, false otherwise
	 * @api public
	 */
	
	is.defined = function (value) {
	  return typeof value !== 'undefined';
	};
	
	/**
	 * is.empty
	 * Test if `value` is empty.
	 *
	 * @param {Mixed} value value to test
	 * @return {Boolean} true if `value` is empty, false otherwise
	 * @api public
	 */
	
	is.empty = function (value) {
	  var type = toStr.call(value);
	  var key;
	
	  if (type === '[object Array]' || type === '[object Arguments]' || type === '[object String]') {
	    return value.length === 0;
	  }
	
	  if (type === '[object Object]') {
	    for (key in value) {
	      if (owns.call(value, key)) { return false; }
	    }
	    return true;
	  }
	
	  return !value;
	};
	
	/**
	 * is.equal
	 * Test if `value` is equal to `other`.
	 *
	 * @param {Mixed} value value to test
	 * @param {Mixed} other value to compare with
	 * @return {Boolean} true if `value` is equal to `other`, false otherwise
	 */
	
	is.equal = function equal(value, other) {
	  if (value === other) {
	    return true;
	  }
	
	  var type = toStr.call(value);
	  var key;
	
	  if (type !== toStr.call(other)) {
	    return false;
	  }
	
	  if (type === '[object Object]') {
	    for (key in value) {
	      if (!is.equal(value[key], other[key]) || !(key in other)) {
	        return false;
	      }
	    }
	    for (key in other) {
	      if (!is.equal(value[key], other[key]) || !(key in value)) {
	        return false;
	      }
	    }
	    return true;
	  }
	
	  if (type === '[object Array]') {
	    key = value.length;
	    if (key !== other.length) {
	      return false;
	    }
	    while (--key) {
	      if (!is.equal(value[key], other[key])) {
	        return false;
	      }
	    }
	    return true;
	  }
	
	  if (type === '[object Function]') {
	    return value.prototype === other.prototype;
	  }
	
	  if (type === '[object Date]') {
	    return value.getTime() === other.getTime();
	  }
	
	  return false;
	};
	
	/**
	 * is.hosted
	 * Test if `value` is hosted by `host`.
	 *
	 * @param {Mixed} value to test
	 * @param {Mixed} host host to test with
	 * @return {Boolean} true if `value` is hosted by `host`, false otherwise
	 * @api public
	 */
	
	is.hosted = function (value, host) {
	  var type = typeof host[value];
	  return type === 'object' ? !!host[value] : !NON_HOST_TYPES[type];
	};
	
	/**
	 * is.instance
	 * Test if `value` is an instance of `constructor`.
	 *
	 * @param {Mixed} value value to test
	 * @return {Boolean} true if `value` is an instance of `constructor`
	 * @api public
	 */
	
	is.instance = is['instanceof'] = function (value, constructor) {
	  return value instanceof constructor;
	};
	
	/**
	 * is.nil / is.null
	 * Test if `value` is null.
	 *
	 * @param {Mixed} value value to test
	 * @return {Boolean} true if `value` is null, false otherwise
	 * @api public
	 */
	
	is.nil = is['null'] = function (value) {
	  return value === null;
	};
	
	/**
	 * is.undef / is.undefined
	 * Test if `value` is undefined.
	 *
	 * @param {Mixed} value value to test
	 * @return {Boolean} true if `value` is undefined, false otherwise
	 * @api public
	 */
	
	is.undef = is.undefined = function (value) {
	  return typeof value === 'undefined';
	};
	
	/**
	 * Test arguments.
	 */
	
	/**
	 * is.args
	 * Test if `value` is an arguments object.
	 *
	 * @param {Mixed} value value to test
	 * @return {Boolean} true if `value` is an arguments object, false otherwise
	 * @api public
	 */
	
	is.args = is.arguments = function (value) {
	  var isStandardArguments = toStr.call(value) === '[object Arguments]';
	  var isOldArguments = !is.array(value) && is.arraylike(value) && is.object(value) && is.fn(value.callee);
	  return isStandardArguments || isOldArguments;
	};
	
	/**
	 * Test array.
	 */
	
	/**
	 * is.array
	 * Test if 'value' is an array.
	 *
	 * @param {Mixed} value value to test
	 * @return {Boolean} true if `value` is an array, false otherwise
	 * @api public
	 */
	
	is.array = Array.isArray || function (value) {
	  return toStr.call(value) === '[object Array]';
	};
	
	/**
	 * is.arguments.empty
	 * Test if `value` is an empty arguments object.
	 *
	 * @param {Mixed} value value to test
	 * @return {Boolean} true if `value` is an empty arguments object, false otherwise
	 * @api public
	 */
	is.args.empty = function (value) {
	  return is.args(value) && value.length === 0;
	};
	
	/**
	 * is.array.empty
	 * Test if `value` is an empty array.
	 *
	 * @param {Mixed} value value to test
	 * @return {Boolean} true if `value` is an empty array, false otherwise
	 * @api public
	 */
	is.array.empty = function (value) {
	  return is.array(value) && value.length === 0;
	};
	
	/**
	 * is.arraylike
	 * Test if `value` is an arraylike object.
	 *
	 * @param {Mixed} value value to test
	 * @return {Boolean} true if `value` is an arguments object, false otherwise
	 * @api public
	 */
	
	is.arraylike = function (value) {
	  return !!value && !is.bool(value)
	    && owns.call(value, 'length')
	    && isFinite(value.length)
	    && is.number(value.length)
	    && value.length >= 0;
	};
	
	/**
	 * Test boolean.
	 */
	
	/**
	 * is.bool
	 * Test if `value` is a boolean.
	 *
	 * @param {Mixed} value value to test
	 * @return {Boolean} true if `value` is a boolean, false otherwise
	 * @api public
	 */
	
	is.bool = is['boolean'] = function (value) {
	  return toStr.call(value) === '[object Boolean]';
	};
	
	/**
	 * is.false
	 * Test if `value` is false.
	 *
	 * @param {Mixed} value value to test
	 * @return {Boolean} true if `value` is false, false otherwise
	 * @api public
	 */
	
	is['false'] = function (value) {
	  return is.bool(value) && Boolean(Number(value)) === false;
	};
	
	/**
	 * is.true
	 * Test if `value` is true.
	 *
	 * @param {Mixed} value value to test
	 * @return {Boolean} true if `value` is true, false otherwise
	 * @api public
	 */
	
	is['true'] = function (value) {
	  return is.bool(value) && Boolean(Number(value)) === true;
	};
	
	/**
	 * Test date.
	 */
	
	/**
	 * is.date
	 * Test if `value` is a date.
	 *
	 * @param {Mixed} value value to test
	 * @return {Boolean} true if `value` is a date, false otherwise
	 * @api public
	 */
	
	is.date = function (value) {
	  return toStr.call(value) === '[object Date]';
	};
	
	/**
	 * Test element.
	 */
	
	/**
	 * is.element
	 * Test if `value` is an html element.
	 *
	 * @param {Mixed} value value to test
	 * @return {Boolean} true if `value` is an HTML Element, false otherwise
	 * @api public
	 */
	
	is.element = function (value) {
	  return value !== undefined
	    && typeof HTMLElement !== 'undefined'
	    && value instanceof HTMLElement
	    && value.nodeType === 1;
	};
	
	/**
	 * Test error.
	 */
	
	/**
	 * is.error
	 * Test if `value` is an error object.
	 *
	 * @param {Mixed} value value to test
	 * @return {Boolean} true if `value` is an error object, false otherwise
	 * @api public
	 */
	
	is.error = function (value) {
	  return toStr.call(value) === '[object Error]';
	};
	
	/**
	 * Test function.
	 */
	
	/**
	 * is.fn / is.function (deprecated)
	 * Test if `value` is a function.
	 *
	 * @param {Mixed} value value to test
	 * @return {Boolean} true if `value` is a function, false otherwise
	 * @api public
	 */
	
	is.fn = is['function'] = function (value) {
	  var isAlert = typeof window !== 'undefined' && value === window.alert;
	  return isAlert || toStr.call(value) === '[object Function]';
	};
	
	/**
	 * Test number.
	 */
	
	/**
	 * is.number
	 * Test if `value` is a number.
	 *
	 * @param {Mixed} value value to test
	 * @return {Boolean} true if `value` is a number, false otherwise
	 * @api public
	 */
	
	is.number = function (value) {
	  return toStr.call(value) === '[object Number]';
	};
	
	/**
	 * is.infinite
	 * Test if `value` is positive or negative infinity.
	 *
	 * @param {Mixed} value value to test
	 * @return {Boolean} true if `value` is positive or negative Infinity, false otherwise
	 * @api public
	 */
	is.infinite = function (value) {
	  return value === Infinity || value === -Infinity;
	};
	
	/**
	 * is.decimal
	 * Test if `value` is a decimal number.
	 *
	 * @param {Mixed} value value to test
	 * @return {Boolean} true if `value` is a decimal number, false otherwise
	 * @api public
	 */
	
	is.decimal = function (value) {
	  return is.number(value) && !isActualNaN(value) && !is.infinite(value) && value % 1 !== 0;
	};
	
	/**
	 * is.divisibleBy
	 * Test if `value` is divisible by `n`.
	 *
	 * @param {Number} value value to test
	 * @param {Number} n dividend
	 * @return {Boolean} true if `value` is divisible by `n`, false otherwise
	 * @api public
	 */
	
	is.divisibleBy = function (value, n) {
	  var isDividendInfinite = is.infinite(value);
	  var isDivisorInfinite = is.infinite(n);
	  var isNonZeroNumber = is.number(value) && !isActualNaN(value) && is.number(n) && !isActualNaN(n) && n !== 0;
	  return isDividendInfinite || isDivisorInfinite || (isNonZeroNumber && value % n === 0);
	};
	
	/**
	 * is.integer
	 * Test if `value` is an integer.
	 *
	 * @param value to test
	 * @return {Boolean} true if `value` is an integer, false otherwise
	 * @api public
	 */
	
	is.integer = is['int'] = function (value) {
	  return is.number(value) && !isActualNaN(value) && value % 1 === 0;
	};
	
	/**
	 * is.maximum
	 * Test if `value` is greater than 'others' values.
	 *
	 * @param {Number} value value to test
	 * @param {Array} others values to compare with
	 * @return {Boolean} true if `value` is greater than `others` values
	 * @api public
	 */
	
	is.maximum = function (value, others) {
	  if (isActualNaN(value)) {
	    throw new TypeError('NaN is not a valid value');
	  } else if (!is.arraylike(others)) {
	    throw new TypeError('second argument must be array-like');
	  }
	  var len = others.length;
	
	  while (--len >= 0) {
	    if (value < others[len]) {
	      return false;
	    }
	  }
	
	  return true;
	};
	
	/**
	 * is.minimum
	 * Test if `value` is less than `others` values.
	 *
	 * @param {Number} value value to test
	 * @param {Array} others values to compare with
	 * @return {Boolean} true if `value` is less than `others` values
	 * @api public
	 */
	
	is.minimum = function (value, others) {
	  if (isActualNaN(value)) {
	    throw new TypeError('NaN is not a valid value');
	  } else if (!is.arraylike(others)) {
	    throw new TypeError('second argument must be array-like');
	  }
	  var len = others.length;
	
	  while (--len >= 0) {
	    if (value > others[len]) {
	      return false;
	    }
	  }
	
	  return true;
	};
	
	/**
	 * is.nan
	 * Test if `value` is not a number.
	 *
	 * @param {Mixed} value value to test
	 * @return {Boolean} true if `value` is not a number, false otherwise
	 * @api public
	 */
	
	is.nan = function (value) {
	  return !is.number(value) || value !== value;
	};
	
	/**
	 * is.even
	 * Test if `value` is an even number.
	 *
	 * @param {Number} value value to test
	 * @return {Boolean} true if `value` is an even number, false otherwise
	 * @api public
	 */
	
	is.even = function (value) {
	  return is.infinite(value) || (is.number(value) && value === value && value % 2 === 0);
	};
	
	/**
	 * is.odd
	 * Test if `value` is an odd number.
	 *
	 * @param {Number} value value to test
	 * @return {Boolean} true if `value` is an odd number, false otherwise
	 * @api public
	 */
	
	is.odd = function (value) {
	  return is.infinite(value) || (is.number(value) && value === value && value % 2 !== 0);
	};
	
	/**
	 * is.ge
	 * Test if `value` is greater than or equal to `other`.
	 *
	 * @param {Number} value value to test
	 * @param {Number} other value to compare with
	 * @return {Boolean}
	 * @api public
	 */
	
	is.ge = function (value, other) {
	  if (isActualNaN(value) || isActualNaN(other)) {
	    throw new TypeError('NaN is not a valid value');
	  }
	  return !is.infinite(value) && !is.infinite(other) && value >= other;
	};
	
	/**
	 * is.gt
	 * Test if `value` is greater than `other`.
	 *
	 * @param {Number} value value to test
	 * @param {Number} other value to compare with
	 * @return {Boolean}
	 * @api public
	 */
	
	is.gt = function (value, other) {
	  if (isActualNaN(value) || isActualNaN(other)) {
	    throw new TypeError('NaN is not a valid value');
	  }
	  return !is.infinite(value) && !is.infinite(other) && value > other;
	};
	
	/**
	 * is.le
	 * Test if `value` is less than or equal to `other`.
	 *
	 * @param {Number} value value to test
	 * @param {Number} other value to compare with
	 * @return {Boolean} if 'value' is less than or equal to 'other'
	 * @api public
	 */
	
	is.le = function (value, other) {
	  if (isActualNaN(value) || isActualNaN(other)) {
	    throw new TypeError('NaN is not a valid value');
	  }
	  return !is.infinite(value) && !is.infinite(other) && value <= other;
	};
	
	/**
	 * is.lt
	 * Test if `value` is less than `other`.
	 *
	 * @param {Number} value value to test
	 * @param {Number} other value to compare with
	 * @return {Boolean} if `value` is less than `other`
	 * @api public
	 */
	
	is.lt = function (value, other) {
	  if (isActualNaN(value) || isActualNaN(other)) {
	    throw new TypeError('NaN is not a valid value');
	  }
	  return !is.infinite(value) && !is.infinite(other) && value < other;
	};
	
	/**
	 * is.within
	 * Test if `value` is within `start` and `finish`.
	 *
	 * @param {Number} value value to test
	 * @param {Number} start lower bound
	 * @param {Number} finish upper bound
	 * @return {Boolean} true if 'value' is is within 'start' and 'finish'
	 * @api public
	 */
	is.within = function (value, start, finish) {
	  if (isActualNaN(value) || isActualNaN(start) || isActualNaN(finish)) {
	    throw new TypeError('NaN is not a valid value');
	  } else if (!is.number(value) || !is.number(start) || !is.number(finish)) {
	    throw new TypeError('all arguments must be numbers');
	  }
	  var isAnyInfinite = is.infinite(value) || is.infinite(start) || is.infinite(finish);
	  return isAnyInfinite || (value >= start && value <= finish);
	};
	
	/**
	 * Test object.
	 */
	
	/**
	 * is.object
	 * Test if `value` is an object.
	 *
	 * @param {Mixed} value value to test
	 * @return {Boolean} true if `value` is an object, false otherwise
	 * @api public
	 */
	
	is.object = function (value) {
	  return toStr.call(value) === '[object Object]';
	};
	
	/**
	 * is.hash
	 * Test if `value` is a hash - a plain object literal.
	 *
	 * @param {Mixed} value value to test
	 * @return {Boolean} true if `value` is a hash, false otherwise
	 * @api public
	 */
	
	is.hash = function (value) {
	  return is.object(value) && value.constructor === Object && !value.nodeType && !value.setInterval;
	};
	
	/**
	 * Test regexp.
	 */
	
	/**
	 * is.regexp
	 * Test if `value` is a regular expression.
	 *
	 * @param {Mixed} value value to test
	 * @return {Boolean} true if `value` is a regexp, false otherwise
	 * @api public
	 */
	
	is.regexp = function (value) {
	  return toStr.call(value) === '[object RegExp]';
	};
	
	/**
	 * Test string.
	 */
	
	/**
	 * is.string
	 * Test if `value` is a string.
	 *
	 * @param {Mixed} value value to test
	 * @return {Boolean} true if 'value' is a string, false otherwise
	 * @api public
	 */
	
	is.string = function (value) {
	  return toStr.call(value) === '[object String]';
	};
	
	/**
	 * Test base64 string.
	 */
	
	/**
	 * is.base64
	 * Test if `value` is a valid base64 encoded string.
	 *
	 * @param {Mixed} value value to test
	 * @return {Boolean} true if 'value' is a base64 encoded string, false otherwise
	 * @api public
	 */
	
	is.base64 = function (value) {
	  return is.string(value) && (!value.length || base64Regex.test(value));
	};
	
	/**
	 * Test base64 string.
	 */
	
	/**
	 * is.hex
	 * Test if `value` is a valid hex encoded string.
	 *
	 * @param {Mixed} value value to test
	 * @return {Boolean} true if 'value' is a hex encoded string, false otherwise
	 * @api public
	 */
	
	is.hex = function (value) {
	  return is.string(value) && (!value.length || hexRegex.test(value));
	};
	
	/**
	 * is.symbol
	 * Test if `value` is an ES6 Symbol
	 *
	 * @param {Mixed} value value to test
	 * @return {Boolean} true if `value` is a Symbol, false otherise
	 * @api public
	 */
	
	is.symbol = function (value) {
	  return typeof Symbol === 'function' && toStr.call(value) === '[object Symbol]' && typeof symbolValueOf.call(value) === 'symbol';
	};


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map