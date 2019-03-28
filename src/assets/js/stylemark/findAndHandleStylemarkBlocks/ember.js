(function(Ember) {
    var stylemarkConf = stylemarkConf || {};
    
    if (!Ember) {
        return;
    }

    findAndHandleStylemarkBlocks(['handlebars', 'hbs'], function(block, index) {
        var render = function() {
            var app = window[stylemarkConf.emberAppName] ||  window.noop
            var container = app.__container__;
            var renderer = container.lookup('renderer:-dom');
            var template = Ember.HTMLBars.compile(block);

            var jsBlocks = getStylemarkBlocks('js');
            var jsBlock = jsBlocks && jsBlocks[0] ? jsBlocks[0] : '{}';
            var context;
            eval('context = ' + jsBlock);

            // Credit:
            // http://stackoverflow.com/questions/27950413/render-ember-js-hbs-template-to-a-string#answer-35625858
            var compile = function(container, template, context) {
                return new Ember.RSVP.Promise(function(resolve) {
                    Ember.Component.extend(Ember.merge({
                        style: 'display:none;',
                        layout: template,
                        container: container,
                        renderer: renderer,

                        init: function() {
                            this._super.apply(this, arguments);
                            Ember.setOwner(this, container);
                        },

                        didRender: function() {
                            var elem = this.$();
                            resolve(elem);
                            this.destroy();
                        }
                    }, context))
                        .create()
                        .append();

                });
            };

            compile(container, template, context).then(function(elem) {
                var node = document.querySelectorAll('.stylemark-ember-root')[index];
                jQuery(node).append(elem);
            });
        };

        var isReady = function() {
            var app = window[stylemarkConf.emberAppName] ||  window.noop;
            return app && app.__container__;
        };

        var checkReady = function() {
            if (isReady()) {
                render();
            }
            else {
                setTimeout(checkReady, 20);
            }
        };

        checkReady();
    });

})(window.Ember);
