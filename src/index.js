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
                countryInfoEl.innerHTML = "";
                countryListEl.innerHTML = "";
                
                if (responseJSON.length > 10) {
                    Notiflix.Notify.info("Too many matches found. Please enter a more specific name.");

                    return;
                }
                if (responseJSON.length >= 2 && responseJSON.length <= 10) {

                    countryListEl.insertAdjacentHTML("beforeend", showCountryList(responseJSON))
                    return;
                }
                if (responseJSON.length === 1) {

                    countryInfoEl.insertAdjacentHTML("beforeend", showCountryInfo(responseJSON));
                    return;
                };
            })
            .catch((error) => Notiflix.Notify.failure("Oops, there is no country with that name"));
    };
};

function showCountryInfo(responseJSON) {
    const countryInfoMarkup = responseJSON.map((country) =>
        `<h2>${country.name.official}</h2>
        <p>Capital: ${country.capital}</p>
        <p>Population: ${country.population}</p>
        <img src="${country.flags.svg}" alt="Country flag" width="150">
        <p>Languages: ${Object.values(country.languages).join(", ")}</p>
        `)
        .join('');

    return countryInfoMarkup;
};

function showCountryList(responseJSON) {
    let countryListMarkup = responseJSON.reduce((countryListMarkup, country) =>
        countryListMarkup +
        `<li class="country-list__elem"><img src="${country.flags.svg}" alt="Country flag" width="30" heigth="30"> <h2>${country.name.official}</h2></li>`, "");

    return countryListMarkup;
};

countryInput.addEventListener('input', debounce(onCountryInput, DEBOUNCE_DELAY));