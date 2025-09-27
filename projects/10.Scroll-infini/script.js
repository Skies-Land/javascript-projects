//#region - INITIALISATION : Sélection des éléments DOM et variables
const imagesList = document.querySelector('.search-imgs__list')
const errorMsg = document.querySelector('.search-imgs__error-msg')
const loader = document.querySelector('.loader')

let searchQuery = 'random'
let pageIndex = 1
let totalPages
//#endregion

//#region - FETCH API DATA :  Récupération des données depuis l'API Unsplash 
async function fetchData() {
    let data
    loader.classList.add('js-active-loader')
    errorMsg.textContent = ''
    try {
        const response = await fetch(`https://api.unsplash.com/search/photos?page=${pageIndex}&per_page=30&query=${searchQuery}&client_id=k0NQrFTFdh0GgTvYZlHXeH40ZRQ5bgjwJUdgxnlybRo`)
        if (!response.ok) throw new Error()
        data = await response.json()
        totalPages = data.total_pages
        // console.log(data)
    }
    catch (error) {
        // Affiche un message d'erreur si la récupération des données échoue
        errorMsg.textContent = "Erreur lors de l'appel des données"
        return
    }
    finally {
        // Retire le loader quelle que soit l'issue de la requête
        loader.classList.remove('js-active-loader')
    }
    if (!data.total) {
        // Informe l'utilisateur qu'aucun résultat n'a été trouvé dans l'input de recherche
        errorMsg.textContent = "Aucun résultat pour cette recherche... essayez un mot clé plus précis !"
        return
    }
    else {
        createImages(data.results)
    }
}
fetchData()
//#endregion

//#region - DOM MANIPULATION : Création et affichage des images
function createImages(data) {
    const fragment = document.createDocumentFragment()
    data.forEach(img => {
        const li = document.createElement('li')
        li.className = 'search-imgs__list-item'
        const newImg = document.createElement('img')
        newImg.className = 'search-imgs__list-item-img'
        newImg.src = img.urls.regular
        li.appendChild(newImg)
        fragment.appendChild(li)
    })
    imagesList.appendChild(fragment)
}
//#endregion

//#region - INFINITE SCROLL HANDLING : Gestion du scroll infini
const observer = new IntersectionObserver(handleIntersect, {rootMargin: "50%"})

observer.observe(document.querySelector('.search-imgs__marker'))

function handleIntersect(entries) {
    if (window.scrollY > window.innerHeight && entries[0].isIntersecting) {
        if (pageIndex + 1 <= totalPages) {
            // console.log("intersect", pageIndex, totalPages)
            pageIndex++
            fetchData()
        }
    }
}
//#endregion

//#region - SEARCH HANDLING : Gestion de la recherche d'images
const input = document.querySelector('.search-imgs__input')
const form = document.querySelector('.search-imgs__form')

form.addEventListener('submit', handleImagesSearch)

function handleImagesSearch(e) {
    e.preventDefault()
    imagesList.textContent = ''
    errorMsg.textContent = ''
    if (!input.value.trim()) return
    searchQuery = input.value
    pageIndex = 1
    totalPages = undefined
    fetchData()
}
//#endregion

//#region - SCROLL TO TOP : Bouton de retour en haut de page
const scrollToTop = document.querySelector('.scroll-to-top-button')
scrollToTop.addEventListener('click', pushToTop)
function pushToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    })
}
//#endregion