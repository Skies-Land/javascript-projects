const canvas = document.querySelector("#canvas-1");
const ctx = canvas.getContext("2d")

canvas.width = window.innerWidth
canvas.height = window.innerHeight

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

let particulesArray;

function fillParticulesArray() {
    particulesArray = []
    const particulesNumber = (canvas.height * canvas.width) / 9000
    for (let i = 0; i < particulesNumber; i++) {
        const size = Math.random() * 2 + 1
        const x = Math.random() * (canvas.innerWidth - 20) + 10
        const y = Math.random() * (canvas.innerHeight - 20) + 10
        const directionX = randomVelocity()
        const directionY = randomVelocity()
        particulesArray.push(new Particle(x, y, directionX, directionY, size, "#f1f1f1"))
    }
}
fillParticulesArray()
console.log(particulesArray);

function randomVelocity() {
    const speed = Math.random() * 1 + 0.5
    return Math.random() < 0.5 ? speed : -speed
}