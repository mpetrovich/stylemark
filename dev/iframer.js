const visit = require('unist-util-visit');
const is = require('hast-util-is-element');

const renderableExtensions = ['html', 'jsx'];

module.exports = (getSrc = (v => v)) => {
	return (tree, file) => {
		visit(tree, 'code', (node, index, parent) => {
			const isRenderable = renderableExtensions.some(ext => node.lang.endsWith(ext));

			if (!isRenderable) {
				return;
			}

			const src = getSrc(node.lang);
			const iframe = {
				type: 'element',
				data: {
					hName: 'iframe',
					hProperties: { src }
				}
			};

			parent.children = [].concat(
				parent.children.slice(0, index),
				iframe,
				parent.children.slice(index),
			);
		});
	};
};