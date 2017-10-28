"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _1 = require("./");
var _2 = require("../utils/");
var TextAssetBuilder = (function () {
    function TextAssetBuilder() {
    }
    TextAssetBuilder.prototype.build = function (font, text, maxWidth, height, color) {
        var textViewPort = new _2.ViewPort();
        var textAsset = new _1.Asset(_1.AssetType.IMAGE);
        textViewPort.setFont(font);
        textViewPort.setColor(color || "green");
        textViewPort.setTextBaseline("hanging");
        if (!maxWidth) {
            maxWidth = textViewPort.measureText(text).width;
        }
        textViewPort.size = ({ width: maxWidth, height: height });
        textViewPort.setFont(font);
        textViewPort.setColor(color);
        textViewPort.setTextBaseline("hanging");
        textViewPort.drawText(text, 0, 0, maxWidth);
        textAsset.setData(textViewPort.getImage());
        return textAsset;
    };
    return TextAssetBuilder;
}());
exports.TextAssetBuilder = TextAssetBuilder;
//# sourceMappingURL=TextAssetBuilder.js.map