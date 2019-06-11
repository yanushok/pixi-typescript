import * as PIXI from 'pixi.js';

abstract class Scene {
    protected scene: PIXI.Container;
    protected stage: PIXI.Container
    protected width: number;
    protected height: number;

    constructor(stage: PIXI.Container, width: number, height: number) {
        this.stage = stage;
        this.scene = new PIXI.Container();
        this.scene.visible = false;

        this.width = width;
        this.height = height;
    }

    abstract setup(): Scene;

    public setVisibility(visible: boolean): void {
        this.scene.visible = visible;
    }

    public removeScene() {
        this.stage.removeChild(this.scene);
    }
}

export default Scene;
