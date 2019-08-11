import test from 'ava'
import { readFileSync } from 'fs'
import path from 'path'
import parseComponent from '../parse/component'
import compileComponent from '../transform/compileComponent'
import renderComponent from '../render/component'

test('An iframe is added before the first HTML block of each specimen', async t => {
	const markdown = readFileSync(`${__dirname}/component-test-cases/iframes.md`, { encoding: 'utf8' })
	const iframePathFn = ({ component, specimen }) => `${component.metadata.name}/${specimen.name}.html`

	var component = parseComponent(markdown)
	component = await compileComponent(component)
	component = renderComponent(component, { iframePathFn })

	t.is(component.html, readFileSync(`${__dirname}/component-test-cases/iframes.expected.html`, { encoding: 'utf8' }))
})
