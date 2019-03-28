function findAndHandleStylemarkBlocks(languages, handler) {
    var blocks = getStylemarkBlocks(languages);
    handleStylemarkBlocks(blocks, handler);
}

function getStylemarkBlocks(languages) {
    languages = typeof languages === 'string' ? [languages] : languages;

    var selectors = [];

    for (var i = 0; i < languages.length; i++) {
        selectors.push('script[data-language="' + languages[i] + '"]');
    }

    var selector = selectors.join(',');
    var scripts = document.querySelectorAll(selector);
    var blocks = [];

    for (var i = 0, length = scripts.length; i < length; i++) {
        if (scripts[i].innerText) {
            blocks.push(scripts[i].innerText);
        }
    }

    return blocks;
}

function handleStylemarkBlocks(blocks, handler) {
    for (var i = 0, length = blocks.length; i < length; i++) {
        handler(blocks[i], i);
    }
}
