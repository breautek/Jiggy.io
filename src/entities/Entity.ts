import * as Events from 'events';
import {IDimension} from '../interfaces';
import { Asset, AssetType } from '../assets';
import { Coordinate } from "../utils";
import {EntityModel, ModelEventTypes, EntityView, EntityEventTypes, ILocationUpdateEvent} from '.';

import {Iterator, Color} from "../utils";

export class Entity extends Events.EventEmitter {
    protected _view : EntityView;
    protected _model : EntityModel;
    protected _children : Array<Entity>;
    private $regions : Array<Array<Array<Entity>>>;
    private $regionDimension : IDimension;
    private $regionList : Record<string, Array<Coordinate>>;
    protected _parent : Entity;
    private $modified : boolean;
    private $notifierKeys : Array<string>;
    private $parentNotifierKeys : Array<string>;
    private $modelCB : (attribute: string, value: any, oldValue: any) => void;
    private $collisionable : boolean;
    private $eventEmitted: boolean;

    public constructor (model? : EntityModel) {
        super();
        let shouldUseDefaults :  boolean = false;

        this.$modelCB = (attribute: string, value: any, oldValue: any) => {
            if (this.$notifierKeys.indexOf(attribute) > -1) {
                this.$setModified(true);
            }
            else if (this._parent && this.$parentNotifierKeys.indexOf(attribute) > -1) {
                this._parent.$setModified(true);
            }
        }
        
        //Check to see if a model was passed in
        if (!model) {
            //No model was passed in, so create the default model for an Entity
            model = new EntityModel();
            shouldUseDefaults = true;
        }
        
        //TODO figure out how to decide what EntityView class we should use...
        this._view = new EntityView(model);
        this._model = model;
        
        this._children = []; //Array to store all the children entities

        //Region Management
        this.$regions = []//Array of generated 'regions' of children to make children searching more efficient, by splitting them up into regions by position & dimensions
        this.$regionDimension; //The dimensions of the regions for this Entity
        this.$regionList = {}; //Mapping of Children to Region(s) so we don't have to search

        this.$collisionable = false;
        //Layer Management
        // this.layers = [[]]; //Layers for rendering so children can be rendering in proper order
        // this.layerList = {}; //Mapping of Children to Layers so we don't have to search

        this._parent = null; //Parent is the entity that contains this one
        this.$modified = false; //Whether or not this Entity has been modified
        
        //Model attributes in which we should change isModified for
        this.$notifierKeys = [
            'width',
            'height',
            'color',
            'texture',
            'textures'
        ];
        this.$parentNotifierKeys = [ 'x', 'y' ]; //Array of attributes to flag the parent as modified, anything in notifierKeys will do so by default, this list is for keys that don't mark this entity as isMOdified but should mark the parents

        if (shouldUseDefaults) {
            this.$setDefaults();
        }
    }

    public getID (): string {
        return this._model.getID();
    }

    public getParent (): Entity {
        return this._parent;
    }

    public setParent (parent : Entity): void {
        this._parent = parent;
    }

    public getRegions (): Array<Array<Array<Entity>>> {
        return this.$regions;
    }

    public getRegionDimension (): IDimension {
        return this.$regionDimension;
    }

    public getType (): string {
        return this._model.getType();
    }

    public setType (type: string): void {
        this._model.setType(type);
    }

    public setCollisionable(collisionable: boolean): void {
        this.$collisionable = collisionable;
    }

    public isCollisionable(): boolean {
        return this.$collisionable;
    }

    public getModel () : EntityModel {
        return this._model;
    }

    public setModel (model : EntityModel): void {
        // let view = this._view;
        let oldModel = this._model;

        if (oldModel) {
            // view.deattachListener(oldModel);
            oldModel.removeListener(ModelEventTypes.ATTR_CHANGE.toString(), this.$modelCB);
        }

        this._model = model;
        // view.attachListener(model);
        model.on(ModelEventTypes.ATTR_CHANGE.toString(),  this.$modelCB);
    }

    public getHeight () : number {
        return this._model.getAttribute('height');
    }

    public setHeight (height: number): void {
        this._model.setAttribute('height', height);
        this.$generateRegions();
    }

    public getWidth () : number {
        return this._model.getAttribute('width');
    }

    public setWidth (width: number): void {
        this._model.setAttribute('width', width);
        this.$generateRegions();
    }

    public getX (): number {
        return this._model.getX();
    }

    public setX (x : number): void {
        let oldCoordinates = this.getPosition();
        this._model.setX(x);
        let newCoordinates = this.getPosition();

        if (this._parent) {
            this._parent.$updateChildsRegion(this);
        }

        let eventData : ILocationUpdateEvent = {
            type: EntityEventTypes.LOCATION_UPDATE.toString(),
            oldCoordinates,
            newCoordinates,
            source: this
        }

        if (!this.$eventEmitted) {
            this.$eventEmitted = true;
            this.emit(EntityEventTypes.LOCATION_UPDATE.toString(), eventData);
            this.$eventEmitted = false;
        }
    }

    public getPosition(): Coordinate {
        return this._model.getPosition();
    }

    public setPosition (position: Coordinate): void {
        let oldCoordinates = this.getPosition();
        this._model.setPosition(position)

        if (this._parent) {
            this._parent.$updateChildsRegion(this);
        }

        let eventData : ILocationUpdateEvent = {
            type: EntityEventTypes.LOCATION_UPDATE.toString(),
            oldCoordinates,
            newCoordinates: position,
            source: this
        }

        this.emit(EntityEventTypes.LOCATION_UPDATE.toString(), eventData);
    }

    public getX2 () : number {
        return this.getX() + this.getWidth();
    }

    public getY (): number {
        return this._model.getY();
    }

    public setY (y: number): void {
        let oldCoordinates = this.getPosition();
        this._model.setY(y);
        let newCoordinates = this.getPosition();

        if (this._parent) {
            this._parent.$updateChildsRegion(this);
        }

        let eventData : ILocationUpdateEvent = {
            type: EntityEventTypes.LOCATION_UPDATE.toString(),
            oldCoordinates,
            newCoordinates,
            source: this
        }

        if (!this.$eventEmitted) {
            this.$eventEmitted = true;
            this.emit(EntityEventTypes.LOCATION_UPDATE.toString(), eventData);
            this.$eventEmitted = false;
        }
    }

    public getY2 () : number {
        return this.getY() + this.getHeight();
    }

    public getZ (): number {
        return this._model.getZ();
    }

    public setZ (z: number): void {
        this._model.setZ(z);
    }

    public getVisible () : boolean {
        return this._model.getAttribute('visible');
    }

    public setVisible (state: boolean): void {
        this._model.setAttribute('visible', state);
    }

    public getColor () : Color {
        return <Color>this._model.getAttribute('color');
    }

    public setColor (color: Color): void {
        this._model.setAttribute('color', color);
    }

    public getTexture () : Asset {
        return this._model.getTexture();
    }

    public setTexture (asset  : Asset): void {
        if (asset.getType() !== AssetType.IMAGE) {
            throw new Error('Texture asset must be of type IMAGE.');
        }

        this._model.setTexture(asset);
        this.$setModified(true);
    }


    /**
     * public isModified
     *
     *	Indicates whether this Entity has been modified since the last render frame.
     * 
     * @return {Boolean}
     */
    public isModified () : boolean {
        return this.$modified;
    }

    /**
     * public addChild
     *
     *	Adds a child entity node to this entity.
     * 
     * @param {zen.entities.Entity} child 
     * @return {void}
     */
    public addChild (child : Entity) : void {
        let parent = child._parent;
        if (parent) {
            parent.removeChild(child);
        }
        this._children.push(child);
        child._parent = this;

        //Region Management
        this.$putChildInRegion(child);
    }

    /**
     * public removeChild
     *
     *	Removes a child entity node from this entity.
     * 
     * @param  {zen.entities.Entity} child 
     * @return {void}
     */
    public removeChild (child : Entity) : void {
        if (this.isChild(child)) {
            let idx = this.indexOf(child);
            this._children.splice(idx, 1);
        }

        //Region Management
        this.$removeChildFromRegions(child);
        delete this.$regionList[child.getID()];
    }

    /**
     * public removeAllChildren
     *
     *	Removes all child nodes of this entity.
     * 
     * @return {void}
     */
    public removeAllChildren () : void {
        let child : Entity;
        // eslint-disable-next-line no-cond-assign
        while (child = this.getChildAt(0)) {
            this.removeChild(child);
        }
    }

    /**
     * public isChild
     *
     *	Checks to see if the given entity is a child of
     *	this entity.
     * 
     * @param  {zen.entities.Entity}  child 
     * @return {Boolean}
     */
    public isChild (child : Entity) : boolean {
        return (this.indexOf(child) > -1);
    }

    /**
     * public indexOf
     *
     *	Finds the index of the given entity.
     * 
     * @param  {zen.entities.Entity} child 
     * @return {Integer}
     */
    public indexOf (child : Entity) : number {
        return this._children.indexOf(child);
    }

    /**
     * public childCount
     *
     *	Counts the number of child nodes inside this entity.
     * 
     * @return {Integer} 
     */
    public childCount () : number {
        return this._children.length;
    }

    /**
     * public getChildAt
     *
     *	Gets a child entity at the given index.
     * 
     * @param  {Integer} index 
     * @return {zen.entities.Entity}
     */
    public getChildAt (index: number) : Entity {
        return this._children[index];
    }

    /**
     * private setModified
     *
     *	Sets whether this Entity has been modified since the last render
     *	frame.
     * 
     * @param {Boolean} state
     */
    private $setModified (state: boolean) : void {
        this.$modified = state;
        if (this._parent) {
            this._parent.$setModified(state);
        }
    }

    /**
     * public iterator DEPRECATED - use getChildren()
     *
     *	Creates a child node iterator for this entity.
     * 
     * @return {Object} {
     *         hasNext : function()
     *         next : function()
     *         hasPrevious : function()
     *         previous : function()
     * }
     */
    public iterator () : Iterator<Entity> {
        return new Iterator<Entity>(this._children);
    }

    /**
     * public getChildren
     *
     *	Returns an Iterator of Children.  Can pass
     *	in a set of coordinates to get children in a specific
     *	region of coordinates relative to the entity (0,0 is top left of this entity).
     *	If only the starTCoordinate is specified, looks up children who intersect with that point.
     *	If both arguements are passed in, looks for children who intersect with the rect the coords create.
     *	If neither are provided, just returns an iterator of all children.
     *
     * Not recursive, only checks it's own children
     *
     *
     * @param {zen.data.Coordinate} startCoordinate, optional, The Starting coordinate to loop for children.  Passing only 
     * this param in will look for children that intersect with this coordinate.
     * @param { zen.data.Coordinate} endCoordinate, optional, The End coordinate to loop for children.  Passing in this param
     * creates a region to look for children instead of just a specific point
     * @return Iterator
     */
    public getChildren (startCoordinate? : Coordinate, endCoordinate? : Coordinate) : Iterator<Entity> {
        if (startCoordinate && endCoordinate) { //Area Lookup
            let startRegion : Coordinate = this.$coordinateToRegion(startCoordinate);
            let endRegion : Coordinate = this.$coordinateToRegion(endCoordinate);

            //Loop through all regions in the coordinates and collect the children
            let children : Array<Entity> = [];

            for (let x = startRegion.getX(); x <= endRegion.getX(); x ++) {
                for (let y = startRegion.getY(); y <= endRegion.getY(); y ++) {
                    children = children.concat(this.$getChildrenInRegion(new Coordinate(x, y)));
                }
            }

            return new Iterator<Entity>(children);
        }
        else if (startCoordinate) { //Point Lookup
            let region : Coordinate = this.$coordinateToRegion(startCoordinate);

            //Loop through and determine who intersects with the point
            let children : Array<Entity> = [];

            let childrenIterator = new Iterator<Entity>(this.$getChildrenInRegion(new Coordinate(region.getX(), region.getY())));
            while (childrenIterator.hasNext()) {
                let child : Entity = childrenIterator.next();
                let childCoordinate : Coordinate = child.getPosition();
                let childOuterCoordinate : Coordinate = child.getOuterPosition();

                if (childCoordinate.getX() <= startCoordinate.getX() && childCoordinate.getY() <= startCoordinate.getY()
                    && childOuterCoordinate.getX() >= startCoordinate.getX() && childOuterCoordinate.getY() >= startCoordinate.getY()) {
                    //Intersects with the startCoordinate
                    children.push(child);
                }
            }

            return new Iterator<Entity>(children);
        }
        else { //All Lookup
            return new Iterator<Entity>(this._children);
        }
    }

    public findChildren (startCoordinate? : Coordinate, endCoordinate? : Coordinate) : Array<Entity> {
        let children : Array<Entity> = [];

        if (this._children.length > 0) {
            //Find the Region the coordinates belond to
            if (startCoordinate && !endCoordinate) {
                let region : Coordinate = this.$coordinateToRegion(startCoordinate);
                let regionChildren : Array<Entity> = this.$getChildrenInRegion(new Coordinate(region.getX(), region.getY()));
                if (regionChildren.length > 0) {
                    let childrenIterator = new Iterator<Entity>(regionChildren);
                    // let childrenIterator = new zen.util.Iterator(this.children);

                    //Loop through all children in that region to see if they intersect
                    while (childrenIterator.hasNext()) {
                        let iterChild : Entity = childrenIterator.next();
                        let childCoordinate : Coordinate = iterChild.getPosition();
                        let childOuterCoordinate : Coordinate = iterChild.getOuterPosition();

                        if (childCoordinate.getX() <= startCoordinate.getX() && childCoordinate.getY() <= startCoordinate.getY()
                            && childOuterCoordinate.getX() >= startCoordinate.getX() && childOuterCoordinate.getY() >= startCoordinate.getY()) {
                            //Intersects with the startCoordinate
                            children.push(iterChild);

                            //See if we can get a deeper child...
                            let deeperChildren = iterChild.findChildren(new Coordinate(startCoordinate.getX() - childCoordinate.getX(), startCoordinate.getY() - childCoordinate.getY()));
                            if (deeperChildren) {
                                children = children.concat(deeperChildren);
                            }
                        }
                    }
                }
            }
            else if (startCoordinate && endCoordinate) {
                let startRegion = this.$coordinateToRegion(startCoordinate);
                let endRegion = this.$coordinateToRegion(endCoordinate);
                let childrenVisited : Array<Entity> = [];
                //Loop through the regions
                for (let x = startRegion.getX(); x <= endRegion.getX(); x ++) {
                    for (let y = startRegion.getY(); y <= endRegion.getY(); y ++) {
                        let regionChildren : Array<Entity> = this.$getChildrenInRegion(new Coordinate(x, y));

                        for (let regionChildI in regionChildren) {
                            let regionChild : Entity = regionChildren[regionChildI];

                            if (childrenVisited.indexOf(regionChild) === -1) {
                                childrenVisited.push(regionChild);
                                let childCoordinate : Coordinate = regionChild.getPosition();
                                let childOuterCoordinate : Coordinate = regionChild.getOuterPosition();

                                let didXCollide = false;
                                let didYCollide = false;

                                if ((startCoordinate.getX() < childOuterCoordinate.getX() && endCoordinate.getX() > childCoordinate.getX())
                                    || (endCoordinate.getX() > childCoordinate.getX() && startCoordinate.getX() < childOuterCoordinate.getX())) {
                                    didXCollide = true;
                                }

                                if ((startCoordinate.getY() < childOuterCoordinate.getY() && endCoordinate.getY() > childCoordinate.getY())
                                    || (endCoordinate.getY() > childCoordinate.getY() && startCoordinate.getY() < childOuterCoordinate.getY())) {
                                    didYCollide = true;
                                }

                                if (didXCollide && didYCollide) {
                                    children.push(regionChild);

                                    let deeperChildren = regionChild.findChildren(new Coordinate(startCoordinate.getX() - childCoordinate.getX(), startCoordinate.getY() - childCoordinate.getY()), new Coordinate(endCoordinate.getX() - childOuterCoordinate.getX(), endCoordinate.getY() - childOuterCoordinate.getY()))
                                    if (deeperChildren) {
                                        children = children.concat(deeperChildren);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        
        return children;
    }

    /**
     * public findTopChildAt
     *
     * Tries to find the deepest child at the top most layer at this coordinates.
     * TODO: Update this to support Layers once we have layers...
     *
     * @param {Coordinate} [coordinate] [Coordinate relative to this entity to loop from]
     * @return Entity
     */
    public findTopChildAt (coordinate : Coordinate) : Entity|boolean {
        let child : Entity | boolean = false;

        //Find the Region the coordinates belond to
        let region = this.$coordinateToRegion(coordinate);
        let regionChildren = this.$getChildrenInRegion(new Coordinate(region.getX(), region.getY()));
        let childrenIterator = new Iterator<Entity>(regionChildren);

        childrenIterator.setToEnd();

        //Loop through all children in that region to see if they intersect
        while (childrenIterator.hasPrev() && !child) {
            let iterChild : Entity = childrenIterator.prev();
            let childCoordinate : Coordinate = iterChild.getPosition();
            let childOuterCoordinate : Coordinate = iterChild.getOuterPosition();

            if (childCoordinate.getX() <= coordinate.getX() && childCoordinate.getY() <= coordinate.getY()
                && childOuterCoordinate.getX() >= coordinate.getX() && childOuterCoordinate.getY() >= coordinate.getY()) {
                //Intersects with the startCoordinate
                child = iterChild;

                //See if we can get a deeper child...
                let deeperChild : boolean|Entity = iterChild.findTopChildAt(new Coordinate(coordinate.getX() - childCoordinate.getX(), coordinate.getY() - childCoordinate.getY()));
                if (deeperChild) {
                    child = deeperChild;
                }
            }
        }
        
        return child || false;
    }

    public getOuterPosition () : Coordinate {
        return new Coordinate(this.getX2(), this.getY2());
    }

    public getAbsoluteY () : number {
        let entity : Entity = this;
        let y = 0;
        while (entity) {
            y += entity.getY();
            entity = entity._parent;
        }
        return y;
    }

    public getAbsoluteY2 () : number {
        return this.getAbsoluteY() + this.getHeight();
    }

    public getAbsoluteX () : number {
        let entity : Entity = this;
        let x = 0;
        while (entity) {
            x += entity.getX();
            entity = entity._parent;
        }
        return x;
    }

    public getAbsoluteX2 () : number {
        return this.getAbsoluteX() + this.getWidth();
    }

    public setSize (dimension : IDimension) : void {
        this.$setModified(true);
        this.setWidth(dimension.width);
        this.setHeight(dimension.height);
    }

    public getSize () : IDimension {
        return {width: this.getWidth(), height: this.getHeight()};
    }

    /**
     * private _setDefaults
     *
     *	Sets the default attributes for this entity.
     * 
     * @return {void} 
     */
    private $setDefaults(): void {
        this.setPosition(new Coordinate(0, 0));
        this.setSize({width: 0, height: 0});
        this.setVisible(true);
        // this.setColor(0,0,0,0);
    }

    /**
     * private _generateRegions
     *
     *	Genetates regions of children to make searches more efficient
     * 
     * @return {void} 
     */
    private $generateRegions () : void {
        this.$regions = []; //Start fresh
        this.$regionList = {};
        let regionWidth: number;
        let regionHeight: number;

        //Pref we want 100 by 100 region, try to aim as close to it as we can
        if (this.getWidth() <= 100) {
            regionWidth = this.getWidth() / 2;
        }
        else {
            regionWidth = 50;
        }

        if (this.getHeight() <= 100) {
            regionHeight = this.getHeight() / 2;
        }
        else {
            regionHeight = 50;
        }

        this.$regionDimension = {width: regionWidth, height: regionHeight};

        //Generate the Arrays
        let xCount: number = Math.ceil(this.getWidth() / regionWidth);
        let yCount: number = Math.ceil(this.getHeight() / regionHeight);

        for (let x: number = 0; x < xCount; x ++) {
            this.$regions[x] = [];
            for (let y: number = 0; y < yCount; y ++) {
                this.$regions[x][y] = [];
            }
        }

        //Populate Arrays
        let childrenIterator = this.iterator();
        while (childrenIterator.hasNext()) {
            this.$putChildInRegion(childrenIterator.next());
        }
    }

    private $putChildInRegion (child: Entity) : void {
         // console.log("Generating start region");
        let startRegion = this.$coordinateToRegion(child.getPosition());
        // console.log("Generator end region");
        let endRegion = this.$coordinateToRegion(new Coordinate(child.getX2(), child.getY2()));

        this.$regionList[child.getID()] = [];

        if (!isNaN(startRegion.getX()) && !isNaN(startRegion.getY()) && !isNaN(endRegion.getX()) && !isNaN(endRegion.getY())) {
            //Compare both Regions and add the entity to those regions, and all in between
            for (let x = startRegion.getX(); x <= endRegion.getX(); x ++) {
                if (this.$regions[x]) { //Overflow protection
                    for (let y = startRegion.getY(); y <= endRegion.getY(); y ++) {
                        if (this.$regions[x][y]) { //Overflow Protection
                            this.$regions[x][y].push(child);
                            this.$regionList[child.getID()].push(new Coordinate(x, y));
                        }
                    }
                }
            }
        }
        else {
            // zen.app.getLogManager().log(zen.util.LogManager.WARNING, "Unable to put child into region - Out of Bounds", child);
        }
    }

    private $getChildrenInRegion (regionCoordinate : Coordinate) : Array<Entity> {
        if (this.$regions[regionCoordinate.getX()] && this.$regions[regionCoordinate.getX()][regionCoordinate.getY()]) {
            return this.$regions[regionCoordinate.getX()][regionCoordinate.getY()];
        }
        else {
            return [];
        }
    }

    private $removeChildFromRegions (child: Entity) : void {
        //Clear Child out of existing regions
        if (this.$regionList[child.getID()])  {
            for (let i in this.$regionList[child.getID()]) {
                let coord = this.$regionList[child.getID()][i];
                this.$regions[coord.getX()][coord.getY()].splice(this.$regions[coord.getX()][coord.getY()].indexOf(child), 1);
            }
        }
    }

    private $updateChildsRegion (child: Entity) : void {
        this.$removeChildFromRegions(child);

        //Add it back into new regions
        this.$putChildInRegion(child);
    }

    private $coordinateToRegion (coordinate: Coordinate) : Coordinate {
        // console.log('Coordinate To Region', coordinate);
        // console.log('Region Dimension', this.regionDimension);
        let x = Math.floor(coordinate.getX() / this.$regionDimension.width);
        let y = Math.floor(coordinate.getY() / this.$regionDimension.height);
        // console.log('Region Coordinates', new zen.data.Coordinate(x, y));
        return new Coordinate(x, y);
    }
}
