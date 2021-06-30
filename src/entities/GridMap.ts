import {Entity} from "./Entity";
import {
    IDimension,
    ICoordinate
} from '../interfaces';

export class GridMap extends Entity {
    public tileSize : IDimension;
    public tileCount : ICoordinate;
    private $tiles : Array<Array<Entity>>;

    public constructor (tileSize: IDimension, tileCount: ICoordinate) {
        super();

        this.tileSize = tileSize;
        this.tileCount = tileCount;
        this.$tiles = [];

        this.setWidth(this.tileSize.width * this.tileCount.x);
        this.setHeight(this.tileSize.height * this.tileCount.y);

        for (let x: number = 0; x < this.tileCount.x; x ++) {
            for (let y: number = 0; y < this.tileCount.y; y++) {
                let tile = this._buildTile(x, y);

                this.addChild(tile);

                if (!this.$tiles[x]) {
                    this.$tiles[x] = [];
                }

                this.$tiles[x][y] = tile;
            }
        }
    }

    protected _buildTile(x: number, y: number) : Entity {
        let tile = new Entity();
        tile.setWidth(this.tileSize.width);
        tile.setHeight(this.tileSize.height);
        tile.setX((x) * this.tileSize.width);
        tile.setY((y) * this.tileSize.height);
        return tile;
    }

    public getTile (coordinate: ICoordinate) : Entity {
        return this.$tiles[coordinate.x][coordinate.y];
    }

    public getTiles () : Array<Entity> {
        return this._children;
    }
}
