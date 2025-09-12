const customCursorParent = document.querySelector('.custom-cursor')
const cursorOuterCircle = document.querySelector('.custom-cursor__outer-circle')
const cursorInnerDot = document.querySelector('.custom-cursor__inner-dot')

let mouseX = 0, mouseY = 0
let outerCurrentX = 0, outerCurrentY = 0
let innerCurrentX = 0, innerCurrentY = 0

const outerCursorSpeed = 0.1
const innerDotCursorSpeed = 0.25

let isRafIdle = null

window.addEventListener("mousemove", handleWindowMousemove)

/** EXPLICATION :
 * Gère l’événement mousemove sur la fenêtre.
 * Met à jour les coordonnées mouseX et mouseY en fonction de la position actuelle de la souris.
 * Démarre la boucle d’animation du curseur si elle n’est pas déjà en cours.
 *  * @param {MouseEvent} e - L’objet événement mousemove contenant la position de la souris.
 */
function handleWindowMousemove(e) {
    mouseX = e.clientX
    mouseY = e.clientY

    if (!isRafIdle) {
        animateCursor()
    }
}

/** EXPLICATION :
 *
 * Anime deux éléments de curseur (cercle externe + point interne) en interpolant
 * leurs positions vers la position de la souris (`lerp`) et relance la boucle
 * requestAnimationFrame tant que la distance résiduelle dépasse un seuil.
 * Masque le curseur personnalisé quand la souris survole un élément interactif.
 *
 * Globals attendus : mouseX, mouseY, outerCurrentX/Y, innerCurrentX/Y,
 * outerCursorSpeed, innerDotCursorSpeed, cursorOuterCircle, cursorInnerDot, isRafIdle.
 *
 * Arrêt : annule rAF et met isRafIdle à null quand la distance < 0.1px (seuil).
 *
 * Remarques : document.elementFromPoint() utilise des coordonnées viewport ;
 * préfère translate3d/transform pour de meilleures performances si besoin.
 *
 * @returns {void}
 */
function animateCursor() {
    outerCurrentX += (mouseX - outerCurrentX) * outerCursorSpeed
    outerCurrentY += (mouseY - outerCurrentY) * outerCursorSpeed

    innerCurrentX += (mouseX - innerCurrentX) * innerDotCursorSpeed
    innerCurrentY += (mouseY - innerCurrentY) * innerDotCursorSpeed

    cursorOuterCircle.style.translate = `calc(${outerCurrentX}px - 50%) calc(${outerCurrentY}px - 50%)`
    cursorInnerDot.style.translate = `calc(${innerCurrentX}px - 50%) calc(${innerCurrentY}px - 50%)`

    if (Math.abs(outerCurrentX - mouseX) < 0.1 && Math.abs(outerCurrentY - mouseY) < 0.1) {
        cancelAnimationFrame(isRafIdle)
        isRafIdle = null
        return
    }

    isRafIdle = requestAnimationFrame(animateCursor)

    // Contrôle de l'animation "hover" sur les liens de la navbar
    const hoveredElement = document.elementFromPoint(mouseX, mouseY)
    if (hoveredElement && hoveredElement.closest("a,button,input,textarea")) {
        cursorOuterCircle.style.opacity = "0"
        cursorInnerDot.style.opacity = "0"
    } else {
        cursorOuterCircle.style.opacity = "1"
        cursorInnerDot.style.opacity = "1"
    }
}