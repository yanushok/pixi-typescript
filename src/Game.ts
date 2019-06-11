import * as PIXI from 'pixi.js'
import Tile, { TileState } from './Tile';
import Settings from './Settings';
import MenuScene from './scenes/MenuScene';
import GameScene from './scenes/GameScene';

class Game {
    public application: PIXI.Application;
    private window: Window;
    private grid: Array<Tile> = [];

    private width: number;
    private height: number;

    constructor(window: Window, width: number = 600, height: number = 800) {
        this.window = window;
        this.width = width;
        this.height = height;

        this.application = new PIXI.Application({
            width: width,
            height: height,
            antialias: true,
            transparent: false,
            resolution: window.devicePixelRatio,
        });

        this.window.onresize = this.handleWindowResize.bind(this);
        this.window.document.body.appendChild(this.application.view);
    }

    public start(): void {
        const { view: canvas } = this.application;

        this.application.renderer.resize(canvas.width, canvas.height);
        Game.scaleToWindow(this.window, canvas, 'white');

        new MenuScene(this.application.stage, this.width, this.height).setup().setVisibility(true);
        new GameScene(this.application.stage, this.width, this.height).setup();
    }

    public gameOver(): void {
        this.application.stage.getChildByName('gameMainScene').visible = false;
        this.application.stage.getChildByName('gameOverScene').visible = true;
    }

    public win(): void {
        this.application.stage.getChildByName('gameMainScene').visible = false;
        this.application.stage.getChildByName('gameWinScene').visible = true;
    }

    public checkState() {
        for (let i = 0; i < this.grid.length; i++) {
            if (!this.grid[i].hasMine() && this.grid[i].currentState !== TileState.visible) {
                return;
            }
        }

        this.win();
    }

    public startLevel(diff) {
        this.application.stage.getChildByName('gameMainScene').visible = true;

        this.grid = [];

        // offsetX = Math.floor((document.getElementById('game').clientWidth -
        //     (cDiff.width * gameState.tileW)) / 2);

        // offsetY = Math.floor((document.getElementById('game').clientHeight -
        //     (cDiff.height * gameState.tileH)) / 2);

        for (let py = 0; py < Settings.height; py++) {
            for (let px = 0; px < Settings.width; px++) {
                this.grid.push(new Tile(px, py, this.grid));
            }
        }

        let minesPlaced = 0;

        while (minesPlaced < Settings.mines) {
            const idx = Math.floor(Math.random() * this.grid.length);

            if (this.grid[idx].hasMine()) { continue; }

            this.grid[idx].setMine();
            minesPlaced++;
        }

        for (var i in this.grid) {
            this.grid[i].calcDanger();
        }
    }

    private handleWindowResize(): void {
        const { view: canvas } = this.application;

        Game.scaleToWindow(this.window, canvas, 'white');
    }

    static scaleToWindow(window: Window, canvas: HTMLCanvasElement, backgroundColor: string): number {
        //1. Scale the canvas to the correct size
        //Figure out the scale amount on each axis
        const scaleX: number = window.innerWidth / canvas.offsetWidth;
        const scaleY: number = window.innerHeight / canvas.offsetHeight;

        //Scale the canvas based on whichever value is less: `scaleX` or `scaleY`
        const scale = Math.min(scaleX, scaleY);
        canvas.style.transformOrigin = "0 0";
        canvas.style.transform = "scale(" + scale + ")";

        //2. Center the canvas.
        //Decide whether to center the canvas vertically or horizontally.
        //Wide canvases should be centered vertically, and
        //square or tall canvases should be centered horizontally
        let center: string;

        if (canvas.offsetWidth > canvas.offsetHeight) {
            if (canvas.offsetWidth * scale < window.innerWidth) {
                center = "horizontally";
            } else {
                center = "vertically";
            }
        } else {
            if (canvas.offsetHeight * scale < window.innerHeight) {
                center = "vertically";
            } else {
                center = "horizontally";
            }
        }

        //Center horizontally (for square or tall canvases)
        let margin: number;
        if (center === "horizontally") {
            margin = (window.innerWidth - canvas.offsetWidth * scale) / 2;
            canvas.style.marginTop = 0 + "px";
            canvas.style.marginBottom = 0 + "px";
            canvas.style.marginLeft = margin + "px";
            canvas.style.marginRight = margin + "px";
        }

        //Center vertically (for wide canvases)
        if (center === "vertically") {
            margin = (window.innerHeight - canvas.offsetHeight * scale) / 2;
            canvas.style.marginTop = margin + "px";
            canvas.style.marginBottom = margin + "px";
            canvas.style.marginLeft = 0 + "px";
            canvas.style.marginRight = 0 + "px";
        }

        //3. Remove any padding from the canvas  and body and set the canvas
        //display style to "block"
        canvas.style.paddingLeft = 0 + "px";
        canvas.style.paddingRight = 0 + "px";
        canvas.style.paddingTop = 0 + "px";
        canvas.style.paddingBottom = 0 + "px";
        canvas.style.display = "block";

        //4. Set the color of the HTML body background
        document.body.style.backgroundColor = backgroundColor;

        //Fix some quirkiness in scaling for Safari
        const ua = navigator.userAgent.toLowerCase();
        if (ua.indexOf("safari") != -1) {
            if (ua.indexOf("chrome") > -1) {
                // Chrome
            } else {
                // Safari
                //canvas.style.maxHeight = "100%";
                //canvas.style.minHeight = "100%";
            }
        }

        //5. Return the `scale` value. This is important, because you'll nee this value
        //for correct hit testing between the pointer and sprites
        return scale;
    }
}

export default Game;
