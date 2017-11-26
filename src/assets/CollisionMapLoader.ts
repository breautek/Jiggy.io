import {
    Asset,
    AssetLoader,
    AssetState,
    CollisionMapData
} from '../assets';

import {
    ViewPort
} from '../utils'

export class CollisionMapLoader extends AssetLoader {

    public load(asset: Asset): Promise<Asset> {
        asset.setState(AssetState.LOADING);

        return new Promise<Asset>((resolve, reject) => {
            var image: HTMLImageElement = document.createElement('img');
            
            image.onload = () => {
                var viewport: ViewPort = new ViewPort();
                viewport.setSize({
                    width : image.width,
                    height: image.height
                });
                viewport.getContext().drawImage(image, 0, 0, image.width, image.height);
                var data: ImageData = viewport.getContext().getImageData(0, 0, image.width, image.height);

                image.onerror = null;
                image.onload = null;
                image.src = null;

                this._onSuccess(asset, new CollisionMapData(data), resolve);
            };

            image.onerror = (e: any) => {
                this._onFail(asset, e, reject);
            };

            image.src = asset.getSource(); 
        });
    }

    public unload(asset: Asset): Promise<Asset> {
        asset.setState(AssetState.UNLOADING);

        return new Promise<Asset>((resolve, reject) => {
            asset.setData(null);
            asset.setState(AssetState.NOT_LOADED);
            resolve(asset);
        });
    }
}
