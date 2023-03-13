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
    console.log(e.target.value.trim());
  }, DEBOUNCE_DELAY)
);

fetchCountries('q')
  .then(data => {
    if (data.length > 10) {
      Notify.info('Too many matches found. Please enter a more specific name.');
      return;
    }

    if (data.length >= 2) {
      return;
    }
    console.log('data', data);
  })
  .catch(error => {
    Notify.failure(error.message);
  });
