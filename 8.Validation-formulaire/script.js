/** EXPLICATION GÉNÉRALE :
 * @fileoverview Script de validation d'un formulaire d'inscription.
 * Ce script gère la vérification en temps réel des champs du formulaire (nom d'utilisateur, email, mot de passe, confirmation),
 * applique des règles de validation via des regex et des conditions personnalisées, 
 * affiche dynamiquement des icônes de validation et des messages d’erreur, 
 * et déclenche une animation si le formulaire est soumis avec des erreurs.
 */

const inputsValidity = {
    username: false,
    email: false,
    password: false,
    repeatPassword: false
}

//#region --> 🧾 GESTION DU FORMULAIRE & ANIMATION D'ECHEC
    const form = document.querySelector('.sign-up__form')
    const signUpContainer = document.querySelector('.sign-up')
    signUpContainer.addEventListener('animationend', handleSingUpFailAnimationEnd)
    let isAnimating = false

    /** EXPLICATION :
     * Supprime la classe d’animation de shake et remet l'état isAnimating à false.
     * Utilisé après la fin de l'animation de soumission échouée.
    */
    function handleSingUpFailAnimationEnd() {
        signUpContainer.classList.remove('js-shake-animation')
        isAnimating = false
    }
//#endregion

//#region --> 📤 SOUMISSION DU FORMULAIRE
    form.addEventListener('submit', handleSignUpSubmit)
    
    /** EXPLICATION :
     * Gère la soumission du formulaire.
     * Vérifie la validité de tous les champs et déclenche une animation en cas d’échec ou une alerte en cas de succès.
     * @param {Event} e - Événement de soumission du formulaire
     */
    function handleSignUpSubmit(e) {
        e.preventDefault()
        const faildeInputs = Object.values(inputsValidity).filter(value => !value)
        if (faildeInputs.length && !isAnimating) {
            isAnimating = true
            signUpContainer.classList.add('js-shake-animation')
        showValidation(Object.keys(inputsValidity).slice(0,-1))
        } else if (!faildeInputs.length) {
            alert('Données envoyées avec succès !')
    }
}
//#endregion

//#region --> 👁️ AFFICHAGE DES ICÔNES DE VALIDATION
    /** EXPLICATION :
     * Affiche les icônes de validation (check ou erreur) et les messages d’erreur selon la validité des champs.
     * @param {string[]} inputGroupNames - Liste des noms des groupes de champs à valider
     */
    function showValidation(inputGroupNames) {
        inputGroupNames.forEach(inputGroupNames => {
            const inputGroup = document.querySelector(`[data-inputGroupName="${inputGroupNames}"]`)
            const inputGroupIcon = inputGroup.querySelector('.sign-up__check-icon')
            const inputGroupValidationText = inputGroup.querySelector('.sign-up__error-msg')

            // En cas de validité de l'input, affichage d'une icône de >✅ <
            if (inputsValidity[inputGroupNames]) {
                inputGroupIcon.style.display = 'inline'
                inputGroupIcon.src = './assets/svg/check.svg'
                inputGroupValidationText.style.display = 'none'
            }
            // En cas d'erreur de l'input, affichage d'une icône de >❗️<
            else {
                inputGroupIcon.style.display = 'inline'
                inputGroupIcon.src = './assets/svg/error.svg'
                inputGroupValidationText.style.display = 'block'
            }
        })
    }
//#endregion

//#region --> 🔤 VALIDATION DU NOM D'UTILISATEUR
    const userInput = document.querySelector('.js-username-input')
    userInput.addEventListener('blur', usernameValidation)
    userInput.addEventListener('input', usernameValidation)

    /** EXPLICATION :
     * Valide le champ du nom d'utilisateur.
     * Le champ est considéré valide s'il contient au moins 3 caractères non vides.
     * Met à jour la validité dans `inputsValidity` et affiche les éléments visuels associés.
     */
    function usernameValidation() {
        if (userInput.value.trim().length >= 3) {
            inputsValidity.username = true
            showValidation(['username'])
        } else {
            inputsValidity.username = false
            showValidation(['username'])
        }
    }
//#endregion

//#region --> 📧 VALIDATION DE L'ADRESSE EMAIL
    const emailInput = document.querySelector('.js-email-input')
    emailInput.addEventListener('blur', emailValidation)
    emailInput.addEventListener('input', emailValidation)
    const regexEmail = /^[a-zA-ZÀ-ÿ0-9_]+([.-]?[a-zA-ZÀ-ÿ0-9_]+)*@[a-zA-ZÀ-ÿ0-9_]+([.-]?[a-zA-ZÀ-ÿ0-9_]+)*(\.[a-zA-ZÀ-ÿ]{2,})+$/

    /** EXPLICATION :
     * Valide le champ email en utilisant une expression régulière.
     * Met à jour la validité dans `inputsValidity` et affiche les éléments visuels associés.
     */
    function emailValidation() {
        if (regexEmail.test(emailInput.value)) {
            inputsValidity.email = true
            showValidation(['email'])
        } else {
            inputsValidity.email = false
            showValidation(['email'])
        }
    }
//#endregion

//#region --> 🔒 VALIDATION DU MOT DE PASSE
    const passwordInput = document.querySelector('.js-password-input')
    passwordInput.addEventListener('blur', passwordValidation)
    passwordInput.addEventListener('input', passwordValidation)
    const passwordVerification = {
        length: false,
        symbol: false,
        number: false
    }
    const regexList = {
        symbol: /[!\"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]/,
        number: /[0-9]/
    }
    const confirmPasswordIcon = document.querySelector('.js-repeat-password-check-icon')
    let passwordValue

    /** EXPLICATION :
     * Valide le champ mot de passe selon plusieurs critères :
     * - Longueur minimale de 6 caractères
     * - Contient au moins un chiffre
     * - Contient au moins un symbole
     * Met à jour dynamiquement `inputsValidity.password`.
     * Relance la validation du champ de confirmation si elle est déjà affichée.
     */
    function passwordValidation() {
        passwordValue = passwordInput.value.trim()
        if (passwordValue.length < 6) {
            passwordVerification.length = false
        } else {
            passwordVerification.length = true
        }
        for (const regexValidation in regexList) {
            if (regexList[regexValidation].test(passwordValue)) {
                passwordVerification[regexValidation] = true
            }
            else {
                passwordVerification[regexValidation] = false
            }
        }
        if (Object.values(passwordVerification).filter(value => !value).length) {
            inputsValidity.password = false
            showValidation(['password'])
            
        } else {
            inputsValidity.password = true
            showValidation(['password'])
        }
        if (confirmPasswordIcon.style.display === 'inline') {
            confirmPassword()
        }
    }
//#endregion

//#region --> ✅ CONFIRMATION DU MOT DE PASSE
    const confirmInput = document.querySelector('.js-password-confirmation')
    confirmInput.addEventListener('blur', confirmPassword)
    confirmInput.addEventListener('input', confirmPassword)

    /** EXPLICATION :
     * Valide la confirmation du mot de passe.
     * Vérifie que le mot de passe confirmé correspond à la valeur du mot de passe original.
     * Met à jour `inputsValidity.repeatPassword` et affiche les éléments visuels associés.
     */
    function confirmPassword() {
        const confirmedValue = confirmInput.value
        if (!confirmedValue && !passwordValue) {
            const confirmPasswordGroup = document.querySelector('[data-inputGroupName="repeatPassword"]')
            confirmPasswordGroup.querySelector('.sign-up__check-icon').style.display = 'none'
            confirmPasswordGroup.querySelector('.sign-up__error-msg').style.display = 'none'
            return
        }
        if (confirmedValue !== passwordValue) {
            inputsValidity.repeatPassword = false
            showValidation(['repeatPassword'])
        } else {
            inputsValidity.repeatPassword = true
            showValidation(['repeatPassword'])
        }
    }
//#endregion