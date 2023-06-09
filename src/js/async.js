import '../css/styles.css';
import Debounce from 'lodash.debounce';
import { Notify } from 'notiflix';

const DEBOUNCE_DELAY = 300;
const refs = {
  input: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

async function fetchAsyncCountries(name) {
  resetRenderCountries();
  const API_URL = 'https://restcountries.com/v3.1/name/';
  try {
    const response = await fetch(
      `${API_URL}${name}?fields=name,capital,population,languages,flags`
    );
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Oops, there is no country with that name');
      } else {
        throw new Error('Oops, something went wrong!');
      }
    }
    const data = await response.json();

    if (data.length > 10) {
      Notify.info('Too many matches found. Please enter a more specific name.');
    } else if (data.length > 1) {
      renderCountries(data);
    } else if (data.length === 1) {
      renderCountry(data[0]);
    }
  } catch (error) {
    Notify.failure(error.message);
  }
}

function renderCountry({ flags, name, capital, population, languages }) {
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
  const elements = countries.map(({ flags, name }) => {
    return `
    <li class="country-list__item">
      <div class="country-container">
        <img class="country-info__flag flags--small" src="${flags.svg}" alt="${flags.alt}" />
        <h2 class="country-info__title">${name.official}</h2>
      </div>
    </li>
  `;
  });

  refs.countryList.innerHTML = elements.join('');
}

function resetRenderCountries() {
  refs.countryInfo.innerHTML = refs.countryList.innerHTML = '';
}

function handleSearchInput(e) {
  fetchAsyncCountries(e.target.value.trim());
}

refs.input.addEventListener(
  'input',
  Debounce(e => handleSearchInput(e), DEBOUNCE_DELAY)
);
