const stylemark = {}

stylemark.findSpecimenRenderer = (specimen) => {
    const normalizedRenderers = stylemark.renderers.map((item) => (Array.isArray(item) ? item : [item, {}]))
    const match = normalizedRenderers.find(([renderer, options]) => renderer.test(specimen, options))
    if (!match) {
        return null
    }
    const [renderer, options] = match
    const resolvedOptions = Object.assign({}, renderer.defaultOptions, options)
    return [renderer, resolvedOptions]
}

stylemark.renderSpecimen = (specimen) => {
    const host = document.currentScript.parentElement
    const shadowRoot = host.attachShadow({ mode: "open" })
    const [renderer, options] = stylemark.findSpecimenRenderer(specimen)

    if (!renderer) {
        console.error("No renderer found for specimen", specimen)
        return
    }

    const html = renderer.html ? renderer.html(specimen, options) : null
    const css = renderer.css ? renderer.css(specimen, options) : null
    const js = renderer.js ? renderer.js(specimen, options) : null

    if (html) {
        shadowRoot.innerHTML += html
    }

    if (css) {
        const style = document.createElement("style")
        style.type = "text/css"
        style.textContent = css
        shadowRoot.appendChild(style)
    }

    if (js) {
        const script = document.createElement("script")
        script.type = "text/javascript"
        script.textContent = `(function() {
            const scripts = window.document.getElementsByTagName("script");
            const document = scripts[scripts.length - 1].parentNode.shadowRoot;
            ${js}
        })()`
        shadowRoot.appendChild(script)
    }
}

window.stylemark = stylemark
