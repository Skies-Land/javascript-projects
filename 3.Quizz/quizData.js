const quizData = {
    responses: [
        { id: "q1", answer: "a" },
        { id: "q2", answer: "a" },
        { id: "q3", answer: "b" },
        { id: "q4", answer: "a" },
        { id: "q5", answer: "c" },
    ],
    questions: [
        {
            id: "q1",
            question: "Que signifie l'acronyme HTML ?",
            options: [
                { value: "a", label: "HyperText Markup Language" },
                { value: "b", label: "HighText Machine Language" },
                { value: "c", label: "Hyper Tool Multi Language" }
            ]
        },
        {
            id: "q2",
            question: "Quelle balise HTML est utilisée pour lier un fichier CSS ?",
            options: [
                { value: "a", label: "<link>" },
                { value: "b", label: "<style>" },
                { value: "c", label: "<css>" }
            ]
        },
        {
            id: "q3",
            question: "En JavaScript, quelle méthode permet de sélectionner un élément par son ID ?",
            options: [
                { value: "a", label: "getElementByClassName()" },
                { value: "b", label: "getElementById()" },
                { value: "c", label: "querySelectorAll()" }
            ]
        },
        {
            id: "q4",
            question: "Quelle est la commande Git pour cloner un dépôt distant ?",
            options: [
                { value: "a", label: "git clone <url>" },
                { value: "b", label: "git copy <url>" },
                { value: "c", label: "git fork <url>" }
            ]
        },
        {
            id: "q5",
            question: "Que fait l'attribut 'alt' dans une balise <img> en HTML ?",
            options: [
                { value: "a", label: "Indique la taille de l'image" },
                { value: "b", label: "Ajoute un style à l'image" },
                { value: "c", label: "Définit un texte alternatif" }
            ]
        }
    ]
};

export default quizData;