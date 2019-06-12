import * as PIXI from 'pixi.js'

import { GameState } from './Settings';
import MenuScene from './scenes/MenuScene';
import Scene from './scenes/Scene';

class Game {
    public application: PIXI.Application;
    private window: Window;

    private width: number;
    private height: number;

    private scenes: {[key: string]: Scene} = {};

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

        this.application.renderer.backgroundColor = 0x061639;

        this.window.onresize = this.handleWindowResize.bind(this);
        this.window.document.body.appendChild(this.application.view);
    }

    public start(): void {
        const { view: canvas } = this.application;

        this.application.renderer.resize(canvas.width, canvas.height);
        Game.scaleToWindow(this.window, canvas, 'white');

        GameState.screen = 'game';
        new MenuScene(this.application.stage, this.width, this.height).setup().setVisibility(true);
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
