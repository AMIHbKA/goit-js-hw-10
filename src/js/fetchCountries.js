export function fetchCountries(name) {
  const API_URL = 'https://restcountries.com/v3.1/name/';
  return fetch(
    `${API_URL}${name}?fields=name,capital,population,languages,flags`
  ).then(response => {
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Oops, there is no country with that name');
      } else {
        throw new Error('Oops, something went wrong!');
      }
    }

    return response.json();
  });
}
