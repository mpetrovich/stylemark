module.exports = (userOptions = {}) => {
    const defaultOptions = {
        collapsedByDefault: [],
        expandedByDefault: ["html", "css", "js"],
    }
    const options = Object.assign({}, defaultOptions, userOptions)

    return {
        name: "html",
        options,

        test: (specimen, options, config) => specimen.blocks[0].type === "html",

        render: (specimen, options, config) =>
            specimen.blocks
                .filter((block) => block.type === "html")
                .map((block) => block.content)
                .join("\n"),

        initDom: (specimen, shadowRoot, options, config) => {
            const inlineCss = specimen.blocks
                .filter((block) => block.type === "css")
                .map((block) => block.content)
                .join("\n")

            const inlineJs = specimen.blocks
                .filter((block) => block.type === "js")
                .map((block) => block.content)
                .join("\n")

            if (inlineCss) {
                const style = document.createElement("style")
                style.textContent = inlineCss
                shadowRoot.appendChild(style)
            }

            if (inlineJs) {
                const specimenId = shadowRoot.host.getAttribute("id")
                const script = document.createElement("script")
                script.textContent = `(function() {
                    const document = window.document.getElementById("${specimenId}");
                    ${inlineJs}
                })()`
                setTimeout(() => {
                    shadowRoot.appendChild(script)
                })
            }

            const optionsNode = document.createTextNode(`Options: ${JSON.stringify(options)}`)
            shadowRoot.appendChild(optionsNode)
        },
    }
}
