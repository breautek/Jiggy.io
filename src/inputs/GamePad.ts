//Global interface alias
export type NativeGamepadEvent = GamepadEvent;
export type NativeGamepad = Gamepad;
export type NativeGamepadButton = GamepadButton;

import * as Events from 'events';
import { IEvent } from "../interfaces";

export const enum GamePadEvents {
    ButtonValueChange = "BUTTONVALUECHANGE",
    AxisValueChange = "AXISVALUECHANGE",
    Disconnect = "DISCONNECT"
}

export interface IValueChangeEvent extends IEvent {
    value: number,
    id: number
}

export type GamePadButton = NativeGamepadButton;

/**
 * Represents a single Gamepad the user has plugged in.  May only be detected once the user hits a key.  Have an array of axes, and buttons, for the Gamepad.
 */
export class GamePad extends Events.EventEmitter {
    private $pollRate: number = 15;
    private $pollTimer: NodeJS.Timeout;
    private $gamePadID: number;
    private $buttons: Array<number> = [];
    private $axes: Array<number> = [];

    constructor(id: number) {
        super();

        this.$gamePadID = id;
        let gamePad: NativeGamepad = navigator.getGamepads()[id];

        //Build an array of buttons & axes for this GamePad
        for (let i: number = 0; i < gamePad.buttons.length; i++) {
            this.$buttons.push(gamePad.buttons[i].value);
        }

        for (let i: number = 0; i < gamePad.axes.length; i++) {
            this.$axes.push(gamePad.axes[i]);
        }

        this.$poll = this.$poll.bind(this);

        this.$initializePolling();
    }

    public getAxis(index: number): number {
        return this.$axes[index];
    }

    public setPollRate(pollRate: number): void {
        this.$pollRate = pollRate;
        this.$initializePolling();
    }

    private $initializePolling(): void {
        if (this.$pollTimer) {
            clearInterval(this.$pollTimer);
        }
        this.$pollTimer = setInterval(this.$poll, this.$pollRate);
    }

    private $poll(): void {
        let gamePad: NativeGamepad = navigator.getGamepads()[this.$gamePadID];

        //Gamepad no longer exists, it was disconnected
        if (!gamePad) {
            this.$disconnect();
            return null;
        }

        //Compare Button Values
        for (let i: number = 0; i < gamePad.buttons.length; i++) {
            if (gamePad.buttons[i].value !== this.$buttons[i]) {
                this.$buttons[i] = gamePad.buttons[i].value;
                let e: IValueChangeEvent = {
                    source: this,
                    type: GamePadEvents.ButtonValueChange,
                    value: gamePad.buttons[i].value,
                    id: i
                };
                this.emit(GamePadEvents.ButtonValueChange, e);
            }
        }

        //Compare Axes Values
        for (let i: number = 0; i < gamePad.axes.length; i++) {
            if (gamePad.axes[i] !== this.$axes[i]) {
                this.$axes[i] = gamePad.axes[i];
                let e: IValueChangeEvent = {
                    source: this,
                    type: GamePadEvents.AxisValueChange,
                    value: gamePad.axes[i],
                    id: i
                };
                this.emit(GamePadEvents.AxisValueChange, e);
            }
        }
    }

    private $disconnect(): void {
        clearInterval(this.$pollTimer);
        let e: IEvent = {
            source: this,
            type: GamePadEvents.AxisValueChange
        };
        this.emit(GamePadEvents.Disconnect, e);
    }
}
