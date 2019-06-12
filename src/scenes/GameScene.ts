import * as PIXI from 'pixi.js';

import Scene from "./Scene";
import Tile, { TileState } from '../Tile';
import Settings, { GameState } from '../Settings';
import PauseScene from './PauseScene';

class GameScene extends Scene {
    public grid: Array<Tile>;
    private tilesContainer: PIXI.Container;
    private interactive: boolean = true;

    constructor(stage: PIXI.Container, width: number, height: number) {
        super(stage, width, height);
    }

    public setup(): Scene {
        this.grid = [];
        this.scene.name = 'GameScene';
        this.stage.addChild(this.scene);

        this.startLevel();

        return this;
    }

    private startLevel() {
        for (let y = 0; y < Settings.height; y++) {
            for (let x = 0; x < Settings.width; x++) {
                this.grid.push(new Tile(x, y, this));
            }
        }

        let minesPlaced = 0;

        while (minesPlaced < Settings.mines) {
            const idx = Math.floor(Math.random() * this.grid.length);

            if (this.grid[idx].hasMine()) { continue; }

            this.grid[idx].setMine();
            minesPlaced++;
        }

        for (let i = 0; i < this.grid.length; i++) {
            this.grid[i].calcDanger();
        }

        this.drawLevel();
    }

    public checkState() {
        for (let i = 0; i < this.grid.length; i++) {
            if (!this.grid[i].hasMine() && this.grid[i].currentState !== TileState.visible) {
                return;
            }
        }

        GameState.screen = 'win';
        this.drawLevel();
    }

    public pause() {
        GameState.screen = 'pause';
        new PauseScene(this.stage, this.width, this.height).setup().setVisibility(true);
        this.setVisibility(false);
    }

    public goToMenu() {
        GameState.screen = 'menu';
        this.removeScene();
        this.stage.getChildByName('MenuScene').visible = true;
    }

    public drawLevel() {
        if (!this.grid || !this.grid.length) {
            return;
        }

        const startWidth = (this.width - GameState.tileW * Settings.width) / 2;
        const startHeight = (this.height - GameState.tileH * Settings.height) / 2;

        if (this.tilesContainer) {
            this.scene.removeChild(this.tilesContainer);
        }

        this.tilesContainer = new PIXI.Container();

        if (GameState.screen === 'lost' || GameState.screen === 'win') {
            this.interactive = false;

            const button = new PIXI.Graphics();
            button.beginFill(0xBBBBBB);
            button.drawRect(this.width / 2 - 100, this.height - 150, 200, 100);
            button.endFill();
            button.interactive = true;
            button.buttonMode = true;
            button.on('click', this.goToMenu.bind(this));
            this.tilesContainer.addChild(button);

            const buttonText = new PIXI.Text('Go to menu', {
                fill: "white"
            });
            buttonText.position.set(this.width / 2 - buttonText.width / 2, this.height - 150 + buttonText.height);
            this.tilesContainer.addChild(buttonText);

            const text = GameState.screen === 'lost' ? 'Game over!' : 'Cleared!';

            const winText = new PIXI.Text(text, {
                fill: "white"
            });
            winText.position.set(this.width / 2 - winText.width / 2, 150);
            this.tilesContainer.addChild(winText);
        } else if (GameState.screen === 'game') {
            const button = new PIXI.Graphics();
            button.beginFill(0xBBBBBB);
            button.drawRect(this.width / 2 - 100, this.height - 150, 200, 100);
            button.endFill();
            button.interactive = true;
            button.buttonMode = true;
            button.on('click', this.pause.bind(this));
            this.tilesContainer.addChild(button);

            const buttonText = new PIXI.Text('Pause', {
                fill: "white"
            });
            buttonText.position.set(this.width / 2 - buttonText.width / 2, this.height - 150 + buttonText.height);
            this.tilesContainer.addChild(buttonText);
        }

        for (let i = 0; i < this.grid.length; i++) {
            const tile = this.grid[i];

            if (GameState.screen === 'lost' && this.grid[i].hasMine()) {
                const tileRect = new PIXI.Graphics();
                tileRect.beginFill(0xCC0000);
                tileRect.lineStyle(1, 0x999999);
                tileRect.drawRect(tile.x * GameState.tileW + startWidth, tile.y * GameState.tileH + startHeight, GameState.tileW, GameState.tileH);
                tileRect.endFill();
                this.tilesContainer.addChild(tileRect);
            } else if (this.grid[i].currentState === TileState.visible) {
                const tileRect = new PIXI.Graphics();
                tileRect.beginFill(0xBBBBBB);
                tileRect.lineStyle(1, 0x999999);
                tileRect.drawRect(tile.x * GameState.tileW + startWidth, tile.y * GameState.tileH + startHeight, GameState.tileW, GameState.tileH);
                tileRect.endFill();
                this.tilesContainer.addChild(tileRect);

                if (this.grid[i].danger > 0) {
                    const buttonText = new PIXI.Text(this.grid[i].danger.toString(), {
                        fill: "white"
                    });
                    buttonText.position.set(tile.x * GameState.tileW + startWidth + (GameState.tileW - buttonText.width) / 2, tile.y * GameState.tileH + startHeight + (GameState.tileH - buttonText.height) / 2);
                    this.tilesContainer.addChild(buttonText);
                }
            } else if (this.grid[i].currentState === TileState.flagged) {
                const tileRect = new PIXI.Graphics();
                tileRect.beginFill(0xffb02e);
                tileRect.lineStyle(1, 0x999999);
                tileRect.drawRect(tile.x * GameState.tileW + startWidth, tile.y * GameState.tileH + startHeight, GameState.tileW, GameState.tileH);
                tileRect.endFill();
                tileRect.interactive = this.interactive;
                tileRect.on('rightclick', tile.setFlag.bind(tile));
                this.tilesContainer.addChild(tileRect);
            } else {
                const tileRect = new PIXI.Graphics();
                tileRect.beginFill(0xCCCCCC);
                tileRect.lineStyle(1, 0x999999);
                tileRect.drawRect(tile.x * GameState.tileW + startWidth, tile.y * GameState.tileH + startHeight, GameState.tileW, GameState.tileH);
                tileRect.endFill();
                tileRect.interactive = this.interactive;
                tileRect.on('click', tile.click.bind(tile));
                tileRect.on('rightclick', tile.setFlag.bind(tile));
                this.tilesContainer.addChild(tileRect);
            }
        }

        this.scene.addChild(this.tilesContainer);
    }
}

export default GameScene;