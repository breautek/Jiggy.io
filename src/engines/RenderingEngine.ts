import { ViewPort, Camera, Color, Coordinate, Iterator } from "../utils";
import { IDimension } from "../interfaces";
import {Entity} from "../entities";

/**
 * Abstract Rendering Engine class which at it's core is simply has a list of cameras to render on the screen, each of which may point to a 'scene' entity.
 */
export abstract class RenderingEngine {
    private $viewPort : ViewPort;
    private $prerenderViewPort : ViewPort;
    private $rendering  : boolean;
    private $fps : number;
    private $hudEntity : Entity;
    private $cameras : Array<Camera>;
    private $animationFrameID : number;
    private $frames : number;
    private $lastRender : Date;
    private $showFPS : boolean;
    public debugCamera : boolean;

    public constructor () {
        this.$prerenderViewPort = new ViewPort();
        this.$rendering = false;
        this.$fps = 0;
        this.$frames = 0;
        this.$showFPS = true;
        this.$cameras = [];
    }

    /**
     * Sets the View Port to render into
     * @param viewPort
     */
    public setViewPort(viewPort: ViewPort): void {
        this.$viewPort = viewPort;
    }

    /**
     * Returns the View Port the rendering engine is rendering into
     */
    public getViewPort(): ViewPort {
        return this.$viewPort;
    }

    /**
     * Sets an Entity to be rendered outside of a Camera relative to the view port as a HUD element.  Set a single HUD Entity that may contain your entire HUD.
     * @param hud
     */
    public setHUD(hud: Entity): void {
        this.$hudEntity = hud;
    }

    /**
     * Returns the current HUD Element
     */
    public getHUD(): Entity {
        return this.$hudEntity;
    }

    /**
     * Adds a Camera to the list of Cameras to render every frame
     * @param camera
     */
    public addCamera (camera : Camera) : void {
        this.$cameras.push(camera);
    }

    /**
     * Removes a Camera from the Camera rendering list
     * @param camera
     */
    public removeCamera (camera : Camera) : void {
        delete this.$cameras[this.$cameras.indexOf(camera)];
    }

    /**
     * Set the Engine to begin rendering into it's View Port
     */
    public startRendering () : boolean {
        if (this.$viewPort) {
            this.$rendering = true;
            this.$requestFrame();
            return true;
        }
        else {
            console.warn('Unable to begin rendering, no view port assigned to rendering engine.');
            return false;
        }
    }

    /**
     * Stop rendering into the View Port
     */
    public stopRendering () : void {
        window.cancelAnimationFrame(this.$animationFrameID);
        this.$animationFrameID = null;
        this.$rendering = false;
    }

    /**
     * Use the requestAnimationFrame API to create a render loop
     */
    private $requestFrame () : void {
        if (this.$rendering) {
            this.$animationFrameID = window.requestAnimationFrame(() => {
                this._render();
                this.$postRender();
            });
        }
    }

    /**
     * Abstract method to render a frame
     */
    protected _render () : void {
        this.$viewPort.clear();

        for (let i in this.$cameras) {
            this._renderCamera(this.$cameras[i])
        }

        //Render HUD Entity
        if (this.getHUD()) {
            this._renderHUDEntity(this.getHUD());
        }
    }

    /**
     * Render an Entity relative to the View Port to create a 'HUD' or 'Menus'
     * @param hudEntity
     */
    protected _renderHUDEntity(hudEntity: Entity): void {
        let x = hudEntity.getAbsoluteX();
        let y = hudEntity.getAbsoluteY();
        let w = hudEntity.getWidth();
        let h = hudEntity.getHeight();

        //Rendering time!
        if (hudEntity.getColor()) {
            //Draw a rect in its place...
            let color: Color = hudEntity.getColor();
            this.getViewPort().getContext().fillStyle = color.toString();
            this.getViewPort().getContext().fillRect(x, y, w, h);
        }

        if (hudEntity.getTexture()) {
            let imageData = hudEntity.getTexture().getData();
            this.getViewPort().getContext().drawImage(imageData, x, y, w, h)
        }

        let iter: Iterator<Entity> = hudEntity.getChildren();
        while (iter.hasNext()) {
            let child: Entity = iter.next();
            this._renderHUDEntity(child);
        }
    }

    /**
     * Render a single camera into the viewport
     */
    protected _renderCamera(camera: Camera): void {
        let scene = camera.getScene();
        let context = this.getViewPort().getContext();

        if (this.debugCamera) {
            //For Debugging purposes.. Draw a rect where each camera should be
            let viewPoint: Coordinate = camera.getViewPoint();
            let fov: IDimension = camera.getFOV();
            let renderOrigin: Coordinate = camera.getRenderOrigin();
            let renderDimension: IDimension = camera.getRenderDimension();

            context.beginPath();
            context.rect(viewPoint.getX(), viewPoint.getY(), fov.width, fov.height);
            context.lineWidth = 7;
            context.strokeStyle = 'red';
            context.stroke();

            context.beginPath();
            context.rect(renderOrigin.getX(), renderOrigin.getY(), renderDimension.width, renderDimension.height);
            context.lineWidth = 7;
            context.fillStyle = 'black';
            context.fill();
            context.strokeStyle = 'green';
            context.stroke();
        }

        let color: Color = new Color(255, 255, 0);
        this.getViewPort().getContext().fillStyle = color.toString();
        this.getViewPort().getContext().fillRect(camera.getRenderOrigin().getX(), camera.getRenderOrigin().getY(), camera.getRenderDimension().width, camera.getRenderDimension().height);

        this._renderEntity(scene, camera);
    }

    protected abstract _renderEntity(entity: Entity, camera: Camera): void;

    /**
     * Count every render loop in a second to show the FPS of the game
     */
    private $calculateFPS () : void {
        let date = new Date(); //Get current Date/Time

        if (this.$lastRender) { //If we have a store Date/Time from last rendering
            if (this.$lastRender.getSeconds() !== date.getSeconds()) { //This is a new second, calculate the average FPS for the last second and display it
                // var avg : number = 0;
                // var i : any;
                // for (i in this._frames) {
                // 	avg += this._frames[i];
                // }
                this.$fps = this.$frames;
                this.$frames = 1;
            }
            else { //It's the same second as last render, just add the FPS to an array so we can calculate the Average later
                this.$frames += 1;
            }
        }

        this.$lastRender = date;
    }

    /**
     * PostRender methods to modify the view and request the next animation frame
     */
    private $postRender () : void {
        //TODO: Call PostProcessors here

        if (this.$showFPS) {
            //Calculate the FPS
            this.$calculateFPS();

            //Draw the FPS on the screen
            let ctx = this.$viewPort.getContext();
            ctx.globalAlpha = 0.5;
            ctx.fillStyle = 'black';
            ctx.fillRect(0, 0, 100, 35);
            ctx.globalAlpha = 1;
            ctx.fillStyle = 'white';
            ctx.font = "20px Georgia";
            ctx.fillText(this.$fps + " FPS", 20, 25);
        }

        //Start request for next frame
        this.$requestFrame();
    }
}
