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
//# sourceMappingURL=CollisionEmitter.js.map