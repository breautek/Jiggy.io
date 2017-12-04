
import {CollisionStrategy} from './CollisionStrategy';
import {Entity} from '../entities';
import {Coordinate} from '../utils';

export class SimpleCollisionStrategy extends CollisionStrategy {
    public test(entities: Array<Entity>, coordinate: Coordinate): Array<Entity> {
        var hitEntities: Array<Entity> = [];

        for (var i: number = 0; i < entities.length; i++) {
            var entity: Entity = entities[i];
            var x1: number = entity.getAbsoluteX();
            var x2: number = entity.getAbsoluteX2();
            var y1: number = entity.getAbsoluteY();
            var y2: number = entity.getAbsoluteY2();
            
            if (coordinate.getX() >= x1 && coordinate.getX() <= x2 &&
                coordinate.getY() >= y1 && coordinate.getY() <= y2) {
                hitEntities.push(entity);
            }
        }

        return hitEntities;
    }

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

    public compare(e1: Entity, e2x: number, e2y: number, e2x2: number, e2y2: number): boolean {
        var e1x : number = e1.getAbsoluteX();
        var e1x2: number = e1.getAbsoluteX2();
        var e1y : number = e1.getAbsoluteY();
        var e1y2: number = e1.getAbsoluteY2();

        // This is a test to see if the entity is NOT overlapping.
        // If any of the conditions fail below, then the 2
        // entities are overlapping.

        var isXWithinRange: boolean = this._isOverlapping(e1x, e1x2, e2x, e2x2);
        var isYWithinRange: boolean = this._isOverlapping(e1y, e1y2, e2y, e2y2);

        return isXWithinRange && isYWithinRange;
    }
}
