'use strict';
(function () {
    //create the controller
    function docCreatorDeleteController($scope, $routeParams, $element, $http) {
        $scope.legacyPath = decodeURIComponent("/App_Plugins/Flowmaster/BackOffice/Delete.aspx");
    };
    //register the controller
    angular.module("umbraco").controller('Flowmaster.FlowmasterTree.DeleteController', docCreatorDeleteController);
})();
