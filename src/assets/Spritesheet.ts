import {ViewPort} from "../utils";

import {
    Asset,
    AssetType
} from '.';
import {ISpritesheetDefinition} from './ISpritesheetDefinition';

export class Spritesheet {
    private $spritesheetAsset : Asset;
    private $spritesheetDefinition : Record<string, ISpritesheetDefinition>
    private $spriteCache : Record<string, Asset>

    public constructor (spritesheetAsset: Asset, spritesheetDefinition: {[key: string] : ISpritesheetDefinition}) {
        this.$spritesheetAsset = spritesheetAsset; //The asset for the entire spritesheet
        this.$spritesheetDefinition = spritesheetDefinition; //Definitions for sprites to coordinates
        this.$spriteCache = {}; //A cache of sprites images
    }

    getSprite (id: string) : any {
        if (this.$spriteCache[id]) {
            return this.$spriteCache[id];
        }
        else if (this.$spritesheetDefinition[id]) {
            let def = this.$spritesheetDefinition[id];

            //Create an Image for this Sprite

            let spriteViewPort = new ViewPort();
            this.$spriteCache[id] = new Asset(AssetType.IMAGE);
            spriteViewPort.setSize({width: def.width, height: def.height});
            spriteViewPort.getContext().translate(def.flipX === true ? def.width : 0, def.flipY === true ? def.height : 0)
            spriteViewPort.setScale({width: def.flipX === true ? -1 : 1, height: def.flipY === true ? -1 : 1});
            spriteViewPort.drawImage(this.$spritesheetAsset.getData(), def.x, def.y, def.width, def.height, 0, 0, def.width, def.height);
            this.$spriteCache[id].setData(spriteViewPort.getImage());

            return this.$spriteCache[id];
        }
        else {
            return false;
        }
    }
}
