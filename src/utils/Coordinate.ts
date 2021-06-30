export class Coordinate {
    private $x: number;
    private $y: number;
    private $z: number;

    constructor (x: number, y: number, z?: number) {
        this.$x = x;
        this.$y = y;
        this.$z = z || 0;
    }
    
    public toCartesian(): Coordinate {
        return new Coordinate((2 * this.$y + this.$x) / 2, (2 * this.$y - this.$x) / 2, this.$z);
    }
    
    public static fromIsometric(x: number, y: number): Coordinate {
        return new Coordinate((2 * y + x) / 2, (2 * y - x) / 2);
    }
    
    public toIsometric(): Coordinate {
        return new Coordinate(this.$x  - this.$y, (this.$x + this.$y) / 2, this.$z);
    }
    
    public setX(x: number): void {
        this.$x = x;
    }
    
    public setY(y: number): void {
        this.$y = y;
    }
    
    public getX(): number {
        return this.$x;
    }

    public getY(): number {
        return this.$y;
    }

    public getZ(): number {
        return this.$z;
    }

    public setZ(z: number): void {
        this.$z = z;
    }
    
    public incrementX(x: number): void {
        this.$x += x;
    }
    
    public incrementY(y: number): void {
        this.$y += y;
    }
    
    public incrementZ(z: number): void {
        this.$z += z;
    }
}
