(function(){
  'use strict';

   angular
   .module('userStatusApp')
   .controller('loginCtr1',['$q', '$rootScope', '$scope', '$location', 'MESSAGES', 'loginService', 'messageBox', LoginCtrl]);

    function LoginCtrl($q, $rootScope, $scope, $location, MESSAGES, loginService, messageBox){
		var self = this;
		self.$q = $q;
		self.$rootScope = $rootScope;
		self.$scope = $scope;
		self.$location = $location;
		self.loginService = loginService;
		self.messageBox = messageBox;
		self.MESSAGES = MESSAGES;
    }
	LoginCtrl.prototype = {
		doLogin : function() {
			var params = {};
			params.username = this.$scope.username;
			params.password = this.$scope.password;
			var self = this;
			this.loginService.doLogin(params).then(function(response){
				if(angular.isDefined(response) && response.data.responseCode == "200"){
					self.$rootScope.user = params;
					self.$location.path('search');
				} else if (angular.isDefined(response) && response.data.responseCode != "200") {
					self.messageBox.showMessage(response.data.responseDescription, 'danger');
				} else {
					self.messageBox.showMessage(self.MESSAGES.ERROR_IN_RESPONSE, 'danger');
				}
			});
		},
		getMessages : function() {
			return this.MESSAGES;
		}
	};


})();