const canvas = document.querySelector("#canvas-1");
const ctx = canvas.getContext("2d")

// canvas.width = window.innerWidth
// canvas.height = window.innerHeight

class Particle {
    constructor (x,y,directionX,directionY,size,color) {
        this.x = x
        this.y = y
        this.directionX = directionX
        this.directionY = directionY
        this.size = size
        this.color = color
    }
    draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fillStyle = this.color
        ctx.fill()
    }
    update() {
        if (this.x >= canvas.width || this.x <= 0) {
            this.directionX = -this.directionX
        } else if (this.y >= canvas.height || this.y <= 0) {
            this.directionY = -this.directionY
        }
        this.x += this.directionX
        this.y += this.directionY
        this.draw()
    }
}
// console.log(new Particle(40, 10, 1, 1, 54, "#000"));
