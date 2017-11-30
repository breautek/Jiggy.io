
import {CollisionStrategy} from './CollisionStrategy';
import {Entity} from '../entities';
import {Coordinate} from '../utils';

export class SimpleCollisionStrategy extends CollisionStrategy {
    private _isOverlapping(a1: number, a2: number, b1: number, b2: number): boolean {
        var overlapping: boolean = false;

        if (a1 > b1 && a1 < b2) {
            return true;
        }

        if (a2 > b1 && a2 < b2) {
            return true;
        }

        if (b1 > a1 && b1 < a2) {
            return true;
        }

        if (b2 > a1 && b2 < a2) {
            return true;
        }

        return overlapping;
    }

    public compare(e1: Entity, e2: Entity): boolean {
        var e1x : number = e1.getAbsoluteX();
        var e1x2: number = e1.getAbsoluteX2();
        var e1y : number = e1.getAbsoluteY();
        var e1y2: number = e1.getAbsoluteY2();
        var e2x : number = e2.getAbsoluteX();
        var e2x2: number = e2.getAbsoluteX2();
        var e2y : number = e2.getAbsoluteY();
        var e2y2: number = e2.getAbsoluteY2();

        // This is a test to see if the entity is NOT overlapping.
        // If any of the conditions fail below, then the 2
        // entities are overlapping.

        // var isXWithinRange: boolean = !(e1x > e2x2 && e1x2 > e2x);
        // var isYWithinRange: boolean = !(e1y > e2y2 && e1y2 > e2y);
        var isXWithinRange: boolean = this._isOverlapping(e1x, e1x2, e2x, e2x2);
        var isYWithinRange: boolean = this._isOverlapping(e1y, e1y2, e2y, e2y2);

        // console.log('x', isXWithinRange, 'y', isYWithinRange);

        // if (isXWithinRange && isYWithinRange) {
        //     console.log(e1.getName(), e2.getName());
        // }

        return isXWithinRange && isYWithinRange;

        
        // return !(
        //     e1x     >= e2x2     &&
        //     e2x     >= e1x2     &&
        //     e1y     >= e2y2     &&
        //     e2y     >= e1y2
        // );
    }
}
