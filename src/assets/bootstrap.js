const stylemark = {
    initSpecimen: specimen => {
        const host = document.currentScript.parentElement
        const shadow = host.attachShadow({ mode: "open" })

        specimen.blocks.forEach(block => {
            if (block.type === "html") {
                shadow.innerHTML += block.content
            } else if (block.type === "css") {
                const style = document.createElement("style")
                style.type = "text/css"
                style.textContent = block.content
                shadow.appendChild(style)
            } else if (block.type === "js") {
                const script = document.createElement("script")
                script.type = "text/javascript"
                script.textContent = `(function() {
                    const scripts = document.getElementsByTagName("script");
                    const $document = scripts[scripts.length - 1].parentNode.shadowRoot;
                    ${block.content}
                })()`
                shadow.appendChild(script)
            }
        })
    },
}

window.stylemark = stylemark
