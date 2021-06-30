
import {Entity} from "../entities";
import {Asset} from ".";

export interface IAnimationFrame {
    asset: Asset;
    delay:  number;
    moveX? : number;
    moveY?: number;
}

export class Animation {
    public loop : boolean;
    public reverseLoop : boolean;

    private $entity : Entity;
    private $animationDefinition : Array<IAnimationFrame>;
    private $direction : string;
    private $animating : boolean;
    private $animationIndex : number;
    private $timeout: any;

    public constructor (entity: Entity, animationDefinitions: Array<IAnimationFrame>) {
        this.$entity = entity; //Entity to do the animation
        this.$animationDefinition = animationDefinitions; //Definitions for animations
        this.loop = true;
        this.$timeout = false;
        this.$direction = 'forward';
        this.reverseLoop = false;
        this.$animating = false;
        this.$animationIndex = -1;
    }

    public isAnimating () : boolean {
        return this.$animating;
    }

    public start () : void {
        if (!this.$timeout) {
            this.$direction = "forward";
            this.$loadStep(0);
            this.$animating = true;
        }
    }

    public stop () : void {
        clearTimeout(this.$timeout);
        this.$timeout = false;
        this.$animating = false;
    }

    private $loadStep (stepIndex: number) : void {
        let step = this.$animationDefinition[stepIndex];
        let sprite = step.asset;
        this.$entity.setTexture(sprite);
        this.$entity.setWidth(sprite.getData().width);
        this.$entity.setHeight(sprite.getData().height);

        // let offset : number = 0;

        if (step.moveX || (this.$direction === "reverse" && this.$animationDefinition[stepIndex + 1].moveX)) {
            if (this.$direction === "reverse" && this.$animationDefinition[stepIndex + 1].moveX) {
                // offset =  0 - this.$animationDefinition[stepIndex + 1].moveX;
                this.$entity.setX(this.$entity.getX() - this.$animationDefinition[stepIndex + 1].moveX);
            }
            else {
                // offset =  0 + step.moveX;
                this.$entity.setX(this.$entity.getX() + step.moveX);
            }
        }

        if (step.moveY || (this.$direction === "reverse" && this.$animationDefinition[stepIndex + 1].moveY)) {
            if (this.$direction === "reverse" && this.$animationDefinition[stepIndex + 1].moveY) {
                this.$entity.setY(this.$entity.getY() - this.$animationDefinition[stepIndex + 1].moveY);
            }
            else {
                this.$entity.setY(this.$entity.getY() + step.moveY);
            }
        }

        let nextStepIndex : number;

        if (this.$direction === "reverse") {
            nextStepIndex = stepIndex - 1;
        }
        else {
            nextStepIndex = stepIndex + 1;
        }

        if (this.$animationDefinition[nextStepIndex]) {
            this.$timeout = setTimeout(() => {
                this.$loadStep(nextStepIndex)
            }, step.delay);
        }
        else if (this.reverseLoop) {
            this.$timeout = setTimeout(() => {
                if (this.$direction === "forward") {
                    this.$direction = "reverse";
                    this.$loadStep(stepIndex - 1);
                }
                else if (this.$direction === "reverse") {
                    this.$direction = "forward";
                    this.$loadStep(stepIndex + 1);
                }
            }, step.delay);
        }
        else if (this.loop) {
            this.$timeout = setTimeout(() => {
                this.$loadStep(0)
            }, step.delay);
        }
        else {
            //Animation Complete
            this.stop();
        }
    }
}
