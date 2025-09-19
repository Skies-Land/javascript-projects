const musicData = [
    { title: "Solar", artist: "Betical", id: 1 },
    { title: "Electric-Feel", artist: "TEEMID", id: 2 },
    { title: "Aurora", artist: "SLUMB", id: 3 },
    { title: "Lost-Colours", artist: "Fakear", id: 4 }
]

const musicPlayer = document.querySelector(".audio-player__player")
const musicTitle = document.querySelector(".audio-player__music-title")
const artistName = document.querySelector(".audio-player__artist-name")
const thumbnail = document.querySelector(".audio-player__thumbnail")
const indexTxt = document.querySelector(".audio-player__current-index")

let currentMusicId = 1

function populateUI(musicId) {
    const {title, artist} = musicData.find(obj => obj.id === musicId)
    musicTitle.textContent = title
    artistName.textContent = artist
    thumbnail.src = `./assets/ressources/thumbs/${title}.png` // Image de couverture
    musicPlayer.src = `./assets/ressources/music/${title}.mp3` // Fichier musicale
    indexTxt.textContent = `${musicId}/${musicData.length}` // L'index de la musique en cours
}
populateUI(currentMusicId)

const playTogglerBtn = document.querySelector(".audio-player__play-toggler")

playTogglerBtn.addEventListener("click", handlePlayPause)

function handlePlayPause() {
    if (musicPlayer.paused) play()
    else pause()
}

function play() {
    playTogglerBtn.querySelector("img").src = "./assets/ressources/icons/pause-icon.svg"
    playTogglerBtn.setAttribute("aria-pressed", "true")
    musicPlayer.play()
}

function pause() {
    playTogglerBtn.querySelector("img").src = "./assets/ressources/icons/play-icon.svg"
    playTogglerBtn.setAttribute("aria-pressed", "false")
    musicPlayer.pause()
}

const displayCurrentTime = document.querySelector(".js-current-time")
const durationTime = document.querySelector(".js-duration-time")

window.addEventListener("load", fillDurationVariables)

let current
let totalDuration

function fillDurationVariables() {
    current = musicPlayer.currentTime
    totalDuration = musicPlayer.duration

    formatValue(current, displayCurrentTime)
    formatValue(totalDuration, durationTime)
}

function formatValue(value, element) {
    const currentMinutes = Math.floor(value / 60)
    let currentSeconds = Math.floor(value % 60)

    if (currentSeconds < 10) {
        currentSeconds = `0${currentSeconds}`
    }
    element.textContent = `${currentMinutes}:${currentSeconds}`
}

const progressBar = document.querySelector(".audio-player__progress-bar")

musicPlayer.addEventListener("timeupdate", updateProgress)

function updateProgress(e) {
    const current = e.target.currentTime

    formatValue(current, displayCurrentTime)

    const progressValue = current / totalDuration
    progressBar.style.transform = `scaleX(${progressValue})`
}

const progressBarContainer = document.querySelector(".audio-player__progress-container")

progressBarContainer.addEventListener("click", setProgress)

function setProgress(e) {
    const progressBarDimension = progressBarContainer.getBoundingClientRect()
    const clickPositionInProgressBar = e.clientX - progressBarDimension.left
    const clickProgressRatio = clickPositionInProgressBar / progressBarDimension.width
    musicPlayer.currentTime = clickProgressRatio * totalDuration
}