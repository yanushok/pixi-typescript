import * as PIXI from 'pixi.js';

import Scene from "./Scene";
import GameScene from "./GameScene";
import { GameState } from '../Settings';

class MenuScene extends Scene {
    public setup(): Scene {
        this.scene.name = 'MenuScene';
        this.stage.addChild(this.scene);

        const button = new PIXI.Graphics();
        button.name = 'playButton';
        button.beginFill(0xBBBBBB);
        button.drawRect(this.width / 2 - 100, this.height / 2 - 50, 200, 100);
        button.endFill();
        button.interactive = true;
        button.buttonMode  = true;
        button.on('click', this.startGameHandler.bind(this));
        this.scene.addChild(button);

        const buttonText = new PIXI.Text('Start new game', {
            fill: "white"
        });
        buttonText.name = 'playButtonText';
        buttonText.position.set(this.width / 2 - buttonText.width / 2, this.height / 2 - buttonText.height / 2);
        this.scene.addChild(buttonText);

        return this;
    }

    private startGameHandler() {
        GameState.screen = 'game';
        new GameScene(this.stage, this.width, this.height).setup().setVisibility(true);
        this.setVisibility(false);
    }
}

export default MenuScene;