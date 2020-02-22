function attachSpecimen(selector, specimen) {
    const host = document.querySelector(selector)
    const shadow = host.attachShadow({ mode: "open" })

    shadow.innerHTML = specimen.blocks
        .filter(block => block.language === "html")
        .map(block => block.content)
        .join("\n")

    specimen.blocks
        .filter(block => block.language === "css")
        .forEach(block => {
            const style = document.createElement("style")
            style.type = "text/css"
            style.textContent = block.content
            shadow.appendChild(style)
        })

    specimen.blocks
        .filter(block => block.language === "js")
        .forEach(block => {
            const script = document.createElement("script")
            script.type = "text/javascript"
            script.textContent = block.content
            shadow.appendChild(script)
        })
}
