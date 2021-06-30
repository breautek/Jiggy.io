import {LogicEngine} from ".";

interface ILogicCall {
    method: {(): void;};
    interval: number;
}

interface IInterval {
    methods: Array<() => void>;
    interval_id: any;
}

export class GroupLogicEngine extends LogicEngine {
    private $logicCalls : Record<string, ILogicCall>;
    private $intervals : Record<string, IInterval>;
    private $intervalID : string;
    private $interval : number;

    public constructor () {
        super();
        this.$logicCalls = {};
        this.$intervals = {};
        this.$interval = 10;
    }

    public addLogic (id: string, logicMethod : () => void, interval : number) : void {
        this.$logicCalls[id] = {
            'method': logicMethod,
            'interval': interval
        };

        if (!this.$hasInterval(interval)) {
            //Create the Interval for this Interval of Logic Loop
            this.$createInterval(interval);
        }

        this.$addToInterval(id);
    }

    public pauseLogic (id : string) : void {
        this.$removeFromInterval(id);
    }

    public resumeLogic (id: string) : void {
        this.$addToInterval(id);
    }

    public removeLogic (id: string) : void {
        if (this.$logicCalls[id]) {
            this.$removeFromInterval(id);
            delete this.$logicCalls[id];
        }
    }

    private $createInterval (interval : number) : void {
        let methods : Array<() => void> = [];
        this.$intervals[interval] = {
            'methods': methods,
            'interval_id': 	setInterval(() => {
                this.$processInterval(interval);
            }, interval)
        };
    }

    private $hasInterval (interval: number) : boolean {
        return this.$intervals[interval] !== undefined;
    }

    private $removeInterval (interval: number) : void {
        clearInterval(this.$intervals[interval].interval_id);
        delete this.$intervals[interval];
    }

    private $addToInterval (id: string) : void {
        this.$intervals[this.$logicCalls[id].interval].methods.push(this.$logicCalls[id].method);
    }

    private $removeFromInterval (id: string) : void {
        let interval = this.$logicCalls[id].interval;
        this.$intervals[interval].methods.splice(this.$intervals[interval].methods.indexOf(this.$logicCalls[id].method), 1);
        
        if (this.$intervals[interval].methods.length === 0) {
            this.$removeInterval(interval);
        }
    }

    private $processInterval (interval : number) : void {
        for (let i in this.$intervals[interval].methods) {
            this.$intervals[interval].methods[i]();
        }
    }
}
