;(() => {
    const handlers = new Map()
    window.stylemarkSpecimenHandlers.forEach((handler) => handlers.set(handler.name, handler))

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
                    handler.render(specimen, shadowRoot, handler.options)
                }
            }
        )
    })
})()
