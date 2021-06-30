import {Event} from "../interfaces";

export interface IAttrChangeEvent extends Event {
    attribute : string,
    oldValue : any,
    value : any
}
