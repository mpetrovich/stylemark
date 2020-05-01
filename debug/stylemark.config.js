const themes = require("../src/themes/all")
const htmlSpecimen = require("../src/specimens/html")

const colorSpecimen = {
    defaultOptions: {
        width: "50px",
        height: "50px",
    },
    test: (specimen) => specimen.blocks[0].type === "color",
    html: (specimen) => `<div>${specimen.blocks[0].content}</div>`,
    css: (specimen, options) => `div {
        width: ${options.width};
        height: ${options.height};
        background: ${specimen.blocks[0].content};
    }`,
    js: (specimen) => `
        document.addEventListener("click", e => navigator.clipboard.writeText("${specimen.blocks[0].content}"))
    `,
}

module.exports = {
    input: "*.{js,md}",
    output: "../dist",
    name: "Test Styleguide",
    head: [
        '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Manrope:wght@500&display=swap">',
        "<style>body { background: #f0f0f0; }</style>",
        "<script>console.log('inline head script')</script>",
        "assets/external-head.js",
    ],
    body: [
        "<script>console.log('inline body script')</script>",
        "assets/external-body.js",
        '<script src="jquery.js"></script>',
        '<script>$("body").css({background: "green"})</script>',
    ],
    assets: {
        "assets/*.png": "images/",
        "robots.txt": true,
        "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.0/jquery.slim.min.js": "jquery.js",
    },
    theme: themes.solo,
    themeConfig: {
        logo: "assets/stylemark.png",
    },
    specimenTypes: [[colorSpecimen, { width: "100px" }], htmlSpecimen],
}