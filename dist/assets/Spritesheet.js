"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ViewPort_1 = require("../utils/ViewPort");
var _1 = require("./");
var Spritesheet = (function () {
    function Spritesheet(spritesheetAsset, spritesheetDefinition) {
        this._spritesheetAsset = spritesheetAsset;
        this._spritesheetDefinition = spritesheetDefinition;
        this._spriteCache = {};
    }
    Spritesheet.prototype.getSprite = function (id) {
        if (this._spriteCache[id]) {
            return this._spriteCache[id];
        }
        else if (this._spritesheetDefinition[id]) {
            var def = this._spritesheetDefinition[id];
            var spriteViewPort = new ViewPort_1.ViewPort();
            this._spriteCache[id] = new _1.Asset(_1.AssetType.IMAGE);
            spriteViewPort.size = { width: def.width, height: def.height };
            spriteViewPort.context.translate(def.flipX === true ? def.width : 0, def.flipY === true ? def.height : 0);
            spriteViewPort.setScale({ width: def.flipX === true ? -1 : 1, height: def.flipY === true ? -1 : 1 });
            spriteViewPort.drawImage(this._spritesheetAsset.getData(), def.x, def.y, def.width, def.height, 0, 0, def.width, def.height);
            this._spriteCache[id].setData(spriteViewPort.getImage());
            return this._spriteCache[id];
        }
        else {
            return false;
        }
    };
    return Spritesheet;
}());
exports.Spritesheet = Spritesheet;
//# sourceMappingURL=Spritesheet.js.map