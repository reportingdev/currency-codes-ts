const fs = require("fs");
const xml2js = require("xml2js");
const util = require("util");

require("@gouch/to-title-case");

const outputPublishDateFile = "src/iso-4217-publish-date.ts";
const outputTypesFile = "src/types.ts";

function ingestEntry(entry) {
  return {
    code: entry.Ccy && entry.Ccy._,
    number: entry.CcyNbr && entry.CcyNbr._,
    digits: (entry.CcyMnrUnts && parseInt(entry.CcyMnrUnts._)) || 0,
    currency: entry.CcyNm && entry.CcyNm._,
    countries:
      (entry.CtryNm &&
        entry.CtryNm._ && [entry.CtryNm._.toLowerCase().toTitleCase()]) ||
      [],
    withdraval: entry.WthdrwlDt?._,
  };
}

function ingestEntries(entries) {
  const currenciesByCode = entries.map(ingestEntry).reduce(indexByCode, {});

  const currencies = Object.values(currenciesByCode).filter(function (c) {
    return !!c.code;
  });
  currencies.sort(compareCurrencyCode);

  return currencies;
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

async function processFile(name) {
  const data = await fs.promises.readFile(name);

  const parseStringP = util.promisify(xml2js.parseString);

  const result = await parseStringP(data, {
    explicitArray: false, // turn off array wrappers around content
    explicitCharkey: true, // put all content under a key so its easier to parse when there are attributes
    mergeAttrs: true, // lift attributes up so they're easier to parse
  });

  const isoRoot = result.ISO_4217;

  return {
    entries: ingestEntries(
      isoRoot.CcyTbl ? isoRoot.CcyTbl.CcyNtry : isoRoot.HstrcCcyTbl.HstrcCcyNtry
    ),
    publishDate: isoRoot.Pblshd,
  };
}

function generatePreamble(publishDate) {
  return (
    "/*\n" +
    "\tFollows ISO 4217, https://www.six-group.com/en/products-services/financial-information/data-standards.html#scrollTo=currency-codes\n" +
    "\tSee https://www.six-group.com/dam/download/financial-information/data-center/iso-currrency/lists/list-one.xml\n" +
    "and https://www.six-group.com/dam/download/financial-information/data-center/iso-currrency/lists/list-three.xml\n" +
    "\tData last updated " +
    publishDate +
    "\n" +
    "*/\n\n"
  );
}

async function writeData(countries, preamble, outputDataFile) {
  // TypeScript style export and added type
  const dataContent =
    preamble +
    'import { CurrencyCodeRecord } from "./types";\n' + // Explicitly import type
    "const data: CurrencyCodeRecord[] = " +
    JSON.stringify(countries, null, "  ") +
    ";\n" +
    "export default data;";

  await fs.promises.writeFile(outputDataFile, dataContent);

  console.log("Ingested into " + outputDataFile);
}

async function writePublishDate(publishDate, preamble) {
  const publishDateContent =
    preamble +
    "export default " +
    JSON.stringify(publishDate, null, "  ") +
    ";";

  await fs.promises.writeFile(outputPublishDateFile, publishDateContent);

  console.log("Wrote publish date to " + outputPublishDateFile);
}

async function writeTypes(entries) {
  // Prepare content for CurrencyCode type
  const currencyCodes = entries.map((c) => JSON.stringify(c.code)).join(" | ");

  // Prepare content for Country type
  const countryNames = [...new Set(entries.flatMap((c) => c.countries))]
    .map((country) => JSON.stringify(country))
    .join(" | ");

  const typesContent = `// Types generated based on ISO 4217 currency codes and countries
export type CurrencyCode = ${currencyCodes};
export type Country = ${countryNames};
export interface CurrencyCodeRecord {
  code: CurrencyCode;
  number?: string;
  digits: number;
  currency: string;
  countries: Country[];
  withdraval?: string;
}`;

  await fs.promises.writeFile(outputTypesFile, typesContent);

  console.log("Wrote TypeScript types to " + outputTypesFile);
}

async function ingest() {
  const { entries: currentEntries, publishDate } = await processFile(
    "iso-4217-list-one.xml"
  );
  const { entries: historicalEntries } = await processFile(
    "iso-4217-list-three.xml"
  );
  const allEntries = [...currentEntries, ...historicalEntries];

  const preamble = generatePreamble(publishDate);

  await writeData(currentEntries, preamble, "src/data.ts");
  await writeData(historicalEntries, preamble, "src/data-historical.ts");
  await writePublishDate(publishDate, preamble);
  await writeTypes(allEntries);
}

ingest();
