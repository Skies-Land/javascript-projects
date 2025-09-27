const tableResults = document.querySelector(".table__results")
const userListServerInfo = document.querySelector(".user-list__server-info")
const loader = document.querySelector(".user-list__loader")
let dataArray

/** EXPLICATION :
 * Récupère des utilisateurs depuis l'API RandomUser, gère l'état d'interface
 * (loader/messages), trie les résultats par nom de famille (ordre A→Z)
 * puis déclenche le rendu initial.
 *
 * Effets de bord :
 *  - Active/désactive un indicateur de chargement.
 *  - Écrit des messages d'état dans `.user-list__server-info`.
 *  - Met à jour la variable globale `dataArray`.
 *
 * @returns {Promise<void>} Une promesse résolue lorsque la liste initiale est rendue.
 * @throws {Error} En cas d'échec réseau ou réponse non OK ; l'erreur est capturée et un message utilisateur est affiché.
 */
async function getUsers() {
    loader.classList.add("js-active-loader")
    userListServerInfo.textContent = ""
    try {
        const response = await fetch("https://randomuser.me/api/?nat=fr&results=50")
        if (!response.ok) throw new Error()
        const { results } = await response.json()
        // console.log(results)
        dataArray = results.sort((a,b) => a.name.last.localeCompare(b.name.last))
    }
    catch (error) {
        userListServerInfo.textContent = "Erreur lors de l'appel des données"
        return
    }
    finally {
        loader.classList.remove("js-active-loader")
    }
    createUserList(dataArray)
}
getUsers()

/** EXPLICATION :
 * Rend une liste d'utilisateurs dans le tableau cible.
 * Utilise un `DocumentFragment` pour limiter les reflows/repaints.
 *
 * @param {RandomUser[]} Array Tableau d'utilisateurs à afficher (déjà trié/filtré en amont).
 * @returns {void}
 */
function createUserList(Array) {
    const fragment = document.createDocumentFragment()
    Array.forEach(user => {
        const tr = document.createElement("tr")
        tr.className = "table__content-row"
        tr.innerHTML = `
            <td class="table__data table__data-info">
                <div class="table__data-content-wrapper">
                    <img src="" alt="" class="table__data-img">
                    <span class="js-td-name"></span>
                </div>
            </td>
            <td class="table__data table__data-email">
                <span class="js-td-email"></span>
            </td>
            <td class="table__data table__data-phone">
                <span class="js-td-phone-number"></span>
            </td>
        `
        tr.querySelector(".table__data-img").src = user.picture.thumbnail
        tr.querySelector(".js-td-name").textContent = `${user.name.last} ${user.name.first}`
        tr.querySelector(".js-td-email").textContent = user.email
        tr.querySelector(".js-td-phone-number").textContent = user.phone
        fragment.appendChild(tr)
    })
    tableResults.appendChild(fragment)
}

const searchInput = document.querySelector(".user-list__input")
searchInput.addEventListener("input", filterData)


/** EXPLICATION :
 * Gère le filtrage en temps réel à chaque saisie dans le champ de recherche.
 * Nettoie la chaîne (trim + lowercase), filtre `dataArray` via `searchForOccurences`
 * puis rerend la liste ou affiche un message si aucun résultat.
 *
 * @param {InputEvent} e Événement d'entrée provenant du champ de recherche.
 * @returns {void}
 */
function filterData(e) {
    tableResults.textContent = ""
    userListServerInfo.textContent = ""
    // trim() = nettoyage des espaces potentiel sur les côtés dans l'input
    // toLowerCase() = affichage en minuscule dans l'input
    const searchedString = e.target.value.trim().toLowerCase()
    const FilteredUsersArray = dataArray.filter(userData => searchForOccurences(userData, searchedString))
    if (!FilteredUsersArray.length) {
        userListServerInfo.textContent = "Aucun résultat trouvés."
        return
    } else {
        createUserList(FilteredUsersArray)
    }
}

/** EXPLICATION :
 * Détermine si un utilisateur correspond à la chaîne recherchée.
 *
 * Règles :
 *  - 1 terme : correspond si le prénom OU le nom commence par ce terme.
 *  - 2 termes : correspond si (prenom commence par terme1 ET nom par terme2)
 *               OU (nom par terme1 ET prenom par terme2).
 *
 * @param {RandomUser} userData Données d'un utilisateur.
 * @param {string} searchedString Chaîne normalisée (trim + lowercase).
 * @returns {boolean} `true` si l'utilisateur matche la recherche, sinon `false`.
 */
function searchForOccurences(userData, searchedString) {
    const searchedWords = searchedString.split(/\s+/)
    const firstName = userData.name.first.toLowerCase()
    const lastName = userData.name.last.toLowerCase()
    if (searchedWords.length === 1) {
        return (
            firstName.startsWith(searchedString[0]) ||
            lastName.startsWith(searchedString[0])
        )
    }
    if (searchedWords.length === 2) {
        return (
            (firstName.startsWith(searchedWords[0]) && lastName.startsWith(searchedWords[1])) ||
            (lastName.startsWith(searchedWords[0]) && firstName.startsWith(searchedWords[1])) 
        )
    }
    return false
}