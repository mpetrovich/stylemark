module.exports = specimen => {
    const cssBlocks = specimen.blocks.filter(block => block.language === "css")
    const jsBlocks = specimen.blocks.filter(block => block.language === "js")
    const htmlBlocks = specimen.blocks.filter(block => block.language === "html")
    const id = `specimen-${specimen.name}`

    return `<div id="${id}">
    <script>
        let host = document.getElementById(${id})
    </script>
</div>
`
}
