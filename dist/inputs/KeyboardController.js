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
var _1 = require("./");
var KeyboardController = (function (_super) {
    __extends(KeyboardController, _super);
    function KeyboardController() {
        var _this = _super.call(this) || this;
        _this._eventDetail = {
            keyCodes: [],
            keyCode: null,
            altKey: false,
            shiftKey: false,
            superKey: false
        };
        return _this;
    }
    KeyboardController.prototype.destroy = function () {
        window.removeEventListener('keyup', this._keyUpHandler);
        window.removeEventListener('keydown', this._keyDownHandler);
    };
    KeyboardController.prototype._keyDownHandler = function (e) {
        e.preventDefault();
        if (this._eventDetail.keyCodes.indexOf(e.keyCode) === -1) {
            this._updateEventDetail(e);
            this._onKeyDown();
        }
    };
    KeyboardController.prototype._keyUpHandler = function (e) {
        e.preventDefault();
        this._updateEventDetail(e);
        this._onKeyUp();
    };
    KeyboardController.prototype._attachEvents = function () {
        this._keyUpHandler = this._keyUpHandler.bind(this);
        this._keyDownHandler = this._keyDownHandler.bind(this);
        window.document.addEventListener('keydown', this._keyDownHandler);
        window.addEventListener('keyup', this._keyUpHandler);
    };
    KeyboardController.prototype._onKeyDown = function () {
        this._fireEvent(_1.InputEvent.BUTTON_DOWN, this._eventDetail);
    };
    KeyboardController.prototype._onKeyUp = function () {
        this._fireEvent(_1.InputEvent.BUTTON_UP, this._eventDetail);
    };
    KeyboardController.prototype._updateEventDetail = function (e) {
        this._eventDetail.altKey = e.altKey;
        this._eventDetail.shiftKey = e.shiftKey;
        this._eventDetail.superKey = e.metaKey;
        this._eventDetail.keyCode = e.keyCode;
        if (e.type === 'keydown') {
            if (this._eventDetail.keyCodes.indexOf(e.keyCode) === -1) {
                this._eventDetail.keyCodes.push(e.keyCode);
            }
        }
        else if (e.type === 'keyup') {
            if (this._eventDetail.keyCodes.indexOf(e.keyCode) > -1) {
                this._eventDetail.keyCodes.splice(this._eventDetail.keyCodes.indexOf(e.keyCode), 1);
            }
        }
    };
    KeyboardController.prototype.initialize = function (inputManager) {
        var _this = this;
        this.on(_1.InputEvent.BUTTON_DOWN.toString(), function (data) {
            inputManager.onInputReceived(_this, _1.InputEvent.BUTTON_DOWN, data);
        });
        this.on(_1.InputEvent.BUTTON_UP.toString(), function (data) {
            inputManager.onInputReceived(_this, _1.InputEvent.BUTTON_UP, data);
        });
    };
    return KeyboardController;
}(_1.Controller));
exports.KeyboardController = KeyboardController;
//# sourceMappingURL=KeyboardController.js.map