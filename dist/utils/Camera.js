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
//# sourceMappingURL=Camera.js.map