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
}

function updatePlayPauseUI(isPlaying) {
    togglePlayBtn.querySelector('img').src = isPlaying ? './assets/svg/pause.svg' : './assets/svg/play.svg'
    togglePlayBtn.setAttribute('data-toggle', isPlaying ? 'pause' : 'play')
    togglePlayBtn.setAttribute('aria-label', isPlaying ? 'Pause du Pomodoro' : 'Démarrer le Pomodoro')
    togglePlayBtn.setAttribute('aria-pressed', isPlaying ? 'true' : 'false')
}