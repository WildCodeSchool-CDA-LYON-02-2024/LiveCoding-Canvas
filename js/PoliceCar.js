class PoliceCar {
    img1 = null
    img2 = null
    x = 0
    y = 0

    constructor(x, y) {
        this.img1 = new Image()
        this.img1.src = 'asset/police-car-siren-red.png'
        this.img2 = new Image()
        this.img2.src = 'asset/police-car-siren-blue.png'
        this.x = x
        this.y = y
        this.isRed = true
        this.countFrame = 0
    }

    getImg() {
        if (++this.countFrame === 20) {
            this.isRed = !this.isRed
            this.countFrame = 0
        }
        return this.isRed ? this.img1 : this.img2
    }

    loaded(callback) {
        this.img1.onload = () => {
           this.img2.onload = ()=> {
                callback()
            }
        }
    }
}

export {PoliceCar}