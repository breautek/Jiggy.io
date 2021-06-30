import { IEvent } from "../interfaces";
import { Coordinate } from "../utils";

export interface ILocationUpdateEvent extends IEvent {
    oldCoordinates: Coordinate;
    newCoordinates: Coordinate;
}
