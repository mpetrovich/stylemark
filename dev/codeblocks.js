module.exports = plugin;

function plugin(options = {}) {
	return (tree, file) => {
		const { name = 'codeblocks' } = options;
		file.data[name] = getCodeBlocks(tree, options);
	};
}

function getCodeBlocks(tree, { lang = 'all', formatter = (v => v) }) {
	const blocks = [];

	for (let i = 0; i < tree.children.length; i++) {
		const child = tree.children[i];

		if (child.type === 'code' && (lang === 'all' || child.lang === lang)) {
			blocks.push({
				lang: child.lang,
				meta: child.meta,
				value: formatter(child.value)
			});
		}
	}

	return blocks;
}
