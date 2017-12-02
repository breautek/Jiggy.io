import * as Events from 'events';
import {Iterator, IDGenerator} from "../utils";
import { Asset } from "../assets";
import { Coordinate } from "../utils";
import {
	ModelEventTypes,
	ShortAttrChangeEvent,
	TextureChangeEvent,
	AttrDeleteEvent
} from './';

export class EntityModel extends Events.EventEmitter {
	private _attributes : {[key: string]: any};
	private _id : string;
    private _type: string;
    private _position: Coordinate;
	private _texture : Asset;

	public constructor () {
		super();
		this._attributes = {};
		this._id = IDGenerator.getSingleton().generate();
        this._type = 'generic';
        this._position = new Coordinate(0, 0);
	}

	public getID () : string {
		return this._id;
	}

	public setType(type: string): void {
		this._type = type;
	}

	public getType(): string {
		return this._type;
	}

	public setTexture (asset: Asset): void {
		this._texture = asset;
		this.emit(ModelEventTypes.TEXTURE_CHANGE.toString(), {
			attribute : 'texture',
			name : name,
			value : asset
		});
	}

	public getTexture () : Asset {
		return this._texture;
	}

	public setAttribute (key : string, value : any) : void {
		var oldValue = this.getAttribute(key);
		this._attributes[key] = value;
		this.emit(ModelEventTypes.ATTR_CHANGE.toString(), {
			attribute : key,
			oldValue : oldValue,
			value : value
		});
	}

	public removeAttribute(key: string) : void {
		var value = this.getAttribute(key);
		delete this._attributes[key];
		// if (this._isNotifierKey(key)) {
			var data : AttrDeleteEvent = {
				type: ModelEventTypes.ATTR_DELETE.toString(),
				attribute : key,
				value : value,
				source: this
			};

			this.emit(ModelEventTypes.ATTR_DELETE.toString(), data);
		// }
	}

	public getAttribute (key : string) : any {
		return this._attributes[key];
	}

	public hasAttribute (key: string) : boolean {
		if (this._attributes[key]) {
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
        return this._position.getX();
    }
    public getY(): number {
        return this._position.getY();
    }
    public setX(x: number): void {
        this._position.setX(x);
    }
    public setY(y: number): void {
        this._position.setY(y);
    }
    public setZ(z: number): void {
        this._position.setZ(z);
    }
    public getZ(): number {
        return this._position.getZ();
    }
    public getPosition(): Coordinate {
        return this._position.clone();
    }
    public setPosition(position: Coordinate): void {
        this._position = position;
    }
}