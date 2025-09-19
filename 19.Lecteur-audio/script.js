const musicsData = [
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

/** EXPLICATION :
 * Met à jour l’interface pour refléter la piste en cours.
 * Renseigne le titre, l’artiste, la vignette et la source audio,
 * puis met à jour l’index courant.
 *
 * @param {number} musicId - Identifiant de la piste à charger.
 * @returns {void}
 */
function populateUI(musicId) {
    const {title, artist} = musicsData.find(obj => obj.id === musicId)
    musicTitle.textContent = title
    artistName.textContent = artist
    thumbnail.src = `./assets/ressources/thumbs/${title}.png` // Image de couverture
    musicPlayer.src = `./assets/ressources/music/${title}.mp3` // Fichier musicale
    indexTxt.textContent = `${musicId}/${musicsData.length}` // L'index de la musique en cours
}
populateUI(currentMusicId)

const playTogglerBtn = document.querySelector(".audio-player__play-toggler")

playTogglerBtn.addEventListener("click", handlePlayPause)

/** EXPLICATION :
 * Bascule l’état du lecteur entre lecture et pause
 * en se basant sur l’état courant de l’élément audio.
 * @returns {void}
 */
function handlePlayPause() {
    if (musicPlayer.paused) play()
    else pause()
}

/** EXPLICATION :
 * Lance la lecture audio et met à jour l’UI du bouton (icône + aria-pressed).
 * @returns {Promise<void> | void} - Selon le navigateur, `HTMLMediaElement.play()` peut retourner une Promise.
 */
function play() {
    playTogglerBtn.querySelector("img").src = "./assets/ressources/icons/pause-icon.svg"
    playTogglerBtn.setAttribute("aria-pressed", "true")
    musicPlayer.play()
}

/** EXPLICATION :
 * Met la lecture en pause et met à jour l’UI du bouton (icône + aria-pressed).
 * @returns {void}
 */
function pause() {
    playTogglerBtn.querySelector("img").src = "./assets/ressources/icons/play-icon.svg"
    playTogglerBtn.setAttribute("aria-pressed", "false")
    musicPlayer.pause()
}

const displayCurrentTime = document.querySelector(".js-current-time")
const durationTime = document.querySelector(".js-duration-time")

musicPlayer.addEventListener("loadedmetadata", fillDurationVariables)

let current
let totalDuration

/** EXPLICATION :
 * Initialise les variables de temps (`current`, `totalDuration`) lorsque les métadonnées sont chargées,
 * puis met à jour l’affichage du temps courant et de la durée totale.
 * Dépend de l’événement `loadedmetadata` de l’élément audio.
 * @returns {void}
 */
function fillDurationVariables() {
    current = musicPlayer.currentTime
    totalDuration = musicPlayer.duration

    formatValue(current, displayCurrentTime)
    formatValue(totalDuration, durationTime)
}

/** EXPLICATION :
 * Formate une valeur temporelle en mm:ss et l’injecte dans un élément cible.
 * @param {number} value - Temps en secondes.
 * @param {HTMLElement} element - Élément où afficher le texte formaté.
 * @returns {void}
 */
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

/** EXPLICATION :
 * Met à jour la barre de progression en fonction du temps courant de lecture,
 * et rafraîchit l’affichage du temps courant.
 * @param {Event} e - Événement `timeupdate` provenant de l’élément audio.
 * @returns {void}
 */
function updateProgress(e) {
    const current = e.target.currentTime

    formatValue(current, displayCurrentTime)

    const progressValue = current / totalDuration
    progressBar.style.transform = `scaleX(${progressValue})`
}

const progressBarContainer = document.querySelector(".audio-player__progress-container")

progressBarContainer.addEventListener("click", setProgress)

/** EXPLICATION :
 * Permet de naviguer dans l’audio en cliquant dans la barre de progression.
 * Calcule la position cliquée et ajuste `currentTime` en conséquence.
 * @param {MouseEvent} e - Événement de clic sur le conteneur de la barre de progression.
 * @returns {void}
 */
function setProgress(e) {
    const progressBarDimension = progressBarContainer.getBoundingClientRect()
    const clickPositionInProgressBar = e.clientX - progressBarDimension.left
    const clickProgressRatio = clickPositionInProgressBar / progressBarDimension.width
    musicPlayer.currentTime = clickProgressRatio * totalDuration
}

const navigationBtnsArray = [
    document.querySelector(".js-next-btn"),
    document.querySelector(".js-prev-btn"),
]

navigationBtnsArray.forEach(btn => btn.addEventListener("click", handleNavigation))

/** EXPLICATION :
 * Gère les boutons « Suivant » et « Précédent ».
 * Détermine la direction à partir de la classe du bouton, puis change de piste.
 * @param {MouseEvent} e - Événement de clic sur un bouton de navigation.
 * @returns {void}
 */
function handleNavigation(e) {
    if (e.currentTarget.classList.contains("js-next-btn")) {
        changeSong("next")
    } else {
        changeSong("prev")
    }
}

musicPlayer.addEventListener("ended", handleSongEnd)

/** EXPLICATION :
 * Déclenché à la fin de la piste. Bascule automatiquement sur la piste suivante.
 * @returns {void}
 */
function handleSongEnd() {
    changeSong("next")
}

const btnShuffle = document.querySelector(".audio-player__shuffle")
btnShuffle.addEventListener("click", switchShuffle)

let isShuffleActive = false

/** EXPLICATION :
 * Active/désactive le mode lecture aléatoire, met à jour l’état visuel et aria-pressed.
 * @returns {void}
 */
function switchShuffle() {
    isShuffleActive = !isShuffleActive
    btnShuffle.querySelector("svg").classList.toggle("js-active-shuffle")
    btnShuffle.setAttribute("aria-pressed", isShuffleActive.toString())
}

/** EXPLICATION :
 * Change de piste en fonction d’une direction (« next » | « prev ») ou,
 * si le shuffle est actif, délègue à `playAShuffleSong`.
 * Gère le bouclage en début/fin de liste, met à jour l’UI et lance la lecture.
 * @param {"next"|"prev"} direction - Sens de navigation demandé.
 * @returns {void}
 */
function changeSong(direction) {
    if (isShuffleActive) {
        playAShuffleSong()
        return
    }

    if (direction === "next") {
        currentMusicId++
    } else if (direction === "prev") {
        currentMusicId--    
    }

    if (currentMusicId < 1) currentMusicId = musicsData.length
    else if (currentMusicId > musicsData.length) currentMusicId = 1

    populateUI(currentMusicId)
    play()
}

/** EXPLICATION :
 * Sélectionne aléatoirement une piste différente de l’actuelle (si possible),
 * met à jour l’UI pour cette piste et lance la lecture.
 * @returns {void}
 */
function playAShuffleSong() {
    const musicsWithoutCurrentSong = musicsData.filter(el => el.id !== currentMusicId)
    const randomMusic = musicsWithoutCurrentSong[Math.floor(Math.random() * musicsWithoutCurrentSong.length)]
    currentMusicId = randomMusic.id
    populateUI(currentMusicId)
    play()
}