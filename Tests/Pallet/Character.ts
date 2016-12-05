import {Entity} from "../../Source/Entities";
import {Animation, Spritesheet, Asset} from "../../Source/Assets";
import {Coordinate} from "../../Source/Interfaces";
import Engine from "../../Source/Engine";

export default class Character extends Entity {
	public moving :  boolean;
	private _activeAnim : Animation;
	private _endTexture : Asset;
	private _upAnim : Animation;
	private _downAnim : Animation;
	private _leftAnim : Animation;
	private _rightAnim : Animation;
	public tileX : number;
	public tileY : number;
	private _characterSpritesheet : Spritesheet;

	constructor (character_spritesheet : Spritesheet) {
		super();

		this.width = 14;
		this.height = 21;

		this._characterSpritesheet = character_spritesheet;

		this._upAnim = new Animation(this, [
			{"asset": character_spritesheet.getSprite('player_up_step1'), "delay": 250}, 
			{"asset": character_spritesheet.getSprite("player_up"), "delay": 250}, 
			{"asset": character_spritesheet.getSprite("player_up_step2"), "delay": 250}, 
			{"asset": character_spritesheet.getSprite("player_up"), "delay": 250}]);

		this._downAnim = new Animation(this, [
			{"asset": character_spritesheet.getSprite("player_down_step1"), "delay": 250}, 
			{"asset": character_spritesheet.getSprite("player_down"), "delay": 250}, 
			{"asset": character_spritesheet.getSprite("player_down_step2"), "delay": 250}, 
			{"asset": character_spritesheet.getSprite("player_down"), "delay": 250}]);

		this._leftAnim = new Animation(this, [
			{"asset": character_spritesheet.getSprite("player_left_step2"), "delay": 250}, 
			{"asset": character_spritesheet.getSprite("player_left"), "delay": 250}, 
			{"asset": character_spritesheet.getSprite("player_left_step1"), "delay": 250}, 
			{"asset": character_spritesheet.getSprite("player_left"), "delay": 250}]);

		this._rightAnim = new Animation(this, [
			{"asset": character_spritesheet.getSprite("player_right_step2"), "delay": 250}, 
			{"asset": character_spritesheet.getSprite("player_right"), "delay": 250}, 
			{"asset": character_spritesheet.getSprite("player_right_step1"), "delay": 250}, 
			{"asset": character_spritesheet.getSprite("player_right"), "delay": 250}]);
	}

	private _move (coordinates : Coordinate) : void {
		Engine.getSingleton().logicEngine.removeLogic(this.ID + "_endmove");
		// var collision =  mapl2.findChildren(new zen.data.Coordinate(player.getX2() + 3, player.getY2() - 5),  new zen.data.Coordinate(player.getX2() + 3, player.getY2()));
		var collision = false;
		var updatedCoordinates = false;
		var x = coordinates.x;
		var y = coordinates.y;

		//TODO: Fix Magic Numbers... 16 is so only the bottom balf of the sprite is collision but the +1 is fixing it to check rpoper tile...
		var potCollisions = this.parent.findChildren({x: x + 1, y: y + 	16});
		for (var i in potCollisions) {
			if (potCollisions[i] != this && potCollisions[i].collisionable) {
				collision = true;
			}
		}

		if (!collision) {
			Engine.getSingleton().logicEngine.addLogic(this.ID + "_move", () => {

				if (this.x != x) {
					if (this.x > x) {
						this.x =  (this.x - 2);

						if (!updatedCoordinates) {
							this.tileX -= 1;
							updatedCoordinates = true;
						}

					} else {
						this.x = (this.x + 2);

						if (!updatedCoordinates) {
							this.tileX += 1;
							updatedCoordinates = true;
						}
					}
				}

				if (this.y != y) {
					if (this.y > y) {
						this.y = (this.y - 2);

						if (!updatedCoordinates) {
							this.tileY -= 1;
							updatedCoordinates = true;
						}
					} else {
						this.y = (this.y) + 2;


						if (!updatedCoordinates) {
							this.tileY += 1;
							updatedCoordinates = true;
						}
					}
				};

				// tilePosition.setTexture(zen.assets.TextAssetBuilder.build("15px Georgia", "X: " + character.tileX + " Y: " + character.tileY, 75, 50, "black"));

				if (this.x == x && this.y == y || collision) {
					Engine.getSingleton().logicEngine.removeLogic(this.ID + "_move");
					this.moving = false;

					Engine.getSingleton().logicEngine.addLogic(this.ID + "_endmove", () => {
						this._activeAnim.stop();
						delete this._activeAnim;
						this.texture = this._endTexture;
						Engine.getSingleton().logicEngine.removeLogic(this.ID + "_endmove");
					}, 50);

				}
			}, 50);	
		} else {
			this.moving = false;
			this._activeAnim.stop();
			delete this._activeAnim;
			this.texture = (this._endTexture);
		}
	}

	public moveLeft () : void {
		if (!this.moving) {

			if (this._activeAnim && this._activeAnim != this._leftAnim) {
				this._activeAnim.stop();
			}
			
			this._endTexture = this._characterSpritesheet.getSprite("player_left");
			this._leftAnim.start();
			this._activeAnim = this._leftAnim;
			this.moving = true;
			this._move({x:  this.x - 16, y: this.y});
		}
	}

	public moveUp () : void {
		if (!this.moving) {
			if (this._activeAnim && this._activeAnim != this._upAnim) {
				this._activeAnim.stop();
			}

			this._endTexture = this._characterSpritesheet.getSprite("player_up");
			this._upAnim.start();
			this._activeAnim = this._upAnim;
			this.moving = true;
			this._move({x:  this.x, y: this.y - 16});

		}
	}

	public moveRight () : void {
		if (!this.moving) {
			if (this._activeAnim && this._activeAnim != this._rightAnim) {
				this._activeAnim.stop();
			}

			this._endTexture = this._characterSpritesheet.getSprite("player_right");
			this._rightAnim.start();
			this._activeAnim = this._rightAnim;
			this.moving = true;
			this._move({x: this.x + 16, y:  this.y});
		}
	}

	public moveDown () : void {
		if (!this.moving) {
			if (this._activeAnim && this._activeAnim != this._downAnim) {
				this._activeAnim.stop();
			}

			this._endTexture = this._characterSpritesheet.getSprite("player_down");
			this._downAnim.start();
			this._activeAnim = this._downAnim;
			this.moving = true;
			this._move({x: this.x, y: this.y + 16});
		}
	}

}