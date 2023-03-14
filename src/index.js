import './css/styles.css';
import { fetchCountries } from './js/fetchCountries';
import Debounce from 'lodash.debounce';
import { Notify } from 'notiflix';

const DEBOUNCE_DELAY = 300;
const refs = {
  input: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.input.addEventListener(
  'input',
  Debounce(e => {
    fetchCountries(e.target.value.trim())
      .then(data => {
        resetRenderCountries();

        if (data.length > 10) {
          Notify.info(
            'Too many matches found. Please enter a more specific name.'
          );
          // return;
        } else if (data.length > 1) {
          renderCountries(data);
          // return;
        } else if (data.length === 1) {
          rendrerCountry(data[0]);
        }
      })
      .catch(error => {
        Notify.failure(error.message);
      });
  }, DEBOUNCE_DELAY)
);

function rendrerCountry({ flags, name, capital, population, languages }) {
  const lngs = Object.values(languages).join(', ');
  const el = `
  <div class="country-container">
    <img class="country-info__flag" src="${flags.svg}" alt="${flags.alt}" />
    <h2 class="country-info__title">${name.official}</h2>
  </div>
    <p class="country-info__capital">
      <span>Capital: </span>
      ${capital}
    </p>
    <p class="country-info__population">
      <span>Population: </span>
      ${population}
    </p>
    <p class="country-info__lng">
      <span>Languages: </span>
        ${lngs}
    </p>
  `;

  refs.countryInfo.insertAdjacentHTML('beforeend', el);
}

function renderCountries(countries) {
  return countries.map(({ flags, name }) => {
    const el = `<li class="country-list__item"><div class="country-container"><img class="country-info__flag flags--small" src="${flags.svg}" alt="${flags.alt}" />
  <h2 class="country-info__title">${name.official}</h2></div></li>
  `;

    refs.countryList.insertAdjacentHTML('beforeend', el);
  });
}

function resetRenderCountries() {
  refs.countryInfo.innerHTML = '';
  refs.countryList.innerHTML = '';
}
