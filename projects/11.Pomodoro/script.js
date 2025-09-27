const togglePlayBtn = document.querySelector('.js-pomodoro-toggle-btn')
togglePlayBtn.addEventListener('click', togglePomodoro)

let isRunning = false

/** EXPLICATION :
 * Bascule l'état du Pomodoro entre démarrer et pause.
 * Appelle startPomodoro() ou pausePomodoro() selon l'état courant.
 */
function togglePomodoro() {
    if (!isRunning) {
        startPomodoro()
    }
    else {
        pausePomodoro()
    }
}

let isWorking = true 
let workTimeMs = 30 * 60 * 1000
let restTimeMs = 5 * 60 * 1000
let timerID = null
let lastDisplayedSec = null
let endTimeMS = null

/** EXPLICATION :
 * Démarre le timer Pomodoro pour la période courante (travail ou repos).
 * Met à jour l'UI et lance l'intervalle du timer.
 */
function startPomodoro() {
    isRunning = true
    updatePlayPauseUI(true)
    const timeLeftMs = isWorking ? workTimeMs : restTimeMs
    endTimeMS = Date.now() + timeLeftMs
    timerID = setInterval(handleTicks, 10)
}

/** EXPLICATION :
 * Met à jour l'interface du bouton play/pause et gère l'animation du soulignement.
 * @param {boolean} isPlaying - Indique si le Pomodoro est en cours de lecture.
 */
function updatePlayPauseUI(isPlaying) {
    togglePlayBtn.querySelector('img').src = isPlaying ? './assets/svg/pause.svg' : './assets/svg/play.svg'
    togglePlayBtn.setAttribute('data-toggle', isPlaying ? 'pause' : 'play')
    togglePlayBtn.setAttribute('aria-label', isPlaying ? 'Pause du Pomodoro' : 'Démarrer le Pomodoro')
    togglePlayBtn.setAttribute('aria-pressed', isPlaying ? 'true' : 'false')

    handleUnderlineAnimation(isPlaying ? 
        {work: isWorking, rest: !isWorking} :
        {work: false, rest: false}
    )
}

/** EXPLICATION :
 * Gère l'animation de soulignement des périodes de travail et de repos dans l'UI.
 * @param {Object} itemState - Objet contenant l'état (actif/inactif) de chaque période.
 */
function handleUnderlineAnimation(itemState) {
    for (const item in itemState) {
        const element = document.querySelector(`.js-pomodoro-${item}-text`)
        if (itemState[item]) {
            element.classList.add('js-active-pomodoro')
        } else {
            element.classList.remove('js-active-pomodoro')
        }
    }
}

/** EXPLICATION :
 * Fonction appelée périodiquement pour mettre à jour le timer.
 * Gère le passage à la période suivante et l'affichage du temps restant.
 */
function handleTicks() {
    const remainingMs = Math.max(0, endTimeMS - Date.now())
    if (remainingMs === 0) {
        switchPeriod()
        return
    }
    const currentRemainingSeconds = Math.floor(remainingMs / 1000)
    if (currentRemainingSeconds !== lastDisplayedSec) {
        lastDisplayedSec = currentRemainingSeconds
        updatePomodoro(currentRemainingSeconds)
    }
}

const displayWork = document.querySelector('.pomodoro__worktime')
const displayPause = document.querySelector('.pomodoro__resttime')

/** EXPLICATION :
 * Met à jour l'affichage du temps restant pour la période courante.
 * @param {number} secondsLeft - Nombre de secondes restantes à afficher.
 */
function updatePomodoro(secondsLeft) {
    const display = isWorking ? displayWork : displayPause
    display.textContent = formatTime(secondsLeft)
}

/** EXPLICATION : 
 * Formate un nombre de secondes en chaîne "minutes:secondes".
 * @param {number} seconds - Le nombre total de secondes à formater.
 * @returns {string} Le temps formaté sous forme "mm:ss".
 */
function formatTime(seconds) {
    /** EXPLICATION : `Math.floor`
     * Retourne une chaîne au format "minutes:secondes".
     * Math.floor(seconds / 60) → calcule le nombre de minutes entières.
     * - seconds % 60 → calcule le reste en secondes.
     * - Le ternaire ajoute un "0" devant si les secondes sont < 10, afin d’avoir un affichage cohérent (ex: "5:07").
     */
    return `${Math.floor(seconds / 60)}:${seconds % 60 < 10 ? `0${seconds % 60}` : seconds % 60}`
}

const cycles = document.querySelector('.pomodoro__cycles')
let cyclesNumber = 0

/** EXPLICATION :
 * Passe à la période suivante (travail <-> repos), réinitialise les timers et met à jour l'UI.
 */
function switchPeriod() {
    lastDisplayedSec = null
    if (isWorking) {
        isWorking = false
        endTimeMS = Date.now() + restTimeMs
    } else {
        isWorking = true
        workTimeMs = 30 * 60 * 1000
        restTimeMs = 5 * 60 * 1000
        displayWork.textContent = formatTime(workTimeMs / 1000)
        displayPause.textContent = formatTime(restTimeMs / 1000)
        endTimeMS = Date.now() + workTimeMs
        cyclesNumber++
        cycles.textContent = `Cycle(s) : ${cyclesNumber}`
    }
    handleUnderlineAnimation({work: isWorking, rest: !isWorking})
}

/** EXPLICATION :
 * Met le Pomodoro en pause, sauvegarde le temps restant et met à jour l'UI.
 */
function pausePomodoro() {
    isRunning = false
    clearInterval(timerID)
    timerID = null
    const remainingMs = Math.max(0, endTimeMS - Date.now())
    // si une période de travail est lancé, 
    if (isWorking) {
        workTimeMs = remainingMs
    } else {
        restTimeMs = remainingMs
    }
    updatePlayPauseUI(false)
}

const resetBtn = document.querySelector('.js-reset-btn')
resetBtn.addEventListener('click', resetPomodoro)

/** EXPLICATION :
 * Réinitialise complètement le Pomodoro à son état initial (timers, cycles, UI).
 */
function resetPomodoro() {
    clearInterval(timerID)
    timerID = null
    isRunning = false
    isWorking = true
    lastDisplayedSec = null
    workTimeMs = 30 * 60 * 1000
    restTimeMs = 5 * 60 * 1000
    displayWork.textContent = formatTime(workTimeMs / 1000)
    displayPause.textContent = formatTime(restTimeMs / 1000)
    cyclesNumber = 0
    cycles.textContent = 'Cycle(s) : 0'
    updatePlayPauseUI(false)
    handleUnderlineAnimation({work: false, rest: false})
}