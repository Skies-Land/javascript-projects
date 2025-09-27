const calculatorData = {
    calculation: "0",
    result: "",
    displayedResult: false
}

const output = document.querySelector(".calculator__output")
output.textContent = calculatorData.calculation
const calculatorBtns = [...document.querySelectorAll("button[data-action]")]
const digitBtns = calculatorBtns.filter(button => /[0-9]/.test(button.getAttribute("data-action")))
// console.log(digitBtns)

const calculatorHistory = document.querySelector(".calculator__history")
digitBtns.forEach(btn => btn.addEventListener("click", handleDigits))
/** EXPLICATION :
 * Gère le clic sur un bouton numérique (0–9).
 * Met à jour l'état courant de la calculatrice et l'affichage principal.
 * Si un résultat venait d'être affiché, réinitialise l'historique et recommence un nouveau calcul.
 * Remplace les points par des virgules à l'affichage uniquement.
 *
 * @param {MouseEvent} e - Événement déclenché par le clic sur un bouton chiffre; sa cible est un HTMLButtonElement portant l'attribut data-action.
 * @returns {void}
 */
function handleDigits(e) {
    const buttonValue = e.currentTarget.getAttribute("data-action")
    // console.log(buttonValue)

    if (calculatorData.displayedResult) {
        calculatorHistory.textContent = ""
        calculatorData.calculation = ""
        calculatorData.displayedResult = false
    }
    else if (calculatorData.calculation === "0") calculatorData.calculation = ""

    calculatorData.calculation += buttonValue
    output.textContent = calculatorData.calculation.replaceAll(".", ",")
}

const operatorBtns = calculatorBtns.filter(button => /[\/+*-]/.test(button.getAttribute("data-action")))
operatorBtns.forEach(btn => btn.addEventListener("click", handleOperators))
/** EXPLICATION :
 * Gère le clic sur un opérateur (+, -, *, /).
 * Empêche les opérateurs consécutifs (hors signe « - » en début d'expression) et la saisie d'un opérateur juste après un point décimal.
 * Si un résultat est affiché, enchaîne un nouveau calcul à partir de ce résultat.
 *
 * @param {MouseEvent} e - Événement déclenché par le clic sur un bouton opérateur.
 * @returns {void}
 */
function handleOperators(e) {
    const buttonValue = e.currentTarget.getAttribute("data-action")
    
    if (calculatorData.calculation.slice(-1) === ".") return
    if (calculatorData.displayedResult) {
        calculatorHistory.textContent = ""
        calculatorData.calculation = calculatorData.result += buttonValue
        output.textContent = calculatorData.calculation.replace(".", ",")
        calculatorData.displayedResult = false
    }
    else if (calculatorData.calculation === "0" && buttonValue === "-") {
        calculatorData.calculation = "-"
        output.textContent = calculatorData.calculation
    }
    else if (/[\/+*-]/.test(calculatorData.calculation.slice(-1)) && calculatorData.calculation !== "-") {
        calculatorData.calculation = calculatorData.calculation.slice(0, -1) + buttonValue
        output.textContent = calculatorData.calculation.replaceAll(".", ",")
    }
    else if (calculatorData.calculation !== "-") {
        calculatorData.calculation += buttonValue
        output.textContent = calculatorData.calculation.replaceAll(".", ",")
    }
}

const decimalButton = document.querySelector("button[data-action='.']")
decimalButton.addEventListener("click", createDecimalNumber)
/** EXPLICATION :
 * Insère un séparateur décimal (point) dans le nombre en cours de saisie.
 * Bloque l'ajout si le dernier caractère est un opérateur ou si le nombre courant possède déjà un point.
 * Si un résultat est affiché, commence une nouvelle saisie décimale à partir de ce résultat.
 * Met à jour l'affichage en remplaçant les points par des virgules.
 *
 * @returns {void}
 */
function createDecimalNumber() {
    if (/[\/+*-]/.test(calculatorData.calculation.slice(-1))) return

    if (calculatorData.displayedResult) {
        if (/\./.test(calculatorData.result)) return

        calculatorHistory.textContent = ""
        calculatorData.calculation = calculatorData.result += "."
        output.textContent = calculatorData.calculation.replace(".", ",")
        calculatorData.displayedResult = false
        return
    }

    let lastNumberString = ""
    for (let i = calculatorData.calculation.length - 1; i >= 0; i--) {
        if (/[\/+*-]/.test(calculatorData.calculation[i])) break
        else {
            lastNumberString += calculatorData.calculation[i]
        }
    }
    // console.log(lastNumberString)
    if (!lastNumberString.includes(".")) {
        calculatorData.calculation += "."
        output.textContent = calculatorData.calculation.replaceAll(".", ",")
    }
}

const equalBtn = document.querySelector("button[data-action='=']")
equalBtn.addEventListener("click", handleEqualBtn)
/** EXPLICATION
 * Évalue l'expression courante lorsque l'utilisateur appuie sur « = ».
 * Affiche un message d'aide si l'expression se termine par un opérateur ou une virgule.
 * Sinon, calcule le résultat via {@link customEval}, met à jour l'affichage et fige l'état en tant que résultat affiché.
 *
 * @returns {void}
 */
function handleEqualBtn() {
    if (/[\/+*-,]/.test(calculatorData.calculation.slice(-1))) {
        calculatorHistory.textContent = "Terminez le calcul par un chiffre."
        setInterval(() => {
            calculatorHistory.textContent = ""
        }, 2500)
    }
    else if (!calculatorData.displayedResult) {
        calculatorData.result = customEval(calculatorData.calculation)
        output.textContent = calculatorData.result.replace(".", ",")
        calculatorHistory.textContent = calculatorData.calculation
        calculatorData.displayedResult = true
    }
}

/** EXPLICATION :
 * Évalue récursivement une expression arithmétique simple sans utiliser eval.
 * Priorise la multiplication et la division, puis l'addition et la soustraction.
 * Remplace à chaque étape une sous-expression « operande1 opérateur operande2 » par son résultat,
 * jusqu'à ce qu'il n'y ait plus d'opérateur (hors signe négatif initial). Arrondit à 5 décimales si nécessaire.
 *
 * @param {string} calculation - Expression mathématique à évaluer (ex. "12.3*4-2").
 * @returns {string} Le résultat final sous forme de chaîne (éventuellement arrondi à 5 décimales).
 */
function customEval(calculation) {
    if (!/[\/+*-]/.test(calculation.slice(1))) return calculation

    let operator
    let operatorIndex

    if (/[\/*]/.test(calculation.slice(1))) {
        for (let i = 1; i < calculation.length; i++) {
            if (/[\/*]/.test(calculation[i])) {
                operator = calculation[i]
                operatorIndex = i
                break
            }
        }
    } else if (/[+-]/.test(calculation.slice(1))) {
        for (let i = 1; i < calculation.length; i++) {
            if (/[+-]/.test(calculation[i])) {
                operator = calculation[i]
                operatorIndex = i
                break
            }
        }
    }
    // console.log(operator, operatorIndex);

    const operandsInfo = getCalulationLimitAndOperands(operatorIndex, calculation)
    // console.log(operandeInfo);
    
    const currentCalculationResult = computeResult(operator, operandsInfo)
    // console.log(currentCalculationResult);
    
    // console.log(calculation.slice(0, operandsInfo.startCharIndex));
    // console.log(currentCalculationResult);
    // console.log(calculation.slice(operandsInfo.endCharindex + 1));
    const updatedCalculation = calculation.slice(0, operandsInfo.startCharIndex) + currentCalculationResult + calculation.slice(operandsInfo.endCharindex + 1)
    // console.log(updatedCalculation);

    if (/[\/+*-]/.test(updatedCalculation.slice(1))) {
        return customEval(updatedCalculation)
    }

    if (updatedCalculation.includes(".")) {
        if (updatedCalculation.split(".")[1].length > 5) {
            return Number(updatedCalculation).toFixed(5).toString()
        }
    }

    return updatedCalculation
}

/** EXPLICATION :
 * Extrait les opérandes gauche et droite entourant un opérateur à l'index donné.
 * Parcourt la chaîne vers la droite puis vers la gauche pour identifier les limites du sous-calcul.
 *
 * @param {number} operatorIndex - Index de l'opérateur dans la chaîne "calculation".
 * @param {string} calculation - Expression complète en cours d'évaluation.
 * @returns {{leftOperand: string, rightOperand: string, startCharIndex: number, endCharindex: number}} Un objet décrivant les deux opérandes et les bornes (indices de début et de fin inclus) de la sous-expression.
 */
function getCalulationLimitAndOperands(operatorIndex, calculation) {
    let rightOperand = ""
    let endCharindex = null

    for (let i = operatorIndex + 1; i < calculation.length; i++) {
        if (i === calculation.length - 1) {
            rightOperand += calculation[i]
            endCharindex = i
        } 
        else if (/[\/+*-]/.test(calculation[i])) {
            endCharindex = i - 1
            break        
        }
        else {
            rightOperand += calculation[i]        
        }
    }

    let leftOperand = ""
    let startCharIndex = null

    for (let i = operatorIndex - 1; i >= 0; i--) {
        if (i === 0) {
            startCharIndex = 0
            leftOperand += calculation[i]
            break
        }
        else if (/[\/+*-]/.test(calculation[i])) {
            startCharIndex = i + 1
            break        
        }
        else {
            leftOperand += calculation[i]        
        }
    }

    leftOperand = leftOperand.split("").reverse().join("")

    return {
        leftOperand,
        rightOperand,
        startCharIndex,
        endCharindex
    }
}

/** EXPLICATION :
 * Calcule le résultat d'une opération binaire entre deux opérandes numériques.
 *
 * @param {"+"|"-"|"*"|"/"} operator - L'opérateur arithmétique à appliquer.
 * @param {{leftOperand: string, rightOperand: string}} operandsInfo - Objet contenant les opérandes à convertir en nombres.
 * @returns {number} Le résultat numérique du calcul.
 */
function computeResult(operator, operandsInfo) {
    let currentCalculationResult

    switch (operator) {
        case "+":
            currentCalculationResult = Number(operandsInfo.leftOperand) + Number(operandsInfo.rightOperand)
            break
        case "-":
            currentCalculationResult = Number(operandsInfo.leftOperand) - Number(operandsInfo.rightOperand)
            break
        case "*":
            currentCalculationResult = Number(operandsInfo.leftOperand) * Number(operandsInfo.rightOperand)
            break
        case "/":
            currentCalculationResult = Number(operandsInfo.leftOperand) / Number(operandsInfo.rightOperand)
            break
    }

    return currentCalculationResult
}

const resetButton = document.querySelector("button[data-action='c']")
resetButton.addEventListener("click", reset)
/** EXPLICATION :
 * Réinitialise complètement la calculatrice.
 * Restaure l'expression à "0", efface le résultat et l'historique, et met à jour l'affichage.
 *
 * @returns {void}
 */
function reset() {
    calculatorData.calculation = "0"
    calculatorData.displayedResult = false
    calculatorData.result = ""
    output.textContent = calculatorData.calculation
    calculatorHistory.textContent = ""
}

const clearEntryButton = document.querySelector("button[data-action='ce']")
clearEntryButton.addEventListener("click", clearEntry)
/** EXPLICATION :
 * Efface la dernière entrée (un caractère) sans réinitialiser le calcul entier.
 * N'agit pas si un résultat est affiché ou si l'expression vaut déjà "0".
 * Si un seul caractère reste à l'écran, remet l'expression à "0".
 *
 * @returns {void}
 */
function clearEntry() {
    if (calculatorData.displayedResult) return

    if (calculatorData.calculation === "0") return

    if (output.textContent.length === 1) {
        calculatorData.calculation = "0"
        
    } else {
        calculatorData.calculation = calculatorData.calculation.slice(0, -1)
    }

    output.textContent = calculatorData.calculation
}