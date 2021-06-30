import {
    LogManager
} from '.';

export class IDGenerator {
    private static $instance: IDGenerator;

    protected constructor() {}

    public generate(): string {
        return IDGenerator.generate();
    }

    public static generate(): string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            let r = Math.random() * 16|0, v = c === 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        });
    }

    public static getSingleton(): IDGenerator {
        LogManager.getSingleton().deprecate('IDGenerator should no longer be used as a singleton anymore. Instead use IDGenerator.generate().');
        if (!IDGenerator.$instance) {
            IDGenerator.$instance = new IDGenerator();
        }
        return IDGenerator.$instance;
    }
}
