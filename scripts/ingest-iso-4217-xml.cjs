const fs = require('fs');
const xml2js = require('xml2js');

require('@gouch/to-title-case');

const input = 'iso-4217-list-one.xml';
const outputDataFile = 'src/data.ts';
const outputPublishDateFile = 'src/iso-4217-publish-date.ts';
const outputTypesFile = 'src/types.ts';


function ingestEntry(entry) {
  return {
    code: entry.Ccy && entry.Ccy._,
    number: entry.CcyNbr && entry.CcyNbr._,
    digits: (entry.CcyMnrUnts && parseInt(entry.CcyMnrUnts._)) || 0,
    currency: entry.CcyNm && entry.CcyNm._,
    countries: (entry.CtryNm && entry.CtryNm._ && [entry.CtryNm._.toLowerCase().toTitleCase()]) || []
  };
}

function indexByCode(index, c) {
  if (!index[c.code]) {
    index[c.code] = c;
  } else {
    index[c.code].countries = index[c.code].countries.concat(c.countries);
  }
  return index;
}

function compareCurrencyCode(a, b) {
  return a.code.localeCompare(b.code);
}

function ingestEntries(data) {
  const currenciesByCode = data.ISO_4217.CcyTbl.CcyNtry
    .map(ingestEntry)
    .reduce(indexByCode, {});

  const currencies = Object.values(currenciesByCode).filter(function (c) { return !!c.code; });
  currencies.sort(compareCurrencyCode);

  return currencies;
}

function ingestPublishDate(data) {
  return data.ISO_4217.Pblshd;
}

function failOnError(err) {
  if (err) {
    console.error(err);
    process.exit(1);
  }
}

fs.readFile(input, function (err, data) {
  failOnError(err);

  xml2js.parseString(
    data,
    {
      explicitArray: false,  // turn off array wrappers around content
      explicitCharkey: true, // put all content under a key so its easier to parse when there are attributes
      mergeAttrs: true       // lift attributes up so they're easier to parse
    },
    function (err, result) {
      failOnError(err);

      const publishDate = ingestPublishDate(result);
      const countries = ingestEntries(result);

      // Prepare content for CurrencyCode type
      const currencyCodes = countries.map(c => JSON.stringify(c.code)).join(' | ');

      // Prepare content for Country type
      const countryNames = [...new Set(countries.flatMap(c => c.countries))]
        .map(country => JSON.stringify(country))
        .join(' | ');

      const typesContent = `// Types generated based on ISO 4217 currency codes and countries
export type CurrencyCode = ${currencyCodes};
export type Country = ${countryNames};
export interface CurrencyCodeRecord {
  code: CurrencyCode;
  number: string;
  digits: number;
  currency: string;
  countries: Country[];
}`;

      const preamble = '/*\n' +
        '\tFollows ISO 4217, https://www.six-group.com/en/products-services/financial-information/data-standards.html#scrollTo=currency-codes\n' +
        '\tSee https://www.six-group.com/dam/download/financial-information/data-center/iso-currrency/lists/list-one.xml\n' +
        '\tData last updated ' + publishDate + '\n' +
        '*/\n\n';

      // TypeScript style export and added type
      const dataContent = preamble +
        'import { CurrencyCodeRecord } from "./types";\n' + // Explicitly import type
        'const data: CurrencyCodeRecord[] = ' + JSON.stringify(countries, null, '  ') + ';\n' +
        'export default data;';

      const publishDateContent = preamble +
      'export default ' + JSON.stringify(publishDate, null, '  ') + ';';

      fs.writeFile(outputDataFile, dataContent, function (err) {
        failOnError(err);

        console.log('Ingested ' + input + ' into ' + outputDataFile);
      });

      fs.writeFile(outputPublishDateFile, publishDateContent, function (err) {
        failOnError(err);

        console.log('Wrote publish date to ' + outputPublishDateFile);
      });

      // Write the types to types.ts
      fs.writeFile(outputTypesFile, typesContent, function (err) {
        failOnError(err);

        console.log('Wrote TypeScript types to ' + outputTypesFile);
      });
    });
});
