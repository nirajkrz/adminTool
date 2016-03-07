(function() {
	'use strict';

	angular
		.module('userStatusApp')
		.controller('headerCtrl', ['$q', '$rootScope', '$scope', 'commonService', 'MESSAGES', '$location','messageBox', HeaderCtrl]);


	function HeaderCtrl($q, $rootScope, $scope, commonService, MESSAGES, $location,messageBox) {

		$scope.showHeader = function() {
			return $rootScope.headerFlag;
		};
		$scope.actions = [{
			id: 'qa',
			name: 'QA'
		}, {
			id: 'prod',
			name: 'Prod'
		}];

		$scope.doLogout = function() {
			commonService.doLogout().then(function(response) {
				if (response.status == 200) {
					$rootScope.user = {};
					//$location.path('login');
					window.location.href = "/profileadminapp/login";
				} else {
					messageBox.showMessage(MESSAGES.ERROR_IN_RESPONSE, 'danger');
				}
			});
		}
		$scope.setAction = function(action) {
			$scope.changeDB(action.id);
		};

		/*Change DB Connection when user selects dropdown value*/
		$scope.changeDB = function(action) {
			commonService.changeDBConnection(action).then(function(response) {
				if (angular.isDefined(response)) {
					if (angular.isDefined(response.status) && response.status == 200) {
						messageBox.showMessage(MESSAGES.DB_CHANGE_SUCCESS, 'success');
					} else {
						messageBox.showMessage(MESSAGES.DB_CHANGE_FAILURE, 'danger');
					}
				} else {
					messageBox.showMessage(MESSAGES.ERROR_IN_RESPONSE, 'danger');
				}
			});
		}

	}


})();