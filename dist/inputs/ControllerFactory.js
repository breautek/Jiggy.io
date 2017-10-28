"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _1 = require("./");
var ControllerFactory = (function () {
    function ControllerFactory() {
    }
    ControllerFactory.getSingleton = function () {
        if (!ControllerFactory._instance) {
            ControllerFactory._instance = new ControllerFactory();
        }
        return ControllerFactory._instance;
    };
    ControllerFactory.prototype.create = function (type) {
        switch (type) {
            default:
                throw new Error('Controller Type is not supported.');
            case _1.ControllerType.MOUSE:
                return new _1.MouseController();
            case _1.ControllerType.KEYBOARD:
                return new _1.KeyboardController();
        }
    };
    return ControllerFactory;
}());
exports.ControllerFactory = ControllerFactory;
//# sourceMappingURL=ControllerFactory.js.map