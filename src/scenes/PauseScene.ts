import Scene from "./Scene";

class PauseScene extends Scene {
    public setup(): Scene {
        this.scene.name = 'PauseScene';
        this.stage.addChild(this.scene);

        return this;
    }
}

export default PauseScene;