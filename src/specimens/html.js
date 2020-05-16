const debug = require("debug")("stylemark:specimen:html")

module.exports = (userOptions = {}) => {
    const defaultOptions = { assets: [] }
    const options = Object.assign({}, defaultOptions, userOptions)

    debug("User options:", userOptions)
    debug("Resolved options:", options)

    return {
        name: "html",
        options,
        test: (specimen) => specimen.blocks[0].type === "html",

        render: (specimen, shadowRoot, options) => {
            const isCssAsset = (asset) => /\.css$/.test(asset)
            const isJsAsset = (asset) => /\.js$/.test(asset)

            options.assets.filter(isCssAsset).forEach((asset) => {
                const link = document.createElement("link")
                link.rel = "stylesheet"
                link.href = asset
                shadowRoot.appendChild(link)
            })

            options.assets.filter(isJsAsset).forEach((asset) => {
                const script = document.createElement("script")
                script.src = asset
                shadowRoot.appendChild(script)
            })

            const html = specimen.blocks
                .filter((block) => block.type === "html")
                .map((block) => block.content)
                .join("\n")

            const css = specimen.blocks
                .filter((block) => block.type === "css")
                .map((block) => block.content)
                .join("\n")

            const js = specimen.blocks
                .filter((block) => block.type === "js")
                .map((block) => block.content)
                .join("\n")

            if (html) {
                shadowRoot.innerHTML += `<slot></slot>`
            }

            if (css) {
                const style = document.createElement("style")
                style.type = "text/css"
                style.textContent = css
                shadowRoot.appendChild(style)
            }

            if (js) {
                const specimenId = shadowRoot.host.getAttribute("id")
                const script = document.createElement("script")
                script.type = "text/javascript"
                script.textContent = `(function() {
                    const document = window.document.getElementById("${specimenId}").shadowRoot.querySelector("slot").assignedNodes()[0];
                    ${js}
                })()`
                setTimeout(() => {
                    shadowRoot.appendChild(script)
                })
            }
        },
    }
}
