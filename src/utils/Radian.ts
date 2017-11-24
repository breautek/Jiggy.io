
export class Radian {
    private value: number;

    public constructor(value: number = 0) {
        this.value = value;
    }

    public setValue(value: number): Radian {
        this.value = value;
        return this;
    }

    public getValue(): number {
        return this.value;
    }

    public toString(): string {
        return this.value.toString();
    }

    public toDegrees(): number {
        return this.getValue() * 180 / Math.PI;
    }

    public static fromDegrees(degrees: number): Radian {
        return new Radian(degrees * Math.PI / 180);
    }
}
