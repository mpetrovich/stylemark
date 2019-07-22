const fs = require('fs-extra');

module.exports = ({ outputPath }) => (tree, file) => {
	outputPath = outputPath.endsWith('/') ? outputPath : `${outputPath}/`;

	file.data.codeblocks
		.filter(block => block.name)
		.forEach((block, index) => {
			const path = `${outputPath}examples/${file.data.meta.category}/${file.data.meta.name}/${block.name}/${index}.${block.lang}`
			const content = block.value;
			fs.outputFileSync(path, block.value, 'utf8');
			console.log({ path })
		});
}
