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
var _1 = require("../assets/");
var _2 = require("./");
var Iterator_1 = require("../utils/Iterator");
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
            model = new _2.EntityModel();
            useDefaults = true;
        }
        _this.view = new _2.EntityView(model);
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
            if (asset.getType() !== _1.AssetType.IMAGE) {
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
        return new Iterator_1.Iterator(this._children);
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
            return new Iterator_1.Iterator(children);
        }
        else if (startCoordinate) {
            var region = this._coordinateToRegion(startCoordinate);
            var children = [];
            var childrenIterator = new Iterator_1.Iterator(this._getChildrenInRegion({ x: region.x, y: region.y }));
            while (childrenIterator.hasNext()) {
                var child = childrenIterator.next();
                var childCoordinate = child.getCoordinate();
                var childOuterCoordinate = child.getOuterCoordinate();
                if (childCoordinate.x <= startCoordinate.x && childCoordinate.y <= startCoordinate.y
                    && childOuterCoordinate.x >= startCoordinate.x && childOuterCoordinate.y >= startCoordinate.y) {
                    children.push(child);
                }
            }
            return new Iterator_1.Iterator(children);
        }
        else {
            return new Iterator_1.Iterator(this._children);
        }
    };
    Entity.prototype.findChildren = function (startCoordinate, endCoordinate) {
        var children = [];
        if (this._children.length > 0) {
            if (startCoordinate && !endCoordinate) {
                var region = this._coordinateToRegion(startCoordinate);
                var regionChildren = this._getChildrenInRegion({ x: region.x, y: region.y });
                if (regionChildren.length > 0) {
                    var childrenIterator = new Iterator_1.Iterator(regionChildren);
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
        var childrenIterator = new Iterator_1.Iterator(regionChildren);
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
//# sourceMappingURL=Entity.js.map