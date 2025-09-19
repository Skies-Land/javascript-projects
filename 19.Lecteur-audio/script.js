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