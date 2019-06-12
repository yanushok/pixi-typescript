import * as PIXI from 'pixi.js';

import Scene from "./Scene";
import { GameState } from "../Settings";

class PauseScene extends Scene {
    public setup(): Scene {
        this.scene.name = 'PauseScene';
        this.stage.addChild(this.scene);

        const button = new PIXI.Graphics();
        button.beginFill(0xBBBBBB);
        button.drawRect(this.width / 2 - 100, this.height / 2 - 150, 200, 100);
        button.endFill();
        button.interactive = true;
        button.buttonMode  = true;
        button.on('click', this.resumeHandler.bind(this));
        this.scene.addChild(button);

        const buttonText = new PIXI.Text('Resume', {
            fill: "white"
        });
        buttonText.position.set(this.width / 2 - buttonText.width / 2, this.height / 2 - buttonText.height / 2 - 100);
        this.scene.addChild(buttonText);

        const button2 = new PIXI.Graphics();
        button2.beginFill(0xBBBBBB);
        button2.drawRect(this.width / 2 - 100, this.height / 2 + 50, 200, 100);
        button2.endFill();
        button2.interactive = true;
        button2.buttonMode  = true;
        button2.on('click', this.exitHandler.bind(this));
        this.scene.addChild(button2);

        const buttonText2 = new PIXI.Text('Exit to menu', {
            fill: "white"
        });
        buttonText2.position.set(this.width / 2 - buttonText2.width / 2, this.height / 2 - buttonText2.height / 2 + 100);
        this.scene.addChild(buttonText2);

        return this;
    }

    private resumeHandler(): void {
        GameState.screen = 'game';
        this.stage.getChildByName('GameScene').visible = true;
        this.removeScene();
    }

    private exitHandler(): void {
        GameState.screen = 'menu';
        this.stage.getChildByName('MenuScene').visible = true;
        this.removeScene();
    }
}

export default PauseScene;