import {ViewPort, LogManager, SeverityEnum} from '../utils';
import {AudioEngine, HTML5AudioEngine} from '../audio';
import {AssetFactory} from '../assets';
import {RenderingEngine, LogicEngine} from '../engines';

// TODO - Create interfaces so that we don't need to depend on other packages

//Typescript Testing Imports
// import {GridMap,Entity} from '../entities';
//import {ControllerFactory} from '../inputs';
// import {Animation,Spritesheet} from '../assets';
// import {CollisionEmitter} from '../utils';
//End//

export default class Engine {
    private $renderingEngine : RenderingEngine;
    private $audioEngine : AudioEngine;
    private $logManager : LogManager;
    private $assetFactory : AssetFactory;
    private $logicEngine : LogicEngine;
    private $viewPort : ViewPort;
    private $debugMode : boolean;
    private static $instance: Engine;

    private constructor () {

        this.$debugMode = false;

        this.$logManager = LogManager.getSingleton();

        //Setup the default AssetFactory
        this.$assetFactory = AssetFactory.getSingleton();

        this.$audioEngine = new HTML5AudioEngine();

        //Create the ViewPort
        this.$viewPort = new ViewPort();

        this.$logManager.log(SeverityEnum.INFO, 'Engine has started.');
    }

    public static getInstance(): Engine {
        if (!Engine.$instance) {
            Engine.$instance = new Engine();
        }

        return Engine.$instance;
    }

    public isDebugEnabled(): boolean {
        return this.$debugMode;
    }

    public setRenderingEngine(renderingEngine: RenderingEngine): void {
        if (this.$renderingEngine) {
            //Stop the old rendering engine
        }

        this.$renderingEngine = renderingEngine;

        //Start the new Rendering engine, pass in View Port, etc...
        this.$renderingEngine.setViewPort(this.$viewPort);
        this.$renderingEngine.startRendering();
    }

    public getRenderingEngine(): RenderingEngine {
        return this.$renderingEngine;
    }

    public setLogManager(logManager: LogManager): void {
        this.$logManager = logManager;
    }

    public getLogManager(): LogManager {
        return this.$logManager;
    }

    public setAssetFactory(assetFactory: AssetFactory): void {
        this.$assetFactory = assetFactory;
    }

    public getAssetFactory(): AssetFactory {
        return this.$assetFactory;
    }

    public getViewPort(): ViewPort {
        return this.$viewPort;
    }

    public setAudioEngine(audioEngine: AudioEngine): void {
        this.$audioEngine = audioEngine;
    }

    public getAudioEngine(): AudioEngine {
        return this.$audioEngine;
    }

    public setLogicEngine(logicEngine: LogicEngine): void {
        this.$logicEngine = logicEngine;
    }

    public getLogicEngine(): LogicEngine {
        return this.$logicEngine;
    }
}

export { Engine };
