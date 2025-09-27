/**
 * @file script.js
 * @description
 * Ce script gère l'affichage dynamique et l'interactivité d'un quiz en JavaScript.
 * 
 * Fonctionnalités principales :
 * - Génère automatiquement les questions et options de réponse à partir des données du quiz.
 * - Permet à l'utilisateur de sélectionner des réponses via des boutons radio.
 * - Évalue les réponses soumises et calcule le score en temps réel.
 * - Affiche un message de résultat ainsi qu'un retour visuel (couleurs) pour chaque question.
 * - Réinitialise les couleurs lorsqu'une nouvelle réponse est sélectionnée.
 * 
 * Technologies utilisées :
 * - HTML/CSS pour la structure et le style.
 * - JavaScript natif pour la génération du DOM et la logique de validation.
 */

import quizData from './quizData.js';
//console.log(quizData);

const form = document.querySelector('.quiz__form');
const formSubmitBtn = document.querySelector('.quiz__submit-button');

/** EXPLICATION :
 * Génère dynamiquement le contenu du quiz dans l'interface utilisateur.
 * 
 * @param {Array} questions - Tableau contenant les questions du quiz et leurs options.
 * @description 
 * - Crée un bloc pour chaque question avec ses réponses possibles.
 * - Utilise un DocumentFragment pour optimiser l'insertion dans le DOM.
 * - Associe des boutons radio à chaque option.
 */
function addQuizContent(questions) {
    // fragment : permet de créer un groupe de nœuds qui sera inséré dans le DOM en une seule opération
    const fragment = document.createDocumentFragment();
    questions.forEach(currentQuestion => {
        // Création d'un bloc pour chaque question
        const questionBlock = document.createElement('div');
        questionBlock.className = "quiz__question-block";
        questionBlock.id = currentQuestion.id;
        // Création du titre de la question
        const questionText = document.createElement('p');
        questionText.className = "quiz__question";
        questionText.textContent = currentQuestion.question;
        questionBlock.appendChild(questionText);
        // Création des options pour chaque question
        currentQuestion.options.forEach((option, index) => {
            const inputGroup = document.createElement('div');
            inputGroup.className = "quiz__input-group";
            // Création de l'élément input radio
            const radioInput = document.createElement('input');
            radioInput.type = "radio";
            radioInput.className = "quiz__radio-input";
            radioInput.id = `${currentQuestion.id}-${option.value}`;
            radioInput.name = currentQuestion.id;
            radioInput.value = option.value;
            radioInput.checked = index === 0;
            // Création de l'élément label associé à l'input
            const label = document.createElement('label');
            label.className = "quiz__label";
            label.htmlFor = radioInput.id;
            label.textContent = option.label;
            // Ajout de l'input et du label dans le groupe d'input
            inputGroup.appendChild(radioInput);
            inputGroup.appendChild(label);
            questionBlock.appendChild(inputGroup);
        })
        fragment.appendChild(questionBlock);
    })
    form.insertBefore(fragment, formSubmitBtn);
}

addQuizContent(quizData.questions);

form.addEventListener('submit', handleSubmit);
/** EXPLICATION :
 * Gère l'événement de soumission du formulaire de quiz.
 * 
 * @param {Event} e - Événement de soumission du formulaire.
 * @description 
 * - Empêche le rechargement de la page.
 * - Déclenche la récupération et l'évaluation des résultats du quiz.
 */
function handleSubmit(e) {
    e.preventDefault();
    getResults();
}

/** EXPLICATION :
 * Récupère et évalue les réponses sélectionnées par l'utilisateur.
 * 
 * @returns {void}
 * @description 
 * - Récupère toutes les réponses cochées.
 * - Compare les réponses de l'utilisateur avec les réponses correctes du quizData.
 * - Transmet les résultats à la fonction d'affichage et de coloration.
 */
function getResults() {
    const checkRadioButtons = [...document.querySelectorAll('input[type="radio"]:checked')];
    //console.log(checkRadioButtons);
    const results = checkRadioButtons.map(radioButton => {
        const response = quizData.responses.find (response => response.id === radioButton.name);
        return {
            id: radioButton.name,
            correct: response.answer === radioButton.value
        }
    })
    //console.log(results);
    showQuizResults(results);
    addColors(results);
}

const quizResultsBox = document.querySelector('.quiz__results');
const quizDescription = document.querySelector('.quiz__description');

let isResultBoxShowed = false;
/** EXPLICATION :
 * Affiche le résultat final du quiz à l'utilisateur.
 * 
 * @param {Array} results - Tableau des résultats pour chaque question.
 * @description 
 * - Calcule le nombre de bonnes réponses.
 * - Affiche un message de réussite ou d'encouragement selon le score.
 */
function showQuizResults(results) {
    if(!isResultBoxShowed) {
        quizResultsBox.style.display = 'block';
        isResultBoxShowed = true;
    }

    const goodResponses = results.filter(response => response.correct === true);
    const hasFinishQuiz = goodResponses.length === quizData.responses.length;

    if(!hasFinishQuiz) {
        quizDescription.textContent = `Résultat : ${goodResponses.length}/${quizData.questions.length}, retentez votre chance.`
    } else {
        quizDescription.textContent = `Bravo : ${goodResponses.length}/${quizData.questions.length}. 🏆 `
    }
}

/** EXPLICATION :
 * Ajoute un style visuel pour indiquer les réponses correctes ou incorrectes.
 * 
 * @param {Array} results - Tableau des résultats pour chaque question.
 * @description 
 * - Applique une bordure verte pour les bonnes réponses.
 * - Applique une bordure rouge pour les mauvaises réponses.
 */
function addColors(results) {
    results.forEach(response => {
        document.getElementById(response.id).style.outline = response.correct ? '3px solid #3da406' : '3px solid #ff6565';
    })
}

form.addEventListener ('input', resetQuestionHighlight)
/** EXPLICATION :
 * Réinitialise la couleur de la question lorsqu'une nouvelle option est sélectionnée.
 * 
 * @param {Event} e - Événement d'entrée sur les boutons radio.
 * @description 
 * - Supprime la bordure de la question modifiée pour indiquer un nouvel essai.
 */
function resetQuestionHighlight(e) {
    if(e.target.matches('.quiz__radio-input')) {
        const block = document.getElementById(e.target.name);
        if(block) block.style.outline = 'none';
    }
}