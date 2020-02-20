module.exports = library => `<!doctype html>
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
				${library.components
                    .map(
                        component =>
                            `<a href="#${component.metadata.name}" class="nav-link">${component.metadata.name}</a>`
                    )
                    .join("")}
			</nav>
		</aside>
		<main>
			${library.components
                .map(
                    component => `
						<article id="${component.metadata.name}">
						<h1>${component.metadata.name}</h1>
						${component.html}
						</article>
					`
                )
                .join("")}
		</main>
	</body>
</html>`
