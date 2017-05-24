var rfr = require('rfr');
var expect = require('chai').expect;
var Parser = rfr('src/parser');
var fs = require('fs');

describe('A processed Markdown file', () => {
	var content = fs.readFileSync('test/input.md', 'utf8');
	var parser = new Parser();
	var syntax = 'markdown';
	var docs = parser.parse(content, syntax);

	it('should have the correct number of docs', () => expect(docs.length).to.equal(1));
	it('should have the correct doc name', () => expect(docs[0].getName()).to.equal('Button'));
	it('should have the correct doc category', () => expect(docs[0].getCategory()).to.equal('Components'));
	it('should have the correct doc meta', () => expect(docs[0].getMeta()).to.deep.equal({
		tags: ['element', 'interactive', 'form'],
		version: ['1.0.3'],
		todos: ['fix padding', 'improve colors'],
	}));
	it('should have the correct doc description', () => expect(docs[0].getDescription()).to.equal(
		fs.readFileSync('test/expected.md', 'utf8')
	));
});

describe('A processed source code file', () => {
	// @todo
	return;
});
