/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
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
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 12);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      } else {
        // At least give some kind of context to the user
        var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
        err.context = er;
        throw err;
      }
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    args = Array.prototype.slice.call(arguments, 1);
    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else if (listeners) {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.prototype.listenerCount = function(type) {
  if (this._events) {
    var evlistener = this._events[type];

    if (isFunction(evlistener))
      return 1;
    else if (evlistener)
      return evlistener.length;
  }
  return 0;
};

EventEmitter.listenerCount = function(emitter, type) {
  return emitter.listenerCount(type);
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Asset_1 = __webpack_require__(21);
exports.Asset = Asset_1.Asset;
var AssetType_1 = __webpack_require__(22);
exports.AssetType = AssetType_1.AssetType;
var AssetState_1 = __webpack_require__(23);
exports.AssetState = AssetState_1.AssetState;
var AssetFactory_1 = __webpack_require__(24);
exports.AssetFactory = AssetFactory_1.AssetFactory;
var AssetLoader_1 = __webpack_require__(25);
exports.AssetLoader = AssetLoader_1.AssetLoader;
var AudioLoader_1 = __webpack_require__(26);
exports.AudioLoader = AudioLoader_1.AudioLoader;
var ImageLoader_1 = __webpack_require__(27);
exports.ImageLoader = ImageLoader_1.ImageLoader;
var JSONLoader_1 = __webpack_require__(28);
exports.JSONLoader = JSONLoader_1.JSONLoader;
var TextAssetBuilder_1 = __webpack_require__(29);
exports.TextAssetBuilder = TextAssetBuilder_1.TextAssetBuilder;
var Spritesheet_1 = __webpack_require__(30);
exports.Spritesheet = Spritesheet_1.Spritesheet;
var Animation_1 = __webpack_require__(31);
exports.Animation = Animation_1.Animation;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var SeverityEnum_1 = __webpack_require__(4);
exports.SeverityEnum = SeverityEnum_1.SeverityEnum;
var Camera_1 = __webpack_require__(14);
exports.Camera = Camera_1.Camera;
var IDGenerator_1 = __webpack_require__(15);
exports.IDGenerator = IDGenerator_1.IDGenerator;
var Iterator_1 = __webpack_require__(16);
exports.Iterator = Iterator_1.Iterator;
var LogManager_1 = __webpack_require__(17);
exports.LogManager = LogManager_1.LogManager;
var ViewPort_1 = __webpack_require__(18);
exports.ViewPort = ViewPort_1.ViewPort;
var CollisionEmitter_1 = __webpack_require__(19);
exports.CollisionEmitter = CollisionEmitter_1.CollisionEmitter;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var LogicEngine_1 = __webpack_require__(33);
exports.LogicEngine = LogicEngine_1.LogicEngine;
var GroupLogicEngine_1 = __webpack_require__(34);
exports.GroupLogicEngine = GroupLogicEngine_1.GroupLogicEngine;
var RenderingEngine_1 = __webpack_require__(35);
exports.RenderingEngine = RenderingEngine_1.RenderingEngine;
var TwoDimensionalRenderingEngine_1 = __webpack_require__(36);
exports.TwoDimensionalRenderingEngine = TwoDimensionalRenderingEngine_1.TwoDimensionalRenderingEngine;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var SeverityEnum;
(function (SeverityEnum) {
    SeverityEnum[SeverityEnum["DEBUG"] = 0] = "DEBUG";
    SeverityEnum[SeverityEnum["INFO"] = 1] = "INFO";
    SeverityEnum[SeverityEnum["WARNING"] = 2] = "WARNING";
    SeverityEnum[SeverityEnum["ERROR"] = 3] = "ERROR";
})(SeverityEnum = exports.SeverityEnum || (exports.SeverityEnum = {}));


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = __webpack_require__(2);
var assets_1 = __webpack_require__(1);
var assetFactory = assets_1.AssetFactory.getSingleton();
var AudioEngine = (function () {
    function AudioEngine() {
        this._audioMap = {};
        this.logManager = utils_1.LogManager.getSingleton();
    }
    AudioEngine.prototype.addAudio = function (name, audio, channels) {
        if (audio.getType() !== assets_1.AssetType.AUDIO) {
            throw 'AudioEngine.addAudio: Invalid Asset Type.';
        }
        this._setAudio(name, audio, channels);
    };
    AudioEngine.prototype.hasAudio = function (name) {
        var audio = this._getAudio(name);
        return (audio !== null);
    };
    AudioEngine.prototype.removeAudio = function (name) {
        var audio = this._getAudio(name);
        if (audio) {
            this._stopAudio(audio);
        }
        delete this._audioMap[name];
    };
    AudioEngine.prototype.releaseAssets = function () {
        var keys = Object.keys(this._audioMap);
        for (var i = 0, len = keys.length; i < len; i++) {
            this.removeAudio(keys[i]);
        }
    };
    AudioEngine.prototype.playAudio = function (name) {
        var audio = this._getAudio(name);
        if (audio) {
            this._playAudio(audio);
            audio.setAttribute('playing', true);
        }
    };
    AudioEngine.prototype.pauseAudio = function (name) {
        var audio = this._getAudio(name);
        if (audio) {
            this._pauseAudio(audio);
            audio.setAttribute('playing', false);
        }
    };
    AudioEngine.prototype.stopAudio = function (name) {
        var audio = this._getAudio(name);
        if (audio) {
            this._stopAudio(audio);
            audio.setAttribute('playing', false);
        }
    };
    AudioEngine.prototype.isAudioLooping = function (name) {
        var audio = this._getAudio(name);
        if (audio) {
            return this._isAudioLooping(audio);
        }
        return false;
    };
    AudioEngine.prototype.loopAudio = function (name, state) {
        var audio = this._getAudio(name);
        if (audio) {
            this._loopAudio(audio, state);
        }
    };
    AudioEngine.prototype.isAudioMuted = function (name) {
        var audio = this._getAudio(name);
        if (audio) {
            return this._isAudioMuted(audio);
        }
        return false;
    };
    AudioEngine.prototype.muteAudio = function (name, state) {
        var audio = this._getAudio(name);
        if (audio) {
            this._muteAudio(audio, state);
        }
    };
    AudioEngine.prototype.getAudioDuration = function (name) {
        var audio = this._getAudio(name);
        if (audio) {
            return this._getAudioDuration(audio);
        }
        return 0;
    };
    AudioEngine.prototype.setTimeCursor = function (name, seconds) {
        var audio = this._getAudio(name);
        if (audio) {
            this._setTimeCursor(audio, seconds);
        }
    };
    AudioEngine.prototype.getTimeCursor = function (name) {
        var audio = this._getAudio(name);
        if (audio) {
            return this._getTimeCursor(audio);
        }
        return 0;
    };
    AudioEngine.prototype.setVolume = function (name, volume) {
        var audio = this._getAudio(name);
        if (audio) {
            this._setVolume(audio, volume);
        }
    };
    AudioEngine.prototype.getVolume = function (name) {
        var audio = this._getAudio(name);
        if (audio) {
            return this._getVolume(audio);
        }
        else {
            return 0;
        }
    };
    AudioEngine.prototype._setAudio = function (name, audio, channels) {
        if (!audio) {
            this.removeAudio(name);
        }
        else {
            var channelArr = [audio];
            if (channels > 1) {
                var clone;
                for (var i = 1; i < channels; i++) {
                    clone = assetFactory.build(audio.getType(), audio.getSource());
                    channelArr.push(clone);
                }
            }
            this._audioMap[name] = channelArr;
            this._registerEvents(channelArr);
        }
    };
    AudioEngine.prototype._warnMissingAudio = function (name) {
        this.logManager.log(utils_1.SeverityEnum.WARNING, 'Audio ' + name + ' is missing from Audio Engine.');
    };
    AudioEngine.prototype._getAudio = function (name, justGiveChannel1) {
        if (this._audioMap[name]) {
            var channels = this._audioMap[name];
            if (justGiveChannel1) {
                return channels[0];
            }
            else {
                var channel;
                var asset;
                for (var i = 0, len = channels.length; i < len; i++) {
                    channel = channels[i];
                    if (!channel.getAttribute('playing')) {
                        return channel;
                    }
                }
            }
            return channels[0];
        }
        else {
            this._warnMissingAudio(name);
            return null;
        }
    };
    AudioEngine.prototype._getData = function (audio) {
        return audio.getData();
    };
    AudioEngine.prototype._attachStartEvent = function (asset) {
        if (!asset.getAttribute('startEvent')) {
            this._registerStartEvent(asset);
            asset.setAttribute('startEvent', true);
        }
    };
    AudioEngine.prototype._attachEndEvent = function (asset) {
        if (!asset.getAttribute('endEvent')) {
            this._registerEndEvent(asset);
            asset.setAttribute('endEvent', true);
        }
    };
    AudioEngine.prototype._registerEvents = function (channelArray) {
        var channel;
        for (var i = 0, len = channelArray.length; i < len; i++) {
            channel = channelArray[i];
            this._attachStartEvent(channel);
            this._attachEndEvent(channel);
        }
    };
    return AudioEngine;
}());
exports.AudioEngine = AudioEngine;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Entity_1 = __webpack_require__(7);
exports.Entity = Entity_1.Entity;
var EntityModel_1 = __webpack_require__(37);
exports.EntityModel = EntityModel_1.EntityModel;
var EntityView_1 = __webpack_require__(8);
exports.EntityView = EntityView_1.EntityView;
var EntityView2D_1 = __webpack_require__(38);
exports.EntityView2D = EntityView2D_1.EntityView2D;
var GridMap_1 = __webpack_require__(39);
exports.GridMap = GridMap_1.GridMap;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Events = __webpack_require__(0);
var assets_1 = __webpack_require__(1);
var _1 = __webpack_require__(6);
var utils_1 = __webpack_require__(2);
var Entity = (function (_super) {
    __extends(Entity, _super);
    function Entity(model) {
        var _this = _super.call(this) || this;
        var useDefaults = false;
        _this._modelCB = function (attribute, value, oldValue) {
            if (_this._notifierKeys.indexOf(attribute) > -1) {
                _this._setModified(true);
            }
            else if (_this._parent && _this._parentNotifierKeys.indexOf(attribute) > -1) {
                _this._parent._setModified(true);
            }
        };
        if (!model) {
            model = new _1.EntityModel();
            useDefaults = true;
        }
        _this.view = new _1.EntityView(model);
        _this.model = model;
        _this._children = new Array();
        _this._regions = [];
        _this._regionDimension;
        _this._regionList = {};
        _this.collisionable = false;
        _this._parent = null;
        _this._modified = false;
        _this._notifierKeys = ['width', 'height', 'color', 'texture', 'textures'];
        _this._parentNotifierKeys = ['x', 'y'];
        if (useDefaults) {
            _this._setDefaults();
        }
        return _this;
    }
    Object.defineProperty(Entity.prototype, "ID", {
        get: function () {
            return this._model.ID;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Entity.prototype, "parent", {
        get: function () {
            return this._parent;
        },
        set: function (parent) {
            this._parent = parent;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Entity.prototype, "regions", {
        get: function () {
            return this._regions;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Entity.prototype, "regionDimension", {
        get: function () {
            return this._regionDimension;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Entity.prototype, "type", {
        get: function () {
            return this._model.type;
        },
        set: function (type) {
            this._model.type = type;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Entity.prototype, "model", {
        get: function () {
            return this._model;
        },
        set: function (model) {
            var view = this.view;
            var oldModel = this.model;
            if (oldModel) {
                oldModel.removeListener(1..toString(), this._modelCB);
            }
            this._model = model;
            model.on(1..toString(), this._modelCB);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Entity.prototype, "height", {
        get: function () {
            return this.model.getAttribute('height');
        },
        set: function (height) {
            this.model.setAttribute('height', height);
            this._generateRegions();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Entity.prototype, "width", {
        get: function () {
            return this.model.getAttribute('width');
        },
        set: function (width) {
            this.model.setAttribute('width', width);
            this._generateRegions();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Entity.prototype, "x", {
        get: function () {
            return this.model.getAttribute('x');
        },
        set: function (x) {
            var oldCoordinates = { x: this.x, y: this.y };
            this.model.setAttribute('x', x);
            var newCoordinates = { x: this.x, y: this.y };
            if (this.parent) {
                this.parent._updateChildsRegion(this);
            }
            var eventData = {
                type: 0..toString(),
                oldCoordinates: oldCoordinates,
                newCoordinates: newCoordinates,
                source: this
            };
            if (!this._eventEmitted) {
                this._eventEmitted = true;
                this.emit(0..toString(), eventData);
                this._eventEmitted = false;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Entity.prototype, "coordinate", {
        set: function (coordinate) {
            var oldCoordinates = { x: this.x, y: this.y };
            this.model.setAttribute('x', coordinate.x);
            this.model.setAttribute('y', coordinate.y);
            var newCoordinates = { x: this.x, y: this.y };
            if (this.parent) {
                this.parent._updateChildsRegion(this);
            }
            var eventData = {
                type: 0..toString(),
                oldCoordinates: oldCoordinates,
                newCoordinates: newCoordinates,
                source: this
            };
            this.emit(0..toString(), eventData);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Entity.prototype, "x2", {
        get: function () {
            return this.x + this.width;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Entity.prototype, "y", {
        get: function () {
            return this.model.getAttribute('y');
        },
        set: function (y) {
            var oldCoordinates = { x: this.x, y: this.y };
            this.model.setAttribute('y', y);
            var newCoordinates = { x: this.x, y: this.y };
            if (this.parent) {
                this.parent._updateChildsRegion(this);
            }
            var eventData = {
                type: 0..toString(),
                oldCoordinates: oldCoordinates,
                newCoordinates: newCoordinates,
                source: this
            };
            if (!this._eventEmitted) {
                this._eventEmitted = true;
                this.emit(0..toString(), eventData);
                this._eventEmitted = false;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Entity.prototype, "y2", {
        get: function () {
            return this.y + this.height;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Entity.prototype, "z", {
        get: function () {
            return this.model.getAttribute('z');
        },
        set: function (z) {
            this.model.setAttribute('z', z);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Entity.prototype, "visible", {
        get: function () {
            return this.model.getAttribute('visible');
        },
        set: function (state) {
            this.model.setAttribute('visible', state);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Entity.prototype, "color", {
        get: function () {
            var data = this.model.getAttribute('color');
            return data;
        },
        set: function (color) {
            this.model.setAttribute('color', color);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Entity.prototype, "texture", {
        get: function () {
            return this.model.texture;
        },
        set: function (asset) {
            if (asset.getType() !== assets_1.AssetType.IMAGE) {
                throw new Error('Texture asset must be of type IMAGE.');
            }
            this.model.texture = asset;
            this._setModified(true);
        },
        enumerable: true,
        configurable: true
    });
    Entity.prototype.isModified = function () {
        return this._modified;
    };
    Entity.prototype.addChild = function (child) {
        var parent = child.parent;
        if (parent) {
            parent.removeChild(child);
        }
        this._children.push(child);
        child.parent = this;
        this._putChildInRegion(child);
    };
    Entity.prototype.removeChild = function (child) {
        if (this.isChild(child)) {
            var idx = this.indexOf(child);
            this._children.splice(idx, 1);
        }
        this._removeChildFromRegions(child);
        delete this._regionList[child.ID];
    };
    Entity.prototype.removeAllChildren = function () {
        var child;
        while (child = this.getChildAt(0)) {
            this.removeChild(child);
        }
    };
    Entity.prototype.isChild = function (child) {
        return (this.indexOf(child) > -1);
    };
    Entity.prototype.indexOf = function (child) {
        return this._children.indexOf(child);
    };
    Entity.prototype.childCount = function () {
        return this._children.length;
    };
    Entity.prototype.getChildAt = function (index) {
        return this._children[index];
    };
    Entity.prototype._setModified = function (state) {
        this._modified = state;
        if (this._parent) {
            this._parent._setModified(state);
        }
    };
    Entity.prototype.iterator = function () {
        return new utils_1.Iterator(this._children);
    };
    Entity.prototype.getChildren = function (startCoordinate, endCoordinate) {
        if (startCoordinate && endCoordinate) {
            var startRegion = this._coordinateToRegion(startCoordinate);
            var endRegion = this._coordinateToRegion(endCoordinate);
            var children = [];
            for (var x = startRegion.x; x <= endRegion.x; x++) {
                for (var y = startRegion.y; y <= endRegion.y; y++) {
                    children = children.concat(this._getChildrenInRegion({ x: x, y: y }));
                }
            }
            return new utils_1.Iterator(children);
        }
        else if (startCoordinate) {
            var region = this._coordinateToRegion(startCoordinate);
            var children = [];
            var childrenIterator = new utils_1.Iterator(this._getChildrenInRegion({ x: region.x, y: region.y }));
            while (childrenIterator.hasNext()) {
                var child = childrenIterator.next();
                var childCoordinate = child.getCoordinate();
                var childOuterCoordinate = child.getOuterCoordinate();
                if (childCoordinate.x <= startCoordinate.x && childCoordinate.y <= startCoordinate.y
                    && childOuterCoordinate.x >= startCoordinate.x && childOuterCoordinate.y >= startCoordinate.y) {
                    children.push(child);
                }
            }
            return new utils_1.Iterator(children);
        }
        else {
            return new utils_1.Iterator(this._children);
        }
    };
    Entity.prototype.findChildren = function (startCoordinate, endCoordinate) {
        var children = [];
        if (this._children.length > 0) {
            if (startCoordinate && !endCoordinate) {
                var region = this._coordinateToRegion(startCoordinate);
                var regionChildren = this._getChildrenInRegion({ x: region.x, y: region.y });
                if (regionChildren.length > 0) {
                    var childrenIterator = new utils_1.Iterator(regionChildren);
                    while (childrenIterator.hasNext()) {
                        var iterChild = childrenIterator.next();
                        var childCoordinate = iterChild.getCoordinate();
                        var childOuterCoordinate = iterChild.getOuterCoordinate();
                        if (childCoordinate.x <= startCoordinate.x && childCoordinate.y <= startCoordinate.y
                            && childOuterCoordinate.x >= startCoordinate.x && childOuterCoordinate.y >= startCoordinate.y) {
                            children.push(iterChild);
                            var deeperChildren = iterChild.findChildren({ x: startCoordinate.x - childCoordinate.x, y: startCoordinate.y - childCoordinate.y });
                            if (deeperChildren) {
                                children = children.concat(deeperChildren);
                            }
                        }
                    }
                }
            }
            else if (startCoordinate && endCoordinate) {
                var startRegion = this._coordinateToRegion(startCoordinate);
                var endRegion = this._coordinateToRegion(endCoordinate);
                var childrenVisited = [];
                for (var x = startRegion.x; x <= endRegion.x; x++) {
                    for (var y = startRegion.y; y <= endRegion.y; y++) {
                        var regionChildren = this._getChildrenInRegion({ x: x, y: y });
                        for (var regionChildI in regionChildren) {
                            var regionChild = regionChildren[regionChildI];
                            if (childrenVisited.indexOf(regionChild) === -1) {
                                childrenVisited.push(regionChild);
                                var childCoordinate = regionChild.getCoordinate();
                                var childOuterCoordinate = regionChild.getOuterCoordinate();
                                var xCollission = false;
                                var yCollision = false;
                                if ((startCoordinate.x < childOuterCoordinate.x && endCoordinate.x > childCoordinate.x)
                                    || (endCoordinate.x > childCoordinate.x && startCoordinate.x < childOuterCoordinate.x)) {
                                    xCollission = true;
                                }
                                if ((startCoordinate.y < childOuterCoordinate.y && endCoordinate.y > childCoordinate.y)
                                    || (endCoordinate.y > childCoordinate.y && startCoordinate.y < childOuterCoordinate.y)) {
                                    yCollision = true;
                                }
                                if (xCollission && yCollision) {
                                    children.push(regionChild);
                                    var deeperChildren = regionChild.findChildren({ x: startCoordinate.x - childCoordinate.x, y: startCoordinate.y - childCoordinate.y }, { x: endCoordinate.x - childOuterCoordinate.x, y: endCoordinate.y - childOuterCoordinate.y });
                                    if (deeperChildren) {
                                        children = children.concat(deeperChildren);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return children;
    };
    Entity.prototype.findTopChildAt = function (coordinate) {
        var child = false;
        var region = this._coordinateToRegion(coordinate);
        var regionChildren = this._getChildrenInRegion({ x: region.x, y: region.y });
        var childrenIterator = new utils_1.Iterator(regionChildren);
        childrenIterator.setToEnd();
        while (childrenIterator.hasPrev() && !child) {
            var iterChild = childrenIterator.prev();
            var childCoordinate = iterChild.getCoordinate();
            var childOuterCoordinate = iterChild.getOuterCoordinate();
            if (childCoordinate.x <= coordinate.x && childCoordinate.y <= coordinate.y
                && childOuterCoordinate.x >= coordinate.x && childOuterCoordinate.y >= coordinate.y) {
                child = iterChild;
                var deeperChild = iterChild.findTopChildAt({ x: coordinate.x - childCoordinate.x, y: coordinate.y - childCoordinate.y });
                if (deeperChild) {
                    child = deeperChild;
                }
            }
        }
        return child;
    };
    Entity.prototype.getCoordinate = function () {
        return { x: this.x, y: this.y };
    };
    Entity.prototype.getOuterCoordinate = function () {
        return { x: this.x2, y: this.y2 };
    };
    Entity.prototype.getAbsoluteY = function () {
        var entity = this;
        var y = 0;
        while (entity) {
            y += entity.y;
            entity = entity.parent;
        }
        return y;
    };
    Entity.prototype.getAbsoluteY2 = function () {
        return this.getAbsoluteY() + this.height;
    };
    Entity.prototype.getAbsoluteX = function () {
        var entity = this;
        var x = 0;
        while (entity) {
            x += entity.x;
            entity = entity.parent;
        }
        return x;
    };
    Entity.prototype.getAbsoluteX2 = function () {
        return this.getAbsoluteX() + this.width;
    };
    Entity.prototype.setLocation = function (coordinate) {
        this.x = coordinate.x;
        this.y = coordinate.y;
    };
    Entity.prototype.getLocation = function () {
        return {
            x: this.x,
            y: this.y
        };
    };
    Entity.prototype.setSize = function (dimension) {
        this._setModified(true);
        this.width = dimension.width;
        this.height = dimension.height;
    };
    Entity.prototype.getSize = function () {
        return { width: this.width, height: this.height };
    };
    Entity.prototype._setDefaults = function () {
        this.setLocation({ x: 0, y: 0 });
        this.setSize({ width: 0, height: 0 });
        this.visible = true;
    };
    Entity.prototype._generateRegions = function () {
        this._regions = [];
        this._regionList = {};
        if (this.width <= 100) {
            var regionWidth = this.width / 2;
        }
        else {
            var regionWidth = 50;
        }
        if (this.height <= 100) {
            var regionHeight = this.height / 2;
        }
        else {
            var regionHeight = 50;
        }
        this._regionDimension = { width: regionWidth, height: regionHeight };
        var xCount = Math.ceil(this.width / regionWidth);
        var yCount = Math.ceil(this.height / regionHeight);
        for (var x = 0; x < xCount; x++) {
            this._regions[x] = [];
            for (var y = 0; y < yCount; y++) {
                this._regions[x][y] = [];
            }
        }
        var childrenIterator = this.iterator();
        while (childrenIterator.hasNext()) {
            this._putChildInRegion(childrenIterator.next());
        }
    };
    Entity.prototype._putChildInRegion = function (child) {
        var startRegion = this._coordinateToRegion({ x: child.x, y: child.y });
        var endRegion = this._coordinateToRegion({ x: child.x2, y: child.y2 });
        this._regionList[child.ID] = [];
        if (!isNaN(startRegion.x) && !isNaN(startRegion.y) && !isNaN(endRegion.x) && !isNaN(endRegion.y)) {
            for (var x = startRegion.x; x <= endRegion.x; x++) {
                if (this._regions[x]) {
                    for (var y = startRegion.y; y <= endRegion.y; y++) {
                        if (this._regions[x][y]) {
                            this._regions[x][y].push(child);
                            this._regionList[child.ID].push({ x: x, y: y });
                        }
                    }
                }
            }
        }
        else {
        }
    };
    Entity.prototype._getChildrenInRegion = function (regionCoordinate) {
        if (this._regions[regionCoordinate.x] && this._regions[regionCoordinate.x][regionCoordinate.y]) {
            return this._regions[regionCoordinate.x][regionCoordinate.y];
        }
        else {
            return [];
        }
    };
    Entity.prototype._removeChildFromRegions = function (child) {
        if (this._regionList[child.ID]) {
            for (var i in this._regionList[child.ID]) {
                var coord = this._regionList[child.ID][i];
                this._regions[coord.x][coord.y].splice(this._regions[coord.x][coord.y].indexOf(child), 1);
            }
        }
    };
    Entity.prototype._updateChildsRegion = function (child) {
        this._removeChildFromRegions(child);
        this._putChildInRegion(child);
    };
    Entity.prototype._coordinateToRegion = function (coordinate) {
        var x = Math.floor(coordinate.x / this._regionDimension.width);
        var y = Math.floor(coordinate.y / this._regionDimension.height);
        return { x: x, y: y };
    };
    return Entity;
}(Events.EventEmitter));
exports.Entity = Entity;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Events = __webpack_require__(0);
var EntityView = (function (_super) {
    __extends(EntityView, _super);
    function EntityView(model) {
        var _this = _super.call(this) || this;
        _this._visible = true;
        _this._model = model;
        _this._bindedFuncs = {};
        _this._attachEvents();
        return _this;
    }
    Object.defineProperty(EntityView.prototype, "visible", {
        get: function () {
            return this._visible;
        },
        set: function (visible) {
            this._visible = visible;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EntityView.prototype, "model", {
        set: function (model) {
            if (this._model) {
                this._detachEvents();
            }
            this._model = model;
            this._attachEvents();
        },
        enumerable: true,
        configurable: true
    });
    EntityView.prototype._handleAttrChange = function (e) {
    };
    EntityView.prototype._attachEvents = function () {
        this._model.on(1..toString(), (this._bindedFuncs[1..toString()] = this._handleAttrChange.bind(this)));
    };
    EntityView.prototype._detachEvents = function () {
        this._model.removeListener(1..toString(), this._bindedFuncs[1..toString()]);
    };
    return EntityView;
}(Events.EventEmitter));
exports.EntityView = EntityView;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var SeverityEnum;
(function (SeverityEnum) {
    SeverityEnum[SeverityEnum["DEBUG"] = 0] = "DEBUG";
    SeverityEnum[SeverityEnum["INFO"] = 1] = "INFO";
    SeverityEnum[SeverityEnum["WARNING"] = 2] = "WARNING";
    SeverityEnum[SeverityEnum["ERROR"] = 3] = "ERROR";
})(SeverityEnum = exports.SeverityEnum || (exports.SeverityEnum = {}));


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Events = __webpack_require__(0);
var GamePad = (function (_super) {
    __extends(GamePad, _super);
    function GamePad(id) {
        var _this = _super.call(this) || this;
        _this._pollRate = 15;
        _this._buttons = [];
        _this._axes = [];
        _this._gamePadID = id;
        var gamePad = navigator.getGamepads()[id];
        for (var i = 0; i < gamePad.buttons.length; i++) {
            _this._buttons.push(gamePad.buttons[i].value);
        }
        for (var i = 0; i < gamePad.axes.length; i++) {
            _this._axes.push(gamePad.axes[i]);
        }
        _this._initializePolling();
        return _this;
    }
    GamePad.prototype.getAxis = function (index) {
        return this._axes[index];
    };
    GamePad.prototype.setPollRate = function (pollRate) {
        this._pollRate = pollRate;
        this._initializePolling();
    };
    GamePad.prototype._initializePolling = function () {
        if (this._pollTimer) {
            clearInterval(this._pollTimer);
        }
        this._pollTimer = setInterval(this._poll.bind(this), this._pollRate);
    };
    GamePad.prototype._poll = function () {
        var gamePad = navigator.getGamepads()[this._gamePadID];
        if (!gamePad) {
            this._disconnect();
            return null;
        }
        for (var i = 0; i < gamePad.buttons.length; i++) {
            if (gamePad.buttons[i].value != this._buttons[i]) {
                this._buttons[i] = gamePad.buttons[i].value;
                var e = {
                    source: this,
                    type: "BUTTONVALUECHANGE",
                    value: gamePad.buttons[i].value,
                    id: i
                };
                this.emit("BUTTONVALUECHANGE", e);
            }
        }
        for (var i = 0; i < gamePad.axes.length; i++) {
            if (gamePad.axes[i] != this._axes[i]) {
                this._axes[i] = gamePad.axes[i];
                var e = {
                    source: this,
                    type: "AXISVALUECHANGE",
                    value: gamePad.axes[i],
                    id: i
                };
                this.emit("AXISVALUECHANGE", e);
            }
        }
    };
    GamePad.prototype._disconnect = function () {
        clearInterval(this._pollTimer);
        var e = {
            source: this,
            type: "AXISVALUECHANGE"
        };
        this.emit("DISCONNECT", e);
    };
    return GamePad;
}(Events.EventEmitter));
exports.GamePad = GamePad;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Events = __webpack_require__(0);
;
;
var Touch = (function (_super) {
    __extends(Touch, _super);
    function Touch(nTouch) {
        var _this = _super.call(this) || this;
        _this._id = nTouch.identifier;
        _this._x = nTouch.pageX;
        _this._y = nTouch.pageY;
        window.addEventListener("touchmove", _this._touchMoveListener = _this._onTouchMove.bind(_this));
        window.addEventListener("touchend", _this._touchEndListener = _this._onTouchEnd.bind(_this));
        return _this;
    }
    Touch.prototype.getID = function () {
        return this._id;
    };
    Touch.prototype.getX = function () {
        return this._x;
    };
    Touch.prototype.getY = function () {
        return this._y;
    };
    Touch.prototype._onTouchEnd = function (e) {
        for (var i = 0; i < e.changedTouches.length; i++) {
            var nTouch = e.changedTouches.item(i);
            if (nTouch.identifier === this._id) {
                this._disconnect();
            }
        }
    };
    Touch.prototype._onTouchMove = function (e) {
        for (var i = 0; i < e.changedTouches.length; i++) {
            var nTouch = e.changedTouches.item(i);
            if (nTouch.identifier === this._id && (nTouch.pageX != this._x || nTouch.pageY != this._y)) {
                this._x = nTouch.pageX;
                this._y = nTouch.pageY;
                var e_1 = {
                    type: "TOUCHMOVED",
                    source: this,
                    position: {
                        x: this._x,
                        y: this._y
                    }
                };
                this.emit("TOUCHMOVED", e_1);
            }
        }
    };
    Touch.prototype._disconnect = function () {
        var e = {
            source: this,
            type: "TOUCHREMOVED"
        };
        this.emit("TOUCHREMOVED", e);
        window.removeEventListener("touchmove", this._touchMoveListener);
        window.removeEventListener("touchend", this._touchEndListener);
    };
    return Touch;
}(Events.EventEmitter));
exports.Touch = Touch;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Engine_1 = __webpack_require__(13);
var src_1 = __webpack_require__(3);
var src_2 = __webpack_require__(6);
var src_3 = __webpack_require__(40);
var _1 = __webpack_require__(47);
var TouchDemo = (function (_super) {
    __extends(TouchDemo, _super);
    function TouchDemo() {
        var _this = _super.call(this) || this;
        _this.viewPort.autoSize = true;
        _this.renderingEngine = new src_1.TwoDimensionalRenderingEngine();
        _this.logicEngine = new src_1.GroupLogicEngine();
        _this._container = new src_2.Entity();
        _this._container.color = { r: 0, g: 0, b: 0 };
        console.log(_this.viewPort.canvas.offsetWidth);
        _this._container.width = 1000;
        _this._container.height = 1000;
        _this._camera = new src_3.Camera(_this._container, null, { width: _this._container.width, height: _this._container.height }, null, { height: _this._container.height, width: _this._container.width });
        _this.renderingEngine.addCamera(_this._camera);
        _this.viewPort.on(0..toString(), _this._viewPortUpdated.bind(_this));
        _this.logicEngine.addLogic("touch", _this._touch.bind(_this), 25);
        var touchListener = _1.TouchListener.getInstance();
        touchListener.on("TOUCHADDED", function (touch) {
            console.log("New Touch added with an ID of ", touch.getID());
            var block = new src_2.Entity();
            block.x = touch.getX() - 25;
            block.y = touch.getY() - 25;
            block.color = { r: Math.floor((Math.random() * 255) + 1), g: Math.floor((Math.random() * 255) + 1), b: Math.floor((Math.random() * 255) + 1) };
            block.width = 50;
            block.height = 50;
            _this._container.addChild(block);
            touch.on("TOUCHMOVED", function (e) {
                console.log("Touch moved");
                var position = e.position;
                block.x = position.x - 25;
                block.y = position.y - 25;
            });
            touch.on("TOUCHREMOVED", function (touch) {
                console.log("Touch removed");
                _this._container.removeChild(block);
            });
        });
        return _this;
    }
    TouchDemo.prototype._viewPortUpdated = function (event) {
        this._container.width = event.newDimensions.width;
        this._container.height = event.newDimensions.height;
        this._camera.fov = { width: event.newDimensions.width, height: event.newDimensions.height };
        this._camera.renderDimension = { width: event.newDimensions.width, height: event.newDimensions.height };
    };
    TouchDemo.prototype._touch = function () {
    };
    return TouchDemo;
}(Engine_1.default));
window.TouchDemo = new TouchDemo();


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = __webpack_require__(2);
var audio_1 = __webpack_require__(20);
var assets_1 = __webpack_require__(1);
var Engine = (function () {
    function Engine() {
        this.debugMode = false;
        this.logManager = utils_1.LogManager.getSingleton();
        this.assetFactory = assets_1.AssetFactory.getSingleton();
        this.audioEngine = new audio_1.HTML5AudioEngine();
        this.viewPort = new utils_1.ViewPort();
        this.logManager.log(utils_1.SeverityEnum.INFO, 'Engine has started.');
    }
    Object.defineProperty(Engine.prototype, "renderingEngine", {
        get: function () {
            return this._renderingEngine;
        },
        set: function (renderingEngine) {
            if (this.renderingEngine) {
            }
            this._renderingEngine = renderingEngine;
            this._renderingEngine.viewPort = this.viewPort;
            this._renderingEngine.startRendering();
        },
        enumerable: true,
        configurable: true
    });
    return Engine;
}());
exports.Engine = Engine;
exports.default = Engine;


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Camera = (function () {
    function Camera(scene, viewPoint, fov, renderOrigin, renderDimension) {
        this.scene = scene;
        this.viewPoint = viewPoint || { x: 0, y: 0 };
        this.fov = fov || { width: 100, height: 100 };
        this.renderOrigin = renderOrigin || { x: 0, y: 0 };
        this.renderDimension = renderDimension || { width: 100, height: 100 };
    }
    return Camera;
}());
exports.Camera = Camera;


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var IDGenerator = (function () {
    function IDGenerator() {
    }
    IDGenerator.prototype.generate = function () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };
    IDGenerator.getSingleton = function () {
        if (!IDGenerator._instance) {
            IDGenerator._instance = new IDGenerator();
        }
        return IDGenerator._instance;
    };
    return IDGenerator;
}());
exports.IDGenerator = IDGenerator;


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Iterator = (function () {
    function Iterator(array) {
        this._array = array;
        this._index = -1;
        this._length = array.length;
    }
    Iterator.prototype.hasNext = function () {
        if (this._array[this._index + 1]) {
            return true;
        }
        else {
            return false;
        }
    };
    Iterator.prototype.next = function () {
        this._index += 1;
        return this._array[this._index];
    };
    Iterator.prototype.hasPrev = function () {
        if (this._array[this._index - 1]) {
            return true;
        }
        else {
            return false;
        }
    };
    Iterator.prototype.prev = function () {
        this._index -= 1;
        return this._array[this._index];
    };
    Iterator.prototype.setToBeginning = function () {
        this._index = -1;
    };
    Iterator.prototype.setToEnd = function () {
        this._index = this._array.length;
    };
    Iterator.prototype.getFirst = function () {
        return this._array[0];
    };
    Iterator.prototype.getLast = function () {
        return this._array[this._array.length - 1];
    };
    return Iterator;
}());
exports.Iterator = Iterator;


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var SeverityEnum_1 = __webpack_require__(4);
var LogManager = (function () {
    function LogManager() {
        this._logLevel = SeverityEnum_1.SeverityEnum.WARNING | SeverityEnum_1.SeverityEnum.ERROR;
        this._logLevel = this._logLevel | SeverityEnum_1.SeverityEnum.DEBUG | SeverityEnum_1.SeverityEnum.INFO;
    }
    LogManager.prototype.log = function (severity, message) {
        if (this.getLogLevel() & severity) {
            switch (severity) {
                case SeverityEnum_1.SeverityEnum.DEBUG:
                    console.debug(message);
                    break;
                case SeverityEnum_1.SeverityEnum.INFO:
                    console.info(message);
                    break;
                case SeverityEnum_1.SeverityEnum.WARNING:
                    console.warn(message);
                    break;
                case SeverityEnum_1.SeverityEnum.ERROR:
                    console.error(message);
                    break;
            }
        }
    };
    LogManager.prototype.setLogLevel = function (severity) {
        this._logLevel = severity;
        this._logLevel = severity;
    };
    LogManager.prototype.getLogLevel = function () {
        return this._logLevel;
    };
    LogManager.getSingleton = function () {
        if (!LogManager._instance) {
            LogManager._instance = new LogManager();
        }
        return LogManager._instance;
    };
    LogManager._instance = new LogManager();
    return LogManager;
}());
exports.LogManager = LogManager;


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Events = __webpack_require__(0);
var ViewPort = (function (_super) {
    __extends(ViewPort, _super);
    function ViewPort() {
        var _this = _super.call(this) || this;
        _this.canvas = document.createElement('canvas');
        _this.context = _this.canvas.getContext('2d');
        _this.resizable = false;
        _this._dimension = { width: 0, height: 0 };
        _this.autoSize = false;
        return _this;
    }
    ViewPort.prototype.setScale = function (dimension) {
        this.context.scale(dimension.width, dimension.height);
    };
    Object.defineProperty(ViewPort.prototype, "autoSize", {
        get: function () {
            return this._autoSize;
        },
        set: function (state) {
            var _this = this;
            if (this._autoSizeTimer) {
                clearInterval(this._autoSizeTimer);
            }
            if (state) {
                this._checkForParentSizeChange();
                this._autoSizeTimer = setInterval(function () {
                    _this._checkForParentSizeChange();
                }, 100);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ViewPort.prototype, "size", {
        get: function () {
            return { width: this.canvas.offsetWidth, height: this.canvas.offsetHeight };
        },
        set: function (dimension) {
            this._dimension = dimension;
            this.canvas.setAttribute('width', dimension.width + "px");
            this.canvas.setAttribute('height', dimension.height + "px");
            this.emit('resize', dimension);
        },
        enumerable: true,
        configurable: true
    });
    ViewPort.prototype.clear = function () {
        this.context.clearRect(0, 0, this._dimension.width, this._dimension.height);
    };
    ViewPort.prototype.drawImage = function (img, clip_x, clip_y, clip_width, clip_height, x, y, width, height) {
        this.context.drawImage(img, clip_x, clip_y, clip_width, clip_height, x, y, width, height);
    };
    ViewPort.prototype.setFont = function (font) {
        this.context.font = font;
    };
    ViewPort.prototype.setColor = function (color) {
        this.context.fillStyle = color;
    };
    ViewPort.prototype.measureText = function (text) {
        return this.context.measureText(text);
    };
    ViewPort.prototype.setTextBaseline = function (baseline) {
        this.context.textBaseline = baseline;
    };
    ViewPort.prototype.drawText = function (text, x, y, maxWidth) {
        this.context.fillText(text, x, y, maxWidth);
    };
    ViewPort.prototype.setHidden = function () {
        this.canvas.style.position = "absolute";
        this.canvas.style.left = '110001px';
    };
    ViewPort.prototype.getImage = function () {
        var image = document.createElement('img');
        image.src = this.canvas.toDataURL("image/png");
        return image;
    };
    ViewPort.prototype._checkForParentSizeChange = function () {
        if (this.canvas.parentNode) {
            var size = this.size;
            var parent = this.canvas.parentNode;
            var parent_size = { width: parent.offsetWidth, height: parent.offsetHeight - 2 };
            if (size.width != parent_size.width || size.height != parent_size.height) {
                this.size = { width: parent_size.width, height: parent_size.height };
                var eventData = {
                    type: 0..toString(),
                    oldDimensions: size,
                    newDimensions: parent_size,
                    source: this
                };
                this.emit(0..toString(), eventData);
            }
        }
    };
    return ViewPort;
}(Events.EventEmitter));
exports.ViewPort = ViewPort;


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var CollisionEmitter = (function () {
    function CollisionEmitter() {
        this._cbs = {};
        this._entities = [];
        this._entitiesListeners = {};
        this._listeners = [];
        this._cbs[0] = this._onEntityLocationUpdate.bind(this);
    }
    CollisionEmitter.prototype.addEntity = function (entity) {
        if (!this.hasEntity(entity)) {
            this._entities.push(entity);
            this._entitiesListeners[entity.ID] = [];
            entity.on(0..toString(), this._cbs[0]);
        }
    };
    CollisionEmitter.prototype.removeEntity = function (entity) {
        if (this.hasEntity(entity)) {
            this._entities.splice(this._entities.indexOf(entity), 1);
            delete this._entitiesListeners[entity.ID];
        }
    };
    CollisionEmitter.prototype.hasEntity = function (entity) {
        return this._entitiesListeners.hasOwnProperty(entity.ID);
    };
    CollisionEmitter.prototype.addEntityCollisionListener = function (entity, callback) {
        if (!this.hasEntity(entity)) {
            this.addEntity(entity);
        }
        this._entitiesListeners[entity.ID].push(callback);
    };
    CollisionEmitter.prototype.removeEntityCollisionListener = function (entity, callback) {
        if (this._entitiesListeners[entity.ID].indexOf(callback) > -1) {
            this._entitiesListeners[entity.ID].splice(this._entitiesListeners[entity.ID].indexOf(callback), 1);
        }
    };
    CollisionEmitter.prototype.addCollisionListener = function (callback) {
        this._listeners.push(callback);
    };
    CollisionEmitter.prototype.removeCollisionListener = function (callback) {
        if (this._listeners.indexOf(callback) > -1) {
            this._listeners.splice(this._listeners.indexOf(callback), 1);
        }
    };
    CollisionEmitter.prototype._onEntityLocationUpdate = function (event) {
        var entity = event.source;
        if (entity.parent) {
            var potCollisions = entity.parent.findChildren({ x: entity.x, y: entity.y }, { x: entity.x2, y: entity.y2 });
            var collisions = [];
            for (var i in potCollisions) {
                var potEntity = potCollisions[i];
                if (potEntity != entity && this.hasEntity(potEntity)) {
                    collisions.push(potEntity);
                }
            }
            if (collisions.length > 0) {
                for (var i in this._listeners) {
                    var listener = this._listeners[i];
                    listener(entity, collisions[0], event);
                }
            }
        }
    };
    return CollisionEmitter;
}());
exports.CollisionEmitter = CollisionEmitter;


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var AudioEngine_1 = __webpack_require__(5);
exports.AudioEngine = AudioEngine_1.AudioEngine;
var HTML5AudioEngine_1 = __webpack_require__(32);
exports.HTML5AudioEngine = HTML5AudioEngine_1.HTML5AudioEngine;


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = __webpack_require__(2);
var _1 = __webpack_require__(1);
var Asset = (function () {
    function Asset(type, url) {
        this._id = utils_1.IDGenerator.getSingleton().generate();
        this._type = type;
        this._data = null;
        this.setSource(url);
        this._attributes = {};
    }
    Asset.prototype.setSource = function (source) {
        if (source !== this.getSource()) {
            this._url = source;
            this.setData(null);
            this.setState(_1.AssetState.NOT_LOADED);
        }
    };
    Asset.prototype.getSource = function () {
        return this._url;
    };
    Asset.prototype.setState = function (state) {
        if (this._state !== state) {
            this._state = state;
            this.onStateChange(this._state);
        }
    };
    Asset.prototype.getState = function () {
        return this._state;
    };
    Asset.prototype.setData = function (data) {
        this._data = data;
        this.onDataChange(this._data);
    };
    Asset.prototype.getData = function () {
        return this._data;
    };
    Asset.prototype.getType = function () {
        return this._type;
    };
    Asset.prototype.setLoadStrategy = function (loadStrategy) {
        this._loadStrategy = loadStrategy;
    };
    Asset.prototype.getLoadStrategy = function () {
        return this._loadStrategy;
    };
    Asset.prototype.load = function () {
        this._loadStrategy.load(this);
    };
    Asset.prototype.isReady = function () {
        return (this.getState() === _1.AssetState.LOADED);
    };
    Asset.prototype.setAttribute = function (key, value) {
        this._attributes[key] = value;
    };
    Asset.prototype.getAttribute = function (key) {
        return this._attributes[key];
    };
    Asset.prototype.isAttribute = function (key) {
        return !!this._attributes[key];
    };
    Asset.prototype.removeAttribute = function (key) {
        delete this._attributes[key];
    };
    Asset.prototype.onStateChange = function (state) { };
    Asset.prototype.onDataChange = function (data) { };
    Asset.prototype.onError = function (error) { };
    return Asset;
}());
exports.Asset = Asset;


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var AssetType;
(function (AssetType) {
    AssetType[AssetType["RAW"] = 0] = "RAW";
    AssetType[AssetType["IMAGE"] = 1] = "IMAGE";
    AssetType[AssetType["AUDIO"] = 2] = "AUDIO";
    AssetType[AssetType["JSON"] = 3] = "JSON";
})(AssetType = exports.AssetType || (exports.AssetType = {}));


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var AssetState;
(function (AssetState) {
    AssetState[AssetState["NOT_LOADED"] = 0] = "NOT_LOADED";
    AssetState[AssetState["LOADING"] = 1] = "LOADING";
    AssetState[AssetState["LOADED"] = 2] = "LOADED";
})(AssetState = exports.AssetState || (exports.AssetState = {}));


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var _1 = __webpack_require__(1);
var AssetFactory = (function () {
    function AssetFactory() {
        this._assetLoader = new _1.AssetLoader();
        this._audioLoader = new _1.AudioLoader();
        this._imageLoader = new _1.ImageLoader();
        this._jsonLoader = new _1.JSONLoader();
        this._cache = {};
    }
    AssetFactory.getSingleton = function () {
        if (!AssetFactory._instance) {
            AssetFactory._instance = new AssetFactory();
        }
        return AssetFactory._instance;
    };
    AssetFactory.prototype.build = function (type, url) {
        var asset;
        var cache = this._cache[url];
        if (cache) {
            asset = this._clone(cache);
        }
        else {
            asset = new _1.Asset(type, url);
        }
        if (!cache) {
            switch (type) {
                default:
                    break;
                case _1.AssetType.RAW:
                    asset.setLoadStrategy(this._assetLoader);
                    this._configureRawAsset(asset, url);
                    break;
                case _1.AssetType.IMAGE:
                    asset.setLoadStrategy(this._imageLoader);
                    this._configureImageAsset(asset, url);
                    break;
                case _1.AssetType.AUDIO:
                    asset.setLoadStrategy(this._audioLoader);
                    this._configureAudioAsset(asset, url);
                    break;
                case _1.AssetType.JSON:
                    asset.setLoadStrategy(this._jsonLoader);
                    this._configureJSONAsset(asset, url);
                    break;
            }
            this._cache[url] = asset;
        }
        return asset;
    };
    AssetFactory.prototype._configureRawAsset = function (asset, url) { };
    AssetFactory.prototype._configureImageAsset = function (asset, url) {
        var img = document.createElement('img');
        img.addEventListener('load', function () {
            asset.setState(_1.AssetState.LOADED);
        });
        asset.setData(img);
    };
    AssetFactory.prototype._configureJSONAsset = function (asset, url) { };
    AssetFactory.prototype._configureAudioAsset = function (asset, url) {
        var audio = document.createElement('audio');
        audio.addEventListener('canplaythrough', function () {
            asset.setState(_1.AssetState.LOADED);
        });
        asset.setData(audio);
    };
    AssetFactory.prototype._clone = function (asset) {
        var type = asset.getType();
        var clone = new _1.Asset(type, asset.getSource());
        this._cloneAssetData(clone, asset, type);
        return clone;
    };
    AssetFactory.prototype._cloneAssetData = function (clone, asset, type) {
        var data = null;
        switch (type) {
            default:
                data = asset.getData();
                break;
            case _1.AssetType.IMAGE:
                data = this._cloneNode(asset.getData());
                break;
            case _1.AssetType.AUDIO:
                data = this._cloneNode(asset.getData());
                break;
        }
        clone.setLoadStrategy(asset.getLoadStrategy());
        clone.setData(data);
    };
    AssetFactory.prototype._cloneNode = function (node) {
        if (node) {
            return node.cloneNode(true);
        }
        else {
            return null;
        }
    };
    return AssetFactory;
}());
exports.AssetFactory = AssetFactory;


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var _1 = __webpack_require__(1);
var AssetLoader = (function () {
    function AssetLoader() {
    }
    AssetLoader.prototype.load = function (asset) {
        var _this = this;
        var request = new XMLHttpRequest();
        var source = asset.getSource();
        if (this._validateURL(source)) {
            request.open(this._getMethod(), asset.getSource());
            asset.setState(_1.AssetState.LOADING);
            request.onreadystatechange = function (e) {
                if (request.readyState === XMLHttpRequest.DONE) {
                    if (request.status === 200) {
                        _this._onSuccess(asset, request.responseText);
                    }
                    else {
                        _this._onFail(asset, request);
                    }
                }
                _this._postRequest();
            };
            this._preRequest();
            request.send();
        }
        else {
            this._onSuccess(asset, source);
        }
    };
    AssetLoader.prototype.clone = function (asset, clone) {
        clone.setData(asset.getData());
    };
    AssetLoader.prototype._validateURL = function (url) {
        url = url.trim();
        var type = url.substring(0, 5);
        if (type === 'data:') {
            return false;
        }
        return true;
    };
    AssetLoader.prototype._getMethod = function () {
        return 'GET';
    };
    AssetLoader.prototype._preRequest = function () { };
    AssetLoader.prototype._postRequest = function () { };
    AssetLoader.prototype._onSuccess = function (asset, data) {
        asset.setData(data);
    };
    AssetLoader.prototype._onFail = function (asset, request) {
        asset.onError({
            code: request.status,
            message: 'Generic Error Message'
        });
    };
    return AssetLoader;
}());
exports.AssetLoader = AssetLoader;


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var _1 = __webpack_require__(1);
var AudioLoader = (function (_super) {
    __extends(AudioLoader, _super);
    function AudioLoader() {
        return _super.call(this) || this;
    }
    AudioLoader.prototype.load = function (asset) {
        asset.setState(_1.AssetState.LOADING);
        var audio = asset.getData();
        audio.setAttribute('preload', 'auto');
        this._assignEvents(asset, audio);
        audio.src = asset.getSource();
    };
    AudioLoader.prototype._assignEvents = function (asset, audio) {
        var canPlay = function (e) {
            asset.setData(audio);
            audio.removeEventListener('canplaythrough', canPlay);
        };
        audio.addEventListener('canplaythrough', canPlay);
        audio.addEventListener('error', function () {
            asset.onError();
        });
        audio.addEventListener('playing', function () {
            asset.setAttribute('playing', true);
        });
        audio.addEventListener('ended', function () {
            audio.currentTime = 0;
            asset.setAttribute('playing', false);
        });
    };
    return AudioLoader;
}(_1.AssetLoader));
exports.AudioLoader = AudioLoader;


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var _1 = __webpack_require__(1);
var ImageLoader = (function (_super) {
    __extends(ImageLoader, _super);
    function ImageLoader() {
        return _super.call(this) || this;
    }
    ImageLoader.prototype.load = function (asset) {
        asset.setState(_1.AssetState.LOADING);
        var image = asset.getData();
        image.onload = function (e) {
            asset.setData(image);
        };
        image.onerror = function (e) {
            asset.onError();
        };
        image.src = asset.getSource();
    };
    return ImageLoader;
}(_1.AssetLoader));
exports.ImageLoader = ImageLoader;


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var _1 = __webpack_require__(1);
var JSONLoader = (function (_super) {
    __extends(JSONLoader, _super);
    function JSONLoader() {
        return _super.call(this) || this;
    }
    JSONLoader.prototype._onSuccess = function (asset, data) {
        var json = data;
        asset.setData(JSON.parse(json));
    };
    return JSONLoader;
}(_1.AssetLoader));
exports.JSONLoader = JSONLoader;


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var _1 = __webpack_require__(1);
var utils_1 = __webpack_require__(2);
var TextAssetBuilder = (function () {
    function TextAssetBuilder() {
    }
    TextAssetBuilder.prototype.build = function (font, text, maxWidth, height, color) {
        var textViewPort = new utils_1.ViewPort();
        var textAsset = new _1.Asset(_1.AssetType.IMAGE);
        textViewPort.setFont(font);
        textViewPort.setColor(color || "green");
        textViewPort.setTextBaseline("hanging");
        if (!maxWidth) {
            maxWidth = textViewPort.measureText(text).width;
        }
        textViewPort.size = ({ width: maxWidth, height: height });
        textViewPort.setFont(font);
        textViewPort.setColor(color);
        textViewPort.setTextBaseline("hanging");
        textViewPort.drawText(text, 0, 0, maxWidth);
        textAsset.setData(textViewPort.getImage());
        return textAsset;
    };
    return TextAssetBuilder;
}());
exports.TextAssetBuilder = TextAssetBuilder;


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = __webpack_require__(2);
var _1 = __webpack_require__(1);
var Spritesheet = (function () {
    function Spritesheet(spritesheetAsset, spritesheetDefinition) {
        this._spritesheetAsset = spritesheetAsset;
        this._spritesheetDefinition = spritesheetDefinition;
        this._spriteCache = {};
    }
    Spritesheet.prototype.getSprite = function (id) {
        if (this._spriteCache[id]) {
            return this._spriteCache[id];
        }
        else if (this._spritesheetDefinition[id]) {
            var def = this._spritesheetDefinition[id];
            var spriteViewPort = new utils_1.ViewPort();
            this._spriteCache[id] = new _1.Asset(_1.AssetType.IMAGE);
            spriteViewPort.size = { width: def.width, height: def.height };
            spriteViewPort.context.translate(def.flipX === true ? def.width : 0, def.flipY === true ? def.height : 0);
            spriteViewPort.setScale({ width: def.flipX === true ? -1 : 1, height: def.flipY === true ? -1 : 1 });
            spriteViewPort.drawImage(this._spritesheetAsset.getData(), def.x, def.y, def.width, def.height, 0, 0, def.width, def.height);
            this._spriteCache[id].setData(spriteViewPort.getImage());
            return this._spriteCache[id];
        }
        else {
            return false;
        }
    };
    return Spritesheet;
}());
exports.Spritesheet = Spritesheet;


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Animation = (function () {
    function Animation(entity, animationDefinitions) {
        this._entity = entity;
        this._animationDefinition = animationDefinitions;
        this.loop = true;
        this.timeout = false;
        this.reverseLoop = false;
        this._animating = false;
        this._animation_index = -1;
    }
    Animation.prototype.isAnimating = function () {
        return this._animating;
    };
    Animation.prototype.start = function () {
        if (!this.timeout) {
            this._direction = "forward";
            this._loadStep(0);
            this._animating = true;
        }
    };
    Animation.prototype.stop = function () {
        clearTimeout(this.timeout);
        this.timeout = false;
        this._animating = false;
    };
    Animation.prototype._loadStep = function (stepIndex) {
        var _this = this;
        var step = this._animationDefinition[stepIndex];
        var sprite = step.asset;
        this._entity.texture = sprite;
        this._entity.width = sprite.getData().width;
        this._entity.height = sprite.getData().height;
        var offset = 0;
        if (step.moveX || (this._direction === "reverse" && this._animationDefinition[stepIndex + 1].moveX)) {
            if (this._direction === "reverse" && this._animationDefinition[stepIndex + 1].moveX) {
                offset = 0 - this._animationDefinition[stepIndex + 1].moveX;
                this._entity.x = (this._entity.x - this._animationDefinition[stepIndex + 1].moveX);
            }
            else {
                offset = 0 + step.moveX;
                this._entity.x = (this._entity.x + step.moveX);
            }
        }
        if (step.moveY || (this._direction === "reverse" && this._animationDefinition[stepIndex + 1].moveY)) {
            if (this._direction === "reverse" && this._animationDefinition[stepIndex + 1].moveY) {
                this._entity.y = (this._entity.y - this._animationDefinition[stepIndex + 1].moveY);
            }
            else {
                this._entity.y = (this._entity.y + step.moveY);
            }
        }
        var nextStepIndex;
        if (this._direction === "reverse") {
            nextStepIndex = stepIndex - 1;
        }
        else {
            nextStepIndex = stepIndex + 1;
        }
        if (this._animationDefinition[nextStepIndex]) {
            this.timeout = setTimeout(function () {
                _this._loadStep(nextStepIndex);
            }, step.delay);
        }
        else if (this.reverseLoop) {
            this.timeout = setTimeout(function () {
                if (_this._direction === "forward") {
                    _this._direction = "reverse";
                    _this._loadStep(stepIndex - 1);
                }
                else if (_this._direction === "reverse") {
                    _this._direction = "forward";
                    _this._loadStep(stepIndex + 1);
                }
            }, step.delay);
        }
        else if (this.loop) {
            this.timeout = setTimeout(function () {
                _this._loadStep(0);
            }, step.delay);
        }
        else {
            this.stop();
        }
    };
    return Animation;
}());
exports.Animation = Animation;


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var AudioEngine_1 = __webpack_require__(5);
var HTML5AudioEngine = (function (_super) {
    __extends(HTML5AudioEngine, _super);
    function HTML5AudioEngine() {
        var _this = _super.call(this) || this;
        _this._backgroundVolume = 1.0;
        _this._soundEffectVolume = 1.0;
        _this._backgroundAudios = [];
        _this._soundEffects = [];
        return _this;
    }
    HTML5AudioEngine.prototype.addBackgroundMusic = function (name, audio) {
        this.addAudio(name, audio);
        this._backgroundAudios.push(audio);
    };
    HTML5AudioEngine.prototype.addSoundEffect = function (name, audio) {
        this.addAudio(name, audio);
        this._soundEffects.push(audio);
    };
    HTML5AudioEngine.prototype.setBackgroundVolume = function (volume) {
        this._backgroundVolume = volume;
        for (var i = 0, len = this._backgroundAudios.length; i < len; i++) {
            this._setVolume(this._backgroundAudios[i], this._backgroundVolume);
        }
    };
    HTML5AudioEngine.prototype.setSoundEffectVolume = function (volume) {
        this._soundEffectVolume = volume;
        for (var i = 0, len = this._soundEffects.length; i < len; i++) {
            this._setVolume(this._soundEffects[i], this._soundEffectVolume);
        }
    };
    HTML5AudioEngine.prototype.isBackgroundMusic = function (audio) {
        return (this._backgroundAudios.indexOf(audio) > -1);
    };
    HTML5AudioEngine.prototype.isSoundEffect = function (audio) {
        return (this._soundEffects.indexOf(audio) > -1);
    };
    HTML5AudioEngine.prototype._playAudio = function (audio) {
        this._updateVolume(audio);
        var data = this._getData(audio);
        data.play();
    };
    HTML5AudioEngine.prototype._updateVolume = function (audio) {
        if (this.isSoundEffect(audio)) {
            this._setVolume(audio, this._soundEffectVolume);
        }
        else if (this.isBackgroundMusic(audio)) {
            this._setVolume(audio, this._backgroundVolume);
        }
    };
    HTML5AudioEngine.prototype._pauseAudio = function (audio) {
        var data = this._getData(audio);
        data.pause();
    };
    HTML5AudioEngine.prototype._stopAudio = function (audio) {
        var data = this._getData(audio);
        data.pause();
        this._setTimeCursor(audio, 0);
    };
    HTML5AudioEngine.prototype._isAudioLooping = function (audio) {
        var data = this._getData(audio);
        return data.loop;
    };
    HTML5AudioEngine.prototype._loopAudio = function (audio, state) {
        var data = this._getData(audio);
        data.loop = state;
    };
    HTML5AudioEngine.prototype._isAudioMuted = function (audio) {
        var data = this._getData(audio);
        return data.muted;
    };
    HTML5AudioEngine.prototype._muteAudio = function (audio, state) {
        var data = this._getData(audio);
        data.muted = state;
    };
    HTML5AudioEngine.prototype._getAudioDuration = function (audio) {
        var data = this._getData(audio);
        return data.duration;
    };
    HTML5AudioEngine.prototype._setTimeCursor = function (audio, seconds) {
        var data = this._getData(audio);
        data.currentTime = seconds;
    };
    HTML5AudioEngine.prototype._getTimeCursor = function (audio) {
        var data = this._getData(audio);
        return data.currentTime;
    };
    HTML5AudioEngine.prototype._setVolume = function (audio, volume) {
        var data = this._getData(audio);
        data.volume = volume;
    };
    HTML5AudioEngine.prototype._getVolume = function (audio) {
        var data = this._getData(audio);
        return data.volume;
    };
    HTML5AudioEngine.prototype._registerStartEvent = function (audio) {
        var data = audio.getData();
        data.addEventListener('playing', function (e) {
            audio.setAttribute('playing', true);
        });
    };
    HTML5AudioEngine.prototype._registerEndEvent = function (audio) {
        var data = audio.getData();
        data.addEventListener('ended', function (e) {
            audio.setAttribute('playing', false);
        });
    };
    return HTML5AudioEngine;
}(AudioEngine_1.AudioEngine));
exports.HTML5AudioEngine = HTML5AudioEngine;


/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var LogicEngine = (function () {
    function LogicEngine() {
    }
    return LogicEngine;
}());
exports.LogicEngine = LogicEngine;


/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var _1 = __webpack_require__(3);
var GroupLogicEngine = (function (_super) {
    __extends(GroupLogicEngine, _super);
    function GroupLogicEngine() {
        var _this = _super.call(this) || this;
        _this._logicCalls = {};
        _this._intervals = {};
        _this._interval = 10;
        return _this;
    }
    GroupLogicEngine.prototype.addLogic = function (id, logicMethod, interval) {
        this._logicCalls[id] = {
            'method': logicMethod,
            'interval': interval
        };
        if (!this._hasInterval(interval)) {
            this._createInterval(interval);
        }
        this._addToInterval(id);
    };
    GroupLogicEngine.prototype.pauseLogic = function (id) {
        this._removeFromInterval(id);
    };
    GroupLogicEngine.prototype.resumeLogic = function (id) {
        this._addToInterval(id);
    };
    GroupLogicEngine.prototype.removeLogic = function (id) {
        if (this._logicCalls[id]) {
            this._removeFromInterval(id);
            delete this._logicCalls[id];
        }
    };
    GroupLogicEngine.prototype._createInterval = function (interval) {
        var _this = this;
        var self = this;
        var methods = [];
        this._intervals[interval] = {
            'methods': methods,
            'interval_id': setInterval(function () {
                _this._processInterval(interval);
            }, interval)
        };
    };
    GroupLogicEngine.prototype._hasInterval = function (interval) {
        return this._intervals[interval] != undefined;
    };
    GroupLogicEngine.prototype._removeInterval = function (interval) {
        clearInterval(this._intervals[interval].interval_id);
        delete this._intervals[interval];
    };
    GroupLogicEngine.prototype._addToInterval = function (id) {
        this._intervals[this._logicCalls[id].interval].methods.push(this._logicCalls[id].method);
    };
    GroupLogicEngine.prototype._removeFromInterval = function (id) {
        var interval = this._logicCalls[id].interval;
        this._intervals[interval].methods.splice(this._intervals[interval].methods.indexOf(this._logicCalls[id].method), 1);
        if (this._intervals[interval].methods.length === 0) {
            this._removeInterval(interval);
        }
    };
    GroupLogicEngine.prototype._processInterval = function (interval) {
        for (var i in this._intervals[interval].methods) {
            this._intervals[interval].methods[i]();
        }
    };
    return GroupLogicEngine;
}(_1.LogicEngine));
exports.GroupLogicEngine = GroupLogicEngine;


/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = __webpack_require__(2);
var RenderingEngine = (function () {
    function RenderingEngine() {
        this._prerenderViewPort = new utils_1.ViewPort();
        this._rendering = false;
        this._fps = 0;
        this._frames = 0;
        this._showFPS = true;
        this._cameras = [];
    }
    RenderingEngine.prototype.addCamera = function (camera) {
        this._cameras.push(camera);
    };
    RenderingEngine.prototype.removeCamera = function (camera) {
        delete this._cameras[this._cameras.indexOf(camera)];
    };
    RenderingEngine.prototype.startRendering = function () {
        if (this.viewPort) {
            var self = this;
            this._rendering = true;
            this._requestFrame();
            return true;
        }
        else {
            console.warn('Unable to begin rendering, no view port assigned to rendering engine.');
            return false;
        }
    };
    RenderingEngine.prototype.stopRendering = function () {
        window.cancelAnimationFrame(this._animationFrameID);
        this._animationFrameID = null;
        this._rendering = false;
    };
    RenderingEngine.prototype._requestFrame = function () {
        var _this = this;
        if (this._rendering) {
            this._animationFrameID = window.requestAnimationFrame(function () {
                _this._render();
                _this._postRender();
            });
        }
    };
    RenderingEngine.prototype._render = function () {
        this.viewPort.clear();
    };
    RenderingEngine.prototype._calculateFPS = function () {
        var date = new Date();
        if (this._lastRender) {
            if (this._lastRender.getSeconds() != date.getSeconds()) {
                this._fps = this._frames;
                this._frames = 1;
            }
            else {
                this._frames += 1;
            }
        }
        this._lastRender = date;
    };
    RenderingEngine.prototype._postRender = function () {
        if (this._showFPS) {
            this._calculateFPS();
            var ctx = this.viewPort.context;
            ctx.globalAlpha = 0.5;
            ctx.fillStyle = 'black';
            ctx.fillRect(0, 0, 100, 35);
            ctx.globalAlpha = 1;
            ctx.fillStyle = 'white';
            ctx.font = "20px Georgia";
            ctx.fillText(this._fps + " FPS", 20, 25);
        }
        this._requestFrame();
    };
    return RenderingEngine;
}());
exports.RenderingEngine = RenderingEngine;


/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var _1 = __webpack_require__(3);
var TwoDimensionalRenderingEngine = (function (_super) {
    __extends(TwoDimensionalRenderingEngine, _super);
    function TwoDimensionalRenderingEngine() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TwoDimensionalRenderingEngine.prototype._render = function () {
        _super.prototype._render.call(this);
        var context = this.viewPort.context;
        for (var i in this._cameras) {
            this._renderCamera(this._cameras[i]);
        }
        if (this.HUDEntity) {
            this._renderEntity(this.HUDEntity, null);
        }
    };
    TwoDimensionalRenderingEngine.prototype._renderCamera = function (camera) {
        var scene = camera.scene;
        var context = this.viewPort.context;
        if (this.debugCamera) {
            context.beginPath();
            context.rect(camera.viewPoint.x, camera.viewPoint.y, camera.fov.width, camera.fov.height);
            context.lineWidth = 7;
            context.strokeStyle = 'red';
            context.stroke();
            context.beginPath();
            context.rect(camera.renderOrigin.x, camera.renderOrigin.y, camera.renderDimension.width, camera.renderDimension.height);
            context.lineWidth = 7;
            context.fillStyle = 'black';
            context.fill();
            context.strokeStyle = 'green';
            context.stroke();
        }
        this._renderEntity(scene, camera);
    };
    TwoDimensionalRenderingEngine.prototype._renderEntity = function (entity, camera) {
        if (camera) {
            var collidesYAxis = false;
            var collidesXAxis = false;
            var cameraBounds = {
                x: camera.viewPoint.x,
                y: camera.viewPoint.y,
                x2: camera.viewPoint.x + camera.fov.width,
                y2: camera.viewPoint.y + camera.fov.height
            };
            var entityBounds = {
                x: entity.getAbsoluteX(),
                y: entity.getAbsoluteY(),
                x2: entity.getAbsoluteX2(),
                y2: entity.getAbsoluteY2()
            };
            if ((entityBounds.x < cameraBounds.x2 && entityBounds.x2 > cameraBounds.x)
                || (entityBounds.x2 > cameraBounds.x && entityBounds.x < cameraBounds.x2)) {
                collidesXAxis = true;
            }
            if ((entityBounds.y < cameraBounds.y2 && entityBounds.y2 > cameraBounds.y)
                || (entityBounds.y2 > cameraBounds.y && entityBounds.y < cameraBounds.y2)) {
                collidesYAxis = true;
            }
            if (!collidesYAxis || !collidesXAxis) {
                return false;
            }
            var leftClip = 0;
            if (entity.getAbsoluteX() < camera.viewPoint.x) {
                leftClip = camera.viewPoint.x - entity.getAbsoluteX();
            }
            var rightClip = 0;
            if (entity.getAbsoluteX2() > (camera.viewPoint.x + camera.fov.width)) {
                rightClip = entity.getAbsoluteX2() - (camera.viewPoint.x + camera.fov.width);
            }
            var topClip = 0;
            if (entity.getAbsoluteY() < camera.viewPoint.y) {
                topClip = camera.viewPoint.y - entity.getAbsoluteY();
            }
            var bottomClip = 0;
            if (entity.getAbsoluteY2() > (camera.viewPoint.y + camera.fov.height)) {
                bottomClip = entity.getAbsoluteY2() - (camera.viewPoint.y + camera.fov.height);
            }
            var xModifier = camera.fov.width / camera.renderDimension.width;
            var yModifier = camera.fov.height / camera.renderDimension.height;
            var cameraRelativeY = (entityBounds.y - cameraBounds.y) / yModifier;
            if (cameraRelativeY < 0) {
                cameraRelativeY = 0;
            }
            var cameraRelativeX = (entityBounds.x - cameraBounds.x) / xModifier;
            if (cameraRelativeX < 0) {
                cameraRelativeX = 0;
            }
            var clippedEntityHeight = (entity.height - topClip - bottomClip);
            var clippedEntityWidth = (entity.width - rightClip - leftClip);
            var x = camera.renderOrigin.x + cameraRelativeX;
            var y = camera.renderOrigin.y + cameraRelativeY;
            var w = clippedEntityWidth / xModifier;
            var h = clippedEntityHeight / yModifier;
            if (entity.color) {
                var color = entity.color;
                this.viewPort.context.fillStyle = "rgb(" + color.r + ", " + color.g + ", " + color.b + ")";
                this.viewPort.context.fillRect(x, y, w, h);
            }
            if (this.debugRegions) {
                for (var x_i in entity.regions) {
                    for (var y_i in entity.regions[x]) {
                        if (entity.regions[x_i][y_i].length > 0) {
                            this.viewPort.context.strokeStyle = "red";
                            this.viewPort.context.strokeRect(entity.getAbsoluteX() + entity.regionDimension.width * parseInt(x_i), entity.getAbsoluteY() + entity.regionDimension.height * parseInt(y_i), entity.regionDimension.width, entity.regionDimension.height);
                        }
                    }
                }
            }
            if (entity.texture) {
                var imageData = entity.texture.getData();
                var entityToImageYModifier = imageData.height / entity.height;
                var entityToImageXModifier = imageData.width / entity.width;
                var clippedImageHeight = clippedEntityHeight * entityToImageYModifier;
                var clippedImageWidth = clippedEntityWidth * entityToImageXModifier;
                this.viewPort.context.drawImage(imageData, leftClip * entityToImageXModifier, topClip * entityToImageYModifier, clippedImageWidth, clippedImageHeight, x, y, w, h);
            }
        }
        else {
            var x = entity.x;
            var y = entity.y;
            var w = entity.width;
            var h = entity.height;
            if (entity.color) {
                var color = entity.color;
                this.viewPort.context.fillStyle = "rgb(" + color.r + ", " + color.g + ", " + color.b + ")";
                this.viewPort.context.fillRect(x, y, w, h);
            }
            if (entity.texture) {
                var imageData = entity.texture.getData();
                var entityToImageYModifier = imageData.height / entity.height;
                var entityToImageXModifier = imageData.width / entity.width;
                var clippedImageHeight = clippedEntityHeight * entityToImageYModifier;
                var clippedImageWidth = clippedEntityWidth * entityToImageXModifier;
                this.viewPort.context.drawImage(imageData, x, y, w, h);
            }
        }
        var children = entity.getChildren();
        while (children.hasNext()) {
            this._renderEntity(children.next(), camera);
        }
        return true;
    };
    return TwoDimensionalRenderingEngine;
}(_1.RenderingEngine));
exports.TwoDimensionalRenderingEngine = TwoDimensionalRenderingEngine;


/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Events = __webpack_require__(0);
var utils_1 = __webpack_require__(2);
var EntityModel = (function (_super) {
    __extends(EntityModel, _super);
    function EntityModel() {
        var _this = _super.call(this) || this;
        _this._attributes = {};
        _this._id = utils_1.IDGenerator.getSingleton().generate();
        _this.type = 'generic';
        return _this;
    }
    Object.defineProperty(EntityModel.prototype, "ID", {
        get: function () {
            return this._id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EntityModel.prototype, "texture", {
        get: function () {
            return this._texture;
        },
        set: function (asset) {
            this._texture = asset;
            this.emit(3..toString(), {
                attribute: 'texture',
                name: name,
                value: asset
            });
        },
        enumerable: true,
        configurable: true
    });
    EntityModel.prototype.setAttribute = function (key, value) {
        var oldValue = this.getAttribute(key);
        this._attributes[key] = value;
        this.emit(1..toString(), {
            attribute: key,
            oldValue: oldValue,
            value: value
        });
    };
    EntityModel.prototype.removeAttribute = function (key) {
        var value = this.getAttribute(key);
        delete this._attributes[key];
        var data = {
            type: 2..toString(),
            attribute: key,
            value: value,
            source: this
        };
        this.emit(2..toString(), data);
    };
    EntityModel.prototype.getAttribute = function (key) {
        return this._attributes[key];
    };
    EntityModel.prototype.hasAttribute = function (key) {
        if (this._attributes[key]) {
            return true;
        }
        else {
            return false;
        }
    };
    EntityModel.prototype.sync = function (listener) {
    };
    return EntityModel;
}(Events.EventEmitter));
exports.EntityModel = EntityModel;


/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var EntityView_1 = __webpack_require__(8);
var EntityView2D = (function (_super) {
    __extends(EntityView2D, _super);
    function EntityView2D() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return EntityView2D;
}(EntityView_1.EntityView));
exports.EntityView2D = EntityView2D;


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Entity_1 = __webpack_require__(7);
var GridMap = (function (_super) {
    __extends(GridMap, _super);
    function GridMap(tileSize, tileCount) {
        var _this = _super.call(this) || this;
        _this.tileSize = tileSize;
        _this.tileCount = tileCount;
        _this._tiles = [];
        _this.width = (_this.tileSize.width * _this.tileCount.x);
        _this.height = (_this.tileSize.height * _this.tileCount.y);
        for (var x = 0; x < _this.tileCount.x; x++) {
            for (var y = 0; y < _this.tileCount.y; y++) {
                var tile = new Entity_1.Entity();
                tile.width = _this.tileSize.width;
                tile.height = _this.tileSize.height;
                tile.x = ((x + 1) * _this.tileSize.width);
                tile.y = ((y + 1) * _this.tileSize.height);
                _this.addChild(tile);
                if (!_this._tiles[x]) {
                    _this._tiles[x] = [];
                }
                _this._tiles[x][y] = tile;
            }
        }
        return _this;
    }
    GridMap.prototype.getTile = function (coordinate) {
        return this._tiles[coordinate.x][coordinate.y];
    };
    GridMap.prototype.getTiles = function () {
        return this._children;
    };
    return GridMap;
}(Entity_1.Entity));
exports.GridMap = GridMap;


/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var SeverityEnum_1 = __webpack_require__(9);
exports.SeverityEnum = SeverityEnum_1.SeverityEnum;
var Camera_1 = __webpack_require__(41);
exports.Camera = Camera_1.Camera;
var IDGenerator_1 = __webpack_require__(42);
exports.IDGenerator = IDGenerator_1.IDGenerator;
var Iterator_1 = __webpack_require__(43);
exports.Iterator = Iterator_1.Iterator;
var LogManager_1 = __webpack_require__(44);
exports.LogManager = LogManager_1.LogManager;
var ViewPort_1 = __webpack_require__(45);
exports.ViewPort = ViewPort_1.ViewPort;
var CollisionEmitter_1 = __webpack_require__(46);
exports.CollisionEmitter = CollisionEmitter_1.CollisionEmitter;


/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Camera = (function () {
    function Camera(scene, viewPoint, fov, renderOrigin, renderDimension) {
        this.scene = scene;
        this.viewPoint = viewPoint || { x: 0, y: 0 };
        this.fov = fov || { width: 100, height: 100 };
        this.renderOrigin = renderOrigin || { x: 0, y: 0 };
        this.renderDimension = renderDimension || { width: 100, height: 100 };
    }
    return Camera;
}());
exports.Camera = Camera;


/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var IDGenerator = (function () {
    function IDGenerator() {
    }
    IDGenerator.prototype.generate = function () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };
    IDGenerator.getSingleton = function () {
        if (!IDGenerator._instance) {
            IDGenerator._instance = new IDGenerator();
        }
        return IDGenerator._instance;
    };
    return IDGenerator;
}());
exports.IDGenerator = IDGenerator;


/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Iterator = (function () {
    function Iterator(array) {
        this._array = array;
        this._index = -1;
        this._length = array.length;
    }
    Iterator.prototype.hasNext = function () {
        if (this._array[this._index + 1]) {
            return true;
        }
        else {
            return false;
        }
    };
    Iterator.prototype.next = function () {
        this._index += 1;
        return this._array[this._index];
    };
    Iterator.prototype.hasPrev = function () {
        if (this._array[this._index - 1]) {
            return true;
        }
        else {
            return false;
        }
    };
    Iterator.prototype.prev = function () {
        this._index -= 1;
        return this._array[this._index];
    };
    Iterator.prototype.setToBeginning = function () {
        this._index = -1;
    };
    Iterator.prototype.setToEnd = function () {
        this._index = this._array.length;
    };
    Iterator.prototype.getFirst = function () {
        return this._array[0];
    };
    Iterator.prototype.getLast = function () {
        return this._array[this._array.length - 1];
    };
    return Iterator;
}());
exports.Iterator = Iterator;


/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var SeverityEnum_1 = __webpack_require__(9);
var LogManager = (function () {
    function LogManager() {
        this._logLevel = SeverityEnum_1.SeverityEnum.WARNING | SeverityEnum_1.SeverityEnum.ERROR;
        this._logLevel = this._logLevel | SeverityEnum_1.SeverityEnum.DEBUG | SeverityEnum_1.SeverityEnum.INFO;
    }
    LogManager.prototype.log = function (severity, message) {
        if (this.getLogLevel() & severity) {
            switch (severity) {
                case SeverityEnum_1.SeverityEnum.DEBUG:
                    console.debug(message);
                    break;
                case SeverityEnum_1.SeverityEnum.INFO:
                    console.info(message);
                    break;
                case SeverityEnum_1.SeverityEnum.WARNING:
                    console.warn(message);
                    break;
                case SeverityEnum_1.SeverityEnum.ERROR:
                    console.error(message);
                    break;
            }
        }
    };
    LogManager.prototype.setLogLevel = function (severity) {
        this._logLevel = severity;
        this._logLevel = severity;
    };
    LogManager.prototype.getLogLevel = function () {
        return this._logLevel;
    };
    LogManager.getSingleton = function () {
        if (!LogManager._instance) {
            LogManager._instance = new LogManager();
        }
        return LogManager._instance;
    };
    LogManager._instance = new LogManager();
    return LogManager;
}());
exports.LogManager = LogManager;


/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Events = __webpack_require__(0);
var ViewPort = (function (_super) {
    __extends(ViewPort, _super);
    function ViewPort() {
        var _this = _super.call(this) || this;
        _this.canvas = document.createElement('canvas');
        _this.context = _this.canvas.getContext('2d');
        _this.resizable = false;
        _this._dimension = { width: 0, height: 0 };
        _this.autoSize = false;
        return _this;
    }
    ViewPort.prototype.setScale = function (dimension) {
        this.context.scale(dimension.width, dimension.height);
    };
    Object.defineProperty(ViewPort.prototype, "autoSize", {
        get: function () {
            return this._autoSize;
        },
        set: function (state) {
            var _this = this;
            if (this._autoSizeTimer) {
                clearInterval(this._autoSizeTimer);
            }
            if (state) {
                this._checkForParentSizeChange();
                this._autoSizeTimer = setInterval(function () {
                    _this._checkForParentSizeChange();
                }, 100);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ViewPort.prototype, "size", {
        get: function () {
            return { width: this.canvas.offsetWidth, height: this.canvas.offsetHeight };
        },
        set: function (dimension) {
            this._dimension = dimension;
            this.canvas.setAttribute('width', dimension.width + "px");
            this.canvas.setAttribute('height', dimension.height + "px");
            this.emit('resize', dimension);
        },
        enumerable: true,
        configurable: true
    });
    ViewPort.prototype.clear = function () {
        this.context.clearRect(0, 0, this._dimension.width, this._dimension.height);
    };
    ViewPort.prototype.drawImage = function (img, clip_x, clip_y, clip_width, clip_height, x, y, width, height) {
        this.context.drawImage(img, clip_x, clip_y, clip_width, clip_height, x, y, width, height);
    };
    ViewPort.prototype.setFont = function (font) {
        this.context.font = font;
    };
    ViewPort.prototype.setColor = function (color) {
        this.context.fillStyle = color;
    };
    ViewPort.prototype.measureText = function (text) {
        return this.context.measureText(text);
    };
    ViewPort.prototype.setTextBaseline = function (baseline) {
        this.context.textBaseline = baseline;
    };
    ViewPort.prototype.drawText = function (text, x, y, maxWidth) {
        this.context.fillText(text, x, y, maxWidth);
    };
    ViewPort.prototype.setHidden = function () {
        this.canvas.style.position = "absolute";
        this.canvas.style.left = '110001px';
    };
    ViewPort.prototype.getImage = function () {
        var image = document.createElement('img');
        image.src = this.canvas.toDataURL("image/png");
        return image;
    };
    ViewPort.prototype._checkForParentSizeChange = function () {
        if (this.canvas.parentNode) {
            var size = this.size;
            var parent = this.canvas.parentNode;
            var parent_size = { width: parent.offsetWidth, height: parent.offsetHeight - 2 };
            if (size.width != parent_size.width || size.height != parent_size.height) {
                this.size = { width: parent_size.width, height: parent_size.height };
                var eventData = {
                    type: 0..toString(),
                    oldDimensions: size,
                    newDimensions: parent_size,
                    source: this
                };
                this.emit(0..toString(), eventData);
            }
        }
    };
    return ViewPort;
}(Events.EventEmitter));
exports.ViewPort = ViewPort;


/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var CollisionEmitter = (function () {
    function CollisionEmitter() {
        this._cbs = {};
        this._entities = [];
        this._entitiesListeners = {};
        this._listeners = [];
        this._cbs[0] = this._onEntityLocationUpdate.bind(this);
    }
    CollisionEmitter.prototype.addEntity = function (entity) {
        if (!this.hasEntity(entity)) {
            this._entities.push(entity);
            this._entitiesListeners[entity.ID] = [];
            entity.on(0..toString(), this._cbs[0]);
        }
    };
    CollisionEmitter.prototype.removeEntity = function (entity) {
        if (this.hasEntity(entity)) {
            this._entities.splice(this._entities.indexOf(entity), 1);
            delete this._entitiesListeners[entity.ID];
        }
    };
    CollisionEmitter.prototype.hasEntity = function (entity) {
        return this._entitiesListeners.hasOwnProperty(entity.ID);
    };
    CollisionEmitter.prototype.addEntityCollisionListener = function (entity, callback) {
        if (!this.hasEntity(entity)) {
            this.addEntity(entity);
        }
        this._entitiesListeners[entity.ID].push(callback);
    };
    CollisionEmitter.prototype.removeEntityCollisionListener = function (entity, callback) {
        if (this._entitiesListeners[entity.ID].indexOf(callback) > -1) {
            this._entitiesListeners[entity.ID].splice(this._entitiesListeners[entity.ID].indexOf(callback), 1);
        }
    };
    CollisionEmitter.prototype.addCollisionListener = function (callback) {
        this._listeners.push(callback);
    };
    CollisionEmitter.prototype.removeCollisionListener = function (callback) {
        if (this._listeners.indexOf(callback) > -1) {
            this._listeners.splice(this._listeners.indexOf(callback), 1);
        }
    };
    CollisionEmitter.prototype._onEntityLocationUpdate = function (event) {
        var entity = event.source;
        if (entity.parent) {
            var potCollisions = entity.parent.findChildren({ x: entity.x, y: entity.y }, { x: entity.x2, y: entity.y2 });
            var collisions = [];
            for (var i in potCollisions) {
                var potEntity = potCollisions[i];
                if (potEntity != entity && this.hasEntity(potEntity)) {
                    collisions.push(potEntity);
                }
            }
            if (collisions.length > 0) {
                for (var i in this._listeners) {
                    var listener = this._listeners[i];
                    listener(entity, collisions[0], event);
                }
            }
        }
    };
    return CollisionEmitter;
}());
exports.CollisionEmitter = CollisionEmitter;


/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var GamePadListener_1 = __webpack_require__(48);
exports.GamePadListener = GamePadListener_1.GamePadListener;
var GamePad_1 = __webpack_require__(10);
exports.GamePad = GamePad_1.GamePad;
var Keyboard_1 = __webpack_require__(49);
exports.Keyboard = Keyboard_1.Keyboard;
exports.KeyboardKeys = Keyboard_1.KeyboardKeys;
var Mouse_1 = __webpack_require__(50);
exports.Mouse = Mouse_1.Mouse;
var Touch_1 = __webpack_require__(11);
exports.Touch = Touch_1.Touch;
var TouchListener_1 = __webpack_require__(51);
exports.TouchListener = TouchListener_1.TouchListener;


/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var GamePad_1 = __webpack_require__(10);
var Events = __webpack_require__(0);
var GamePadListener = (function (_super) {
    __extends(GamePadListener, _super);
    function GamePadListener() {
        var _this = _super.call(this) || this;
        if (navigator.getGamepads) {
            _this._buildGamePads();
            _this._gamePadPollTimer = window.setInterval(function () {
                var gamePads = navigator.getGamepads();
                for (var i = 0; i < gamePads.length; i++) {
                    if (gamePads[i] && !_this._activeGamePads[i]) {
                        var gamePad = _this._buildGamePad(i);
                        _this.emit("GAMEPADADDED", gamePad);
                    }
                    else if (!gamePads[i] && _this._activeGamePads[i]) {
                        var gamePad = _this._activeGamePads[i];
                        delete _this._activeGamePads[i];
                        _this.emit("GAMEPADREMOVED", gamePad);
                    }
                }
            }, 15);
        }
        else {
            console.log("Browser does not support GamePad API");
        }
        return _this;
    }
    GamePadListener.prototype._buildGamePads = function () {
        var gamePads = navigator.getGamepads();
        this._activeGamePads = [];
        for (var i = 0; i < gamePads.length; i++) {
            if (gamePads[i]) {
                this._buildGamePad(i);
            }
        }
    };
    GamePadListener.prototype._buildGamePad = function (index) {
        var gamePad = new GamePad_1.GamePad(index);
        this._activeGamePads[index] = gamePad;
        return gamePad;
    };
    GamePadListener.getInstance = function () {
        GamePadListener._instance = GamePadListener._instance || new GamePadListener();
        return GamePadListener._instance;
    };
    GamePadListener.prototype.hasGamePads = function () {
        return this._activeGamePads.length > 0;
    };
    GamePadListener.prototype.getGamePads = function () {
        return this._activeGamePads;
    };
    return GamePadListener;
}(Events.EventEmitter));
exports.GamePadListener = GamePadListener;


/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Events = __webpack_require__(0);
exports.KeyboardKeys = {
    0: 48,
    1: 49,
    2: 50,
    3: 51,
    4: 52,
    5: 53,
    6: 54,
    7: 55,
    8: 56,
    9: 57,
    "BREAK": 3,
    "BACKSPACE": 8,
    "TAB": 9,
    "CLEAR": 12,
    "ENTER": 13,
    "SHIFT": 16,
    "CTRL": 17,
    "ALT": 18,
    "PAUSE": 19,
    "CAPSLOCK": 20,
    "ESCAPE": 27,
    "SPACEBAR": 32,
    "PAGEUP": 33,
    "PAGEDOWN": 34,
    "END": 35,
    "HOME": 36,
    "LEFTARROW": 37,
    "UPARROW": 38,
    "RIGHTARROW": 39,
    "DOWNARROW": 40,
    "SELECT": 41,
    "PRINT": 42,
    "EXECUTE": 43,
    "PRINTSCREEN": 44,
    "INSERT": 45,
    "DELETE": 46,
    "COLON": 58,
    "SEMICOLON": 59,
    "LESSTHAN": 60,
    "EQUALS": 61,
    "AMPERSAT": 64,
    "A": 65,
    "B": 66,
    "C": 67,
    "D": 68,
    "E": 69,
    "F": 70,
    "G": 71,
    "H": 72,
    "I": 73,
    "J": 74,
    "K": 75,
    "L": 76,
    "M": 77,
    "N": 78,
    "O": 79,
    "P": 80,
    "Q": 81,
    "R": 82,
    "S": 83,
    "T": 84,
    "U": 85,
    "V": 86,
    "W": 87,
    "X": 88,
    "Y": 89,
    "Z": 90,
    "WINDOWSKEY": 91,
    "RIGHTWINDOWSKEY": 92,
    "WINDOWSMENU": 93,
    "NUM0": 96,
    "NUM1": 97,
    "NUM2": 98,
    "NUM3": 99,
    "NUM4": 100,
    "NUM5": 101,
    "NUM6": 102,
    "NUM7": 103,
    "NUM8": 104,
    "NUM9": 105,
    "NUMMULTIPLY": 106,
    "NUMADD": 107,
    "NUMPERIOUD": 108,
    "NUMSUBTRACT": 109,
    "DECIMALPOINT": 110,
    "NUMDIVIDE": 111,
    "F1": 112,
    "F2": 113,
    "F3": 114,
    "F4": 115,
    "F5": 116,
    "F6": 117,
    "F7": 118,
    "F8": 119,
    "F9": 120,
    "F10": 121,
    "F11": 122,
    "F12": 123,
    "F13": 124,
    "F14": 125,
    "F15": 126,
    "F16": 127,
    "F17": 128,
    "F18": 129,
    "F19": 130,
    "F20": 131,
    "F21": 132,
    "F22": 133,
    "F23": 134,
    "F24": 135,
    "NUMLOCK": 144,
    "SCROLLLOCK": 145,
    "CARET": 160,
    "EXCLAMATION": 161,
    "POUND": 163,
    "MONEYSIGN": 164,
};
var Keyboard = (function (_super) {
    __extends(Keyboard, _super);
    function Keyboard() {
        var _this = _super.call(this) || this;
        _this._buttonMap = {};
        _this._buttonsActive = {};
        window.addEventListener("keydown", function (e) {
            if (!_this.isButtonActive(e.which)) {
                _this._setButtonActive(e.which, true);
                _this._setButtonValue(e.which, true);
                var event_1 = {
                    type: "KEYDOWN",
                    source: _this,
                    key: e.which
                };
                _this.emit("KEYDOWN", event_1);
            }
        }, true);
        window.addEventListener("keyup", function (e) {
            _this._setButtonActive(e.which, false);
            _this._setButtonValue(e.which, false);
            var event = {
                type: "KEYUP",
                source: _this,
                key: e.which
            };
            _this.emit("KEYUP", event);
        }, true);
        return _this;
    }
    Keyboard.prototype._setButtonActive = function (id, active) {
        this._buttonsActive[id] = active;
    };
    Keyboard.prototype.isButtonActive = function (id) {
        return this._buttonsActive[id] === true;
    };
    Keyboard.prototype.getButtonValue = function (id) {
        return this._buttonMap[id];
    };
    Keyboard.prototype._setButtonValue = function (id, value) {
        this._buttonMap[id] = value;
    };
    Keyboard.getInstance = function () {
        Keyboard._instance = Keyboard._instance || new Keyboard();
        return Keyboard._instance;
    };
    return Keyboard;
}(Events.EventEmitter));
exports.Keyboard = Keyboard;


/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Events = __webpack_require__(0);
var Mouse = (function (_super) {
    __extends(Mouse, _super);
    function Mouse() {
        var _this = _super.call(this) || this;
        _this._leftButtonDown = false;
        _this._rightButtonDown = false;
        _this._scrollWheelDown = false;
        _this._mouseCoords = { x: 0, y: 0 };
        window.addEventListener("contextmenu", function (e) {
            e.preventDefault();
        });
        window.addEventListener("mousedown", function (e) {
            if (e.button === 0) {
                _this._leftButtonDown = true;
                var event_1 = {
                    type: "LEFTBUTTONDOWN",
                    source: _this,
                    x: e.clientX,
                    y: e.clientY
                };
                _this.emit("LEFTBUTTONDOWN", event_1);
            }
            else if (e.button === 1) {
                _this._scrollWheelDown = true;
                var event_2 = {
                    type: "SCROLLWHEELDOWN",
                    source: _this,
                    x: e.clientX,
                    y: e.clientY
                };
                _this.emit("SCROLLWHEELDOWN", event_2);
            }
            else if (e.button === 2) {
                _this._rightButtonDown = true;
                var event_3 = {
                    type: "RIGHTBUTTONDOWN",
                    source: _this,
                    x: e.clientX,
                    y: e.clientY
                };
                _this.emit("RIGHTBUTTONDOWN", event_3);
            }
        }, true);
        window.addEventListener("mouseup", function (e) {
            if (e.button === 0) {
                _this._leftButtonDown = false;
                var event_4 = {
                    type: "LEFTBUTTONUP",
                    source: _this,
                    x: e.clientX,
                    y: e.clientY
                };
                _this.emit("LEFTBUTTONUP", event_4);
            }
            else if (e.button === 1) {
                _this._scrollWheelDown = false;
                var event_5 = {
                    type: "SCROLLWHEELUP",
                    source: _this,
                    x: e.clientX,
                    y: e.clientY
                };
                _this.emit("SCROLLWHEELUP", event_5);
            }
            else if (e.button === 2) {
                _this._rightButtonDown = false;
                var event_6 = {
                    type: "RIGHTBUTTONUP",
                    source: _this,
                    x: e.clientX,
                    y: e.clientY
                };
                _this.emit("RIGHTBUTTONUP", event_6);
            }
        }, true);
        window.addEventListener("mousemove", function (e) {
            _this._mouseCoords = { x: e.clientX, y: e.clientY };
            var event = {
                type: "MOUSEMOVE",
                source: _this,
                x: e.clientX,
                y: e.clientY
            };
            _this.emit("MOUSEMOVE", event);
        }, true);
        window.addEventListener("wheel", function (e) {
            var yDelta = 0;
            var xDelta = 0;
            if (e.wheelDeltaY > 0) {
                yDelta = 1;
            }
            else if (e.wheelDeltaY < 0) {
                yDelta = -1;
            }
            if (e.wheelDeltaX > 0) {
                xDelta = 1;
            }
            else if (e.wheelDeltaX < 0) {
                xDelta = -1;
            }
            var event = {
                type: "SCROLLWHEELMOVE".toString(),
                source: _this,
                x: e.clientX,
                y: e.clientY,
                yDelta: yDelta,
                xDelta: xDelta
            };
            _this.emit("SCROLLWHEELMOVE".toString(), event);
        }, true);
        return _this;
    }
    Mouse.prototype.getCurrentCoordinates = function () {
        return this._mouseCoords;
    };
    Mouse.prototype.isLeftButtonClicked = function () {
        return this._leftButtonDown;
    };
    Mouse.prototype.isMouseWheelClicked = function () {
        return this._scrollWheelDown;
    };
    Mouse.prototype.isRightButtonClicked = function () {
        return this._rightButtonDown;
    };
    Mouse.getInstance = function () {
        Mouse._instance = Mouse._instance || new Mouse();
        return Mouse._instance;
    };
    return Mouse;
}(Events.EventEmitter));
exports.Mouse = Mouse;


/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Touch_1 = __webpack_require__(11);
var Events = __webpack_require__(0);
var TouchListener = (function (_super) {
    __extends(TouchListener, _super);
    function TouchListener() {
        var _this = _super.call(this) || this;
        window.addEventListener("touchstart", function (e) {
            e.preventDefault();
            for (var i = 0; i < e.changedTouches.length; i++) {
                var touch = new Touch_1.Touch(e.changedTouches.item(i));
                _this.emit("TOUCHADDED", touch);
            }
        });
        return _this;
    }
    TouchListener.getInstance = function () {
        TouchListener._instance = TouchListener._instance || new TouchListener();
        return TouchListener._instance;
    };
    return TouchListener;
}(Events.EventEmitter));
exports.TouchListener = TouchListener;


/***/ })
/******/ ]);
//# sourceMappingURL=App.js.map