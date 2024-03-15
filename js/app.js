import { GameEngine } from "./GameEngine.js"


const game = new GameEngine()

document.getElementById('startBtn').onclick = () => {
    document.getElementById('menu').style = 'display: none'
    game.run()
}
