/** EXPLICATION GÉNÉRALE
 * @fileoverview
 * Script principal pour une application de génération et de gestion de cookies.
 * - Permet de créer, modifier et supprimer des cookies via un formulaire.
 * - Affiche les cookies existants dans une liste dynamique.
 * - Utilise des toasts pour informer l'utilisateur des actions effectuées.
 * - Implémente des vérifications de validité des champs et des messages personnalisés.
 */

const inputs = document.querySelectorAll('.cookies-app__input')
inputs.forEach(input => {
    input.addEventListener('invalid', handleInvalideInput)
    input.addEventListener('input', handleResetInputCustomValidity)
})

/** EXPLICATION :
 * Définit un message de validation personnalisé pour les champs invalides.
 * @param {Event} e - Événement déclenché sur le champ invalide.
 */
function handleInvalideInput(e) {
    e.target.setCustomValidity('Veuillez remplir ce champ')
}
/** EXPLICATION :
 * Réinitialise le message de validation personnalisé lorsque l'utilisateur modifie la valeur.
 * @param {Event} e - Événement déclenché lors de la saisie dans le champ.
 */
function handleResetInputCustomValidity(e) {
    e.target.setCustomValidity('')
}

const cookieForm = document.querySelector('.cookies-app__form')
cookieForm.addEventListener('submit', handleCookieForm)

/** EXPLICATION :
 * Gère la soumission du formulaire de création de cookie.
 * - Empêche le rechargement de la page.
 * - Crée un cookie avec les données du formulaire.
 * - Réinitialise le formulaire après soumission.
 * @param {Event} e - Événement de soumission du formulaire.
 */
function handleCookieForm(e) {
    e.preventDefault()
    createCookie()
    cookieForm.reset()
}

const cookiesList = document.querySelector('.cookies-app__list')
/** EXPLICATION :
 * Crée ou modifie un cookie en fonction des données saisies dans le formulaire.
 * 
 * - Récupère les valeurs des champs et les stocke dans un objet `newCookie`.
 * - Vérifie si un cookie portant le même nom existe déjà en parcourant `document.cookie`.
 * - Si un cookie existe :
 *    * Met à jour sa valeur dans l'interface.
 *    * Affiche une notification toast bleue indiquant que le cookie a été modifié.
 * - Si aucun cookie n'existe :
 *    * Crée un nouvel élément de liste pour afficher le cookie dans l'interface.
 *    * Ajoute cet élément soit comme premier enfant si la liste contient déjà des cookies,
 *     soit comme unique enfant si la liste était vide.
 *    * Affiche une notification toast verte indiquant que le cookie a été créé.
 * - Encode le nom et la valeur pour éviter les erreurs liées aux caractères spéciaux.
 * - Définit le cookie dans `document.cookie` avec une durée de vie de 7 jours.
 *
 */
function createCookie() {
    const newCookie = {}
    inputs.forEach(input => {
        const nameAttribute = input.getAttribute('name')
        newCookie[nameAttribute] = input.value.trim()
    })

    const cookiesArray = document.cookie.replace(/\s/g, '').split(';')
    const alreadyExistingCookie = cookiesArray.find(cookie => decodeURIComponent(cookie.split('=')[0]) === newCookie.name)
    if (alreadyExistingCookie) {
        createToast({name: newCookie.name, state: '- modifié', color: 'royalblue'})
        const modifiedCookie = document.querySelector(`[data-cookie=${newCookie.name}]`)
        modifiedCookie.querySelector('.cookies-app__cookie-value').textContent = `Valeur: ${newCookie.value}`
    } else {
        createToast({name: newCookie.name, state: '- créé', color: 'green'})
        if (!cookiesList.children.length) {
            cookiesList.appendChild(createCookieListItem(`${newCookie.name}=${newCookie.value}`))
        } else {
            cookiesList.insertBefore(
                createCookieListItem(`${encodeURIComponent(newCookie.name)}=${newCookie.value}`),
                cookiesList.firstChild
            )
        }
    }
    document.cookie = `${encodeURIComponent(newCookie.name)}=${encodeURIComponent(newCookie.value)};path=/;expires=${getCookieExpiration(7)}`
}

/** EXPLICATION :
 * Crée un élément de liste (`<li>`) représentant un cookie dans l'interface.
 *
 * - Analyse la chaîne de cookie reçue sous la forme "nom=valeur".
 * - Sépare le nom et la valeur en utilisant '=' comme délimiteur.
 * - Crée dynamiquement un élément <li> avec :
 *    * Un paragraphe affichant le nom du cookie.
 *    * Un paragraphe affichant la valeur du cookie.
 *    * Un bouton permettant de supprimer ce cookie spécifique.
 * - Ajoute un attribut `data-cookie` pour identifier le cookie correspondant dans le DOM.
 * - Décode les caractères encodés pour gérer les noms/valeurs contenant des caractères spéciaux.
 * - Attache un écouteur sur le bouton de suppression qui :
 *    * Supprime le cookie du navigateur.
 *    * Supprime l'élément <li> de la liste affichée.
 *    * Affiche une notification toast confirmant la suppression.
 *
 * @param {string} cookie - Chaîne contenant le cookie au format "nom=valeur".
 * @returns {HTMLLIElement} Élément <li> prêt à être inséré dans la liste des cookies. 
 */
function createCookieListItem(cookie) {
    const formatCookie = cookie.split('=')
    const cookieListItem = document.createElement('li')
    cookieListItem.className = "cookies-app__cookie"
    cookieListItem.setAttribute('data-cookie', decodeURIComponent(formatCookie[0]))

    cookieListItem.innerHTML = `
        <p class="cookies-app__cookie-name"></p>
        <p class="cookies-app__cookie-value"></p>
        <button class="cookies-app__cookie-button">X</button>
    `
    cookieListItem.querySelector('.cookies-app__cookie-name').textContent = 
        `Nom : ${decodeURIComponent(formatCookie[0])}`
    cookieListItem.querySelector('.cookies-app__cookie-value').textContent = 
        `Valeur : ${decodeURIComponent(formatCookie[1])}`
    cookieListItem.querySelector('.cookies-app__cookie-button').addEventListener('click', handleDeleteCookie)

    /** EXPLICATION :
     * Supprime le cookie correspondant et enlève l'élément de la liste.
     * Affiche une notification toast rouge indiquant que le cookie a été supprimé.
     * 
     * @param {Event} e - Événement de clic sur le bouton de suppression.
     */
    function handleDeleteCookie(e) {
        createToast({name: formatCookie[0], state: '- supprimé', color: 'crimson'})
        document.cookie = `${(formatCookie[0])}=; expires=${new Date(0)}; path=/`
        e.target.closest('.cookies-app__cookie').remove()
    }
    return cookieListItem
}

/** EXPLICATION :
 * Calcule la date d'expiration (définie sur 7 jour) d'un cookie.
 * - `console.log(days * 24 * 60 *60 * 1000)` -> Affiche le nombre de millisecondes correspondant au nombre de jours spécifié.
 * - `console.log(new Date(Date.now() + days * 24 * 60 *60 * 1000))` -> Affiche la date complète calculée en ajoutant le nombre de jours à la date actuelle.
 * - `console.log(new Date(Date.now() + days * 24 * 60 *60 * 1000).toUTCString())`-> Affiche la date au format UTC utilisée pour la propriété 'expires' des cookies.
 * @param {number} days - Nombre de jours avant l'expiration.
 * @returns {string} Date d'expiration au format UTC.
 */
function getCookieExpiration(days) {
    return new Date(Date.now() + days * 24 * 60 *60 * 1000).toUTCString()
}

const toastsContainer = document.querySelector('.toasts')
/** EXPLICATION :
 * Crée et affiche une notification toast temporaire.
 * @param {Object} params - Paramètres de la notification.
 * @param {string} params.name - Nom du cookie concerné.
 * @param {string} params.state - État de l'action (créé, modifié, supprimé).
 * @param {string} params.color - Couleur de fond de la notification.
 */
function createToast({name, state, color}) {
    const toast = document.createElement('div')
    toast.className = 'toast'
    toast.innerHTML = '<p class="toast__name"></p>'
    toast.querySelector('.toast__name').textContent = `Cookie ${name} ${state}`
    toast.style.backgroundColor = color
    toastsContainer.appendChild(toast)
    setTimeout(() => {
        toast.remove()
    }, 2500) // Disparition de la notification au bout de 2,5s
}

/** EXPLICATION :
 * Affiche tous les cookies existants dans la liste à l'initialisation de l'application.
 * 
 * - Récupère les cookies depuis document.cookie (chaîne "nom=valeur; nom2=valeur2").
 * - Supprime les espaces pour éviter les erreurs lors du découpage.
 * - Sépare les cookies en tableau via le caractère ';'.
 * - Inverse l'ordre du tableau pour afficher les plus récents en premier.
 * - Crée un élément de liste pour chaque cookie et les insère dans le DOM.
 *
 * @example
 * // document.cookie = "user=John; theme=dark"
 * // cookies => ["theme=dark", "user=John"] après reverse()
 */
function displayCookies() {
    if (document.cookie) {
        const fragment = document.createDocumentFragment()
        const cookies = document.cookie.replace(/\s/g, '').split(';').reverse()
        cookies.forEach(cookie => {
            fragment.appendChild(createCookieListItem(cookie))
        })
        cookiesList.appendChild(fragment)
    }
}
displayCookies()