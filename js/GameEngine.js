import {Drawable} from "./Drawable.js"
import {PoliceCar} from "./PoliceCar.js";


class GameEngine {

    canvas = null
    ctx = null
    items = []
    player= null

    keys = {
        up: false,
        down: false,
        left: false,
        right: false,
        space: false
    };

    speed = 5

    constructor() {
        this.canvas = document.getElementById('game')
        this.ctx = this.canvas.getContext('2d')
        this.canvas.width = 840
        this.canvas.height = 650
        this.player = new Drawable('asset/tank.png', 300, 50)
      //  this.policeCar = new Drawable('asset/police_car.png',  300, 500)
    }

    init() {
        this.initEvent()
        this.items = [
            new Drawable('asset/police_car.png',  300, 500),
            new PoliceCar( 200, 200),
            new Drawable('asset/police_car.png',  200, 300),
            new PoliceCar(  400, 550)
        ]
    }

    initEvent() {
        window.addEventListener('keydown', (event) => {
            switch (event.key) {
                case 'ArrowUp':
                    this.keys.up = true;
                    break;
                case 'ArrowDown':
                    this.keys.down = true;
                    break;
                case 'ArrowLeft':
                    this.keys.left = true;
                    break;
                case 'ArrowRight':
                    this.keys.right = true;
                    break;
                case ' ':
                    break;
            }
        });

        window.addEventListener('keyup', (event) => {
            switch (event.key) {
                case 'ArrowUp':
                    this.keys.up = false;
                    break;
                case 'ArrowDown':
                    this.keys.down = false;
                    break;
                case 'ArrowLeft':
                    this.keys.left = false;
                    break;
                case 'ArrowRight':
                    this.keys.right = false;
                    break;
                case ' ':
                    break;
            }
        });
    }

    update() {

        let prevX = this.player.x
        let prevY = this.player.y

        if (this.keys.down) {
            this.player.y += this.speed
        }
        if (this.keys.up) {
            this.player.y -= this.speed
        }
        if (this.keys.left) {
            this.player.x -= this.speed
        }
        if (this.keys.right) {
            this.player.x += this.speed
        }

        if (this.collisionItem()) {
            this.player.x = prevX
            this.player.y = prevY
        }

        this.collisionBorder()
    }

    collisionItem() {
        for (let item of this.items)
        {
            if (
                this.player.x < item.getImg().width + item.x
                && this.player.x + this.player.getImg().width > item.x
                && this.player.y < item.getImg().height + item.y
                && this.player.y + this.player.getImg().height > item.y
            ) {
                return true
            }
        }
        return false
    }

    collisionBorder() {
        if (this.player.x < 0) {
            this.player.x = 0
        }
        if (this.player.y < 0) {
            this.player.y= 0
        }
        if (this.player.x + this.player.img.width > this.canvas.width) {
            this.player.x = this.canvas.width - this.player.img.width
        }
        if (this.player.y + this.player.img.height > this.canvas.height) {
            this.player.y = this.canvas.height - this.player.img.height
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        for (let item of this.items)
        {
            this.ctx.drawImage(item.getImg(), item.x, item.y)
        }
        this.ctx.drawImage(this.player.getImg(), this.player.x, this.player.y)
    }

    gameLoop() {
        this.update()
        this.draw()
        window.requestAnimationFrame(() => {
            this.gameLoop()
        })
    }

    run() {
        this.init()
        let count = 0
        for (let item of this.items)
        {
            item.loaded(() => {
                console.log(item)
                if (++count === this.items.length) {
                    this.gameLoop()
                }
            })
        }
    }
}

export { GameEngine }