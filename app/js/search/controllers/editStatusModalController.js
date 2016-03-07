(function(){
  'use strict';

   angular
   .module('userStatusApp')
   .controller('editStatusModalCtrl',['$q', '$rootScope', '$scope', '$modalInstance', 'userSearchService', 'messageBox', 'requestObj', EditStatusModelCtrl]);

    function EditStatusModelCtrl($q, $rootScope, $scope, $modalInstance, userSearchService, messageBox, requestObj){
        $scope.request = requestObj;
		$scope.ok = function () {
            userSearchService.updateStatus($scope.request.userID, $scope.request.currentStatus).then(function(response){
                if (angular.isDefined(response)) {
                    if (angular.isDefined(response.data.responseCode)) {  
                        var responseObj = {
                            statusCode:response.data.responseCode,
                            status:$scope.request.currentStatus

                        };         
                        $modalInstance.close(responseObj);
                    }
                } else {
                    messageBox.showMessage(this.MESSAGES.ERROR_IN_RESPONSE,'danger');
                    $modalInstance.dismiss('cancel');
                }
            }, function(err) {
                messageBox.showMessage(this.MESSAGES.ERROR_OCCURED,'danger');
                $modalInstance.dismiss('cancel');
            });
		};

		$scope.cancel = function () {
			$modalInstance.dismiss('cancel');
		};
    }

})();