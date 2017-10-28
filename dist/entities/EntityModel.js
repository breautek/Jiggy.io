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
var _1 = require("../utils/");
var EntityModel = (function (_super) {
    __extends(EntityModel, _super);
    function EntityModel() {
        var _this = _super.call(this) || this;
        _this._attributes = {};
        _this._id = _1.IDGenerator.getSingleton().generate();
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
//# sourceMappingURL=EntityModel.js.map