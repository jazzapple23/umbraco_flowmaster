'use strict';
(function () {
    //create the controller
    function docCreatorCreateController($scope, $routeParams, $element, $http) {
        if(UmbClientMgr.mainTree().getActionNode().nodeId.toString() == "1998")
            $scope.chartType = "Flowchart";
        else if(UmbClientMgr.mainTree().getActionNode().nodeId.toString() == "1999")
            $scope.chartType = "OrgChart";
        $scope.legacyPath = decodeURIComponent("/App_Plugins/Flowmaster/BackOffice/Create.aspx");
    };
    //register the controller
    angular.module("umbraco").controller('Flowmaster.FlowmasterTree.CreateController', docCreatorCreateController);
})();
