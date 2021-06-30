import {IEvent} from "../interfaces";

export interface IShortAttrChangeEvent extends IEvent {
    attribute : string,
    value : any
}
