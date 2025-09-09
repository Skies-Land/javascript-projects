const canvas = document.querySelector("#canvas-1");
const ctx = canvas.getContext("2d")

canvas.width = window.innerWidth
canvas.height = window.innerHeight

/** EXPLICATION :
 * Classe représentant une particule animée sur le canvas.
 */
class Particle {
    /** EXPLICATION :
     * Crée une particule.
     * @param {number} x Position x initiale
     * @param {number} y Position y initiale
     * @param {number} directionX Vitesse horizontale
     * @param {number} directionY Vitesse verticale
     * @param {number} size Rayon de la particule
     * @param {string} color Couleur de la particule
     */
    constructor(x,y,directionX,directionY,size,color) {
        this.x = x
        this.y = y
        this.directionX = directionX
        this.directionY = directionY
        this.size = size
        this.color = color
    }
    /** EXPLICATION :
     * Dessine la particule sur le canvas.
     */
    draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fillStyle = this.color
        ctx.fill()
    }
    /** EXPLICATION :
     * Met à jour la position de la particule et la redessine.
     */
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

let particulesArray;

/** EXPLICATION :
 * Remplit le tableau des particules avec de nouvelles instances de Particle.
 */
function fillParticulesArray() {
    particulesArray = []
    const particulesNumber = (canvas.height * canvas.width) / 9000
    for (let i = 0; i < particulesNumber; i++) {
        const size = Math.random() * 2 + 1
        const x = Math.random() * (canvas.width - 20) + 10
        const y = Math.random() * (canvas.height - 20) + 10
        const directionX = randomVelocity()
        const directionY = randomVelocity()
        particulesArray.push(new Particle(x, y, directionX, directionY, size, "#f1f1f1"))
    }
    // console.log(particulesArray);
}
fillParticulesArray()

/** EXPLICATION :
 * Génère une vitesse aléatoire (positive ou négative).
 * @returns {number} La vitesse générée
 */
function randomVelocity() {
    const speed = Math.random() * 1 + 0.5
    return Math.random() < 0.5 ? speed : -speed
}

window.addEventListener("resize", handleResize)

/** EXPLICATION :
 * Gère le redimensionnement de la fenêtre et réinitialise le canvas et les particules.
 */
function handleResize() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    fillParticulesArray()
}

/** EXPLICATION :
 * Fonction d'animation principale : efface le canvas, met à jour les particules et dessine les connexions.
 */
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    for (let i = 0; i < particulesArray.length; i++) {
        particulesArray[i].update()
    }
    connectParticules()
    requestAnimationFrame(animate)
}
animate()

/** EXPLICATION :
 * Dessine des lignes entre les particules proches les unes des autres.
 */
function connectParticules() {
    const maxDistance = 135

    for (let i = 0; i < particulesArray.length; i++) {
        const p1 = particulesArray[i]

        for (let j = i + 1; j < particulesArray.length; j++) {
            const p2 = particulesArray[j]

            if (Math.abs(p1.x - p2.x) > maxDistance || Math.abs(p1.y - p2.y) > maxDistance) {
                continue
            }

            const deltaX = p1.x - p2.x
            const deltaY = p1.y - p2.y
            const hypothenuseSquare = deltaX * deltaX + deltaY * deltaY

            const maxDistanceSquare = maxDistance * maxDistance
            if (hypothenuseSquare < maxDistanceSquare) {
                const opacity = 1 - hypothenuseSquare / maxDistanceSquare
                ctx.strokeStyle = `rgba(240, 240, 240, ${opacity})`
                ctx.lineWidth = 0.4
                ctx.beginPath()
                ctx.moveTo(p1.x, p1.y)
                ctx.lineTo(p2.x, p2.y)
                ctx.stroke()
            }
        }
    }
}