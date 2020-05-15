export const currencies = [
  '$',
  '£',
  '€',
  'zł',
  'CHF',
  'RUB',
  'SEK',
  'NOK'];

export const Currency = (countryCode: string) => {
  const getCountry = countryCode.substr(3, 2);
  let currency = currencies[2];
  switch(getCountry) {
    case 'US':
      currency = currencies[0];
      break;
    case 'UK':
      currency = currencies[1];
      break;
    case 'PL':
      currency = currencies[3];
      break;
    case 'CH':
      currency = currencies[4];
      break;
    case 'RU':
      currency = currencies[5];
      break;
    case 'SE':
      currency = currencies[6];
      break;
    case 'NO':
      currency = currencies[7];
      break;
  }
  return currency;
};
