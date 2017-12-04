import { Coordinate } from "./Coordinate";


export class BoundingBox {
    private x1: number;
    private y1: number;
    private x2: number;
    private y2: number;

    public constructor(x1: number = 0, y1: number = 0, x2: number = 0, y2: number = 0) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }

    public getTopLeft(): Coordinate {
        return new Coordinate(this.x1, this.y1);
    }

    public getTopRight(): Coordinate {
        return new Coordinate(this.x2, this.y1);
    }

    public getBottomLeft(): Coordinate {
        return new Coordinate(this.x1, this.y2);
    }

    public getBottomRight(): Coordinate {
        return new Coordinate(this.x2, this.y2);
    }
}
