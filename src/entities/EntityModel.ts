import * as Events from 'events';
import {IDGenerator} from "../utils";
import { Asset } from "../assets";
import { Coordinate } from "../utils";
import {
    ModelEventTypes,
    IAttrDeleteEvent
} from '.';

export class EntityModel extends Events.EventEmitter {
    private $attributes : Record<string, any>;
    private $id : string;
    private $type: string;
    private $position: Coordinate;
    private $texture : Asset;

    public constructor () {
        super();
        this.$attributes = {};
        this.$id = IDGenerator.getSingleton().generate();
        this.$type = 'generic';
        this.$position = new Coordinate(0, 0);
    }

    public getID () : string {
        return this.$id;
    }

    public setType(type: string): void {
        this.$type = type;
    }

    public getType(): string {
        return this.$type;
    }

    public setTexture (asset: Asset): void {
        this.$texture = asset;
        this.emit(ModelEventTypes.TEXTURE_CHANGE.toString(), {
            attribute : 'texture',
            name : name,
            value : asset
        });
    }

    public getTexture () : Asset {
        return this.$texture;
    }

    public setAttribute (key : string, value : any) : void {
        let oldValue = this.getAttribute(key);
        this.$attributes[key] = value;
        this.emit(ModelEventTypes.ATTR_CHANGE.toString(), {
            attribute : key,
            oldValue : oldValue,
            value : value
        });
    }

    public removeAttribute(key: string) : void {
        let value = this.getAttribute(key);
        delete this.$attributes[key];
        // if (this._isNotifierKey(key)) {
        let data : IAttrDeleteEvent = {
            type: ModelEventTypes.ATTR_DELETE.toString(),
            attribute : key,
            value : value,
            source: this
        };

        this.emit(ModelEventTypes.ATTR_DELETE.toString(), data);
        // }
    }

    public getAttribute (key : string) : any {
        return this.$attributes[key];
    }

    public hasAttribute (key: string) : boolean {
        if (this.$attributes[key]) {
            return true;
        }
        else {
            return false;
        }
    }

    // public iterator () : Iterator {
    // 	// return new Iterator(this._attributes);
    // }

    public sync (listener : any) : void {
        // var evt = ModelEventTypes.ATTR_CHANGE.toString();
        // var iter = this.iterator();
        // var item : any;
        // while (iter.hasNext()) {
        // 	item = iter.next();
        // 	listener.notify(evt, {
        // 		attribute 	: item.key,
        // 		value 		: item.value
        // 	});
        // }
        // listener.notify(evt, {
        // 	attribute 	: 'textures',
        // 	value 		: this.collectTextures()
        // });
    }
    public getX(): number {
        return this.$position.getX();
    }
    public getY(): number {
        return this.$position.getY();
    }
    public setX(x: number): void {
        this.$position.setX(x);
    }
    public setY(y: number): void {
        this.$position.setY(y);
    }
    public setZ(z: number): void {
        this.$position.setZ(z);
    }
    public getZ(): number {
        return this.$position.getZ();
    }
    public getPosition(): Coordinate {
        return this.$position;
    }
    public setPosition(position: Coordinate): void {
        this.$position = position;
    }
}
