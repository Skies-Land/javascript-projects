/**
 * Ce script permet à l'utilisateur de simuler un prêt à taux fixe :
 * 
 * - Gère l'interaction utilisateur via deux sliders (montant & durée).
 * - Met à jour dynamiquement les valeurs affichées.
 * - Calcule les mensualités, intérêts et total à rembourser.
 *  
 * Toutes les données sont centralisées dans l'objet `loanData`.
 * Les résultats sont automatiquement mis à jour à chaque interaction.
 */

// Données par défaut du prêt
const loanData = {
    amount: 10000,
    repayment: 42,
    rate: 7
}

// Gestion des sliders (montant et duréee par mois)
const rangeInputs = document.querySelectorAll('.loan-app__range-input')

// Initialisation des valeurs des sliders
rangeInputs.forEach(rangeInput => {
    rangeInput.addEventListener('input', handleRangeChange)
})

// Eléments qui affichent les valeurs dynamiques des sliders
const loanAmountLabel = document.querySelector('.js-loan-amount')
const repaymentLabel = document.querySelector('.js-repayment-duration')

/** EXPLICATION :
 * Gère les modifications des sliders (montant du prêt ou durée de remboursement).
 *
 * Cette fonction est déclenchée à chaque fois qu'un utilisateur modifie un slider.
 * Elle met à jour l'affichage dynamique des valeurs à côté des sliders,
 * met à jour les données de prêt dans l'objet `loanData`, 
 * puis déclenche le recalcul des résultats via `displayLoanInformation()`.
 *
 * @param {Event} e - L'événement déclenché par le mouvement du slider (input).
 *
 * @example
 * // Lorsque l'utilisateur change la valeur du montant
 * <input type="range" id="loan-amount" ... />
 *
 * // Lorsque l'utilisateur change la durée du prêt
 * <input type="range" id="repayment" ... />
 */
function handleRangeChange(e) {
    //console.log(e)
    const inputValue = Number(e.target.value)
    if(e.target.id === 'loan-amount') {
        loanAmountLabel.textContent = `${inputValue.toLocaleString()}€`
        loanData.amount = inputValue
    }
    else if(e.target.id === 'repayment') {
        repaymentLabel.textContent = `${inputValue}`
        loanData.repayment = inputValue
    }
    displayLoanInformation()
}

// Elements d'afficage des résultats du calculateur de prêt
const totalPaymentTxt = document.querySelector('.js-total-value')
const perMonthPaymentTxt = document.querySelector('.js-monthly-payment')
const totaltInterestTxt = document.querySelector('.js-total-interest')

/** EXPLICATION :
 * Calcule les résultats du prêt bancaire à partir des données actuelles.
 *
 * Cette fonction utilise les données de `loanData` pour calculer :
 * - Le montant total à rembourser (capital + intérêts)
 * - Le montant mensuel à payer
 * - Le montant total des intérêts
 * 
 * Les résultats sont ensuite affichés dans l'interface utilisateur.
 *
 * @returns {void}
 */
function displayLoanInformation() {
    // Montant total à rembourser = montant emprunté + intérêts
    const totalPayment = loanData.amount + (loanData.amount * (loanData.rate / 100))
    
    // Mensualité = montant total réparti sur le nombre de mois
    const perMonthPayment = totalPayment / loanData.repayment
    
    // Intérêts = différence entre ce qu'on rembourse et ce qu'on a emprunté
    const totalInterest = totalPayment - loanData.amount

    // Affichage des résultats dans l'interface utilisateur
    totalPaymentTxt.textContent = `${Math.trunc(totalPayment).toLocaleString()}€`
    perMonthPaymentTxt.textContent = `${Math.trunc(perMonthPayment).toLocaleString()}€`
    totaltInterestTxt.textContent = `${Math.trunc(totalInterest).toLocaleString()}€`
}