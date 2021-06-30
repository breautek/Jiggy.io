import {IEvent} from "../interfaces";

export interface IAttrDeleteEvent extends IEvent  {
    attribute : string,
    value : any
}
