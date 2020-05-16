;((stylemark) => {
    const config = stylemark.config

    config.specimenHandlers.forEach((handler) => {
        customElements.define(
            `stylemark-specimen-${handler.name}`,
            class extends HTMLElement {
                constructor() {
                    super()
                }

                connectedCallback() {
                    const specimen = JSON.parse(this.getAttribute("specimen"))
                    const shadowRoot = this.attachShadow({ mode: "open" })
                    shadowRoot.innerHTML = "<slot></slot>"

                    if (handler.initDom) {
                        handler.initDom(specimen, shadowRoot, handler.options, config)
                    }
                }
            }
        )
    })
})(window.stylemark)
