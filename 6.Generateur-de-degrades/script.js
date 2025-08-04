/** EXPLICATION GÉNÉRALE :
 * Générateur de dégradés CSS interactif.
 *
 * Ce script permet à l'utilisateur de générer des dégradés linéaires en sélectionnant deux couleurs
 * et un angle via une interface graphique. Il offre également la possibilité :
 * - d'ajuster dynamiquement les couleurs via des color pickers,
 * - de modifier l'angle d'inclinaison via un range slider,
 * - de copier le code CSS du dégradé dans le presse-papiers,
 * - de générer aléatoirement un nouveau dégradé,
 * - de rendre le texte lisible sur fond coloré grâce à un calcul de contraste.
 */

const colorLabels = document.querySelectorAll('.gradient-app__color-label')
const colorPickerInputs = [...document.querySelectorAll('.gradient-app__color-input')]
const gradientApp = document.querySelector('.gradient-app')
const rangeLabelValue = document.querySelector('.gradient-app__orientation-value')
const gradientData = {
    angle: 90,
    colors: ["#FF5F6D", "#FFC371"]
}

/** EXPLICATION :
 * - Met à jour l'interface utilisateur avec les valeurs actuelles du dégradé.
 * - Applique les couleurs, l'angle, le fond CSS, et les valeurs des color pickers.
 * - Met aussi à jour la couleur du texte en fonction de la lisibilité sur le fond.
 */
function updateGradientUI() {
    const color1 = gradientData.colors[0]
    const color2 = gradientData.colors[1]
    const angle = gradientData.angle

    colorLabels[0].textContent = color1
    colorLabels[1].textContent = color2

    colorPickerInputs[0].value = color1
    colorPickerInputs[1].value = color2

    colorLabels[0].style.backgroundColor = color1
    colorLabels[1].style.backgroundColor = color2

    gradientApp.style.backgroundImage = `linear-gradient(${angle}deg, ${color1}, ${color2})`
    rangeLabelValue.textContent = `${angle}°`

    adapteInputsColor()
}
updateGradientUI()

/** EXPLICATION :
 * Ajuste dynamiquement la couleur du texte des labels en fonction de leur contraste
 * avec l’arrière-plan coloré (calcul basé sur la formule YIQ).
 * Cela garantit la lisibilité des codes hexadécimaux affichés.
 */
function adapteInputsColor() {
    colorLabels.forEach(label => {
        const hexColor = label.textContent.replace('#', '')
        const red = parseInt(hexColor.slice(0,2), 16)
        const green = parseInt(hexColor.slice(2,4), 16)
        const blue = parseInt(hexColor.slice(4,6), 16)
        const yiq = (red * 299 + green * 587 + blue * 144) / 1000
        if (yiq >= 128) {
            // Si le fond est claire, le texte hexadécimal de la couleur passe en sombre 🌛
            label.style.color = '#111'
        } else {
            // Si le fond est sombre, le texte hexadécimal de la couleur passe en claire ☀️
            label.style.color = '#f1f1f1'
        }
    })
}

const rangeInput = document.querySelector('.gradient-app__range')

rangeInput.addEventListener('input', updateGradientAngle)

/** EXPLICATION :
 * Met à jour l'angle du dégradé en fonction de la valeur actuelle du slider.
 * Déclenche également la mise à jour visuelle via updateGradientUI().
 */
function updateGradientAngle() {
    gradientData.angle = rangeInput.value
    updateGradientUI()
}

colorPickerInputs.forEach(input => input.addEventListener('input', colorInputModification))

/** EXPLICATION
 * Met à jour la couleur correspondante dans les données du dégradé suite à une modification
 * d’un input color picker, puis rafraîchit l'affichage.
 *
 * @param {Event} e - L'événement déclenché par l'utilisateur sur un color input.
 */
function colorInputModification(e) {
    const currentColorPickerIndex = colorPickerInputs.indexOf(e.target)
    gradientData.colors[currentColorPickerIndex] = e.target.value.toUpperCase()
    updateGradientUI()
}

const copyBtn = document.querySelector('.js-copy-button')
copyBtn.addEventListener('click', handleGradientCopy)

let lock = false
/** EXPLICATION :
 * - Copie le code CSS du dégradé actuel dans le presse-papiers.
 * - Ajoute une animation visuelle temporaire pour confirmer la copie.
 * - Empêche le spam en utilisant un verrou temporaire.
 */
function handleGradientCopy() {
    if (lock) return
    lock = true

    const gradient = `linear-gradient(${gradientData.angle}deg, ${gradientData.colors[0]}, ${gradientData.colors[1]})`

    navigator.clipboard.writeText(gradient)

    copyBtn.classList.add('js-active-copy-btn')

    setTimeout(() => {
        copyBtn.classList.remove('js-active-copy-btn')
        lock = false
    }, 1000)
}

const randomGradientBtn = document.querySelector('.js-random-btn')
randomGradientBtn.addEventListener('click', creatRandomGradient)

/** EXPLICATION :
 * Génère aléatoirement deux couleurs hexadécimales et les applique comme couleurs du dégradé.
 * Met ensuite à jour l'interface pour refléter les nouvelles valeurs.
 */
function creatRandomGradient() {
    for (let i = 0; i < colorLabels.length; i++) {
        const randomColor = `#${Math.floor(Math.random() * 16777216).toString(16).padStart(6, "0")}`
    gradientData.colors[i] = randomColor.toUpperCase()
    }
    updateGradientUI()
}