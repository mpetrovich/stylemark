var rfr = require('rfr');
var expect = require('chai').expect;
var Parser = rfr('src/parser');
var fs = require('fs');

describe('Parser.parse()', function() {

	describe('with a markdown table', function() {
		var content = fs.readFileSync('test/table/input.txt', 'utf8');
		var parser = new Parser();
		var docs = parser.parse(content);

		it('should return the correct number of docs', function() {
			expect(docs.length).to.equal(1);
		});

		describe('1st doc', function() {
			var doc = docs[0];

			it('should have the correct doc name', function() {
				expect(doc.getName()).to.equal('TableTest');
			});
			it('should have the correct doc description', function() {
				expect(doc.getDescription()).to.equal(
`This is a markdown table:

Col A | Col B | Col C | Col D
--- | --- | --- | ---
Some text | **some bold** | \`some code\` | <code>{{ some code &#124; filter }}</code>

Escaped 'less than' symbols (eg. &lt;) should be automatically encoded as &lt;.
Escaped 'greater than' symbols (eg. &gt;) should be automatically encoded as &gt;.`
				);
			});
		});
	});

});
