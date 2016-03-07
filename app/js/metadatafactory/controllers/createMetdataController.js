(function() {
	'use strict';

	angular
		.module('userStatusApp')
		.controller('metadataCntrl', ['$q', '$rootScope', '$scope', 'commonService','MESSAGES', '$location','messageBox','userSearchService', MetadataCntrl]);

	function MetadataCntrl($q, $rootScope, $scope, commonService, MESSAGES, $location,messageBox, userSearchService) {

		$scope.metadatas = [{
			id: 'ssoid',
			name: 'Cis App Id'
		}, {
			id: 'attributes',
			name: 'Member Attributes'
		},{
			id: 'groups',
			name: 'Member Group Attributes'
		},{
			id: 'cispid',
			name: 'CISP App Id'
		}];
		$scope.showSSOid='';
		$scope.showSSOResponse = false;

		$scope.metadataupdate = function(){
			if($scope.meta.id =='ssoid'){
				$scope.showSSOid = true;
			}else{
				$scope.showSSOid = false;
			}
		}

		$scope.createSsoAppId = function(sid){
		var requestObj = {
			"appName" : sid.appName,
			"requestorId":sid.inputRequesterID
		};
		$scope.metadataSSOResponse = {};
		userSearchService.createSSOId(requestObj).then(function(data){
			if(angular.isDefined(data.data)){

				var resp= data.data;
				if(resp.control.responseCode == 200){
					$scope.metadataSSOResponse.appId = resp.appId;
					$scope.metadataSSOResponse.appName = resp.appName;
					$scope.metadataSSOResponse.appKey = resp.appKey;
					$scope.showSSOResponse = true;
				}
			}
		});

		}
	}
})();