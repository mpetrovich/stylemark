var rfr = require('rfr');
var expect = require('chai').expect;
var Parser = rfr('src/parser');
var fs = require('fs');

describe('Parser', function() {

	describe('parse()', function() {

		describe('with multiple docs', function() {
			var content = fs.readFileSync('test/multiple/input.txt', 'utf8');
			var parser = new Parser();
			var docs = parser.parse(content);

			it('should return the correct number of docs', function() {
				expect( docs.length ).to.equal(2);
			});

			describe('1st doc', function() {
				var doc = docs[0];

				it('should have the correct doc name', function() {
					expect( doc.getName() ).to.equal('PatternA');
				});
				it('should have the correct category', function() {
					expect( doc.getCategory() ).to.equal('Foos & Bars');
				});
				it('should have the correct meta version', function() {
					expect( doc.getMeta().version ).to.deep.equal(['1.0.3']);
				});
				it('should have the correct doc description', function() {
					expect( doc.getDescription() ).to.equal(
						fs.readFileSync('test/multiple/expected-1.md', 'utf8')
					);
				});
				it('should have the correct todos', function() {
					expect( doc.getMeta().todo ).to.deep.equal(['First todo', 'Another future task']);
				});
			});

			describe('2nd doc', function() {
				var doc = docs[1];

				it('should have the correct doc name', function() {
					expect( doc.getName() ).to.equal('PatternB');
				});
				it('should have the correct meta version', function() {
					expect( doc.getMeta().version ).to.deep.equal(['0.2.4']);
				});
				it('should have the correct doc description', function() {
					expect( doc.getDescription() ).to.equal(
						fs.readFileSync('test/multiple/expected-2.md', 'utf8')
					);
				});
				it('should have the correct todos', function() {
					expect( doc.getMeta().todo ).to.deep.equal(['Some future task']);
				});
				it('should have the correct deprecation message', function() {
					expect( doc.getMeta().deprecated ).to.deep.equal(['Use PatternA instead']);
				});
			});
		});

	});

});
