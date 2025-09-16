import phrases from "./data/phrases.js"

const sentenceToWrite = document.querySelector(".typing-game__sentence-to-write")
const textarea = document.querySelector(".typing-game__textarea")

let sentenceSpans
let lastPhraseIndex = null

/** EXPLICATION :
 * Affiche une nouvelle phrase à écrire dans le jeu, choisie aléatoirement parmi les phrases disponibles.
 * Réinitialise la zone de texte et prépare les "span" pour chaque caractère de la phrase.
 * Met le focus sur la zone de texte.
 */
function displayNewSentenceToWrite() {
    textarea.value = ""
    sentenceToWrite.textContent = ""

    let randomIndex
    do {
        randomIndex = Math.floor(Math.random() * phrases.length)
    }
    while (randomIndex === lastPhraseIndex && phrases.length > 1)
    lastPhraseIndex = randomIndex

    const phrase = phrases[randomIndex].text

    phrase.split("").forEach(character => {
        const spanCharacter = document.createElement("span")
        spanCharacter.textContent = character
        sentenceToWrite.appendChild(spanCharacter)
    })

    sentenceSpans = sentenceToWrite.querySelectorAll("span")
    textarea.focus()
}
displayNewSentenceToWrite()

const timeDisplayed = document.querySelector(".js-time-left")
const scoreDisplayed = document.querySelector(".js-score")
const endGameInfo = document.querySelector(".typing-game__end-game-info")

textarea.addEventListener("input", handleTyping)
let passedSentencesCharacters = 0
let time = 60
let score = 0
let timerId = null

/** EXPLICATION :
 * Gère la saisie de l'utilisateur dans la zone de texte.
 * Démarre le minuteur si ce n'est pas déjà fait.
 * Vérifie si la phrase a été correctement complétée et affiche une nouvelle phrase si nécessaire.
 */
function handleTyping() {
    if (!timerId) startTimer()
    const completedSentence = compareSentences()
    if (completedSentence) {
        passedSentencesCharacters += sentenceSpans.length
        displayNewSentenceToWrite()
    }
}

/** EXPLICATION :
 * Démarre le minuteur du jeu et applique les styles actifs.
 * Lance la fonction handleTime toutes les 100 ms.
 */
function startTimer() {
    timeDisplayed.classList.add("js-active-time")
    textarea.classList.add("js-active-textarea")
    timerId = setInterval(handleTime, 100)
}

/** EXPLICATION :
 * Met à jour le temps restant, l'affiche, et gère la fin de la partie si le temps est écoulé.
 * Désactive la zone de texte et affiche le score final à la fin du temps.
 */
function handleTime() {
    time = Number((time - 0.1).toFixed(1))

    timeDisplayed.textContent = `Temps : ${time.toFixed(1)}`

    if (time <= 0) {
        clearInterval(timerId)
        endGameInfo.textContent = `Bravo 🏆, votre score est : ${score}`
        timeDisplayed.classList.remove("js-active-time")
        textarea.classList.remove("js-active-textarea")
        textarea.disabled = true
    }
}

/** EXPLICATION :
 * Compare le texte saisi par l'utilisateur avec la phrase à écrire.
 * Met à jour les classes CSS des caractères pour indiquer correct/incorrect.
 * Met à jour le score.
 * @returns {boolean} true si la phrase est entièrement correcte, sinon false.
 */
function compareSentences() {
    const textareaCharactersArray = textarea.value.split("")
    let areSentecesSimilar = true
    let currentGoodLetters = 0

    for (let  i = 0; i < sentenceSpans.length; i++) {
        if (textareaCharactersArray[i] === undefined) {
            for (let j = i; j < sentenceSpans.length; j++) {
                sentenceSpans[j].className = ""
            }
            areSentecesSimilar = false
            break
        }
        else if (textareaCharactersArray[i] === sentenceSpans[i].textContent) {
            sentenceSpans[i].classList.add("js-correct")
            sentenceSpans[i].classList.remove("js-wrong")
            currentGoodLetters++
        } else {
            sentenceSpans[i].classList.add("js-wrong")
            sentenceSpans[i].classList.remove("js-correct")
            areSentecesSimilar = false
        }
    }

    score = passedSentencesCharacters + currentGoodLetters
    scoreDisplayed.textContent = `Score : ${score}`

    return areSentecesSimilar
}

window.addEventListener("keydown", handleGameReset)

/** EXPLICATION :
 * Réinitialise le jeu lorsque la combinaison de touches "ctrl + alt + Enter" (ou sur mac "control + option + Enter") est pressée.
 * Réinitialise le temps, le score, l'affichage et permet de recommencer une nouvelle partie.
 * @param {KeyboardEvent} e - L'événement clavier déclenché.
 */
function handleGameReset(e) {
    // Équivalant sur mac : "control" + "option" + "enter"
    if (e.ctrlKey && e.altKey && e.key === "Enter") {
        e.preventDefault()

        clearInterval(timerId)

        time = 60
        scoreDisplayed.textContent = `Score : 0`
        timerId = null

        timeDisplayed.textContent = `Temps : ${time}`
        passedSentencesCharacters = 0

        timeDisplayed.classList.remove("js-active-time")
        textarea.classList.remove("js-active-textarea")

        endGameInfo.textContent = ""
        textarea.value = ""
        textarea.disabled = false
        textarea.focus()
        displayNewSentenceToWrite()
    }
}