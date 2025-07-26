import quizData from './quizData.js';
console.log(quizData);

const form = document.querySelector('.quiz-form');
const formSubmitBtn = document.querySelector('.quiz__submit-button');

function addQuizContent(questions) {
    // Le fragment permet de créer un groupe de nœuds qui sera inséré dans le DOM en une seule opération.
    const fragment = document.createDocumentFragment();

    questions.forEach(currentQuestion => {
        
        const questionBlock = document.createElement('div');
        questionBlock.className = "quiz__question-block";
        questionBlock.id = currentQuestion.id;
        
        const questionText = document.createElement('p');
        questionText.className = "quiz__question";
        questionText.textContent = currentQuestion.question;
        questionBlock.appendChild(questionText);

        fragment.appendChild(questionBlock);
    })

    form.insertBefore(fragment, formSubmitBtn);
}

addQuizContent(quizData.questions);