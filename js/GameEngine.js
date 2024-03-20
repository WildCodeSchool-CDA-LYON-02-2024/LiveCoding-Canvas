import {Drawable} from "./Drawable.js"
import { Explosion } from "./Explosion.js";
import {PoliceCar} from "./PoliceCar.js";
import {collision} from "./utils.js";


class GameEngine {

    canvas = null
    ctx = null
    items = []
    lasers = []
    life = 5
    isGameOver = false
    player= null
    explosions = []

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
    }

    init() {
        this.player = new Drawable(300, 50, 'asset/tank.png')
        this.life = 5
        this.initEvent()
        this.items = [
            new Drawable( 300, 500, 'asset/police_car.png'),
            new PoliceCar( 200, 800),
            new Drawable(  200, 600, 'asset/police_car.png'),
            new PoliceCar(  400, 550),
            new Drawable(350, 850, 'asset/police_car.png'),
            new PoliceCar(  220, 550)
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
                    const laser = new Drawable(null, null ,'asset/laser.png');
                    laser.x = this.player.x + this.player.getImg().width / 2 - laser.getImg().width / 2;
                    laser.y = this.player.y
                    this.lasers.push(laser)
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

        this.collisionLaser()
        this.lasers = this.lasers.filter(laser => laser.y < this.canvas.height && !laser.onDestroy)

        for (let laser of this.lasers)
        {
            laser.y += 10
        }

        for (let explosion of this.explosions) {
            if (!explosion.isFinished) {
                explosion.currentFrameIndex++

                if(explosion.currentFrameIndex >= explosion.images.length) {
                    explosion.isFinished = true
                }
            }
        }

        this.explosions = this.explosions.filter(explosion => {
            return !explosion.isFinished;
        })

        !this.isGameOver ? this.gameOver() : null;
    }

    collisionItem() {
        this.items = this.items.filter(item => !item.onDestroy)
        for (let item of this.items) {
            if (collision(this.player, item)) {
                item.onDestroy = true
                this.life -= 1
                return true
            }
            if (item.y < 0) {
                this.life -= 1
                item.onDestroy = true
            }
            item.y -= 1
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
        if (this.player.x + this.player.getImg().width > this.canvas.width) {
            this.player.x = this.canvas.width - this.player.getImg().width
        }
        if (this.player.y + this.player.getImg().height > this.canvas.height) {
            this.player.y = this.canvas.height - this.player.getImg().height
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        for (let item of this.items)
        {
            this.ctx.drawImage(item.getImg(), item.x, item.y)
        }
        for (let laser of this.lasers) {
            this.ctx.drawImage(laser.getImg(), laser.x, laser.y)
        }

        this.ctx.drawImage(this.player.getImg(), this.player.x, this.player.y)

        for (let explosion of this.explosions) {
            this.ctx.drawImage(explosion.getImg(), explosion.x, explosion.y)
        }
    }

    createBlastSound() {
        const explosionSound = new Audio('asset/sounds/explosion.wav')
        return explosionSound.play()
    }

    createEnnemyExplosion(item) {
        const explosion = new Explosion(null, null);
        explosion.x = item.x
        explosion.y = item.y
        this.explosions.push(explosion)
    }

    gameLoop() {
        if (this.items.length === 0) {
            this.gameOver()
        }
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

    collisionLaser() {
        for (let laser of this.lasers) {
            for (let item of this.items) {
                if (collision(laser, item)) {
                    laser.onDestroy = true
                    item.onDestroy = true
                    this.createEnnemyExplosion(item)
                    this.createBlastSound()
                }
            }
        }
    }

    gameOver() {
        if (this.life > 0 && this.items.length === 0) {
            this.isGameOver = true
            document.getElementById('titleMenu').innerText = 'GAME OVER'
            document.getElementById('contentMenu').innerText = 'Vous avez gagné !!!'
            document.getElementById('startBtn').innerText = 'Restart the Game'
            document.getElementById('menu').style = 'display: flex'
        } else if (this.life <= 0) {
            this.isGameOver = true
            document.getElementById('titleMenu').innerText = 'GAME OVER'
            document.getElementById('contentMenu').innerText = 'LOSEEEEEER !!!'
            document.getElementById('startBtn').innerText = 'Restart the Game'
            document.getElementById('menu').style = 'display: flex'
        }

    }
}

export { GameEngine }