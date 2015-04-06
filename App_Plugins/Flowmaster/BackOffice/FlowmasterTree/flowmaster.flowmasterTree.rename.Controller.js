'use strict';
(function () {
    //create the controller
    function docCreatorRenameController($scope, $routeParams, $element, $http) {
        $scope.legacyPath = decodeURIComponent("/App_Plugins/Flowmaster/BackOffice/Rename.aspx");
    };
    //register the controller
    angular.module("umbraco").controller('Flowmaster.FlowmasterTree.RenameController', docCreatorRenameController);
})();
