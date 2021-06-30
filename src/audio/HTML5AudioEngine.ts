import {AudioEngine} from './AudioEngine';
import {Asset} from '../assets';
import {AudioEvents} from './AudioEvents';

export class HTML5AudioEngine extends AudioEngine {
    private $backgroundAudios: Array<Asset>;
    private $soundEffects: Array<Asset>;
    private $backgroundVolume: number;
    private $soundEffectVolume: number;

    public constructor() {
        super();
        this.$backgroundVolume = 1.0;
        this.$soundEffectVolume = 1.0;
        this.$backgroundAudios = []
        this.$soundEffects = []
    }

    public addBackgroundMusic(name: string, audio: Asset): void {
        this.addAudio(name, audio);
        this.$backgroundAudios.push(audio);
    }

    public addSoundEffect(name: string, audio: Asset): void {
        this.addAudio(name, audio);
        this.$soundEffects.push(audio);
    }

    public setBackgroundVolume(volume: number): void {
        this.$backgroundVolume = volume;
        for (let i: number = 0, len: number = this.$backgroundAudios.length; i < len; i++) {
            this._setVolume(this.$backgroundAudios[i], this.$backgroundVolume);
        }
    }

    public setSoundEffectVolume(volume: number): void {
        this.$soundEffectVolume = volume;
        for (let i: number = 0, len: number = this.$soundEffects.length; i < len; i++) {
            this._setVolume(this.$soundEffects[i], this.$soundEffectVolume);
        }
    }

    public isBackgroundMusic(audio: Asset): boolean {
        return (this.$backgroundAudios.indexOf(audio) > -1);
    }

    public isSoundEffect(audio: Asset): boolean {
        return (this.$soundEffects.indexOf(audio) > -1);
    }

    protected _playAudio(audio: Asset): void {
        this.$updateVolume(audio);
        let data: HTMLAudioElement = <HTMLAudioElement>this._getData(audio);
        data.play();
    }

    private $updateVolume(audio: Asset): void {
        if (this.isSoundEffect(audio)) {
            this._setVolume(audio, this.$soundEffectVolume);
        }
        else if (this.isBackgroundMusic(audio)) {
            this._setVolume(audio, this.$backgroundVolume);
        }
    }

    protected _pauseAudio(audio: Asset): void {
        let data: HTMLAudioElement = <HTMLAudioElement>this._getData(audio);
        data.pause();
    }

    protected _stopAudio(audio: Asset): void {
        let data: HTMLAudioElement = <HTMLAudioElement>this._getData(audio);
        data.pause();
        this._setTimeCursor(audio, 0);
    }

    protected _isAudioLooping(audio: Asset): boolean {
        let data: HTMLAudioElement = <HTMLAudioElement>this._getData(audio);
        return data.loop;
    }

    protected _loopAudio(audio: Asset, state: boolean): void {
        let data: HTMLAudioElement = <HTMLAudioElement>this._getData(audio);
        data.loop = state;
    }

    protected _isAudioMuted(audio: Asset): boolean {
        let data: HTMLAudioElement = <HTMLAudioElement>this._getData(audio);
        return data.muted;
    }

    protected _muteAudio(audio: Asset, state: boolean): void {
        let data: HTMLAudioElement = <HTMLAudioElement>this._getData(audio);
        data.muted = state;
    }

    protected _getAudioDuration(audio: Asset): number {
        let data: HTMLAudioElement = <HTMLAudioElement>this._getData(audio);
        return data.duration;
    }

    protected _setTimeCursor(audio: Asset, seconds: number): void {
        let data: HTMLAudioElement = <HTMLAudioElement>this._getData(audio);
        data.currentTime = seconds;
    }

    protected _getTimeCursor(audio: Asset): number {
        let data: HTMLAudioElement = <HTMLAudioElement>this._getData(audio);
        return data.currentTime;
    }

    protected _setVolume(audio: Asset, volume: number): void {
        let data: HTMLAudioElement = <HTMLAudioElement>this._getData(audio);
        data.volume = volume;
    }

    protected _getVolume(audio: Asset): number {
        let data: HTMLAudioElement = <HTMLAudioElement>this._getData(audio);
        return data.volume;
    }

    protected _registerStartEvent(asset: Asset, name: string, audio: Asset): void {
        let data: HTMLAudioElement = <HTMLAudioElement>asset.getData();
        data.addEventListener('playing', (e: Event) => {
            asset.setAttribute('playing', true);
            this.emit(AudioEvents.STARTED, name, audio);
        });
    }

    protected _registerEndEvent(asset: Asset, name: string, audio: Asset): void {
        let data: HTMLAudioElement = <HTMLAudioElement>asset.getData();
        data.addEventListener('ended', (e: Event) => {
            asset.setAttribute('playing', false);
            this.emit(AudioEvents.ENDED, name, audio);
        });
    }
}
