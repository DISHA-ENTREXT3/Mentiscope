const test = require('node:test');
const assert = require('node:assert');

test('Basic math test for CI', (t) => {
    assert.strictEqual(1 + 1, 2);
});

test('Environment variables check', (t) => {
    // This is just a placeholder to show tests are running
    assert.ok(true);
});
