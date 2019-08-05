module.exports = (library, { componentRenderer }) => `<!doctype html>
<html>
	<head>
		<title>${library.name}</title>
	</head>
	<body>
		<aside>
			<nav>
				${library.components.map(component => `<a href="#${component.name}">${component.name}</a>`).join('')}
			</nav>
		</aside>
		<main>
			${library.components
				.map(component => `<article id="${component.name}">${componentRenderer(component)}</article>`)
				.join('')}
		</main>
	</body>
</html>`
