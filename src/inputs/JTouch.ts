import * as Events from 'events';
import { IEvent, ICoordinate } from "../interfaces";

export const enum TouchEvents {
    TouchMoved = "TOUCHMOVED",
    TouchRemoved = "TOUCHREMOVED"
}

export interface ITouchMoveEvent extends IEvent {
    position: ICoordinate
}

/**
 * Represents a single touch or 'finger' of the screen touching the screen
 */
export class JTouch extends Events.EventEmitter {
    private $id: number;
    private $x: number;
    private $y: number;
    private $touchMoveListener: (touchEvent: TouchEvent) => void;
    private $touchEndListener: (touchEvent: TouchEvent) => void;

    constructor(nTouch: Touch) {
        super();
        this.$id = nTouch.identifier;
        this.$x = nTouch.pageX;
        this.$y = nTouch.pageY;

        window.addEventListener("touchmove", this.$touchMoveListener = this.$onTouchMove.bind(this));
        window.addEventListener("touchend", this.$touchEndListener = this.$onTouchEnd.bind(this));
    }
    public getID(): number {
        return this.$id;
    }
    public getX(): number {
        return this.$x;
    }
    public getY(): number {
        return this.$y;
    }

    private $onTouchEnd(e: TouchEvent) {
        for (let i: number = 0; i < e.changedTouches.length; i++) {
            let nTouch = e.changedTouches.item(i);
            if (nTouch.identifier === this.$id) {
                this.$disconnect();
            }
        }
    }

    private $onTouchMove(e: TouchEvent) {
        for (let i: number = 0; i < e.changedTouches.length; i++) {
            let nTouch: Touch = e.changedTouches.item(i);
            if (nTouch.identifier === this.$id && (nTouch.pageX !== this.$x || nTouch.pageY !== this.$y)) {
                this.$x = nTouch.pageX;
                this.$y = nTouch.pageY;

                let e: ITouchMoveEvent = {
                    type: TouchEvents.TouchMoved,
                    source: this,
                    position: {
                        x: this.$x,
                        y: this.$y
                    }
                }

                this.emit(TouchEvents.TouchMoved, e);
            }
        }
    }

    private $disconnect() {
        let e: IEvent = {
            source: this,
            type: TouchEvents.TouchRemoved
        };
        this.emit(TouchEvents.TouchRemoved, e);
        window.removeEventListener("touchmove", this.$touchMoveListener);
        window.removeEventListener("touchend", this.$touchEndListener);
    }
}
