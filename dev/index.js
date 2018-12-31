const path = require('path');
const fs = require('fs-extra');
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
const visit = require('unist-util-visit');
const is = require('hast-util-is-element');

(async function() {
	try {
		const inputGlobs = process.argv[2];
		const outputDir = process.argv[3];
		generate(inputGlobs, outputDir);
	}
	catch (error) {
		console.log(error);
	}
})();

async function generate(inputGlobs, outputDir) {
	const filepaths = await getFilepaths(inputGlobs);
	const docs = flatMap(filepaths, filepath => {
		const contents = extractDocContents(filepath);
		const docs = contents.map(content => createDoc(content, filepath));
		return docs;
	});
	docs.forEach(doc => htmlDocWriter(doc, outputDir));
}

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

function createDoc(markdown, filepath) {
	const { meta, blocks } = unified()
		.use(markdownParser)
		.use(frontmatterParser)
		.use(frontmatterExtractor, { name: 'meta', yaml })
		.use(codeBlockParser, { name: 'blocks' })
		.use(remark2rehype)
		.use(htmlRenderer)
		.processSync(markdown)
		.data;
	const id = meta.category + '.' + meta.name;

	return { id, filepath, meta, blocks, markdown };
}

async function htmlDocWriter(doc, outputDir) {
	const renderableExtensions = ['html', 'jsx'];
	const filenameRegex = /.+\.[^.]+$/;
	const iframes = [];

	const html = unified()
		.use(markdownParser)
		.use(() => (tree, file) => {
			visit(tree, 'code', (node, index, parent) => {
				const filename = node.lang;
				const isFileblock = filename && filenameRegex.test(filename);

				if (!isFileblock) {
					return;
				}

				const isRenderable = renderableExtensions.some(ext => filename.endsWith(ext));

				if (!isRenderable) {
					return;
				}

				const src = `examples/${doc.id}/${iframes.length+1}-${filename}`;
				const iframe = {
					type: 'element',
					data: {
						hName: 'iframe',
						hProperties: { src }
					}
				};

				iframes.push(src);

				parent.children = [].concat(
					parent.children.slice(0, index),
					iframe,
					parent.children.slice(index),
				);
			});
		})
		.use(remark2rehype)
		.use(htmlRenderer)
		.processSync(doc.markdown)
		.toString();

	await fs.outputFile(path.resolve(outputDir, `${doc.id}.html`), html, 'utf8');
	iframes.forEach(async src => {
		await fs.outputFile(path.resolve(outputDir, src), `iframe content for ${src}`, 'utf8');
	});
}
