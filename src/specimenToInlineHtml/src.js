module.exports = specimen => {
	const blocks = specimen.blocks || []
	const renderableBlocks = blocks.filter(block => block.lang === 'html')
	const renderableBlocksHtml = renderableBlocks.map(block => block.content).join('\n')

	return `<article>${renderableBlocksHtml}</article>`
}
