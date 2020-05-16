module.exports = (options = {}) => {
    return {
        name: "html",

        test: (specimen) => specimen.blocks[0].type === "html",

        render: (specimen) =>
            specimen.blocks
                .filter((block) => block.type === "html")
                .map((block) => block.content)
                .join("\n"),

        initDom: (specimen, shadowRoot, options, config) => {
            const isCssAsset = (asset) => /\.css$/.test(asset)
            const isJsAsset = (asset) => /\.js$/.test(asset)
            const isLocalAsset = (asset) => /^https:?\/\//.test(asset) === false

            const getLocalAssetPath = (asset) => {
                const matches = asset.match(/[^\/]+\.[^\.]+$/)
                const basename = matches ? matches[0] : ""
                return `${config.themeOptions.assetDir}/${basename}`
            }

            const addCssAsset = (asset) => {
                const assetUri = isLocalAsset(asset) ? getLocalAssetPath(asset) : asset
                const link = document.createElement("link")
                link.rel = "stylesheet"
                link.href = assetUri
                shadowRoot.appendChild(link)
            }

            const addJsAsset = (asset) => {
                const assetUri = isLocalAsset(asset) ? getLocalAssetPath(asset) : asset
                const script = document.createElement("script")
                script.src = assetUri
                shadowRoot.appendChild(script)
            }

            config.assets.filter(isCssAsset).forEach(addCssAsset)
            config.assets.filter(isJsAsset).forEach(addJsAsset)

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
                style.type = "text/css"
                style.textContent = inlineCss
                shadowRoot.appendChild(style)
            }

            if (inlineJs) {
                const specimenId = shadowRoot.host.getAttribute("id")
                const script = document.createElement("script")
                script.textContent = `(function() {
                    const document = window.document.getElementById("${specimenId}").shadowRoot.querySelector("slot").assignedNodes()[0];
                    ${inlineJs}
                })()`
                setTimeout(() => {
                    shadowRoot.appendChild(script)
                })
            }
        },
    }
}
