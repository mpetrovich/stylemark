(function(ReactDOM) {

    if (!ReactDOM) {
        return;
    }

    findAndHandleStylemarkBlocks('jsx', function(block, index) {
        var rootNode = document.querySelectorAll('.stylemark-react-root')[index];
        var Component = eval(block);
        ReactDOM.render(Component, rootNode);
    });
})(window.ReactDOM);
