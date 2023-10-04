
import { find, uniq, flatten } from 'lodash-es';
import data from './data.js';
import publishDate from './iso-4217-publish-date.js';
import { CurrencyCode, CurrencyCodeRecord } from './types';

/**
 * Retrieve the currency details by its ISO 4217 code.
 *
 * @param {string} code - The ISO 4217 code of the currency.
 * @returns {CurrencyCodeRecord | undefined} - The record of the currency if found, otherwise undefined.
 */
export const code = (code: string): CurrencyCodeRecord | undefined => {
  code = code.toUpperCase();
  return find(data, c => c.code === code);
};

/**
 * Retrieve the currency details by the name of the country.
 *
 * @param {string} country - The name of the country.
 * @returns {CurrencyCodeRecord[]} - An array of currency records that match the country name.
 */
export const country = (country: string): CurrencyCodeRecord[] => {
  const lowerCountry = country.toLowerCase();
  return data.filter(({ countries }) => {
    if (!countries) return false;
    return countries.some(c => c.toLowerCase() === lowerCountry);
  });
};

/**
 * Retrieve the currency details by its ISO 4217 number.
 *
 * @param {number|string} number - The ISO 4217 number of the currency.
 * @returns {CurrencyCodeRecord | undefined} - The record of the currency if found, otherwise undefined.
 */
export const number = (number: number | string): CurrencyCodeRecord | undefined => {
  return find(data, c => c.number === String(number));
};

/**
 * Get a list of all ISO 4217 currency codes.
 *
 * @returns {CurrencyCode[]} - An array of ISO 4217 currency codes.
 */
export const codes = (): CurrencyCode[] => data.map(({ code }) => code);

/**
 * Get a list of all ISO 4217 currency numbers.
 *
 * @returns {string[]} - An array of ISO 4217 currency numbers.
 */
export const numbers = (): string[] => {
  return data
    .map(c => c.number)
    .filter(n => n !== undefined && n !== null);
};

/**
 * Get a list of all countries.
 *
 * @returns {string[]} - An array of country names.
 */
export const countries = (): string[] => {
  const countryArrays = data
    .filter((c: CurrencyCodeRecord) => c.countries)
    .map((c: CurrencyCodeRecord) => c.countries);
  return uniq(flatten(countryArrays));
};


export default {
  code,
  country,
  number,
  codes,
  numbers,
  countries,
  publishDate,
  data
};
