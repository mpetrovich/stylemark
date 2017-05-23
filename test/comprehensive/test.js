var rfr = require('rfr');
var expect = require('chai').expect;
var Parser = rfr('src/parser');
var fs = require('fs');
var _ = require('lodash');

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
			it('should have the correct doc name', () => expect(doc.getName()).to.equal('Tooltip'));
			it('should have the correct doc description', () => expect(doc.getDescription()).to.equal(fs.readFileSync('test/comprehensive/expected.md', 'utf8')));
			it('should have the correct number of examples', () => expect(_.size(doc.getExamples())).to.equal(4));

			describe('1st example', () => {
				var example = doc.getExamples().example;
				it('should have the correct number of code blocks', () => expect(example.codeBlocks.length).to.equal(2));
				it('should have the correct options', () => expect(example.options).to.deep.equal({}));

				describe('1st code block', () => {
					var block = example.codeBlocks[0];
					it('should have the correct syntax', () => expect(block.syntax).to.equal('html'));
					it('should have the correct hidden attribute', () => expect(block.hidden).to.equal(true));
					it('should have the correct code', () => expect(block.code).to.equal(
`<p>Tight pants next level keffiyeh <a href="#" data-toggle="tooltip" title="Default tooltip">you probably</a> haven't heard of them. Photo booth beard raw denim letterpress vegan messenger bag stumptown. Farm-to-table seitan, mcsweeney's fixie sustainable quinoa 8-bit american apparel <a href="#" data-toggle="tooltip" title="Another tooltip">have a</a> terry richardson vinyl chambray. Beard stumptown, cardigans banh mi lomo thundercats. Tofu biodiesel williamsburg marfa, four loko mcsweeney's cleanse vegan chambray. A really ironic artisan <a href="#" data-toggle="tooltip" title="Another one here too">whatever keytar</a>, scenester farm-to-table banksy Austin <a href="#" data-toggle="tooltip" title="The last tip!">twitter handle</a> freegan cred raw denim single-origin coffee viral.</p>`
					));
				});

				describe('2nd code block', () => {
					var block = example.codeBlocks[1];
					it('should have the correct syntax', () => expect(block.syntax).to.equal('js'));
					it('should have the correct hidden attribute', () => expect(block.hidden).to.equal(true));
					it('should have the correct code', () => expect(block.code).to.equal(
`$(function () {
  $('[data-toggle="tooltip"]').tooltip()
})`					));
				});
			});

			describe('2nd example', () => {
				var example = doc.getExamples().static;
				it('should have the correct number of code blocks', () => expect(example.codeBlocks.length).to.equal(1));
				it('should have the correct options', () => expect(example.options).to.deep.equal({ height: '50' }));

				describe('1st code block', () => {
					var block = example.codeBlocks[0];
					it('should have the correct syntax', () => expect(block.syntax).to.equal('html'));
					it('should have the correct hidden attribute', () => expect(block.hidden).to.equal(true));
					it('should have the correct code', () => expect(block.code).to.equal(
`<div class="tooltip left" role="tooltip">
  <div class="tooltip-arrow"></div>
  <div class="tooltip-inner">
    Tooltip on the left
  </div>
</div>
<div class="tooltip top" role="tooltip">
  <div class="tooltip-arrow"></div>
  <div class="tooltip-inner">
    Tooltip on the top
  </div>
</div>
<div class="tooltip bottom" role="tooltip">
  <div class="tooltip-arrow"></div>
  <div class="tooltip-inner">
    Tooltip on the bottom
  </div>
</div>
<div class="tooltip right" role="tooltip">
  <div class="tooltip-arrow"></div>
  <div class="tooltip-inner">
    Tooltip on the right
  </div>
</div>`
					));
				});
			});

			describe('3rd example', () => {
				var example = doc.getExamples()['static-directions'];
				it('should have the correct number of code blocks', () => expect(example.codeBlocks.length).to.equal(2));
				it('should have the correct options', () => expect(example.options).to.deep.equal({}));

				describe('1st code block', () => {
					var block = example.codeBlocks[0];
					it('should have the correct syntax', () => expect(block.syntax).to.equal('html'));
					it('should have the correct hidden attribute', () => expect(block.hidden).to.equal(false));
					it('should have the correct code', () => expect(block.code).to.equal(
`<button type="button" class="btn btn-default" data-toggle="tooltip" data-placement="left" title="Tooltip on left">Tooltip on left</button>

<button type="button" class="btn btn-default" data-toggle="tooltip" data-placement="top" title="Tooltip on top">Tooltip on top</button>

<button type="button" class="btn btn-default" data-toggle="tooltip" data-placement="bottom" title="Tooltip on bottom">Tooltip on bottom</button>

<button type="button" class="btn btn-default" data-toggle="tooltip" data-placement="right" title="Tooltip on right">Tooltip on right</button>`
					));
				});

				describe('2nd code block', () => {
					var block = example.codeBlocks[1];
					it('should have the correct syntax', () => expect(block.syntax).to.equal('js'));
					it('should have the correct hidden attribute', () => expect(block.hidden).to.equal(true));
					it('should have the correct code', () => expect(block.code).to.equal(
`$(function () {
  $('[data-toggle="tooltip"]').tooltip()
})`
					));
				});
			});
		});
	});

});
