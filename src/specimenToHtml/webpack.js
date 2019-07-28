const webpack = require('webpack')

webpack(
	{
		entry: './test-cases/entry.js',
		output: {
			publicPath: 'dist',
			filename: 'all.js',
		},
	},
	(error, stats) => {
		if (error || stats.hasErrors()) {
			console.log({ error, stats })
		}
		console.log({ stats })
	}
)
