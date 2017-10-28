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
var MouseController = (function (_super) {
    __extends(MouseController, _super);
    function MouseController() {
        var _this = _super.call(this) || this;
        _this._eventDetails = {
            altKey: false,
            shiftKey: false,
            superKey: false,
            x: -1,
            y: -1,
            buttons: [],
            button: null
        };
        _this._x = -1;
        _this._y = -1;
        return _this;
    }
    MouseController.prototype.destroy = function () {
        document.body.removeEventListener('mousedown', this._mouseDownHandler);
        document.body.removeEventListener('mouseup', this._mouseUpHandler);
        document.body.removeEventListener('mousemove', this._mouseMoveHandler);
        window.removeEventListener('contextmenu', this._contextMenuHandler);
        window.removeEventListener('wheel', this._wheelHandler);
    };
    MouseController.prototype._getMouseButton = function (e) {
        switch (e.button) {
            case 0:
                return _1.MouseButton.BUTTON_LEFT;
            case 1:
                return _1.MouseButton.BUTTON_MIDDLE;
            case 2:
                return _1.MouseButton.BUTTON_RIGHT;
        }
        throw new Error('Unrecognized Mouse Button.');
    };
    MouseController.prototype._mouseDownHandler = function (e) {
        var mouseButton = this._getMouseButton(e);
        if (this._eventDetails.buttons.indexOf(mouseButton) === -1) {
            this._updateEventDetail(e);
            this._onMouseDown();
        }
    };
    MouseController.prototype._mouseUpHandler = function (e) {
        this._updateEventDetail(e);
        this._onMouseUp();
    };
    MouseController.prototype._mouseMoveHandler = function (e) {
        this._updateEventDetail(e);
        if (this._eventDetails.x !== this._x || this._eventDetails.y !== this._y) {
            this._x = this._eventDetails.x;
            this._y = this._eventDetails.y;
            this._onMouseMove();
        }
    };
    MouseController.prototype._contextMenuHandler = function (e) {
        e.preventDefault();
    };
    MouseController.prototype._wheelHandler = function (e) {
        e.preventDefault();
        this._updateEventDetail(e);
        this._onMouseWheel();
    };
    MouseController.prototype._attachEvents = function () {
        window.addEventListener('wheel', this._wheelHandler);
        document.body.addEventListener('contextmenu', this._contextMenuHandler);
        document.body.addEventListener('mousedown', this._mouseDownHandler);
        document.body.addEventListener('mouseup', this._mouseUpHandler);
        document.body.addEventListener('mousemove', this._mouseMoveHandler);
    };
    MouseController.prototype._onMouseDown = function () {
        this._fireEvent(_1.InputEvent.BUTTON_DOWN, this._eventDetails);
    };
    MouseController.prototype._onMouseUp = function () {
        this._fireEvent(_1.InputEvent.BUTTON_UP, this._eventDetails);
    };
    MouseController.prototype._onMouseMove = function () {
        this._fireEvent(_1.InputEvent.POINTER_MOVE, this._eventDetails);
    };
    MouseController.prototype._onMouseWheel = function () {
        this._fireEvent(_1.InputEvent.WHEEL, this._eventDetails);
    };
    MouseController.prototype._updateEventDetail = function (e) {
        var mouseButton = this._getMouseButton(e);
        this._eventDetails.altKey = e.altKey;
        this._eventDetails.shiftKey = e.shiftKey;
        this._eventDetails.superKey = e.metaKey;
        this._eventDetails.button = e.button;
        this._eventDetails.x = e.x;
        this._eventDetails.y = e.y;
        if (e.type === 'mousedown') {
            if (this._eventDetails.buttons.indexOf(mouseButton) === -1) {
                this._eventDetails.buttons.push(mouseButton);
            }
        }
        else if (e.type === 'mouseup') {
            if (this._eventDetails.buttons.indexOf(mouseButton) > -1) {
                this._eventDetails.buttons.splice(this._eventDetails.buttons.indexOf(mouseButton), 1);
            }
        }
    };
    MouseController.prototype.initialize = function (inputManager) {
        var _this = this;
        this.on(_1.InputEvent.BUTTON_DOWN.toString(), function (data) {
            inputManager.onInputReceived(_this, _1.InputEvent.BUTTON_DOWN, data);
        });
        this.on(_1.InputEvent.BUTTON_UP.toString(), function (data) {
            inputManager.onInputReceived(_this, _1.InputEvent.BUTTON_UP, data);
        });
        this.on(_1.InputEvent.POINTER_MOVE.toString(), function (data) {
            inputManager.onInputReceived(_this, _1.InputEvent.POINTER_MOVE, data);
        });
        this.on(_1.InputEvent.WHEEL.toString(), function (data) {
            inputManager.onInputReceived(_this, _1.InputEvent.WHEEL, data);
        });
    };
    return MouseController;
}(_1.Controller));
exports.MouseController = MouseController;
//# sourceMappingURL=MouseController.js.map