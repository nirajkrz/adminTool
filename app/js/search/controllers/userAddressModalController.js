(function(){
  'use strict';

   angular
   .module('userStatusApp')
   .controller('userAddressModalCtrl', ['$q', '$rootScope', '$scope', '$modalInstance', 'userSearchService', 'messageBox', 'requestObj', UserAddressModalCtrl]);

    function UserAddressModalCtrl($q, $rootScope, $scope, $modalInstance, userSearchService, messageBox, requestObj){
        $scope.request = requestObj;
        $scope.addressList = [];

        userSearchService.fetchAddress({"userId" : $scope.request.userID}).then(function(response){
            if (angular.isDefined(response)) {
                if (angular.isDefined(response.data.id)) {
                    $scope.addressList =  response.data.addresses.addressList;
                    console.log($scope.addressList);   
                }
            } else {
                messageBox.showMessage(this.MESSAGES.ERROR_IN_RESPONSE,'danger');
                $modalInstance.dismiss('cancel');
            }
        }, function(err) {
            messageBox.showMessage(this.MESSAGES.ERROR_OCCURED,'danger');
            $modalInstance.dismiss('cancel');
        });

		$scope.close = function () {
			$modalInstance.dismiss('cancel');
		};
    }

})();