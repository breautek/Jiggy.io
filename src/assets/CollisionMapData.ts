import { Color } from "../utils/Color";


export class CollisionMapData {
    private _data: ImageData;
    
    constructor(data: ImageData) {
        this._data = data;
    }

    public pick(x: number, y: number): Color {
        console.log(this._data);

        return new Color();
    }
}