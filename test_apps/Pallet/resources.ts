/// <reference path="../../src/assets/WebpackAssetSupport.d.ts" />

import {AssetType} from '../../src/assets/AssetType';
import {AssetGroupDefinition} from '../../src/assets/AssetGroupLoader';
import * as map from './Resources/61816.png';
import * as character from './Resources/3698.png';
import * as music from './Resources/music.mp3';
import * as pokeball from './Resources/pokeball.png';

var resources: AssetGroupDefinition = {
    assets : [
        {
            name: "map",
            type : AssetType.IMAGE,
            source : map
        },
        {
           name : "character",
           type : AssetType.IMAGE,
           source : character 
        },
        {
            name : "bgMusic",
            type : AssetType.AUDIO,
            source : music
        },
        {
            name : 'pokeball',
            type : AssetType.IMAGE,
            source : pokeball
        }
    ]
}

export = resources;

// export {resources};
// export default resources;
