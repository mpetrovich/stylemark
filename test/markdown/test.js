var rfr = require('rfr');
var expect = require('chai').expect;
var Parser = rfr('src/parser');
var fs = require('fs');

describe('Parser.parse() with a Markdown example', function() {
	var content = fs.readFileSync('test/markdown/input.txt', 'utf8');
	var parser = new Parser();
	var docs = parser.parse(content, 'markdown');
	var doc = docs[0];

	it('should return the correct number of docs', function() {
		expect(docs.length).to.equal(1);
	});
	it('should have the correct doc name', function() {
		expect(doc.getName()).to.equal('Welcome');
	});
	it('should have the correct doc category', function() {
		expect(doc.getCategory()).to.equal('Getting Started');
	});
	it('should have the correct doc meta', function() {
		expect(doc.getMeta()).to.eql({
			tags: ['one', 'two', 'three'],
			version: ['1.2.3'],
			todo: ['first todo', 'second todo'],
		});
	});
	it('should have the correct doc description', function() {
		expect(doc.getDescription()).to.equal(
			fs.readFileSync('test/markdown/expected.md', 'utf8')
		);
	});
});
