//#region 1️⃣ EXPLICATION GÉNÉRALE :
/**
 * Jeu de mémoire interactif en JavaScript.
 * 
 * Fonctionnalités :
 * - Génération de cartes mélangées à partir d'une liste de fruits.
 * - Mécanique de retournement de carte avec effet de flip.
 * - Comparaison de paires et comptabilisation des essais.
 * - Réinitialisation du jeu via la touche Espace.
 * 
 * Les cartes utilisent des icônes SVG affichées dynamiquement.
 * Le score est basé sur le nombre de tentatives pour retrouver toutes les paires.
 */
//#endregion

//#region 2️⃣ CONFIGURATION ET SÉLECTION DOM
    const fruits = ["brocoli", "cherry", "pepper", "strawberry", "apple", "banana"];
    const fruitsList = document.querySelector('.memory-game__grid')
//#endregion

//#region 3️⃣ GÉNÉRATION DES CARTES
    /** EXPLICATION :
     * Duplique et mélange le tableau de fruits pour créer des paires aléatoires,
     * puis déclenche la création des cartes dans le DOM.
     * 
     * @param {string[]} fruitsArray - Tableau de noms de fruits (identifiants d'icônes)
     */
    function createNewShuffledCards(fruitsArray) {
        const duplicatedFruits = fruitsArray.flatMap(fruit => [fruit, fruit])
        for (let i = duplicatedFruits.length - 1; i > 0; i--) {
            const randmIndex = Math.floor(Math.random() * (i + 1))
            const sevedTemp = duplicatedFruits[i]
            duplicatedFruits[i] = duplicatedFruits[randmIndex]
            duplicatedFruits[randmIndex] = sevedTemp
        }
        createCards(duplicatedFruits)
    }
    createNewShuffledCards(fruits)

    /** EXPLICATION :
     * Crée les éléments DOM représentant les cartes de jeu à partir d'un tableau de fruits.
     * 
     * @param {string[]} randomFruitsArray - Tableau mélangé de fruits (avec doublons)
     */
    function createCards(randomFruitsArray) {
        const fragment = document.createDocumentFragment()
        randomFruitsArray.forEach(fruit => {
            const li = document.createElement('li')
            li.classList.add('memory-game__card')
            li.setAttribute('data-fruit', fruit)

            li.innerHTML = `
                <div class="memory-game__double-face">
                    <div class="memory-game__face">
                        <img src="" alt="" class="memory-game__card-img">
                    </div>
                    <div class="memory-game__back">
                        <img src="assets/svg/question.svg" alt="" class="memory-game__card-img">
                    </div>
                </div>
            `
            
            const liImg = li.querySelector('.memory-game__card-img')
            liImg.src = `./assets/svg/${fruit}.svg`
            liImg.alt = fruit
            fragment.appendChild(li)
        })
        fruitsList.textContent = ''
        fruitsList.appendChild(fragment)
    }
//#endregion

//#region 4️⃣ VARIABLES D'ÉTAT
    const advice = document.querySelector('.memory-game__advice')
    const score = document.querySelector('.memory-game__score')

    let lockedCards = false // Verrouillage des cartes identique révélées
    let cardsPicked = [] // Stockage des cartes sélectionnées
    let numberOfTries = 0 // Nombre d'essais pour dévoiler une paire
//#endregion

//#region 5️⃣ LOGIQUE DU JEU
    window.addEventListener('keydown', handleReset)

    /** EXPLICATION :
     * Gère la réinitialisation du jeu lorsqu'on appuie sur la barre d'espace.
     * Réinitialise les variables d'état et le plateau de jeu.
     * 
     * @param {KeyboardEvent} e - Événement clavier
     */
    function handleReset(e) {
        if (e.code === 'Space') {
            e.preventDefault()
            advice.textContent = "Appuyer sur barre d'espace pour reset le jeu."
            score.textContent = "Nombre d'essais : 0"
            numberOfTries = 0
            createNewShuffledCards(fruits)
            lockedCards = false
            cardsPicked = []
        }
    }

    fruitsList.addEventListener('click', flipACard)

    /** EXPLICATION :
     * Gère le retournement d'une carte lorsqu'on clique dessus.
     * Ne permet que deux cartes retournées à la fois.
     * 
     * @param {MouseEvent} e - Événement de clic
     */
    function flipACard(e) {
        if (lockedCards || e.target === fruitsList) return
        const clickedCard = e.target.closest('.memory-game__card')
        clickedCard.classList.add('js-card-locked')
        const doubleFaceContainer = clickedCard.querySelector('.memory-game__double-face')
        doubleFaceContainer.classList.add('js-double-face-active')
        cardsPicked.push({el : clickedCard, value: clickedCard.getAttribute('data-fruit')})
        if (cardsPicked.length === 2) {
            saveNumberOfTries()
            checkCards()
        }
    }

    /** EXPLICATION : 
     * Incrémente et met à jour l'affichage du nombre d'essais effectués.
     */
    function saveNumberOfTries() {
        numberOfTries++
        score.textContent = `Nombre d'essais : ${numberOfTries}`
    }

    /** EXPLICATION :
     * Compare les deux cartes retournées pour vérifier si elles forment une paire.
     * Si non, elles sont retournées à nouveau après un court délai.
     */
    function checkCards() {
        if (cardsPicked[0].value === cardsPicked[1].value) {
            cardsPicked = []
            checkGameCompletion()
            return
        }
        lockedCards = true
        setTimeout(() => {
            cardsPicked.forEach(card => {
                card.el.querySelector('.memory-game__double-face').classList.remove('js-double-face-active')
                card.el.classList.remove('js-card-locked')
            })
            cardsPicked = []
            lockedCards = false
        }, 1000)
    }

    /** EXPLICATION :
     * Vérifie si toutes les paires ont été trouvées.
     * Si oui, affiche un message de fin de partie.
     */
    function checkGameCompletion() {
        const innerDoubleFaceContainers = [...document.querySelectorAll('.memory-game__double-face')]
        const checkForEnd = innerDoubleFaceContainers.filter(card => !card.classList.contains('js-double-face-active'))
        if (!checkForEnd.length) {
            advice.textContent = `Bravo ! Appuyer sur barre d'espace pour refaire une partie.`
            score.textContent = `Nombre d'essais : ${numberOfTries}`
        }
    }
//#endregion