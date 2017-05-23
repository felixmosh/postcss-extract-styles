const postcss = require('postcss');
const expect = require('chai').expect;
const fs = require('fs');
const path = require('path');

const plugin = require('../');

function readFile(relPath) {
	return fs.readFileSync(path.join(__dirname, relPath), {encoding: 'utf8'});
}

const pattern = /\[\[[^\]]+\]\]/;

const test = function (inputFile, opts, done) {
	const input = readFile(path.join('fixtures',  `${inputFile}.css`));
	const expected = readFile(path.join('expected', `${inputFile}.css`));

	postcss([plugin(opts)]).process(input).then((result) => {
		expect(result[inputFile === 'extracted' ? 'extracted' : 'css'].toString()).to.eql(expected);
		expect(result.warnings()).to.be.empty;

		done();
	}).catch((error) => {
		done(error);
	});
};

describe('postcss-extract-styles', () => {
	it('should extract styles that matches to pattern', (done) => {
		test('remove', {pattern: pattern}, done);
	});

	it('should remain only styles that matches to pattern', (done) => {
		test('extracted', {pattern: pattern}, done);
	});
});
