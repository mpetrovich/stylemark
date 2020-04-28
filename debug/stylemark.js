module.exports = {
    input: "*.{js,md}",
    output: "../dist",
    name: "Test Styleguide",
    theme: {
        head: [
            '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Manrope:wght@500&display=swap">',
            "<style>body { background: #f0f0f0; }</style>",
            "<script>console.log('inline head script')</script>",
            "external-head.js",
        ],
        body: [
            "<script>console.log('inline body script')</script>",
            "external-body.js",
            "jquery.js",
            '<script>$("body").css({background: "green"})</script>',
        ],
        assets: {
            "images/stylemark.png": "logo.png",
            "robots.txt": true,
            "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.0/jquery.slim.min.js": "jquery.js",
        },
    },
}
