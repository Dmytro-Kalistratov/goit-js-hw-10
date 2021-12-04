import './css/styles.css';
import Notiflix from 'notiflix';
import { fetchCountries } from './giveMeCountry';

const debounce = require('lodash.debounce');
const DEBOUNCE_DELAY = 300;

const countryListEl = document.querySelector('.country-list');
const countryInfoEl = document.querySelector('.country-info');
const countryInput = document.querySelector('#search-box');

const onCountryInput = () => {
    const trimCountryinput = countryInput.value.trim();
    if (trimCountryinput !== "") {
        fetchCountries(trimCountryinput)
            .then((responseJSON) => {
                if (responseJSON.length > 10) {
                    Notiflix.Notify.info("Too many matches found. Please enter a more specific name.");
                    return;
                }
                if (responseJSON.length >= 2 && responseJSON.length <= 10) {
                    console.log(responseJSON)
                    return;
                }
                if (responseJSON.length === 1) {

                    countryInfoEl.innerHTML = "";
                    countryInfoEl.insertAdjacentHTML("beforeend", createMarkup(responseJSON));
                    return;
                };
            })
            .catch((error) => Notiflix.Notify.failure("Oops, there is no country with that name"));
    };
};

function createMarkup(responseJSON) {
    const countryMarkup = responseJSON.map((country) =>
        `<li class="list-item">${country.name.official}</li>
        <li class="list-item">${country.capital}</li>
        <li class="list-item">${country.population}</li>
        <li class="list-item"><img src="${country.flags.svg}" alt="Country flag" width="150"></li>
        <li class="list-item">${Object.values(country.languages).join(", ")}</li>
        `)
        .join('');
    
    console.log(responseJSON);

    return countryMarkup;
};

countryInput.addEventListener('input', debounce(onCountryInput, DEBOUNCE_DELAY));