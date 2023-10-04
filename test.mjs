import cc from './dist/index.js'
import assert from 'assert';

// default export
assert.strictEqual(cc.code('EUR')?.countries.length, 36);
assert.strictEqual(cc.code('IDR')?.digits, 2);
assert.strictEqual(cc.number('967')?.currency, 'Zambian Kwacha');
assert.strictEqual(cc.number(967)?.currency, 'Zambian Kwacha');
assert.strictEqual(cc.country('Colombia').length, 2);
assert.strictEqual(cc.country('colombia').length, 2);
assert.strictEqual(cc.codes().length, 180);
assert.strictEqual(cc.countries().length, 260);
assert.strictEqual(cc.numbers().length, 180);
assert.strictEqual(cc.numbers()[0], '784');
assert.strictEqual(cc.data.length, 180);

console.log('tests passed 🎉');
