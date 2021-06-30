import { JTouch } from "./JTouch";
import * as Events from 'events';


export const enum TouchListenerEvents {
    TouchAdded = "TOUCHADDED"
}

/**
 * Listens to the window for new touches, builds Touch objects, and emits them to any listeners
 */
export class TouchListener extends Events.EventEmitter {
    private static $instance: TouchListener;

    private constructor() {
        super();

        window.addEventListener("touchstart", (e: TouchEvent) => {
            //Loop through the new fingers added, build Touch objects, and emit them
            e.preventDefault();
            for (let i = 0; i < e.changedTouches.length; i++) {
                let touch: JTouch = new JTouch(e.changedTouches.item(i));
                this.emit(TouchListenerEvents.TouchAdded, touch);
            }
        });
    }

    static getInstance(): TouchListener {
        TouchListener.$instance = TouchListener.$instance || new TouchListener();
        return TouchListener.$instance;
    }
}
