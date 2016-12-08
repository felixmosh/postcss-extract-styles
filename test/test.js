var postcss = require('postcss');
var expect = require('chai').expect;
var fs = require('fs');
var path = require('path');

var plugin = require('../');

function readFile(relPath) {
	return fs.readFileSync(path.join(__dirname, relPath), {encoding: 'utf8'});
}

var pattern = /\[\[[^\]]+\]\]/;

var test = function (inputFile, opts, done) {
	var input = readFile(path.join('fixtures', inputFile + '.css'));
	var expected = readFile(path.join('expected', inputFile + '.css'));

	postcss([plugin(opts)]).process(input).then(function (result) {
		expect(result[inputFile === 'extracted' ? 'extracted' : 'css'].toString()).to.eql(expected);
		expect(result.warnings()).to.be.empty;

		done();
	}).catch(function (error) {
		done(error);
	});
};

describe('postcss-extract-styles', function () {
	it('should extract styles that matches to pattern', function (done) {
		test('remove', {pattern: pattern}, done);
	});

	it('should remain only styles that matches to pattern', function (done) {
		test('extracted', {pattern: pattern}, done);
	});
});
