import {IEvent, IDimension} from "../interfaces";

export interface IDimensionUpdateEvent extends IEvent {
    oldDimensions: IDimension;
    newDimensions: IDimension;
}
