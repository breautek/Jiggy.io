import {
    AssetState,
    AssetType,
    AssetLoader,
    Asset,
    AudioLoader,
    JSONLoader,
    ImageLoader
} from '.';

export class AssetFactory {
    private $assetLoader: AssetLoader;
    private $audioLoader: AudioLoader;
    private $imageLoader: ImageLoader;
    private $jsonLoader: JSONLoader;
    private $cache: Record<string, Asset>;
    private static $instance: AssetFactory;

    private constructor() {
        this.$assetLoader = new AssetLoader();
        this.$audioLoader = new AudioLoader();
        this.$imageLoader = new ImageLoader();
        this.$jsonLoader = new JSONLoader();
        this.$cache = {};
    }

    public static getSingleton(): AssetFactory {
        if (!AssetFactory.$instance) {
            AssetFactory.$instance = new AssetFactory();
        }
        return AssetFactory.$instance;
    }

    /**
     * public build
     *
     *	Builds an asset of the given type.
     *	See AssetType.
     * 
     * @param  {AssetType} type 
     * @param  {String} url  
     * @return {Asset}      
     */
    public build(type: AssetType, url: string): Asset {
        let asset: Asset;
        let cache: Asset = this.$cache[url];
        if (cache) {
            asset = this._clone(cache);
        }
        else {
            asset = new Asset(type, url);
        }

        if (!cache) {
            switch (type) {
                default:
                    break;
                case AssetType.RAW:
                    asset.setLoadStrategy(this.$assetLoader);
                    this._configureRawAsset(asset, url);
                    break;
                case AssetType.IMAGE:
                    asset.setLoadStrategy(this.$imageLoader);
                    this._configureImageAsset(asset, url);
                    break;
                case AssetType.AUDIO:
                    asset.setLoadStrategy(this.$audioLoader);
                    this._configureAudioAsset(asset, url);
                    break;
                case AssetType.JSON:
                    asset.setLoadStrategy(this.$jsonLoader);
                    this._configureJSONAsset(asset, url);
                    break;
            }
            this.$cache[url] = asset;
        }

        return asset;
    }

    /**
     * protected _configureRawAsset
     *
     *	Sets up specific asset details for Raw type assets.
     * 
     * @param  {zen.assets.Asset} asset 
     * @param  {String} url   
     * @return {void}       
     */
    protected _configureRawAsset(asset: Asset, url: string): void {}

    /**
     * protected _configureImageAsset
     *
     *	Sets up specific asset details for Image type assets.
     * 
     * @param  {zen.assets.Asset} asset 
     * @param  {String} url   
     * @return {void}       
     */
    protected _configureImageAsset(asset: Asset, url: string): void {
        let img: HTMLImageElement = document.createElement('img');
        img.addEventListener('load', function() {
            asset.setState(AssetState.LOADED);
        });
        asset.setData(img);
    }

    /**
     * protected _configureJSONAsset
     *
     *	Sets up specific asset details for JSON type assets.
     * 
     * @param  {zen.assets.Asset} asset 
     * @param  {String} url   
     * @return {void}       
     */
    protected _configureJSONAsset(asset: Asset, url: string): void {}

    /**
     * protected _configureAudioAsset
     *
     *	Sets up specific asset details for Audio type assets.
     * 
     * @param  {zen.assets.Asset} asset 
     * @param  {String} url
     * @return {void}       
     */
    protected _configureAudioAsset(asset: Asset, url: string): void {
        let audio: HTMLAudioElement = document.createElement('audio');
        audio.addEventListener('canplaythrough', function() {
            asset.setState(AssetState.LOADED);
        });
        asset.setData(audio);
    }

    /**
     * protected _clone
     *
     *	Clones a given asset.
     * 
     * @param  {zen.assets.Asset} asset 
     * @return {void}       
     */
    protected _clone(asset: Asset): Asset {
        let type: AssetType = asset.getType();
        let clone = new Asset(type, asset.getSource());
        this._cloneAssetData(clone, asset, type);
        return clone;
    }

    /**
     * protected _cloneAssetData
     *
     *	Can be overridden, but subclasses should always call this as a super
     *	method. Provides implementation to cloning each specific type of asset.
     * 
     * @param  {zen.assets.Asset} clone The clone
     * @param  {zen.assets.Asset} asset The original
     * @param  {Enumeration} type  
     * @return {void}       
     */
    protected _cloneAssetData(clone: Asset, asset: Asset, type: AssetType): void {
        let data: any = null;
        switch (type) {
            default:
                data = asset.getData();
                break;
            case AssetType.IMAGE:
                data = this._cloneNode(<Node>asset.getData());
                break;
            case AssetType.AUDIO:
                data = this._cloneNode(<Node>asset.getData());
                break;
        }

        clone.setLoadStrategy(asset.getLoadStrategy());
        clone.setData(data);
    }

    /**
     * protected _cloneNode
     *
     *	Clones a node style asset.
     * 
     * @param  {HTMLDomElement} node 
     * @return {HTMLDomElement}      a clone
     */
    protected _cloneNode(node: Node): Node {
        if (node) {
            return node.cloneNode(true);
        }
        else {
            return null;
        }
    }
}
