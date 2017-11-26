
import {CollisionStrategy} from './CollisionStrategy';
import {Entity} from '../entities';
import {Coordinate} from '../utils';

export class SimpleCollisionStrategy extends CollisionStrategy {
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

        var isXWithinRange: boolean = !(e1x > e2x2 && e1x2 > e2x);
        var isYWithinRange: boolean = !(e1y > e2y2 && e1y2 > e2y);

        return isXWithinRange && isYWithinRange;

        
        // return !(
        //     e1x     >= e2x2     &&
        //     e2x     >= e1x2     &&
        //     e1y     >= e2y2     &&
        //     e2y     >= e1y2
        // );
    }
}
