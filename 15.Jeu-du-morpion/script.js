/** EXPLICATION :
 * Combinaisons gagnantes possibles pour une grille 3x3.
 * Chaque sous-tableau contient les index des cases formant une ligne gagnante.
 * @type {number[][]}
 */
const winingCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
]

let currentPlayer = "❌"

const info = document.querySelector(".tictactoe__info")
info.textContent = `C'est au tour du joueur ${currentPlayer}`

const cellsContainer = document.querySelector(".tictactoe__cells-container")
cellsContainer.addEventListener("click", handleTry)

const cellsArray = Array.from(cellsContainer.children)
let gameIsLocked = false

/** EXPLICATION :
 * Gère le clic de l'utilisateur sur une case de la grille.
 *
 * - Ignore le clic si l'utilisateur clique sur le conteneur lui-même.
 * - Ignore si la case est déjà remplie ou si la partie est verrouillée.
 * - Sinon, place le symbole du joueur courant et vérifie la fin de partie.
 *
 * @param {MouseEvent} e - Événement de clic déclenché sur une case.
 * @returns {void}
 */
function handleTry(e) {
    if (e.target === cellsContainer) return
    const boxIndex = e.target.getAttribute("data-index")
    if (cellsArray[boxIndex].textContent !== "" || gameIsLocked) {
        return
    }
    cellsArray[boxIndex].textContent = currentPlayer
    checkForGameEnd()
}

/** EXPLICATION :
 * Vérifie l'état de la partie après chaque coup.
 *
 * - Parcourt toutes les combinaisons gagnantes et détecte une victoire.
 * - Détecte un match nul si toutes les cases sont remplies sans vainqueur.
 * - Met à jour le message d'info, verrouille la partie si nécessaire,
 *   et alterne le joueur courant si la partie continue.
 *
 * @returns {void}
 */
function checkForGameEnd() {
    for (let i = 0; i < winingCombinations.length; i++) {
        const combinationToCheck = winingCombinations[i]
        const[a,b,c] = combinationToCheck.map(cellIndex => cellsArray[cellIndex].textContent)
        // console.log(a,b,c);
        if (a === "" || b === "" || c === "") continue
        else if (a === b && b ===c) {
            info.textContent = `Le joueur ${currentPlayer} a gagné 🏆 ! Appuyer sur la barre d'espace pour recommencer.`
            gameIsLocked = true
            return
        }
    }
    if (cellsArray.every(cell => cell.textContent !== "")) {
        info.textContent = "Match null 🤝 ! Appuyer sur la barre d'espace pour recommencer."
        gameIsLocked = true
        return
    }
    currentPlayer = currentPlayer === "❌" ? "⭕" : "❌"
    info.textContent = `C'est au tour du joueur ${currentPlayer}`
}

window.addEventListener("keydown", handleGameReset)

/** EXPLICATIONS :
 * Réinitialise la partie via le clavier.
 *
 * - Sur pression de la barre d'espace, efface toutes les cases,
 *   remet l'information de tour et déverrouille la partie.
 *
 * @param {KeyboardEvent} e - Événement clavier écouté sur `window`.
 * @returns {void}
 */
function handleGameReset(e) {
    if (e.key === " ") {
        cellsArray.forEach(cell => cell.textContent = "")
        info.textContent = `C'est au tour du joueur ${currentPlayer}`
        gameIsLocked = false
    }
}