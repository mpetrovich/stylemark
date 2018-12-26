const visit = require('unist-util-visit');

module.exports = (options = {}) => (tree, file) => {
	const { name = 'codeblocks' } = options;
	file.data[name] = getCodeBlocks(tree, options);
};

function getCodeBlocks(tree, { lang = 'all', formatter = (v => v) } = {}) {
	const blocks = [];

	visit(tree, 'code', node => {
		if (lang === 'all' || node.lang === lang) {
			blocks.push({
				lang: node.lang,
				meta: node.meta,
				value: formatter(node.value)
			});
		}
	});

	return blocks;
}
