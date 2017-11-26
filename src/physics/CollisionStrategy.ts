import {Entity} from '../entities';

export abstract class CollisionStrategy {
    public abstract compare(e1: Entity, e2: Entity): boolean;
}
