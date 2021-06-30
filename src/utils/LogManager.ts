import { SeverityEnum } from './SeverityEnum';

export class LogManager {
    private $logLevel : SeverityEnum;
    private static $instance:LogManager = new LogManager();
    
    protected constructor () {
        this.$logLevel = SeverityEnum.WARNING | SeverityEnum.ERROR;
        this.$logLevel = this.$logLevel | SeverityEnum.DEBUG | SeverityEnum.INFO;
    }

    public log (severity : SeverityEnum, message: string) : void {
        if (this.getLogLevel() & severity) {
            switch (severity) {
                case SeverityEnum.DEBUG:
                    console.debug(`[DEBUG] ${message}`);
                    break;
                case SeverityEnum.INFO:
                    console.info(`[INFO] ${message}`);
                    break;
                case SeverityEnum.WARNING:
                    console.warn(`[WARN] ${message}`);
                    break;
                case SeverityEnum.ERROR:
                    console.error(`[ERROR] ${message}`);
                    break;
                case SeverityEnum.DEPRECATE:
                    console.error(`[DEPRECATE] ${message}`);
            }
        }
    }

    public debug(message: string): void {
        this.log(SeverityEnum.DEBUG, message);
    }

    public info(message: string): void {
        this.log(SeverityEnum.INFO, message);
    }

    public warn(message: string): void {
        this.log(SeverityEnum.WARNING, message);
    }

    public error(message: string): void {
        this.log(SeverityEnum.ERROR, message);
    }

    public deprecate(message: string): void {
        this.log(SeverityEnum.DEPRECATE, message);
    }

    public setLogLevel (severity: SeverityEnum) : void {
        this.$logLevel = severity;
    }

    public getLogLevel () : SeverityEnum {
        return this.$logLevel;
    }

    public static getSingleton():LogManager {
        if (!LogManager.$instance) {
            LogManager.$instance = new LogManager();
        }
        return LogManager.$instance;
    }

}
