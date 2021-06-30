
import {Asset} from './Asset';
import {AssetType} from './AssetType';
import {AssetGroup} from './AssetGroup';
import {AssetFactory} from './AssetFactory';
import {Engine} from '../core/Engine';
import {Iterator} from '../utils/Iterator';

export interface IAssetDefinition {
    name: string;
    type: AssetType;
    source: string;
}

export interface IAssetGroupDefinition {
    assets: Array<IAssetDefinition>;
}

export class AssetGroupLoader {
    private $assetFactory: AssetFactory;

    public constructor() {
        this.$assetFactory = Engine.getInstance().getAssetFactory();
    }

    /**
     * Loads an AssetGroup defined by a JSON structure.
     * 
     * Expected JSON structure by using the interfaces above:
     * {
     *      assets [
     *          {
     *              name : string,
     *              type : AssetType (use the string value),
     *              source : string
     *          }
     *      ]
     * }
     * 
     * Note, the returned AssetGroup will be in an unloaded state.
     * 
     * The file must be a JSON file.
     * 
     * @param path 
     */
    public load(path: string): Promise<AssetGroup> {
        return new Promise<AssetGroup>((resolve, reject) => {
            let json: Asset = this.$assetFactory.build(AssetType.JSON, path);

            json.load().then((assetGroupDefs: Asset) => {
                let data: IAssetGroupDefinition = assetGroupDefs.getData();
                resolve(this.$createGroup(data));
            }).catch(reject);
        });
    }

    public loadFromAsset(asset: Asset): AssetGroup {
        if (asset.getType() !== AssetType.JSON) {
            throw new Error('loadFromAsset expects a JSON asset.');
        }

        return this.$createGroup(asset.getData());
    }

    public loadFromMemory(data: IAssetGroupDefinition): AssetGroup {
        return this.$createGroup(data);
    }

    private $createGroup(data: IAssetGroupDefinition): AssetGroup {
        let iterator: Iterator<IAssetDefinition> = new Iterator<IAssetDefinition>(data.assets);
        let group: AssetGroup = new AssetGroup();

        while (iterator.hasNext()) {
            let assetDef: IAssetDefinition = iterator.next();
            let asset: Asset = this.$assetFactory.build(assetDef.type, assetDef.source);
            group.addAsset(assetDef.name, asset);
        }

        return group;
    }
}
