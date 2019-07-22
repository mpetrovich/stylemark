const visit = require('unist-util-visit');
const flatMap = require('lodash/flatMap');

module.exports = ({ filepath } = {}) => (tree, file) => {
	visit(tree, 'paragraph', (node, index, parent) => {
		const isImport = node.children[0]
			&& node.children[0].value
			&& node.children[0].value.startsWith('import ');

		if (!isImport) {
			return;
		}

		const imports = flatMap(node.children, child => child.value.split('\n'))
		const importNodes = imports.map(value => ({ type: 'import', value, filepath }))
		parent.children.splice(index, 1, ...importNodes);
	});
};
