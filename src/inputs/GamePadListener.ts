//Global interface alias
type NativeGamepad = Gamepad;

import { GamePad } from "./GamePad";
import * as Events from 'events';


export const enum GamePadListenerEvents {
    GamePadAdded = "GAMEPADADDED",
    GamePadRemoved = "GAMEPADREMOVED"
}

/**
 * Listens to the window and detects any new gamePads plugged in.  GamePads may only be detected once a button is clicked.
 */
export class GamePadListener extends Events.EventEmitter {
    private static $instance: GamePadListener;
    private $activeGamePads: Array<GamePad>;
    private $gamePadPollTimer: number;

    private constructor() {
        super();

        //NOTE: GamePad events only fire on Firefox
        //window.addEventListener("gamepadconnected", () => {
        //    var gamePads: NativeGamepad[] = navigator.getGamepads();
        //    //Identify the new Gamepad by index
        //    for (var i = 0; i < gamePads.length; i++) {
        //        if (!this._activeGamePads[i]) {
        //            //There is no GamePad at this index, register the new one and emit it
        //            var gamePad: GamePad = this._buildGamePad(i);
        //            this.emit(InputManagerEvents.GamePadAdded, gamePad);
        //        }   
        //    }
        //});

        //window.addEventListener("gamepaddisconnected", () => {
        //    var gamePads: NativeGamepad[] = navigator.getGamepads();
        //    //Identify the deleted Gamepad by index
        //    for (var i = 0; i < this._activeGamePads.length; i++) {
        //        if (!gamePads[i]) {
        //            //There is no GamePad at this index, register the new one and emit it;
        //            var gamePad: GamePad = this._activeGamePads[i];
        //            this.emit(InputManagerEvents.GamePadRemoved, gamePad);
        //        }
        //    }
        //});

        if (navigator.getGamepads) {
            //Build initial set of gamepads
            this.$buildGamePads();

            //Poll for new gamepads or deactivated gamepads
            this.$gamePadPollTimer = window.setInterval(() => {
                let gamePads: Array<NativeGamepad> = navigator.getGamepads();
                //Identify the new Gamepad by index
                for (let i: number = 0; i < gamePads.length; i++) {
                    if (gamePads[i] && !this.$activeGamePads[i]) {
                        //There is no GamePad at this index, register the new one and emit it
                        let gamePad: GamePad = this.$buildGamePad(i);
                        this.emit(GamePadListenerEvents.GamePadAdded, gamePad);
                    }
                    else if (!gamePads[i] && this.$activeGamePads[i]) {
                        let gamePad: GamePad = this.$activeGamePads[i];
                        delete this.$activeGamePads[i];
                        this.emit(GamePadListenerEvents.GamePadRemoved, gamePad);
                    }
                }
            }, 15);
        }
        else {
            console.log("Browser does not support GamePad API");
        }
    }

    private $buildGamePads(): void {
        let gamePads: Array<NativeGamepad> = navigator.getGamepads();
        this.$activeGamePads = [];

        for (let i: number = 0; i < gamePads.length; i++) {
            if (gamePads[i]) {
                this.$buildGamePad(i);
            }
        }
    }

    /**
     * 
     * @param index - Index in the HTML5 gamePad API that this GamePad represents.  An index is used over the object so polling update checks can be done.
     */
    private $buildGamePad(index: number): GamePad {
        let gamePad: GamePad = new GamePad(index);
        this.$activeGamePads[index] = gamePad;
        return gamePad;
    }

    static getInstance(): GamePadListener {
        GamePadListener.$instance = GamePadListener.$instance || new GamePadListener();
        return GamePadListener.$instance;
    }

    public hasGamePads(): boolean {
        return this.$activeGamePads.length > 0;
    }

    public getGamePads(): Array<GamePad> {
        return this.$activeGamePads;
    }
}
