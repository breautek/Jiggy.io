
import {
    Asset,
    AssetLoader
} from '.';

export class JSONLoader extends AssetLoader {
    public constructor() {
        super();
    }

    /**
     * protected _onSuccess
     *
     *	See AssetLoader._onSuccess for more details.
     * 
     * @param  {Asset} asset 
     * @param  {Stringified JSON} data  
     * @return {void}       
     */
    protected _onSuccess(asset: Asset, data: any, resolve: (asset: Asset) => void): void {
        let json: string = <string>data;
        asset.setData(JSON.parse(json));
        resolve(asset);
    }
}
