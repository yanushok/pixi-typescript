import Settings from './Settings';

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
    private grid: Array<Tile>;

    constructor(x: number, y: number, grid: any) {
        this.x = x;
        this.y = y;
        this.grid = grid;
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

                if (this.grid[y * Settings.width + x]._hasMine) {
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

    public setFlag(): void {
        if (this.currentState === TileState.hidden) {
            this.currentState = TileState.flagged;
        } else if (this.currentState === TileState.flagged) {
            this.currentState = TileState.hidden;
        }
    }

    public click(): void {
        if (this.currentState !== TileState.hidden) {
            return;
        }

        if (this._hasMine) {
            //gameOver();
        } else if (this.danger > 0) {
            this.currentState = TileState.visible;
        } else {
            this.currentState = TileState.visible;
            this.revealNeighbours();
        }

        // checkState();
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
                const currentTile = this.grid[idx];

                if (currentTile.currentState === TileState.hidden) {
                    currentTile.currentState = TileState.visible;

                    if (currentTile.danger == 0) {
                        currentTile.revealNeighbours();
                    }
                }
            }
        }
    }
}