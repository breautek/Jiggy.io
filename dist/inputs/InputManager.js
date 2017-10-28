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
var events_1 = require("events");
var _1 = require("./");
var InputManager = (function (_super) {
    __extends(InputManager, _super);
    function InputManager() {
        var _this = _super.call(this) || this;
        _this._controllers = {};
        _this._factory = _this._createControllerFactory();
        return _this;
    }
    InputManager.getSingleton = function () {
        if (!InputManager._instance) {
            InputManager._instance = new InputManager();
        }
        return InputManager._instance;
    };
    InputManager.prototype.createController = function (name, type) {
        var controller = this._factory.create(type);
        this._controllers[name] = controller;
        controller.initialize(this);
    };
    InputManager.prototype.removeController = function (name) {
        if (!this.hasController(name)) {
            return;
        }
        var controller = this._getController(name);
        controller.destroy();
        delete this._controllers[name];
    };
    InputManager.prototype.hasController = function (name) {
        return !!(this._controllers[name]);
    };
    InputManager.prototype._getController = function (name) {
        if (!this.hasController(name)) {
            return null;
        }
        return this._controllers[name];
    };
    InputManager.prototype._getControllerName = function (controller) {
        for (var i in this._controllers) {
            if (this._controllers[i] === controller) {
                return i;
            }
        }
        return null;
    };
    InputManager.prototype._createControllerFactory = function () {
        return _1.ControllerFactory.getSingleton();
    };
    InputManager.prototype.onInputReceived = function (controller, inputEvent, data) {
        data.controller = this._getControllerName(controller);
        this.emit(inputEvent.toString(), data);
    };
    return InputManager;
}(events_1.EventEmitter));
exports.InputManager = InputManager;
//# sourceMappingURL=InputManager.js.map