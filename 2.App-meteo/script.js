/**
 * Script principal de l'application météo.
 *
 * Fonctionnement général :
 * - Récupère les données météo depuis un fichier JSON local via fetch().
 * - Active un loader pendant le chargement et gère l'affichage des erreurs si la requête échoue.
 * - Une fois les données récupérées, met à jour dynamiquement l'interface utilisateur :
 *    - Affiche le nom de la ville et du pays.
 *    - Met à jour la température.
 *    - Charge et affiche l'icône météo correspondante.
 *
 */

const loader = document.querySelector('.weather-app__loader-container');
const errorInformation = document.querySelector('.weather-app__error-info');

/** EXPLICATION :
 *  * Récupère les données météo depuis un fichier JSON local et met à jour l'UI.
 * Gère l'affichage du loader et des messages d'erreur en cas d'échec.
 */
async function getWeatherData(){
    loader.classList.add('js-loader-active')
    let data;
    try {
        const response = await fetch('./weatherAPI/weatherData.json');
        //console.log(response);
        if(!response.ok) {
            throw new Error()
        }
        data = await response.json();
    }
    catch (error) {
        //console.log(error.message);
        errorInformation.style.display = 'block';
        errorInformation.textContent = 'Une erreur est survenue lors de la récupération des données météo. 🤖';
        return;
    }
    finally {
        loader.classList.remove('js-loader-active');
    }
    //console.log(data);
    populateUI(data);
}
getWeatherData();

const cityName = document.querySelector('.weather-app__city');
const countryName = document.querySelector('.weather-app__country');
const temperature = document.querySelector('.weather-app__temp');
const infoIcon = document.querySelector('.weather-app__info-icon');

/** EXPLICATION :
 *  * Met à jour l'interface utilisateur avec les données météo.
 * @param {Array} data - Tableau contenant les informations météo.
 */
function populateUI(data) {
    cityName.textContent = data[0].city;
    countryName.textContent = data[0].country;
    temperature.textContent = `${data[0].temperature}°`;
    infoIcon.src = `assets/ressources/icons/${data[0].iconID}.svg`;
    infoIcon.style.display = 'block';
}