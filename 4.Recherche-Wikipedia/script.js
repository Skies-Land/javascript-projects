/** EXPLICATION GÉNÉRALE :
 * @fileoverview
 * Script principal de l'application de recherche Wikipedia.
 * - Récupère les résultats de recherche via l'API REST publique de Wikipedia.
 * - Affiche les titres et extraits des articles trouvés.
 * - Gère les erreurs et les messages d'état (loader, messages d'erreur).
 * 
 * Fonctionnalités principales :
 * - Écoute du formulaire de recherche et validation de l'input.
 * - Requête asynchrone vers l'API Wikipedia.
 * - Génération dynamique de cartes d'articles avec liens et descriptions.
 */

const form = document.querySelector('.wiki-app__form');
const searchInput = document.querySelector('.wiki-app__form-search-input');
const errorMsg = document.querySelector('.wiki-app__error-msg');
const resultDisplay = document.querySelector('.wiki-app__results');
const loader = document.querySelector('.wiki-app__loader');

form.addEventListener('submit', handleSubmit)

/** EXPLICATION :
 * Gère l'envoi du formulaire de recherche Wikipedia.
 *
 * @function handleSubmit
 * @param {Event} e - L'événement de soumission du formulaire.
 *
 * Comportement :
 * - Empêche le rechargement de la page lors de la soumission.
 * - Récupère et nettoie la valeur saisie par l'utilisateur.
 * - Vérifie que la recherche n'est pas vide et affiche un message d'erreur si nécessaire.
 * - Si la recherche est valide, appelle la fonction wikiApiCall() avec l'entrée nettoyée.
 */
function handleSubmit(e) {
    e.preventDefault();
    // Enleve les espaces en début et fin de chaîne lors de la recherche
    const trimmedInput = searchInput.value.trim();
    if(trimmedInput === '') {
        errorMsg.textContent = 'La recherche ne peut pas être vide';
    } else {
        wikiApiCall(trimmedInput);
    }
}

/** EXPLICATION :
 * Effectue un appel à l'API Wikipedia pour récupérer des articles correspondant à la recherche.
 *
 * @async
 * @function wikiApiCall
 * @param {string} searchInput - La chaîne de recherche saisie par l'utilisateur.
 * @returns {Promise<void>} - Met à jour l'UI avec les résultats ou affiche un message d'erreur.
 *
 * Comportement :
 * - Vide les anciens résultats et affiche un loader.
 * - Interroge l'API Wikipedia (endpoint generator=search avec extracts).
 * - Gère les erreurs réseau et les cas sans résultats.
 * - Transmet les données récupérées à createCards() pour l'affichage.
 */
async function wikiApiCall(searchInput) {
    errorMsg.textContent = '';
    resultDisplay.textContent = '';
    loader.classList.add('js-active-loader');
    let data;
    try {
        const response = await fetch(`https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${searchInput}&gsrlimit=30&prop=extracts&explaintext&exchars=150&exintro&format=json&origin=*`);
        // Vérifie si la réponse est correcte
        if(!response.ok) {
            throw new Error()
        }
        data = await response.json();
        // console.log(data);
    } catch (error) {
        errorMsg.textContent = "Une erreur s'est produite lors de la récupération des données.";
        return;
    } finally {
        loader.classList.remove('js-active-loader');
    }
    if (!data.query) {
        errorMsg.textContent = "Aucun résultat trouvé pour cette recherche.";
        return;
    } else {
        createCards(data.query.pages);
    }
}

/** EXPLICATION :
 * Crée et affiche dynamiquement les cartes d'articles à partir des données de l'API Wikipedia.
 *
 * @function createCards
 * @param {Object} articleData - Objet contenant les articles récupérés depuis l'API (clé = pageid).
 *
 * Comportement :
 * - Transforme l'objet d'articles en tableau avec Object.values().
 * - Génère des éléments HTML pour chaque article (titre cliquable + extrait).
 * - Ajoute les cartes générées au DOM dans la zone des résultats.
 */
function createCards(articleData) {
    // console.log (Object.values(articleData));
    const fragment = document.createDocumentFragment();
    Object.values(articleData).forEach(article => {
        const card = document.createElement('div');
        card.className = 'wiki-app__result-item';
        // Structure HTML des résultats de recherches
        card.innerHTML = `
            <div class="wiki-app__result-card">
                <p class="wiki-app__result-title">
                    <a 
                        href=""
                        class="wiki-app__result-link-title"
                        target="_blank"
                    ></a>
                </p>
                <p class="wiki-app__result-snippet"></p>
            </div>
        `;
        const cardLink = card.querySelector('.wiki-app__result-link-title');
        cardLink.textContent = article.title;
        cardLink.href = `https://en.wikipedia.org/?curid=${article.pageid}`;
        card.querySelector('.wiki-app__result-snippet').textContent = article.extract ? article.extract : "";
        fragment.appendChild(card);
    });
    resultDisplay.appendChild(fragment);
}