const path = require('path');
const fs = require('fs');
const globby = require('globby');
const flatMap = require('lodash/flatMap');

const unified = require('unified');
const markdownParser = require('remark-parse');
const codeBlockParser = require('./codeblocks');
const frontmatterParser = require('remark-frontmatter');
const frontmatterExtractor = require('remark-extract-frontmatter');
const yaml = require('yaml').parse;
const remark2rehype = require('remark-rehype');
const htmlRenderer = require('rehype-stringify');

(async function() {
	try {
		const inputGlobs = process.argv[2];
		const outputDir = process.argv[3];
		const filepaths = await getFilepaths(inputGlobs);
		const docs = flatMap(filepaths, filepath => {
			const contents = extractDocContents(filepath);
			const docs = contents.map(content => docFactory(content, filepath));
			return docs;
		});
		docs.forEach(doc => writeDoc(outputDir, doc));
	}
	catch (error) {
		console.log(error);
	}
})();

async function getFilepaths(globs) {
	const filepaths = await globby(globs);
	return filepaths.map(filepath => path.resolve(filepath));
}

function extractDocContents(filepath) {
	const fileContent = fs.readFileSync(filepath, 'utf8');
	const isMarkdown = filepath.endsWith('.md') || filepath.endsWith('.markdown');
	return isMarkdown ? [fileContent] : getDocBlocks(fileContent);
}

function getDocBlocks(fileContent) {
	const docBlocks = fileContent.match(/\/\*[\s\S]+?\*\//g);  // Extracts whole docblock including comment tags: /* … */
	return docBlocks.map(docBlock => docBlock
		.replace(/^\/[*]+\s*/, '')  // Removes opening comment tag: /*
		.replace(/\*\/$/, '')  // Removes closing comment tag: */
	);
}

function docFactory(markdown, filepath) {
	const rendered = unified()
		.use(markdownParser)
		.use(frontmatterParser)
		.use(codeBlockParser, { name: 'blocks' })
		.use(frontmatterExtractor, { name: 'meta', yaml })
		.use(remark2rehype)
		.use(htmlRenderer)
		.processSync(markdown);

	const html = rendered.toString();
	const { meta, blocks } = rendered.data;
	const id = meta.category + '-' + meta.name;

	return { id, filepath, meta, markdown, html, blocks };
}

function writeDoc(outputDir, doc) {
	fs.writeFileSync(path.resolve(outputDir, `${doc.id}.html`), doc.html, 'utf8');
}
