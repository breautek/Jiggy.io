"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var KeyCode;
(function (KeyCode) {
    KeyCode[KeyCode["BACKSPACE"] = 8] = "BACKSPACE";
    KeyCode[KeyCode["TAB"] = 9] = "TAB";
    KeyCode[KeyCode["NP_5_UNLOCKED"] = 12] = "NP_5_UNLOCKED";
    KeyCode[KeyCode["ENTER"] = 13] = "ENTER";
    KeyCode[KeyCode["SHIFT"] = 16] = "SHIFT";
    KeyCode[KeyCode["CONTROL"] = 17] = "CONTROL";
    KeyCode[KeyCode["ALT"] = 18] = "ALT";
    KeyCode[KeyCode["PAUSE"] = 19] = "PAUSE";
    KeyCode[KeyCode["CAPS_LOCK"] = 20] = "CAPS_LOCK";
    KeyCode[KeyCode["ESCAPE"] = 27] = "ESCAPE";
    KeyCode[KeyCode["PAGE_UP"] = 33] = "PAGE_UP";
    KeyCode[KeyCode["PAGE_DOWN"] = 34] = "PAGE_DOWN";
    KeyCode[KeyCode["END"] = 35] = "END";
    KeyCode[KeyCode["HOME"] = 36] = "HOME";
    KeyCode[KeyCode["LEFT_ARROW"] = 37] = "LEFT_ARROW";
    KeyCode[KeyCode["UP_ARROW"] = 38] = "UP_ARROW";
    KeyCode[KeyCode["RIGHT_ARROW"] = 39] = "RIGHT_ARROW";
    KeyCode[KeyCode["DOWN_ARROW"] = 40] = "DOWN_ARROW";
    KeyCode[KeyCode["PRINT_SCREEN"] = 44] = "PRINT_SCREEN";
    KeyCode[KeyCode["INSERT"] = 45] = "INSERT";
    KeyCode[KeyCode["DELETE"] = 46] = "DELETE";
    KeyCode[KeyCode["ZERO"] = 48] = "ZERO";
    KeyCode[KeyCode["ONE"] = 49] = "ONE";
    KeyCode[KeyCode["TWO"] = 50] = "TWO";
    KeyCode[KeyCode["THREE"] = 51] = "THREE";
    KeyCode[KeyCode["FOUR"] = 52] = "FOUR";
    KeyCode[KeyCode["FIVE"] = 53] = "FIVE";
    KeyCode[KeyCode["SIX"] = 54] = "SIX";
    KeyCode[KeyCode["SEVEN"] = 55] = "SEVEN";
    KeyCode[KeyCode["EIGHT"] = 56] = "EIGHT";
    KeyCode[KeyCode["NINE"] = 57] = "NINE";
    KeyCode[KeyCode["A"] = 65] = "A";
    KeyCode[KeyCode["B"] = 66] = "B";
    KeyCode[KeyCode["C"] = 67] = "C";
    KeyCode[KeyCode["D"] = 68] = "D";
    KeyCode[KeyCode["E"] = 69] = "E";
    KeyCode[KeyCode["F"] = 70] = "F";
    KeyCode[KeyCode["G"] = 71] = "G";
    KeyCode[KeyCode["H"] = 72] = "H";
    KeyCode[KeyCode["I"] = 73] = "I";
    KeyCode[KeyCode["J"] = 74] = "J";
    KeyCode[KeyCode["K"] = 75] = "K";
    KeyCode[KeyCode["L"] = 76] = "L";
    KeyCode[KeyCode["M"] = 77] = "M";
    KeyCode[KeyCode["N"] = 78] = "N";
    KeyCode[KeyCode["O"] = 79] = "O";
    KeyCode[KeyCode["P"] = 80] = "P";
    KeyCode[KeyCode["Q"] = 81] = "Q";
    KeyCode[KeyCode["R"] = 82] = "R";
    KeyCode[KeyCode["S"] = 83] = "S";
    KeyCode[KeyCode["T"] = 84] = "T";
    KeyCode[KeyCode["U"] = 85] = "U";
    KeyCode[KeyCode["V"] = 86] = "V";
    KeyCode[KeyCode["W"] = 87] = "W";
    KeyCode[KeyCode["X"] = 88] = "X";
    KeyCode[KeyCode["Y"] = 89] = "Y";
    KeyCode[KeyCode["Z"] = 90] = "Z";
    KeyCode[KeyCode["SUPER"] = 91] = "SUPER";
    KeyCode[KeyCode["CONTEXT"] = 93] = "CONTEXT";
    KeyCode[KeyCode["NP_0"] = 96] = "NP_0";
    KeyCode[KeyCode["NP_1"] = 97] = "NP_1";
    KeyCode[KeyCode["NP_2"] = 98] = "NP_2";
    KeyCode[KeyCode["NP_3"] = 99] = "NP_3";
    KeyCode[KeyCode["NP_4"] = 100] = "NP_4";
    KeyCode[KeyCode["NP_5"] = 101] = "NP_5";
    KeyCode[KeyCode["NP_6"] = 102] = "NP_6";
    KeyCode[KeyCode["NP_7"] = 103] = "NP_7";
    KeyCode[KeyCode["NP_8"] = 104] = "NP_8";
    KeyCode[KeyCode["NP_9"] = 105] = "NP_9";
    KeyCode[KeyCode["NP_ASTERIK"] = 106] = "NP_ASTERIK";
    KeyCode[KeyCode["NP_PLUS"] = 107] = "NP_PLUS";
    KeyCode[KeyCode["NP_HYPHEN"] = 109] = "NP_HYPHEN";
    KeyCode[KeyCode["NP_DOT"] = 110] = "NP_DOT";
    KeyCode[KeyCode["NP_SLASH"] = 111] = "NP_SLASH";
    KeyCode[KeyCode["F1"] = 112] = "F1";
    KeyCode[KeyCode["F2"] = 113] = "F2";
    KeyCode[KeyCode["F3"] = 114] = "F3";
    KeyCode[KeyCode["F4"] = 115] = "F4";
    KeyCode[KeyCode["F5"] = 116] = "F5";
    KeyCode[KeyCode["F6"] = 117] = "F6";
    KeyCode[KeyCode["F7"] = 118] = "F7";
    KeyCode[KeyCode["F8"] = 119] = "F8";
    KeyCode[KeyCode["F9"] = 120] = "F9";
    KeyCode[KeyCode["F10"] = 121] = "F10";
    KeyCode[KeyCode["F11"] = 122] = "F11";
    KeyCode[KeyCode["F12"] = 123] = "F12";
    KeyCode[KeyCode["NUM_LOCK"] = 144] = "NUM_LOCK";
    KeyCode[KeyCode["SCREEN_LOCK"] = 145] = "SCREEN_LOCK";
    KeyCode[KeyCode["SEMICOLON"] = 186] = "SEMICOLON";
    KeyCode[KeyCode["EQUALS"] = 187] = "EQUALS";
    KeyCode[KeyCode["COMMA"] = 188] = "COMMA";
    KeyCode[KeyCode["HYPHEN"] = 189] = "HYPHEN";
    KeyCode[KeyCode["PERIOD"] = 190] = "PERIOD";
    KeyCode[KeyCode["SLASH"] = 191] = "SLASH";
    KeyCode[KeyCode["TILDE"] = 192] = "TILDE";
    KeyCode[KeyCode["OPEN_SQUARE_BRACKET"] = 219] = "OPEN_SQUARE_BRACKET";
    KeyCode[KeyCode["BACKSLASH"] = 220] = "BACKSLASH";
    KeyCode[KeyCode["CLOSE_SQUARE_BRACKET"] = 221] = "CLOSE_SQUARE_BRACKET";
    KeyCode[KeyCode["APOSTROPHE"] = 222] = "APOSTROPHE";
    KeyCode[KeyCode["FUNCTION"] = 255] = "FUNCTION";
})(KeyCode = exports.KeyCode || (exports.KeyCode = {}));
//# sourceMappingURL=KeyCode.js.map