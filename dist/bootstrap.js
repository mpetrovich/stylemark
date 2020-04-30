const stylemark = {}

stylemark.findSpecimenType = (specimen) => {
    const normalizedTypes = stylemark.specimenTypes.map((item) => (Array.isArray(item) ? item : [item, {}]))
    const match = normalizedTypes.find(([typeConfig, options]) => typeConfig.test(specimen, options))
    if (!match) {
        return null
    }
    const [typeConfig, options] = match
    const resolvedOptions = Object.assign({}, typeConfig.defaultOptions, options)
    return [typeConfig, resolvedOptions]
}

stylemark.renderSpecimen = (specimen) => {
    const host = document.currentScript.parentElement
    const shadowRoot = host.attachShadow({ mode: "open" })
    const [typeConfig, options] = stylemark.findSpecimenType(specimen)

    if (!typeConfig) {
        console.error("No typeConfig found for specimen", specimen)
        return
    }

    const html = typeConfig.html ? typeConfig.html(specimen, options) : null
    const css = typeConfig.css ? typeConfig.css(specimen, options) : null
    const js = typeConfig.js ? typeConfig.js(specimen, options) : null

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
