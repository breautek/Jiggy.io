/**
 * Vector3D class
 * 
 * This class is largely immutable, except for any setter methods. Setter methods will modify and return the
 * same instance. Arithmic methods will return a new Vector3D class.
 */

 import {Radian} from './Radian';

export class Vector3D {
    private x: number;
    private y: number;
    private z: number;

    public constructor(x: number = 0, y: number = 0, z: number = 0) {
        this.x = 0;
        this.y = 0;
        this.z = 0;
    }

    public set(x: number, y: number, z: number): Vector3D {
        this.setX(x);
        this.setY(y);
        this.setZ(z);
        return this;
    }

    public setX(x: number): Vector3D {
        this.x = x;
        return this;
    }

    public setY(y: number): Vector3D {
        this.y = y;
        return this;
    }

    public setZ(z: number): Vector3D {
        this.z = z;
        return this;
    }

    public getX(): number {
        return this.x;
    }

    public getY(): number {
        return this.y;
    }

    public getZ(): number {
        return this.z;
    }

    public clone(): Vector3D {
        return new Vector3D(this.getX(), this.getY(), this.getZ());
    }

    public add(vect: Vector3D): Vector3D {
        var x1: number = this.getX();
        var y1: number = this.getY();
        var z1: number = this.getZ();
        var x2: number = vect.getX();
        var y2: number = vect.getY();
        var z2: number = vect.getZ();

        return new Vector3D(x1 + x2, y1 + y2, z1 + z2);
    }

    public subtract(vect: Vector3D): Vector3D {
        var x1: number = this.getX();
        var y1: number = this.getY();
        var z1: number = this.getZ();
        var x2: number = vect.getX();
        var y2: number = vect.getY();
        var z2: number = vect.getZ();

        return new Vector3D(x1 - x2, y1 - y2, z1 - z2);
    }

    public multiply(vect: Vector3D): Vector3D {
        var x1: number = this.getX();
        var y1: number = this.getY();
        var z1: number = this.getZ();
        var x2: number = vect.getX();
        var y2: number = vect.getY();
        var z2: number = vect.getZ();

        return new Vector3D(x1 * x2, y1 * y2, z1 * z2);
    }

    public divide(vect: Vector3D): Vector3D {
        var x1: number = this.getX();
        var y1: number = this.getY();
        var z1: number = this.getZ();
        var x2: number = vect.getX();
        var y2: number = vect.getY();
        var z2: number = vect.getZ();

        var x: number = 0;
        var y: number = 0;
        var z: number = 0;

        if (x2 !== 0) {
            x = x1 / x2;
        }

        if (y2 !== 0) {
            y = y1 / y2;
        }

        if (z2 !== 0) {
            z = z1 / z2;
        }

        return new Vector3D(x, y, z);
    }

    public magnitude(): number {
        var x: number = this.getX();
        var y: number = this.getY();
        var z: number = this.getZ();

        return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2) + Math.pow(z, 2));
    }

    public equals(vect: Vector3D): boolean {
        return (this.getX() === vect.getX() && this.getY() === vect.getY() && this.getZ() === vect.getZ());
    }

    public dot(vect: Vector3D): number {
        return (this.getX() * vect.getX()) + (this.getY() * vect.getY()) + (this.getZ() * vect.getZ());
    }

    public normalize(): Vector3D {
        var mag: number = this.magnitude();
        if (mag > 0) {
            return this.divide(new Vector3D(mag, mag, mag));
        }
        else {
            return this.clone();
        }
    }

    public reflect(normal: Vector3D): Vector3D {
        var v: Vector3D = new Vector3D(2, 2, 2);
        var dot: number = normal.dot(this);

        v = v.multiply(normal);
        v = v.multiply(new Vector3D(dot, dot, dot));
        v = this.subtract(v);

        return v.inverse();
    }

    public inverse(): Vector3D {
        return new Vector3D(-this.getX(), -this.getY(), -this.getZ());
    }

    public getAngle(): Radian {
        //TODO
        return new Radian();
    }

    public toString(): string {
        return `(${this.getX()},${this.getY()},${this.getZ()})`;
    }

    public static zero(): Vector3D {
        return new Vector3D(0, 0, 0);
    }

    public static one(): Vector3D {
        return new Vector3D(1, 1, 1);
    }
}
