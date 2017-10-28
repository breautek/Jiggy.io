"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SeverityEnum_1 = require("./SeverityEnum");
var LogManager = (function () {
    function LogManager() {
        this._logLevel = SeverityEnum_1.SeverityEnum.WARNING | SeverityEnum_1.SeverityEnum.ERROR;
        this._logLevel = this._logLevel | SeverityEnum_1.SeverityEnum.DEBUG | SeverityEnum_1.SeverityEnum.INFO;
    }
    LogManager.prototype.log = function (severity, message) {
        if (this.getLogLevel() & severity) {
            switch (severity) {
                case SeverityEnum_1.SeverityEnum.DEBUG:
                    console.debug(message);
                    break;
                case SeverityEnum_1.SeverityEnum.INFO:
                    console.info(message);
                    break;
                case SeverityEnum_1.SeverityEnum.WARNING:
                    console.warn(message);
                    break;
                case SeverityEnum_1.SeverityEnum.ERROR:
                    console.error(message);
                    break;
            }
        }
    };
    LogManager.prototype.setLogLevel = function (severity) {
        this._logLevel = severity;
        this._logLevel = severity;
    };
    LogManager.prototype.getLogLevel = function () {
        return this._logLevel;
    };
    LogManager.getSingleton = function () {
        if (!LogManager._instance) {
            LogManager._instance = new LogManager();
        }
        return LogManager._instance;
    };
    LogManager._instance = new LogManager();
    return LogManager;
}());
exports.LogManager = LogManager;
//# sourceMappingURL=LogManager.js.map