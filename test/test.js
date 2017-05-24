var rfr = require('rfr');
var path = require('path');
var expect = require('chai').expect;
var Parser = rfr('src/parser');
var fs = require('fs');

describe('A processed Markdown file', () => {
	var filepath = 'test/input.md';
	var content = fs.readFileSync(filepath, 'utf8');
	var parser = new Parser();
	var syntax = path.extname(filepath).substr(1);
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
	var filepath = 'test/input.css';
	var content = fs.readFileSync(filepath, 'utf8');
	var parser = new Parser();
	var syntax = path.extname(filepath).substr(1);
	var docs = parser.parse(content, syntax);

	it('should have the correct number of docs', () => expect(docs.length).to.equal(2));

	describe('First doc', () => {
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

	describe('Second doc', () => {
		it('should have the correct doc name', () => expect(docs[1].getName()).to.equal('Link'));
		it('should have the correct doc category', () => expect(docs[1].getCategory()).to.equal('Text'));
		it('should have the correct doc meta', () => expect(docs[1].getMeta()).to.deep.equal({}));
		it('should have the correct doc description', () => expect(docs[1].getDescription()).to.equal(
			fs.readFileSync('test/expected-2.md', 'utf8')
		));
	});
});
