;(() => {
    const handlers = new Map()
    window.stylemarkSpecimenHandlers.forEach(
        (handler) => !handlers.has(handler.name) && handlers.set(handler.name, handler)
    )

    handlers.forEach((handler) => {
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

                    if (handler.renderCss) {
                        handler.renderCss(specimen, shadowRoot, handler.options)
                    }
                    if (handler.renderJs) {
                        handler.renderJs(specimen, shadowRoot, handler.options)
                    }
                }
            }
        )
    })
})()
