var rfr = require('rfr');
var expect = require('chai').expect;
var Parser = rfr('src/parser');
var fs = require('fs');

describe('Parser.parse()', function() {

	describe('with inline examples in the description', function() {
		var content = fs.readFileSync('test/comprehensive/input.txt', 'utf8');
		var parser = new Parser();
		var docs = parser.parse(content);

		it('should return the correct number of docs', function() {
			expect(docs.length).to.equal(1);
		});

		describe('1st doc', function() {
			var doc = docs[0];

			it('should have the correct doc name', function() {
				expect(doc.getName()).to.equal('Tooltip');
			});
			it('should have the correct doc description', function() {
				expect(doc.getDescription()).to.equal(
					fs.readFileSync('test/comprehensive/expected.md', 'utf8')
				);
			});
		});
	});

});
