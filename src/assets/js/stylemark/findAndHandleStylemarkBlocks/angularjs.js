(function(angular) {
    var docSlug = docSlug || '';
    var exampleName = exampleName || '';
    
    if (!angular) {
        return;
    }

    findAndHandleStylemarkBlocks('angularjs', function(block, index) {
        var moduleElem = document.querySelector('[ng-app]');
        var module;

        if (moduleElem) {
            // Uses an existing module
            module = angular.module(moduleElem.getAttribute('ng-app'));
        }
        else {
            // Creates a new module
            module = angular.module('stylemark-' + docSlug + '-' + exampleName, []);
        }

        module.controller('stylemark-' + docSlug + '-' + exampleName + '-' + index, function($scope) {
            $scope.$eval(block);
        });
    });
})(window.angular);
