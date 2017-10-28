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
var Events = require("events");
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
//# sourceMappingURL=ViewPort.js.map