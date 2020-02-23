/* istanbul ignore file */

function initializeSpecimenEmbed(specimen) {
    const host = document.currentScript.parentElement
    const shadow = host.attachShadow({ mode: "open" })

    specimen.blocks.forEach(block => {
        if (block.language === "jsx") {
            ReactDOM.render(eval(block.compiledContent), shadow)
        } else if (block.language === "html") {
            shadow.innerHTML += block.content
        } else if (block.language === "css") {
            const style = document.createElement("style")
            style.type = "text/css"
            style.textContent = block.content
            shadow.appendChild(style)
        } else if (block.language === "js") {
            const script = document.createElement("script")
            script.type = "text/javascript"
            script.textContent = block.content
            shadow.appendChild(script)
        }
    })
}
