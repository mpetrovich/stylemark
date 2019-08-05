module.exports = (library, { componentRenderer }) => `<!doctype html>
<html>
	<head>
		<title>${library.name}</title>
		<style>
			aside {
				width: 20%;
				float: left;
			}
			main {
				width: 80%;
				float: right;
			}
			.nav-link {
				display: block;
			}
		</style>
	</head>
	<body>
		<aside>
			<nav>
				${library.components.map(component => `<a href="#${component.name}" class="nav-link">${component.name}</a>`).join('')}
			</nav>
		</aside>
		<main>
			${library.components
				.map(
					component => `
						<article id="${component.name}">
						<h1>${component.name}</h1>
						${componentRenderer(component)}
						</article>
					`
				)
				.join('')}
		</main>
	</body>
</html>`
