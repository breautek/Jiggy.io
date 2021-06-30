import { Entity } from "../entities";
import { Coordinate } from "./Coordinate";
import {
    IDimension
} from '../interfaces';

const DEFAULT_VIEWPOINT: Coordinate = new Coordinate(0, 0);
const DEFAULT_FOV: IDimension = {width:100, height:100};
const DEFAULT_RENDER_ORIGIN: Coordinate = new Coordinate(0, 0);
const DEFAULT_RENDER_DIMENSION: IDimension = {width:100, height:100};

export class Camera {
    private $scene : Entity;
    private $viewPoint : Coordinate;
    private $fov : IDimension;
    private $renderOrigin : Coordinate;
    private $renderDimension : IDimension;

    public constructor (scene : Entity, viewPoint : Coordinate, fov : IDimension, renderOrigin: Coordinate, renderDimension: IDimension) {
        // this._scene = scene;
        // this._viewPoint = viewPoint || {x:  0, y: 0};
        // this._fov = fov || {width: 100, height: 100};
        // this._renderOrigin = renderOrigin || {x: 0, y: 0};
        // this._renderDimension = renderDimension || {width: 100, height: 100};

        this.setScene(scene);
        this.setViewPoint(viewPoint || DEFAULT_VIEWPOINT);
        this.setFOV(fov || DEFAULT_FOV);
        this.setRenderOrigin(renderOrigin || DEFAULT_RENDER_ORIGIN);
        this.setRenderDimension(renderDimension || DEFAULT_RENDER_DIMENSION);
    }

    public setScene(scene: Entity): void {
        this.$scene = scene;
    }

    public getScene(): Entity {
        return this.$scene;
    }

    public setViewPoint(viewPoint: Coordinate): void {
        this.$viewPoint = viewPoint;
    }

    public getViewPoint(): Coordinate {
        return this.$viewPoint;
    }

    public setFOV(fov: IDimension): void {
        this.$fov = fov;
    }

    public getFOV(): IDimension {
        return this.$fov;
    }

    public setRenderOrigin(origin: Coordinate): void {
        this.$renderOrigin = origin;
    }

    public getRenderOrigin(): Coordinate {
        return this.$renderOrigin;
    }

    public setRenderDimension(dim: IDimension): void {
        this.$renderDimension = dim;
    }

    public getRenderDimension(): IDimension {
        return this.$renderDimension;
    }
}
