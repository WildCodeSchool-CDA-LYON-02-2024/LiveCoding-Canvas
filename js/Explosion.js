import { Drawable } from "./Drawable.js";

export class Explosion extends Drawable {
    isFinished = false
    currentFrameIndex = 0

    constructor(x, y) {
        super(x, y, 'asset/explosion/explosion0.png', 'asset/explosion/explosion1.png', 'asset/explosion/explosion2.png');

        this.frame = Math.floor(Math.random() * (this.images.length - 1));
        this.refresh = 1000
        this.dateFrame = Date.now() + this.refresh;
    }

    getImg() {
        if (this.dateFrame < Date.now()) {
            this.dateFrame = Date.now() + this.refresh

            if (++this.frame > this.images.length - 1) {
                this.frame = 0
            }
        }

        return this.images[this.frame]
    }
}