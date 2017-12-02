import {Entity} from '../entities';
import {Coordinate} from '../utils';

export abstract class CollisionStrategy {
    public abstract compare(e1: Entity, e2: Entity): boolean;
    public abstract test(entities: Array<Entity>, coordinate: Coordinate): Array<Entity>
}
