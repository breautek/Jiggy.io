"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("./utils");
var audio_1 = require("./audio");
var assets_1 = require("./assets");
var Engine = (function () {
    function Engine() {
        if (Engine._instance) {
            throw new Error('Engine is a singleton');
        }
        Engine._instance = this;
        this.debugMode = false;
        this.logManager = utils_1.LogManager.getSingleton();
        this.assetFactory = assets_1.AssetFactory.getSingleton();
        this.audioEngine = new audio_1.HTML5AudioEngine();
        this.viewPort = new utils_1.ViewPort();
        this.logManager.log(utils_1.SeverityEnum.INFO, 'Engine has started.');
    }
    Engine.getSingleton = function () {
        if (!Engine._instance) {
            new Engine();
        }
        return Engine._instance;
    };
    Object.defineProperty(Engine.prototype, "renderingEngine", {
        get: function () {
            return this._renderingEngine;
        },
        set: function (renderingEngine) {
            if (this.renderingEngine) {
            }
            this._renderingEngine = renderingEngine;
            this._renderingEngine.viewPort = this.viewPort;
            this._renderingEngine.startRendering();
        },
        enumerable: true,
        configurable: true
    });
    return Engine;
}());
exports.Engine = Engine;
exports.default = Engine;
//# sourceMappingURL=Engine.js.map