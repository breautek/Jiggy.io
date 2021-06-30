import {Entity, EntityEventTypes, ILocationUpdateEvent} from "../entities";
import { Coordinate } from ".";

type CollisionEmitterListener = (entity1: Entity, entity2: Entity, event: ILocationUpdateEvent) => void;

export class CollisionEmitter {
    private $entities : Array<Entity>;
    private $entitiesListeners : Record<string, Array<CollisionEmitterListener>>
    private $listeners : Array<CollisionEmitterListener>;
    private $cbs : Record<string, (eventType: string) => void>;

    public constructor () {
        this.$cbs = {};
        this.$entities = [];
        this.$entitiesListeners = {};
        this.$listeners = [];
        this.$cbs[EntityEventTypes.LOCATION_UPDATE] = this.$onEntityLocationUpdate.bind(this)
    }

    public addEntity (entity: Entity) : void {
        if (!this.hasEntity(entity)) {
            this.$entities.push(entity);
            this.$entitiesListeners[entity.getID()] = [];

            entity.on(EntityEventTypes.LOCATION_UPDATE.toString(), this.$cbs[EntityEventTypes.LOCATION_UPDATE]);
            // entity.on("dimension_update", this._onEntityUpgrade.bind(this));
        }
    }

    public removeEntity (entity: Entity) : void {
        if (this.hasEntity(entity)) {
            this.$entities.splice(this.$entities.indexOf(entity), 1);
            delete this.$entitiesListeners[entity.getID()];
        }
    }

    public hasEntity (entity: Entity) : boolean {
        return Object.prototype.hasOwnProperty.call(this.$entitiesListeners, entity.getID());
    }

    public addEntityCollisionListener (entity: Entity, callback: (entity1: Entity, entity2: Entity, event: ILocationUpdateEvent) => void) : void {
        if (!this.hasEntity(entity)) {
            this.addEntity(entity);
        }

        this.$entitiesListeners[entity.getID()].push(callback);
    }

    public removeEntityCollisionListener (entity: Entity, callback: (entity1: Entity, entity2: Entity, event: ILocationUpdateEvent) => void) : void {
        if (this.$entitiesListeners[entity.getID()].indexOf(callback) > -1) {
            this.$entitiesListeners[entity.getID()].splice(this.$entitiesListeners[entity.getID()].indexOf(callback), 1);
        }
    }

    public addCollisionListener (callback: (entity1: Entity, entity2: Entity, event: ILocationUpdateEvent) => void) : void {
        this.$listeners.push(callback);
    }

    public removeCollisionListener (callback: (entity1: Entity, entity2: Entity, event: ILocationUpdateEvent) => void) : void {
        if (this.$listeners.indexOf(callback) > -1) {
            this.$listeners.splice(this.$listeners.indexOf(callback), 1);
        }
    }

    private $onEntityLocationUpdate (event: ILocationUpdateEvent) : void {
        //Check for possible collisions
        let entity : Entity = event.source;

        if (entity.getParent()) {
            let potCollisions : Array<Entity> = entity.getParent().findChildren(new Coordinate(entity.getX(), entity.getY()), new Coordinate(entity.getX2(), entity.getY2()));
            let collisions : Array<Entity> = [];

            for (let i in potCollisions) {
                let potEntity = potCollisions[i];

                if (potEntity !== entity && this.hasEntity(potEntity)) {
                    collisions.push(potEntity);
                }
            }

            if (collisions.length > 0) {
                //ALERT THE TROOPS!!
                for (let i in this.$listeners) {
                    let listener = this.$listeners[i];
                    listener(entity, collisions[0], event);
                }
            }
        }
    }
}
