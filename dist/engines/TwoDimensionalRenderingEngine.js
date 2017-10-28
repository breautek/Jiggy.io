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
//# sourceMappingURL=TwoDimensionalRenderingEngine.js.map