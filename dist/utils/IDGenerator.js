"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var IDGenerator = (function () {
    function IDGenerator() {
    }
    IDGenerator.prototype.generate = function () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };
    IDGenerator.getSingleton = function () {
        if (!IDGenerator._instance) {
            IDGenerator._instance = new IDGenerator();
        }
        return IDGenerator._instance;
    };
    return IDGenerator;
}());
exports.IDGenerator = IDGenerator;
//# sourceMappingURL=IDGenerator.js.map