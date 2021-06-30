import {IEvent} from "../interfaces";
import {Coordinate} from '../utils';
import * as Events from 'events';

export const enum MouseEvents {
    LeftButtonDown = "LEFTBUTTONDOWN",
    LeftButtonUp = "LEFTBUTTONUP",
    RightButtonDown = "RIGHTBUTTONDOWN",
    RightButtonUp = "RIGHTBUTTONUP",
    MouseMove = "MOUSEMOVE",
    ScrollWheelDown = "SCROLLWHEELDOWN",
    ScrollWheelUp = "SCROLLWHEELUP",
    ScrollWheelMove = "SCROLLWHEELMOVE"
}

export interface IMouseClickEvent extends IEvent {
    x: number,
    y: number
}

export interface IMouseMoveEvent extends IEvent {
    x: number,
    y: number
}

export interface IScrollWheelMove extends IEvent {
    x: number,
    y: number,
    yDelta: number,
    xDelta: number
}

export class Mouse extends Events.EventEmitter {
    private static $instance: Mouse;
    private $leftButtonDown : boolean = false;
    private $rightButtonDown : boolean = false;
    private $scrollWheelDown : boolean = false;
    private $mouseCoords : Coordinate = new Coordinate(0, 0, 0);

    private constructor () {
        super();

        window.addEventListener("contextmenu", (e: MouseEvent) => {
            e.preventDefault();
        });

        window.addEventListener("mousedown", (e: MouseEvent) => {
            if (e.button === 0) {
                this.$leftButtonDown = true;
                let event : IMouseClickEvent = {
                    type: MouseEvents.LeftButtonDown,
                    source: this,
                    x: e.clientX,
                    y: e.clientY

                };
                this.emit(MouseEvents.LeftButtonDown, event);
            }
            else if (e.button === 1) {
                this.$scrollWheelDown = true;
                let event: IMouseClickEvent = {
                    type: MouseEvents.ScrollWheelDown,
                    source: this,
                    x: e.clientX,
                    y: e.clientY

                };
                this.emit(MouseEvents.ScrollWheelDown, event);
            }
            else if (e.button === 2) {
                this.$rightButtonDown = true;
                let event: IMouseClickEvent = {
                    type: MouseEvents.RightButtonDown,
                    source: this,
                    x: e.clientX,
                    y: e.clientY

                };
                this.emit(MouseEvents.RightButtonDown, event);
            }
        }, true);

        window.addEventListener("mouseup", (e: MouseEvent) => {
            if (e.button === 0) {
                this.$leftButtonDown = false;
                let event: IMouseClickEvent = {
                    type: MouseEvents.LeftButtonUp,
                    source: this,
                    x: e.clientX,
                    y: e.clientY

                };
                this.emit(MouseEvents.LeftButtonUp, event);
            }
            else if (e.button === 1) {
                this.$scrollWheelDown = false;
                let event: IMouseClickEvent = {
                    type: MouseEvents.ScrollWheelUp,
                    source: this,
                    x: e.clientX,
                    y: e.clientY

                };
                this.emit(MouseEvents.ScrollWheelUp, event);
            }
            else if (e.button === 2) {
                this.$rightButtonDown = false;
                let event: IMouseClickEvent = {
                    type: MouseEvents.RightButtonUp,
                    source: this,
                    x: e.clientX,
                    y: e.clientY

                };
                this.emit(MouseEvents.RightButtonUp, event);
            }
        }, true);

        window.addEventListener("mousemove", (e: MouseEvent) => {
            this.$mouseCoords = new Coordinate(e.clientX, e.clientY);
            let event: IMouseMoveEvent = {
                type: MouseEvents.MouseMove,
                source: this,
                x: e.clientX,
                y: e.clientY
            };
            this.emit(MouseEvents.MouseMove, event);
        }, true);

        window.addEventListener("wheel", (e: WheelEvent) => {
            let yDelta : number = 0;
            let xDelta : number = 0;

            if (e.deltaY > 0) {
                yDelta = 1;
            }
            else if (e.deltaY < 0) {
                yDelta = -1;
            }

            if (e.deltaX > 0) {
                xDelta = 1;
            }
            else if (e.deltaX < 0) {
                xDelta = -1;
            }

            let event : IScrollWheelMove = {
                type: MouseEvents.ScrollWheelMove.toString(),
                source: this,
                x: e.clientX,
                y: e.clientY,
                yDelta: yDelta,
                xDelta: xDelta
            };
            this.emit(MouseEvents.ScrollWheelMove.toString(), event);
        }, true);
    }

    public getCurrentCoordinates(): Coordinate {
        return this.$mouseCoords;
    }

    public isLeftButtonClicked(): boolean {
        return this.$leftButtonDown;
    }

    public isMouseWheelClicked(): boolean {
        return this.$scrollWheelDown;
    }

    public isRightButtonClicked(): boolean {
        return this.$rightButtonDown;
    }

    public static getInstance(): Mouse {
        Mouse.$instance = Mouse.$instance || new Mouse();
        return Mouse.$instance;
    }
}
