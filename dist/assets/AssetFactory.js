"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _1 = require("./");
var AssetFactory = (function () {
    function AssetFactory() {
        this._assetLoader = new _1.AssetLoader();
        this._audioLoader = new _1.AudioLoader();
        this._imageLoader = new _1.ImageLoader();
        this._jsonLoader = new _1.JSONLoader();
        this._cache = {};
    }
    AssetFactory.getSingleton = function () {
        if (!AssetFactory._instance) {
            AssetFactory._instance = new AssetFactory();
        }
        return AssetFactory._instance;
    };
    AssetFactory.prototype.build = function (type, url) {
        var asset;
        var cache = this._cache[url];
        if (cache) {
            asset = this._clone(cache);
        }
        else {
            asset = new _1.Asset(type, url);
        }
        if (!cache) {
            switch (type) {
                default:
                    break;
                case _1.AssetType.RAW:
                    asset.setLoadStrategy(this._assetLoader);
                    this._configureRawAsset(asset, url);
                    break;
                case _1.AssetType.IMAGE:
                    asset.setLoadStrategy(this._imageLoader);
                    this._configureImageAsset(asset, url);
                    break;
                case _1.AssetType.AUDIO:
                    asset.setLoadStrategy(this._audioLoader);
                    this._configureAudioAsset(asset, url);
                    break;
                case _1.AssetType.JSON:
                    asset.setLoadStrategy(this._jsonLoader);
                    this._configureJSONAsset(asset, url);
                    break;
            }
            this._cache[url] = asset;
        }
        return asset;
    };
    AssetFactory.prototype._configureRawAsset = function (asset, url) { };
    AssetFactory.prototype._configureImageAsset = function (asset, url) {
        var img = document.createElement('img');
        img.addEventListener('load', function () {
            asset.setState(_1.AssetState.LOADED);
        });
        asset.setData(img);
    };
    AssetFactory.prototype._configureJSONAsset = function (asset, url) { };
    AssetFactory.prototype._configureAudioAsset = function (asset, url) {
        var audio = document.createElement('audio');
        audio.addEventListener('canplaythrough', function () {
            asset.setState(_1.AssetState.LOADED);
        });
        asset.setData(audio);
    };
    AssetFactory.prototype._clone = function (asset) {
        var type = asset.getType();
        var clone = new _1.Asset(type, asset.getSource());
        this._cloneAssetData(clone, asset, type);
        return clone;
    };
    AssetFactory.prototype._cloneAssetData = function (clone, asset, type) {
        var data = null;
        switch (type) {
            default:
                data = asset.getData();
                break;
            case _1.AssetType.IMAGE:
                data = this._cloneNode(asset.getData());
                break;
            case _1.AssetType.AUDIO:
                data = this._cloneNode(asset.getData());
                break;
        }
        clone.setLoadStrategy(asset.getLoadStrategy());
        clone.setData(data);
    };
    AssetFactory.prototype._cloneNode = function (node) {
        if (node) {
            return node.cloneNode(true);
        }
        else {
            return null;
        }
    };
    return AssetFactory;
}());
exports.AssetFactory = AssetFactory;
//# sourceMappingURL=AssetFactory.js.map