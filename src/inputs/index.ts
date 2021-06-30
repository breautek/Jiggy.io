// This is the export file to expose the classes of this package to external of this library.
// The exports must be named therefore importing, and exporting is necessary.

// If a particular module exports multiple items, ensure to include all that should be exposed to the public API.

import { GamePadListener, GamePadListenerEvents } from "./GamePadListener";
import { GamePad, GamePadEvents, IValueChangeEvent} from "./GamePad";
import { Keyboard, KEYBOARD_KEYS, KeyboardEvents, IKeyUp, IKeyDown } from "./Keyboard";
import { Mouse, MouseEvents, IMouseClickEvent, IMouseMoveEvent, IScrollWheelMove } from "./Mouse";
import { JTouch, ITouchMoveEvent, TouchEvents } from "./JTouch";
import { TouchListener, TouchListenerEvents } from "./TouchListener";

export {
    GamePad,
    GamePadEvents,
    GamePadListener,
    GamePadListenerEvents,
    IValueChangeEvent,
    Keyboard,
    KEYBOARD_KEYS,
    KeyboardEvents,
    IKeyUp,
    IKeyDown,
    Mouse,
    MouseEvents,
    IMouseClickEvent,
    IMouseMoveEvent,
    IScrollWheelMove,
    JTouch,
    ITouchMoveEvent,
    TouchEvents,
    TouchListener,
    TouchListenerEvents
};
