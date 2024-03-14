class Drawable {

    img = null
    x = 0
    y = 0

    constructor(src, x, y) {
        this.img = new Image()
        this.img.src = src
        this.x = x
        this.y = y
    }

    getImg() {
        return this.img
    }

    loaded(callback) {
        this.img.onload = () => {
            callback()
        }
    }

}

export { Drawable }