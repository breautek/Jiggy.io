import { Asset } from '../assets';
import {IEvent} from "../interfaces";

export interface ITextureChangeEvent extends IEvent {
    attribute: string,
    name: string,
    value: Asset
}
