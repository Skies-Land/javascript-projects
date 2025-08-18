const togglePlayBtn = document.querySelector('.js-pomodoro-toggle-btn')
togglePlayBtn.addEventListener('click', togglePomodoro)

let isRunning = false

function togglePomodoro() {
    if (!isRunning) {
        startPomodoro()
    }
    else {
        // pausePomodoro()
    }
}

let isWorking = true 
let workTimeMs = 30 * 60 * 1000
let restTimeMs = 5 * 60 * 1000
let timerID = null
let lastDisplayedSec = null
let endTimeMS = null

function startPomodoro() {
    isRunning = true
    updatePlayPauseUI(true)

    const timeLeftMs = isWorking ? workTimeMs : restTimeMs

    endTimeMS = Date.now() + timeLeftMs

    timerID = setInterval(handleTicks, 10)
}

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
const displayPause = document.querySelector('.pomodoro__restime')

function updatePomodoro(secondsLeft) {
    const display = isWorking ? displayWork : displayPause
    display.textContent = formatTime(secondsLeft)
}

function formatTime(seconds) {
    /** EXPLICATION : `Math.floor`
     * Retourne une chaîne au format "minutes:secondes".
     * Math.floor(seconds / 60) → calcule le nombre de minutes entières.
     * - seconds % 60 → calcule le reste en secondes.
     * - Le ternaire ajoute un "0" devant si les secondes sont < 10, afin d’avoir un affichage cohérent (ex: "5:07").
     */
    return `${Math.floor(seconds / 60)}:${seconds % 60 < 10 ? `0${seconds % 60}` : seconds % 60}`
}