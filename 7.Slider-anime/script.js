/** EXPLICATION GÉNÉRALE :
 * Slider animé avec effet de transition fluide.
 * Ce script permet de naviguer entre différentes slides via des boutons directionnels (précédent/suivant).
 * Les animations de transition sont gérées en JavaScript en modifiant dynamiquement les styles CSS.
 * Un système de verrouillage empêche les actions multiples durant l'animation pour garantir une fluidité.
 */

const slides = [...document.querySelectorAll('.slider__slide')]
const sliderData = {
    locked: false,
    direction: 0,
    slideOutIndex: 0,
    slideInIndex: 0
}
const directionButtons = [...document.querySelectorAll('.slider__direction-btn')]
directionButtons.forEach(btn => btn.addEventListener('click', handleSliderDirectionBtn))

/** EXPLICATION :
 * Gère l'événement de clic sur un bouton directionnel.
 * Verrouille temporairement les interactions, détermine la direction, puis lance la gestion de slide.
 * @param {Event} e - L'événement de clic déclenché par le bouton.
 */
function handleSliderDirectionBtn(e) {
    if (sliderData.locked) return
    sliderData.locked = true
    getDirection(e.target)
    slideManagement()
}

/** EXPLICATION :
 * Détermine la direction du déplacement et les index des slides à sortir/entrer.
 * Prend en compte le débordement (boucle) en début ou fin de slider.
 * @param {HTMLElement} btn - Le bouton directionnel cliqué.
 */
function getDirection(btn) {
    sliderData.direction = Number(btn.getAttribute('data-direction'))
    sliderData.slideOutIndex = slides.findIndex(slide => slide.classList.contains('js-active-slide'))

    // Si l'utilisateur est actuellement sur la dernière slide et clique sur "suivant",
    // on boucle en revenant à la première slide (index 0).
    if (sliderData.slideOutIndex + sliderData.direction > slides.length - 1) {
        sliderData.slideInIndex = 0
    }
    // Si l'utilisateur est actuellement sur la première slide et clique sur "précédent",
    // on boucle en revenant à la dernière slide (index dernière slide).
    else if (sliderData.slideOutIndex + sliderData.direction < 0) {
        sliderData.slideInIndex = slides.length - 1
    }
    else {
        sliderData.slideInIndex = sliderData.slideOutIndex + sliderData.direction
    }
}

/** EXPLICATION :
 * Prépare les styles pour animer la sortie de la slide active
 * et déclenche l'écoute de fin de transition pour lancer l'entrée de la nouvelle slide.
 */
function slideManagement() {
    updateElementStyle({
        el: slides[sliderData.slideInIndex],
        props: {
            display: "flex",
            transform: `translateX(${sliderData.direction < 0 ? '100%' : '-100%'})`,
            opacity: 0
        }
    })

    slides[sliderData.slideOutIndex].addEventListener('transitionend',slideIn)

    updateElementStyle({
        el: slides[sliderData.slideOutIndex],
        props: {
            transition: 'transform 0.4s cubic-bezier(0.74, -0.34, 1, 1.19), opacity 0.4s ease-out',
            transform: `translateX(${sliderData.direction < 0 ? '-100%' : '100%'})`,
            opacity: 0
        }
    })
}

/** EXPLICATION :
 * Applique dynamiquement un ensemble de styles à un élément HTML.
 * @param {{el: HTMLElement, props: Object}} animationObject - L'objet contenant l'élément et les propriétés CSS à appliquer.
 */
function updateElementStyle(animationObject) {
    for (const prop in animationObject.props) {
        animationObject.el.style[prop] = animationObject.props[prop]
    }
}

/** EXPLICATION :
 * Gère l'animation d'entrée de la nouvelle slide après la fin de la transition de la slide sortante.
 * 
 * Étapes effectuées :
 * 1. Applique les styles CSS nécessaires pour faire entrer la nouvelle slide (position et opacité).
 * 2. Met à jour les classes CSS pour marquer la nouvelle slide comme active, et retirer cette classe de l'ancienne.
 * 3. Supprime l'écouteur de transition de l'ancienne slide pour éviter des appels multiples.
 * 4. Cache complètement l'ancienne slide (display: none).
 * 5. Ajoute un écouteur sur la nouvelle slide pour savoir quand son animation est finie, 
 *    et ainsi débloquer le slider pour de futures interactions.
 * 
 * @param {TransitionEvent} e - L’événement déclenché à la fin de la transition de la slide sortante.
 */
function slideIn(e) {
        updateElementStyle({
        el: slides[sliderData.slideInIndex],
        props: {
            transition: 'transform 0.4s ease-out, opacity 0.6s ease-out',
            transform: `translateX(0)`,
            opacity: 1
        }
    })
    slides[sliderData.slideInIndex].classList.add('js-active-slide')
    slides[sliderData.slideOutIndex].classList.remove('js-active-slide')
    e.target.removeEventListener('transitionend', slideIn)
    slides[sliderData.slideOutIndex].style.display = 'none'
    slides[sliderData.slideInIndex].addEventListener('transitionend', unlockNewAnimation) 

    /** EXPLICATION :
     * Déverrouille le slider une fois l'animation de la slide entrante terminée,
     * permettant une nouvelle interaction utilisateur.
     * Supprime également l'écouteur d'événement pour éviter les appels multiples.
     */
    function unlockNewAnimation() {
        sliderData.locked = false
        slides[sliderData.slideInIndex].removeEventListener('transitionend', unlockNewAnimation) 
    }
}