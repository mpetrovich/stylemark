const remove = require('unist-util-remove')

module.exports = () => (tree, file) => {
	remove(tree, node => node.type === 'code' && /\bhidden\b/.test(node.meta))
}
