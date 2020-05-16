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

        resolveOptions: (config) => {
            return {
                ...options,
                assets: [].concat(config.assets, options.assets),
            }
        },

        renderHtml: (specimen) =>
            specimen.blocks
                .filter((block) => block.type === "html")
                .map((block) => block.content)
                .join("\n"),

        renderCss: (specimen, shadowRoot, options) => {
            const isCssAsset = (asset) => /\.css$/.test(asset)
            const addLinkTag = (asset) => {
                const link = document.createElement("link")
                link.rel = "stylesheet"
                link.href = asset
                shadowRoot.appendChild(link)
            }

            options.assets.filter(isCssAsset).forEach(addLinkTag)

            const css = specimen.blocks
                .filter((block) => block.type === "css")
                .map((block) => block.content)
                .join("\n")

            if (css) {
                const style = document.createElement("style")
                style.type = "text/css"
                style.textContent = css
                shadowRoot.appendChild(style)
            }
        },

        renderJs: (specimen, shadowRoot, options) => {
            const isJsAsset = (asset) => /\.js$/.test(asset)
            const addExternalScriptTag = (asset) => {
                const script = document.createElement("script")
                script.src = asset
                shadowRoot.appendChild(script)
            }

            options.assets.filter(isJsAsset).forEach(addExternalScriptTag)

            const js = specimen.blocks
                .filter((block) => block.type === "js")
                .map((block) => block.content)
                .join("\n")

            if (js) {
                const specimenId = shadowRoot.host.getAttribute("id")
                const script = document.createElement("script")
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
