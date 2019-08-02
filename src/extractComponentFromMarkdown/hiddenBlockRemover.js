const remove = require('unist-util-remove')

module.exports = () => (tree, file) => {
	remove(tree, node => /\bhidden\b/.test(node.meta))
}
