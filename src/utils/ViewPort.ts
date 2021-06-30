import * as Events from 'events';
import {IDimension} from "../interfaces";
import {ViewPortEventTypes, IDimensionUpdateEvent} from ".";
import {Color} from './Color';

export class ViewPort extends Events.EventEmitter {
    private $canvas : HTMLCanvasElement;
    private $context : CanvasRenderingContext2D;
    private $resizable : boolean;
    private $filledPage : boolean;
    private $dimension: IDimension;
    private $resizeListener: () => void;

    public constructor () {
        super();
        this.$canvas = document.createElement('canvas');
        this.$context = this.$canvas.getContext('2d');
        this.$resizable = false;
        this.$dimension = {width: 0, height: 0};
        this.$filledPage = false;
    }

    public getCanvas(): HTMLCanvasElement {
        return this.$canvas;
    }

    public getContext(): CanvasRenderingContext2D {
        return this.$context;
    }

    public setResizable(resizable: boolean): void {
        this.$resizable = resizable;
    }

    public isResizable(): boolean {
        return this.$resizable;
    }

    public setScale (dimension : IDimension) : void {
        this.$context.scale(dimension.width, dimension.height);
    }

    public fillPage (state: boolean): void {
        console.log("Test, ", state);
        this.$filledPage = state;
        if (state) {
            this.$canvas.style.position = "fixed";
            this.$canvas.style.top = "0px";
            this.$canvas.style.left = "0px";

            this.$resizeListener = this.$fillPage.bind(this);
            window.addEventListener("resize", this.$resizeListener);

            this.$fillPage();
        }
        else {
            //Remove listener if one
            this.$canvas.style.position = "";
            window.removeEventListener("reisze", this.$resizeListener);
        }
    }

    public isFilledPage () : boolean {
        return this.$filledPage;
    }

    public getSize () : IDimension {
        return this.$dimension;
    }

    public setSize (dimension : IDimension): void {
        //First, set the variables for reference
        this.$dimension = dimension;

        //Update the Canvas dimensions
        this.$canvas.setAttribute('width', dimension.width + "px");
        this.$canvas.setAttribute('height', dimension.height + "px");

        this.emit('resize', dimension);
    }

    public clear () : void {
        this.$context.clearRect(0, 0, this.$dimension.width, this.$dimension.height);
    }

    public drawImage (img: HTMLImageElement, clipX : number, clipY : number, clipWidth : number, clipHeight : number, x: number, y : number, width : number, height : number): void {
        this.$context.drawImage(img, clipX, clipY, clipWidth, clipHeight, x, y, width, height);
    }

    public setFont (font : string) : void {
        this.$context.font = font;
    }

    public setColor (color : Color) : void {
        this.$context.fillStyle = color.toString();
    }

    public measureText (text : string) : TextMetrics {
        return this.$context.measureText(text);
    }

    public setTextBaseline (baseline : CanvasTextBaseline) : void {
        this.$context.textBaseline = baseline;
    }

    public drawText (text : string, x : number, y : number, maxWidth : number) : void {
        this.$context.fillText(text, x, y, maxWidth);
    }

    public setHidden () : void {
        this.$canvas.style.position = "absolute";
        this.$canvas.style.left = '110001px';
    }
 
    public getImage () : HTMLImageElement {
        let image =  <HTMLImageElement> document.createElement('img');
        image.src = this.$canvas.toDataURL("image/png");
        return image;
        // return this.context.getImageData(0, 0, this.width, this.height);
    }

    private $fillPage() {
        let newSize = { width: window.innerWidth, height: window.innerHeight };
        let eventData: IDimensionUpdateEvent = {
            type: ViewPortEventTypes.DIMENSION_UPDATE.toString(),
            oldDimensions: this.getSize(),
            newDimensions: newSize,
            source: this
        };
        this.setSize(newSize);
        this.emit(ViewPortEventTypes.DIMENSION_UPDATE.toString(), eventData);
    }
}
