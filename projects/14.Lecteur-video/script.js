//#region - LECTURE (Play/Pause)
const videoPlayer = document.querySelector(".video__player")
const playbackToggler = document.querySelector(".js-playback-toggler")

videoPlayer.addEventListener("click", togglePlay)
playbackToggler.addEventListener("click", togglePlay)

/** EXPLICATION :
 * Bascule l'état de lecture de la vidéo (lecture/pause) et met à jour l'UI du bouton.
 *
 * Utilise l'état courant de `videoPlayer.paused` pour décider d'appeler `play()` ou `pause()`.
 * Met à jour :
 *  - l'attribut aria-pressed
 *  - l'aria-label
 *  - l'icône (play/pause)
 *
 * @returns {void}
 */
function togglePlay() {
    videoPlayer.paused ? videoPlayer.play() : videoPlayer.pause()
    playbackToggler.setAttribute("aria-pressed", !videoPlayer.paused)
    playbackToggler.setAttribute("aria-label", videoPlayer.paused ? "Lecture de la vidéo" : "Pause de la vidéo")
    playbackToggler.querySelector("img").src = videoPlayer.paused ? "./assets/svg/play.svg" : "./assets/svg/pause.svg"
}
//#endregion

//#region - DURÉE & FORMATAGE (affichage MM:SS)
const totalTimeDisplay = document.querySelector(".js-total-video-time")
const currentTimeDisplay = document.querySelector(".js-current-video-time")

window.addEventListener("load", fillDurationVariables)
let current
let totalDuration

/** EXPLICATION :
 * Initialise les variables de durée (courant et totale) et affiche les valeurs formatées.
 *
 * S'appuie sur `videoPlayer.currentTime` et `videoPlayer.duration`.
 * Doit être appelé quand les métadonnées sont disponibles pour garantir une durée valide.
 *
 * @returns {void}
 */
function fillDurationVariables() {
    current = videoPlayer.currentTime
    totalDuration = videoPlayer.duration
    displayFormattedValue(totalDuration, totalTimeDisplay)
    displayFormattedValue(current, currentTimeDisplay)
}

/** EXPLICATION :
 * Formate un temps en secondes en MM:SS et l'injecte dans un élément du DOM.
 *
 * @param {number} value - Temps en secondes (peut être décimal). 
 * @param {HTMLElement} element - Élément cible où afficher la valeur formatée.
 * @returns {void}
 */
function displayFormattedValue(value, element) {
    const currentMinutes = Math.floor(value / 60)
    let currentSeconds = Math.floor(value % 60)
    if (currentSeconds < 10) {
        currentSeconds = `0${currentSeconds}`
    }
    element.textContent = `${currentMinutes}:${currentSeconds}`
}
//#endregion

//#region - MISE À JOUR DU TEMPS & DU RENDU DE LA BARRE DE PROGRESSION
const progressBar = document.querySelector(".video__progress-bar")

videoPlayer.addEventListener("timeupdate", handleTimeUpdate)

/** EXPLICATION :
 * Gère la mise à jour du temps courant :
 *  - met à jour l'affichage du temps
 *  - met à l'échelle la barre de progression
 *  - restaure l'UI du bouton lecture lorsque la vidéo est terminée
 *
 * Écoute l'événement `timeupdate` du `videoPlayer`.
 * @returns {void}
 */
function handleTimeUpdate() {
    const current = videoPlayer.currentTime
    // console.log(current);
    displayFormattedValue(current, currentTimeDisplay)
    const progressPosition = current / totalDuration
    progressBar.style.transform = `scaleX(${progressPosition})`
    if (videoPlayer.ended) {
        playbackToggler.setAttribute("aria-pressed", false)
        playbackToggler.setAttribute("aria-label", "Lecture de la vidéo")
        playbackToggler.querySelector("img").src = "./assets/svg/play.svg"
    }
}
//#endregion

//#region - NAVIGATION VIA LA BARRE DE PROGRESSION
const progressBarContainer = document.querySelector(".video__progress")

progressBarContainer.addEventListener("click", handleProgressNavigation)

/** EXPLICATION :
 * Permet de naviguer dans la vidéo en cliquant sur la barre de progression.
 * Calcule le ratio de la position cliquée et positionne `currentTime` en conséquence.
 *
 * @param {MouseEvent} event - Événement click sur le conteneur de progression.
 * @returns {void}
 */
function handleProgressNavigation(event) {
    const rect = progressBarContainer.getBoundingClientRect()
    // console.log(rect);
    const clickPositionInProgressBar = event.clientX - rect.left
    // console.log(clickPositionInProgressBar);
    const clickProgressRatio = clickPositionInProgressBar / rect.width
    // console.log(clickProgressRatio);
    videoPlayer.currentTime = videoPlayer.duration * clickProgressRatio
}
//#endregion

//#region - VOLUME & SOUDINE
const muteBtn = document.querySelector(".js-mute-btn")
const volumeSlider = document.querySelector(".video__volume-range")

muteBtn.addEventListener("click", handleMute)

/** EXPLICATION :
 * Bascule l'état muet de la vidéo.
 * Si le volume est à 0, remet le volume à 100% avant de toggler `muted` pour offrir un retour audio.
 * Met ensuite à jour l'UI associée (icône, aria-pressed, aria-label).
 *
 * @returns {void}
 */
function handleMute() {
    if (videoPlayer.volume === 0) {
        videoPlayer.volume = 1
        volumeSlider.value = 100
    }
    videoPlayer.muted = !videoPlayer.muted
    updateMuteUI()
}

/** EXPLICATION :
 * Met à jour les éléments d'interface liés au mute (icône, aria-pressed, aria-label)
 * en fonction de l'état courant de `videoPlayer.muted`.
 *
 * @returns {void}
 */
function updateMuteUI() {
    muteBtn.querySelector("img").src = videoPlayer.muted ? "./assets/svg/mute.svg" : "./assets/svg/unmute.svg"
    muteBtn.setAttribute("aria-pressed", videoPlayer.muted)
    muteBtn.setAttribute("aria-label", videoPlayer.muted ? "Désactiver la sourdine" : "Activer la sourdine")
}

volumeSlider.addEventListener("input", handleVolumeModification)

/** EXPLICATION :
 * Ajuste le volume selon la valeur du slider (0–100) et synchronise l'état `muted`.
 *
 * @returns {void}
 */
function handleVolumeModification() {
    videoPlayer.volume = volumeSlider.value / 100
    videoPlayer.muted = videoPlayer.volume === 0
    updateMuteUI()
}
//#endregion

//#region - PLEIN ÉCRAN
const fullScreenToggler = document.querySelector(".js-fullscreen-toggler")
const videoContainer = document.querySelector(".video")

videoPlayer.addEventListener("dblclick", toggleFullScreen)
fullScreenToggler.addEventListener("click", toggleFullScreen)

/** EXPLICATION :
 * Bascule l'affichage plein écran du conteneur vidéo.
 * Utilise l'API Fullscreen : `document.fullscreenElement`, `document.exitFullscreen()`, `Element.requestFullscreen()`.
 *
 * @returns {void}
 */
function toggleFullScreen() {
    if (document.fullscreenElement) {
        document.exitFullscreen()
    } else {
        videoContainer.requestFullscreen()
    }
}
//#endregion