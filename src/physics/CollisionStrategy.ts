import {Entity} from '../entities';
import {Coordinate} from '../utils';
import { BoundingBox } from '../utils/BoundingBox';

export abstract class CollisionStrategy {
    public abstract compare(e1: Entity, e2x: number, e2y: number, e2x2: number, e2y2: number): boolean;
    public abstract test(entities: Array<Entity>, coordinate: Coordinate): Array<Entity>
}
