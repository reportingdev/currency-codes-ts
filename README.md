# Currency Codes TS

A TypeScript library for ISO 4217 currency codes. Efficiently lookup and validate currency codes, retrieve associated countries, and more.

This library is inspired by and originally forked from [currency-codes](https://github.com/freeall/currency-codes). This version adds TypeScript support and will be periodically updated with the latest currency data.

## Installation

```bash
npm install currency-codes-ts
```

## Examples

Here's how you can use the library:

#### Code lookup

```typescript
import { codes } from 'currency-codes-ts';

// get currency details
const euroInfo: CurrencyCodeRecord = codes('EUR');
console.log(euroInfo);  

/*
  {
    code: 'EUR',
    number: '978',
    digits: 2,
    currency: 'Euro',
    countries: [
      'Åland Islands', 'Andorra', 'Austria', 'Belgium', 'Croatia',
      'Cyprus', 'Estonia', 'European Union', 'Finland', 'France',
      'French Guiana', 'French Southern Territories (The)', 'Germany',
      'Greece', 'Guadeloupe', 'Holy See (The)', 'Ireland', 'Italy',
      'Latvia', 'Lithuania', 'Luxembourg', 'Malta', 'Martinique',
      'Mayotte', 'Monaco', 'Montenegro', 'Netherlands (The)',
      'Portugal', 'Réunion', 'Saint Barthélemy', 'Saint Martin (French Part)',
      'Saint Pierre and Miquelon', 'San Marino', 'Slovakia', 'Slovenia',
      'Spain'
    ]
  }
*/
```

#### Number Lookup

```typescript
import { number } from 'currency-codes-ts';

console.log(number(967));

/*
  {
    code: 'ZMW',
    number: '967',
    digits: 2,
    currency: 'Zambian Kwacha',
    countries: [ 'Zambia' ]
  }
*/
```

#### Country Lookup

```typescript
import { country } from 'currency-codes-ts';

console.log(country('Columbia'));

/*
  [
    {
      code: 'COP',
      number: '170',
      digits: 2,
      currency: 'Colombian Peso',
      countries: [ 'Colombia' ]
    },
    {
      code: 'COU',
      number: '970',
      digits: 2,
      currency: 'Unidad de Valor Real',
      countries: [ 'Colombia' ]
    }
  ]
*/
```

#### Get all Currency Codes

```typescript
import { codes } from 'currency-codes-ts';

console.log(codes());

/*
  [
    'AED',
    'AFN',
    ...
    'ZAR',
    'ZMW'
  ]
*/
```

#### Get all Currency Numbers

```typescript
import { numbers } from 'currency-codes-ts';

console.log(numbers());

/*
[
	'784',
	'971',
	...
	'710',
	'967'
]
*/
```

#### Get all Countries

```typescript
import { countries } from 'currency-codes-ts';

console.log(countries());

/*
[ 
	'united arab emirates',
	'afghanistan',
	...
]
*/
```

#### Get all currency records

```typescript
import { data } from 'currency-codes-ts';

console.log(data);

/*
[{
	code: 'AED',
	number: '784',
	digits: 2,
	currency: 'United Arab Emirates dirham',
	countries: ['united arab emirates']
}, {
	code: 'AFN',
	number: '971',
	digits: 2,
	currency: 'Afghan afghani',
	countries: ['afghanistan']
}, {
	...
}]
*/
```

## Functions

- `code(code: string)`: Returns a `CurrencyCodeRecord` object based on ISO 4217 currency code. Returns `undefined` if not found.
- `country(country: string)`: Returns an array of `CurrencyCodeRecord` objects used in the given country.
- `number(number: number | string)`: Returns a `CurrencyCodeRecord` object based on ISO 4217 currency number. Returns `undefined` if not found.
- `codes()`: Returns an array of ISO 4217 currency codes.
- `numbers()`: Returns an array of ISO 4217 currency numbers.
- `countries()`: Returns an array of country names.

## Properties
- `data`: Returns a `CurrencyCodeRecord[]` array containing all the available currency records.
- `publishDate`: Returns the ISO formatted date the currencies were last updated.

## Types

- `CurrencyCodeRecord`: Defines the object returned on currency lookup. Includes properties like `currency`, `code`, `countries`, and `digits`.

```typescript
interface CurrencyCodeRecord {
  code: CurrencyCode;
  number: string;
  digits: number;
  currency: string;
  countries: Country[];
}
```

- `CurrencyCode`: The three-letter ISO 4217 code representing a currency (e.g., USD, EUR).

```typescript
type CurrencyCode = "AED" | "AFN" | "ALL" | "AMD" | "[...]" | "ZMW" | "ZWL";
```

- `Country`: A string representing the name of a country.

```typescript
type Country = "United Arab Emirates (The)" | "Afghanistan" | "Albania" | "Armenia" | "[...]" | "Zambia" | "Zimbabwe";
```

## Contributing

You can update the package with the latest currency data by running 
```bash 
npm run iso
```
This will update the `data.ts` and `types.ts` file based on the ingested data.

To build simply run `tsc`. This will create a build in the `dist/` folder.

For contributions feel free to raise issues and pull requests.

## License

MIT
