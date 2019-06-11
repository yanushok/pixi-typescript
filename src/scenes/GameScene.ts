import * as PIXI from 'pixi.js';

import Scene from "./Scene";

class GameScene extends Scene {
    public setup(): Scene {
        this.scene.name = 'GameScene';
        this.stage.addChild(this.scene);

        const buttonText = new PIXI.Text('GameScene', {
            fill: "white"
        });
        buttonText.name = 'playButtonText';
        buttonText.position.set(this.width / 2 - buttonText.width / 2, this.height / 2 - buttonText.height / 2);
        this.scene.addChild(buttonText);

        return this;
    }
}

export default GameScene;