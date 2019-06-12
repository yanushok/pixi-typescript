import Settings, { GameState } from './Settings';
import GameScene from './scenes/GameScene';

export enum TileState {
    hidden,
    visible,
    flagged,
};

export default class Tile {
    public x: number;
    public y: number;
    private _hasMine: boolean = false;
    public danger: number = 0;
    public currentState: TileState = TileState.hidden;
    private parentScene: GameScene;

    constructor(x: number, y: number, scene: any) {
        this.x = x;
        this.y = y;
        this.parentScene = scene;
    }

    public calcDanger(): void {
        for (let y = this.y - 1, maxY = this.y + 1; y <= maxY; y++) {
            for (let x = this.x - 1, maxX = this.x + 1; x <= maxX; x++) {
                if (x === this.x && y === this.y) {
                    continue;
                }

                if (x < 0 || y < 0 || x >= Settings.width || y >= Settings.height) {
                    continue;
                }

                if (this.parentScene.grid[y * Settings.width + x]._hasMine) {
                    this.danger++;
                }
            }
        }
    }

    public hasMine(): boolean {
        return this._hasMine;
    }

    public setMine(): void {
        this._hasMine = true;
    }

    public setFlag(e: PIXI.interaction.InteractionEvent): void {
        e.data.originalEvent.preventDefault();
        if (this.currentState === TileState.hidden) {
            this.currentState = TileState.flagged;
        } else if (this.currentState === TileState.flagged) {
            this.currentState = TileState.hidden;
        }
        this.parentScene.drawLevel();
    }

    public click(e: PIXI.interaction.InteractionEvent): void {
        e.data.originalEvent.preventDefault();
        if (this.currentState !== TileState.hidden) {
            return;
        }

        if (this._hasMine) {
            this.gameOver();
            this.parentScene.drawLevel();
        } else if (this.danger > 0) {
            this.currentState = TileState.visible;
            this.parentScene.drawLevel();
        } else {
            this.currentState = TileState.visible;
            this.revealNeighbours();
        }

        this.parentScene.checkState();
    }

    public revealNeighbours(): void {
        for (let y = this.y - 1, maxY = this.y + 1; y <= maxY; y++) {
            for (let x = this.x - 1, maxX = this.x + 1; x <= maxX; x++) {
                if (x === this.x && y === this.y) {
                    continue;
                }

                if (x < 0 || y < 0 || x >= Settings.width || y >= Settings.height) {
                    continue;
                }

                const idx = y * Settings.width + x;
                const currentTile = this.parentScene.grid[idx];

                if (currentTile.currentState === TileState.hidden) {
                    currentTile.currentState = TileState.visible;

                    if (currentTile.danger == 0) {
                        currentTile.revealNeighbours();
                    }
                    this.parentScene.drawLevel();
                }
            }
        }
    }

    private gameOver() {
        GameState.screen = 'lost';
    }
}