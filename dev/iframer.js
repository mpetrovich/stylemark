const visit = require('unist-util-visit');
const is = require('hast-util-is-element');

const renderableExtensions = ['html', 'jsx'];

module.exports = (getSrc = (v => v)) => {
	return (tree, file) => {
		let iframeCount = 0;
		file.data.iframes = file.data.iframes || [];

		visit(tree, 'code', (node, index, parent) => {
			const isRenderable = renderableExtensions.some(ext => node.lang.endsWith(ext));

			if (!isRenderable) {
				return;
			}

			const src = getSrc(node.lang, iframeCount++);
			const iframe = {
				type: 'element',
				data: {
					hName: 'iframe',
					hProperties: { src }
				}
			};

			file.data.iframes.push(src);

			parent.children = [].concat(
				parent.children.slice(0, index),
				iframe,
				parent.children.slice(index),
			);
		});
	};
};
