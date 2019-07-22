const path = require('path');
const fs = require('fs-extra');
const globby = require('globby');
const flatMap = require('lodash/flatMap');
const unified = require('unified');
const markdownParser = require('remark-parse');
const codeblockExtractor = require('./plugins/codeblockExtractor');
const codeblockWriter = require('./plugins/codeblockWriter');
const iframePlugin = require('./plugins/iframe');
const importPlugin = require('./plugins/import');
const frontmatterParser = require('remark-frontmatter');
const frontmatterExtractor = require('remark-extract-frontmatter');
const yaml = require('yaml').parse;
const remark2rehype = require('remark-rehype');
const htmlRenderer = require('rehype-stringify');
const visit = require('unist-util-visit');
const removeNode = require('unist-util-remove');
const is = require('hast-util-is-element');
const webpack = require('webpack');

const filenameRegex = /(.+)\.([^.]+)$/;  // Matches `<filename>.<extension>`

(async function() {
	try {
		const inputGlobs = process.argv[2];
		const outputPath = process.argv[3];
		generate(inputGlobs, outputPath);
	}
	catch (error) {
		console.log(error);
	}
})();

async function generate(inputGlobs, outputPath) {
	const filepaths = await getFilepaths(inputGlobs);
	flatMap(filepaths, filepath => {
		const contents = extractDocContents(filepath);
		contents.forEach(content => generateDoc(content, filepath, outputPath));
	});
}

async function getFilepaths(globs) {
	const filepaths = await globby(globs);
	return filepaths.map(filepath => path.resolve(filepath));
}

function extractDocContents(filepath) {
	const fileContent = fs.readFileSync(filepath, 'utf8');
	const isMarkdown = filepath.endsWith('.md') || filepath.endsWith('.markdown');  // @todo Make configurable
	return isMarkdown ? [fileContent] : extractDocBlocks(fileContent);
}

function extractDocBlocks(fileContent) {
	const commentBlocks = fileContent.match(/\/\*[\s\S]+?\*\//g);  // Extracts whole block comment including comment tags: /* … */
	const docBlocks = commentBlocks.map(commentBlock => commentBlock
		.replace(/^\/[*]+\s*/, '')  // Removes opening comment tag: /*
		.replace(/\*\/$/, '')  // Removes closing comment tag: */
	);
	return docBlocks;
}

function isRenderable(filename) {
	return ['.html', '.jsx'].some(extension => filename.endsWith(extension));
}

async function generateDoc(markdown, filepath, outputPath) {
	const result = unified()
		.use(markdownParser)
		.use(frontmatterParser)
		.use(frontmatterExtractor, { name: 'meta', yaml })
		// .use(importPlugin, { filepath })
		.use(codeblockExtractor)
		.use(codeblockWriter, { outputPath })
		.use(iframePlugin, { isRenderable, outputPath })
		.use(remark2rehype)
		// .use(() => (tree, file) => { removeNode(tree, 'comment') })
		.use(htmlRenderer)
		.processSync(markdown)

	const indexPath = path.resolve(outputPath, `${result.data.meta.category}.${result.data.meta.name}.html`);
	const indexHtml = result.toString();
	fs.outputFileSync(indexPath, indexHtml, 'utf8');
}
