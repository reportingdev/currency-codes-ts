import {CurrencyCode, Country} from './types';

declare module "currency-codes" {
  export interface CurrencyCodeRecord {
    code: CurrencyCode;
    number: string;
    digits: number;
    currency: string;
    countries: Country[];
  }

  export function code(code: string): CurrencyCodeRecord | undefined;

  export function country(country: Country): CurrencyCodeRecord[];

  export function number(number: string): CurrencyCodeRecord | undefined;

  export function codes(): CurrencyCode[];

  export function numbers(): number[];

  export function countries(): Country[];

  export const publishDate: string;

  export const data: CurrencyCodeRecord[];
}
