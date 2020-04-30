window.stylemark.specimenTypes = [
        [
        {
        defaultOptions: {"width":"50px","height":"50px"},test: (specimen) => specimen.blocks[0].type === "color",html: (specimen) => `<div>${specimen.blocks[0].content}</div>`,css: (specimen, options) => `div {
        width: ${options.width};
        height: ${options.height};
        background: ${specimen.blocks[0].content};
    }`,js: (specimen) => `
        document.addEventListener("click", e => navigator.clipboard.writeText("${specimen.blocks[0].content}"))
    `
    },{
        width: "100px"
    }
    ],[
        {
        defaultOptions: {"prefix":""},test: (specimen) => specimen.blocks[0].type === "html",html: (specimen, options) =>
        specimen.blocks
            .filter((block) => block.type === "html")
            .map((block) => options.prefix + block.content)
            .join("\n"),css: (specimen) =>
        specimen.blocks
            .filter((block) => block.type === "css")
            .map((block) => block.content)
            .join("\n"),js: (specimen) =>
        specimen.blocks
            .filter((block) => block.type === "js")
            .map((block) => block.content)
            .join("\n")
    },{
        prefix: "FOO: "
    }
    ],{
        html: {"defaultOptions":{"prefix":""}}
    }
    ]