function initializeSpecimenEmbed(id, specimen) {
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
            script.textContent = `
                (function() {
                    const $document = document.getElementById("${id}").shadowRoot;
                    ${block.content}
                })()`
            shadow.appendChild(script)
        }
    })
}