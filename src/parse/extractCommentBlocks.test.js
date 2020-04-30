const test = require("ava")
const extractCommentBlocks = require("./extractCommentBlocks")

test("No comment blocks are extracted from content that contains none", async (t) => {
    const content = `
.red { color: red }
.green { color: green }
.blue { color: blue }
`
    t.deepEqual(extractCommentBlocks(content), [])
})

test("One comment block is extracted from content that contains a single comment block", async (t) => {
    const content = `
.red { color: red }

/*
This is the color green.
It can also be written as #0f0 in hex format.
*/
.green { color: green }

.blue { color: blue }
`
    t.deepEqual(extractCommentBlocks(content), [
        `This is the color green.\nIt can also be written as #0f0 in hex format.`,
    ])
})

test("Multiple comment blocks are extracted from content that contains multiple comment blocks", async (t) => {
    const content = `
/*
This is the color red.
It can also be written as #f00 in hex format.
*/
.red { color: red }

/*
This is the color green.
It can also be written as #0f0 in hex format.
*/
.green { color: green }

/*
This is the color blue.
It can also be written as #00f in hex format.
*/
.blue { color: blue }
`
    t.deepEqual(extractCommentBlocks(content), [
        `This is the color red.\nIt can also be written as #f00 in hex format.`,
        `This is the color green.\nIt can also be written as #0f0 in hex format.`,
        `This is the color blue.\nIt can also be written as #00f in hex format.`,
    ])
})

test("Comment block delimiters can use any number of asterisks", async (t) => {
    const content = `
/*
This is the color red.
It can also be written as #f00 in hex format.
*/
.red { color: red }

/**
This is the color green.
It can also be written as #0f0 in hex format.
**/
.green { color: green }

/*****
This is the color blue.
It can also be written as #00f in hex format.
*****/
.blue { color: blue }
`
    t.deepEqual(extractCommentBlocks(content), [
        `This is the color red.\nIt can also be written as #f00 in hex format.`,
        `This is the color green.\nIt can also be written as #0f0 in hex format.`,
        `This is the color blue.\nIt can also be written as #00f in hex format.`,
    ])
})
