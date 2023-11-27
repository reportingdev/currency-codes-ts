import { find, uniq, flatten } from "lodash-es";
import data from "./data.js";
import dataHistorical from "./data-historical.js";
import publishDate from "./iso-4217-publish-date.js";
import { CurrencyCode, CurrencyCodeRecord } from "./types";

export type CurrencyOptions = {
  historical?: boolean;
};

const resolveRecords = ({ historical = false }: CurrencyOptions = {}) => {
  if (historical) {
    return [...data, ...dataHistorical];
  } else {
    return data;
  }
};

/**
 * Retrieve the currency details by its ISO 4217 code.
 *
 * @param {string} code - The ISO 4217 code of the currency.
 * @returns {CurrencyCodeRecord | undefined} - The record of the currency if found, otherwise undefined.
 */
export const code = (
  code: string,
  options?: CurrencyOptions
): CurrencyCodeRecord | undefined => {
  code = code.toUpperCase();
  const records = resolveRecords(options);

  return find(records, (c) => c.code === code);
};

/**
 * Retrieve the currency details by the name of the country.
 *
 * @param {string} country - The name of the country.
 * @returns {CurrencyCodeRecord[]} - An array of currency records that match the country name.
 */
export const country = (
  country: string,
  options?: CurrencyOptions
): CurrencyCodeRecord[] => {
  const lowerCountry = country.toLowerCase();
  const records = resolveRecords(options);

  return records.filter(({ countries }) => {
    if (!countries) return false;
    return countries.some((c) => c.toLowerCase() === lowerCountry);
  });
};

/**
 * Retrieve the currency details by its ISO 4217 number.
 *
 * @param {number|string} number - The ISO 4217 number of the currency.
 * @returns {CurrencyCodeRecord | undefined} - The record of the currency if found, otherwise undefined.
 */
export const number = (
  number: number | string,
  options?: CurrencyOptions
): CurrencyCodeRecord | undefined => {
  const records = resolveRecords(options);

  return find(records, (c) => c.number === String(number));
};

/**
 * Get a list of all ISO 4217 currency codes.
 *
 * @returns {CurrencyCode[]} - An array of ISO 4217 currency codes.
 */
export const codes = (options?: CurrencyOptions): CurrencyCode[] => {
  const records = resolveRecords(options);

  return records.map(({ code }) => code);
};

/**
 * Get a list of all ISO 4217 currency numbers.
 *
 * @returns {string[]} - An array of ISO 4217 currency numbers.
 */
export const numbers = (options?: CurrencyOptions): string[] => {
  const records = resolveRecords(options);

  return records
    .map((c) => c.number)
    .filter((n) => n !== undefined && n !== null) as string[];
};

/**
 * Get a list of all countries.
 *
 * @returns {string[]} - An array of country names.
 */
export const countries = (options?: CurrencyOptions): string[] => {
  const records = resolveRecords(options);

  const countryArrays = records
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
  data,
  dataHistorical,
};
