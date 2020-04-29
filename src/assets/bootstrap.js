const stylemark = {}

stylemark.findSpecimenRenderer = specimen => {
    let match = null
    for (const renderer of stylemark.renderers) {
        if (renderer.test(specimen)) {
            match = renderer
        }
    }
    return match
}

stylemark.renderSpecimen = specimen => {
    const host = document.currentScript.parentElement
    const shadowRoot = host.attachShadow({ mode: "open" })
    const renderer = stylemark.findSpecimenRenderer(specimen)

    if (!renderer) {
        console.error("No renderer found for specimen", specimen)
        return
    }

    const html = renderer.html ? renderer.html(specimen) : null
    const css = renderer.css ? renderer.css(specimen) : null
    const js = renderer.js ? renderer.js(specimen) : null

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
    const scripts = document.getElementsByTagName("script");
    const $document = scripts[scripts.length - 1].parentNode.shadowRoot;
    ${js}
})()`
        shadowRoot.appendChild(script)
    }
}

window.stylemark = stylemark
