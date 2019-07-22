const path = require('path');
const fs = require('fs-extra');
const visit = require('unist-util-visit');
const filter = require('lodash/filter');
const Handlebars = require('../handlebars');

const filenameRegex = /(.+)\.([^.]+)$/;  // Matches `<filename>.<extension>`
const iframeTemplateFilepath = path.resolve(__dirname, '../iframe.html');
const iframeTemplate = Handlebars.compile(fs.readFileSync(iframeTemplateFilepath, 'utf8'));

module.exports = ({ isRenderable = () => true, outputPath }) => (tree, file) => {
	let iframeCount = 0;
	const codeblocksByFilename = {};

	// Inserts an <iframe> node before a renderable block
	visit(tree, 'code', (node, index, parent) => {
		const filename = node.lang;
		const isFileblock = filename && filenameRegex.test(filename);

		if (!isFileblock) {
			return;
		}

		if (!isRenderable(filename)) {
			return;
		}

		const src = `examples/${file.data.meta.category}/${file.data.meta.name}/${++iframeCount}-${filename}`

		const iframeNode = {
			type: 'element',
			data: {
				hName: 'iframe',
				hProperties: { src }
			}
		};
		parent.children = [].concat(
			parent.children.slice(0, index),
			iframeNode,
			parent.children.slice(index),
		);

		const codeblocksForFilename = filter(file.data.codeblocks, { path: filename });
		const templateData = { ...file.data, codeblocks: codeblocksForFilename };
		const templateContent = iframeTemplate(templateData);
		fs.outputFileSync(path.resolve(outputPath, src), templateContent, 'utf8');
	});
}
