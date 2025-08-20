const charactersSets = {
    lowercaseChars: "abcdefghijklmnopqrstuvwxyz",
    uppercaseChars: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    numbers: "0123456789",
    symbols: "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~"
}

const generatePwdBtn = document.querySelector(".pwd-generator__generate-pwd-btn")
const generatedPassword = document.querySelector(".pwd-generator__generated-pwd")
const checkboxes = document.querySelectorAll(".pwd-generator__checkbox")
const errorMsg = document.querySelector(".pwd-generator__error-msg")
const copyBtn = document.querySelector(".pwd-generator__copy-btn")
const range = document.querySelector(".pwd-generator__range-input")
const rangeValue = document.querySelector(".pwd-generator__range-value")

const MIN_LENGTH = parseInt(range.dataset.min || range.min || "4", 10)
const MAX_LENGTH = parseInt(range.dataset.max || range.max || "20", 10)
const DEFAULT_LENGTH = parseInt(range.dataset.default || range.value || "10", 10)

range.min = String(MIN_LENGTH)
range.max = String(MAX_LENGTH)
range.value = String(DEFAULT_LENGTH)

let passwordLength = Number(range.value)
rangeValue.textContent = String(passwordLength)

generatePwdBtn.addEventListener("click", createPassword)

range.addEventListener("input", () => {
    passwordLength = Number(range.value)
    rangeValue.textContent = String(passwordLength)
})

copyBtn.addEventListener("click", copyToClipboard)

/** EXPLICATION :
 * Génère un mot de passe selon les ensembles de caractères cochés et la longueur sélectionnée.
 * - Garantit au moins 1 caractère provenant de chaque ensemble choisi.
 * - Remplit le reste de manière aléatoire à partir de l'ensemble concaténé.
 * - Insère les caractères « requis » à des positions aléatoires pour éviter des motifs prévisibles.
 * Effets de bord : met à jour le DOM (texte du mot de passe) et l'état du bouton Copier.
 * Affiche des messages d'erreur si aucune case n'est cochée ou si la longueur est insuffisante.
 *
 * @returns {void}
 */
function createPassword() {
    const checkedDataSets = getCheckedDataSets()
    errorMsg.textContent = ""

    if (!checkedDataSets.length) {
        errorMsg.textContent = "Au moins une case doit être cochée ⚠️"
        return
    }

    if (passwordLength < checkedDataSets.length) {
        errorMsg.textContent = `Longueur insuffisante : choisis au moins ${checkedDataSets.length} caractères (autant que d’options cochées).`
        return
    }

    const requiredCharacters = []
    for (let i = 0; i < checkedDataSets.length; i++) {
        requiredCharacters.push(checkedDataSets[i][getRandomIndex(0, checkedDataSets[i].length - 1)])
    }

    const concatenatedDataSets = checkedDataSets.join("")
    let password = ""

    for (let i = requiredCharacters.length; i < passwordLength; i++){
        password += concatenatedDataSets[getRandomIndex(0, concatenatedDataSets.length - 1)]
    }

    requiredCharacters.forEach((item, index) => {
        const randomIndex = getRandomIndex(0, password.length)
        password = password.slice(0, randomIndex) + requiredCharacters[index] + password.slice(randomIndex)
    })

    generatedPassword.textContent = password
    copyBtn.disabled = password.length === 0
}
createPassword()

/** EXPLICATION :
 * Copie le mot de passe actuellement affiché dans le presse-papiers.
 * Utilise l'API asynchrone Clipboard quand elle est disponible et que le contexte est sécurisé,
 * sinon bascule vers un mécanisme de repli (textarea + execCommand).
 * Effets de bord : affiche un message de statut (succès/échec) et l'efface après un court délai.
 *
 * @returns {void}
 */
function copyToClipboard() {
    const pwd = generatedPassword.textContent.trim()
    errorMsg.textContent = ""

    if (!pwd) {
        errorMsg.textContent = "Aucun mot de passe à copier."
        return
    }

    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(pwd)
            .then(() => showStatus("Mot de passe copié ✅"))
            .catch(() => fallbackCopy(pwd))
    } else {
        fallbackCopy(pwd)
    }
}

/** EXPLICATION :
 * Méthode de repli pour copier du texte dans le presse-papiers via un <textarea> temporaire.
 * Moins fiable et potentiellement bloquée par certains navigateurs, mais utile hors contexte sécurisé.
 *
 * @param {string} text - Le texte à copier dans le presse-papiers.
 * @returns {void}
 */
function fallbackCopy(text) {
    const ta = document.createElement("textarea")
    ta.value = text
    ta.setAttribute("readonly", "")
    ta.style.position = "fixed"
    ta.style.top = "-1000px"
    document.body.appendChild(ta)
    ta.select()
    try {
        const ok = document.execCommand("copy")
        showStatus(ok ? "Mot de passe copié ✅" : "Impossible de copier ❌")
    } catch (_) {
        showStatus("Impossible de copier ❌")
    } finally {
        document.body.removeChild(ta)
    }
}

/** EXPLICATION :
 * Affiche un message de statut (erreur, succès, info) dans la zone dédiée puis l'efface après 2 secondes.
 * Effets de bord : met à jour le contenu de l'élément .pwd-generator__error-msg.
 *
 * @param {string} message - Message à afficher.
 * @returns {void}
 */
function showStatus(message) {
    errorMsg.textContent = message
    setTimeout(() => {
        if (errorMsg.textContent === message) errorMsg.textContent = ""
    }, 2000)
}

/** EXPLICATION :
 * Récupère les ensembles de caractères correspondant aux cases cochées.
 * Chaque case doit avoir un id qui mappe une clé de `charactersSets`.
 *
 * @returns {string[]} Tableau d'ensembles de caractères sélectionnés (chacun est une chaîne).
 */
function getCheckedDataSets() {
    const checkedSets = []
    checkboxes.forEach(checkbox => checkbox.checked && checkedSets.push(charactersSets[checkbox.id]))
    return checkedSets
}

/** EXPLICATION :
 * Génère un entier aléatoire sécurisé compris entre min et max.
 * Utilise `crypto.getRandomValues` pour produire un flottant uniforme dans [0,1) puis mise à l'échelle.
 *
 * @param {number} min - Borne inférieure (incluse).
 * @param {number} max - Borne supérieure (incluse).
 * @returns {number} Un entier aléatoire entre min et max.
 */
function getRandomIndex(min, max) {
    const randomNumber = crypto.getRandomValues(new Uint32Array(1))[0]
    const randomFloatingNumber = randomNumber / 4294967296
    return Math.floor(randomFloatingNumber * (max - min + 1)) + min
}