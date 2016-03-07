(function() {
	'use strict';

	angular
		.module('userStatusApp')
		.controller('searchCtrl', ['$q', '$rootScope', '$scope', '$modal', 'userSearchService', 'messageBox', 'MESSAGES', 'USER_STATUS', 'XLSXReaderService', SearchCtrl]);

	function SearchCtrl($q, $rootScope, $scope, $modal, userSearchService, messageBox, MESSAGES, USER_STATUS, XLSXReaderService) {
		var self = this;
		self.$q = $q;
		self.$rootScope = $rootScope;
		self.$scope = $scope;
		self.$modal = $modal;
		self.userSearchService = userSearchService;
		self.messageBox = messageBox;
		self.MESSAGES = MESSAGES;
		self.$scope.users = [];
		self.$scope.status = USER_STATUS;
		self.XLSXReaderService = XLSXReaderService;
        $scope.fileName = '';

		$scope.searchReqObj = {
			emailId: '',
			userId: ''
		};
		$scope.searchText = '';
		$scope.selectedAll = false;

		$scope.excelDatas = [];
		$scope.excelEmailIds = [];
		$scope.excelUserIds = [];
		$scope.pageRowCount = 10;
		$scope.totalRowCount = 0;
		$scope.pageCount = 0;
		$scope.currentPage = 0;

	}

	SearchCtrl.prototype = {

		checkAll : function (selectedAll) {

	        var ctrl = this;
	        angular.forEach(this.$scope.users, function (user) {
	            user.selected = selectedAll;
	        });
	    },

		getNumber : function(num) {

            var arr = [];
            for (var i = 0; i < num; i++) {
                arr.push(i+1);
            }
            return arr;
        },

		updateSearchRequest : function(searchText) {
			var myregEmail = /^([_a-zA-Z0-9-])+(\.[a-zA-Z0-9-]+)*@([a-zA-Z0-9-])+(\.[a-zA-Z0-9-]{1,})*\.([a-zA-Z]{2,}){1}/;
			var mrregUserID = /^\d{1,16}$/;

			this.$scope.searchReqObj.emailId = '';
			this.$scope.searchReqObj.userId = '';
	        this.$scope.excelDatas = [];
			if (searchText) {
				this.$scope.searchReqObj = {};
				if (myregEmail.test(searchText)) {
					this.$scope.searchReqObj.emailId = searchText;
				} else if (mrregUserID.test(searchText)) {
					this.$scope.searchReqObj.userId = searchText;
				} else {
					this.$scope.searchReqObj.emailId = '';
					this.$scope.searchReqObj.userId = '';
				}
			}
		},

		fileChanged : function(files) {
			this.$scope.excelFile = files[0];
	        this.$scope.fileName = this.$scope.excelFile.name;

	        this.$scope.excelDatas = [];
	        var ctrl = this,
				msgBox = this.messageBox,
				messages = this.MESSAGES;

			ctrl.$scope.searchReqObj.userId = '';
        	ctrl.$scope.searchReqObj.emailId = '';
	        if (this.$scope.fileName.split('.')[1].toLowerCase() === 'xlsx') {
		        this.XLSXReaderService.readFile(this.$scope.excelFile).then(function(xlsxData) {
		        	var data = JSON.parse(xlsxData);
		        	ctrl.$scope.excelDatas = [];
		        	angular.forEach(data, function(sheet, key) {
		        		if ( sheet instanceof Array ) {
		        			ctrl.$scope.excelDatas = ctrl.$scope.excelDatas.concat(sheet);
						} else {
						    ctrl.$scope.excelDatas.push( sheet );
		        		}
		        	});
		        });
	    	} else {
				msgBox.showMessage(messages.INVALID_FILE, 'danger');
	    		this.$scope.excelFile = {};
	        	this.$scope.fileName = '';
	    	}
        	this.$scope.$apply();
		},

		doSearch: function(page) {
			/*Let's Call the search service for this*/
			var ctrl = this;
			if (this.$scope.excelDatas.length > 0) {
				this.$scope.excelEmailIds = [];
				this.$scope.excelUserIds = [];
				this.$scope.totalRowCount = 0;
				this.$scope.pageCount = 0;
				var slicedElements = [];
				angular.forEach(this.$scope.excelDatas, function(val, key) {
	            	if (val.emailId != undefined) {
	            		ctrl.$scope.excelEmailIds.push(val.emailId);
	            	}
	            	if (val.userId != undefined) {
	            		ctrl.$scope.excelUserIds.push(val.userId);
	            	}
	            });

	            if (ctrl.$scope.excelUserIds.length > 0) {
					ctrl.$scope.totalRowCount = ctrl.$scope.excelUserIds.length;
					slicedElements = ctrl.$scope.excelUserIds.splice((ctrl.$scope.pageRowCount*(page-1)), (ctrl.$scope.pageRowCount*page));
					ctrl.$scope.searchReqObj.userId = slicedElements.join(',');
	            } else if (ctrl.$scope.excelUserIds.length === 0 && ctrl.$scope.excelEmailIds.length > 0) {
					ctrl.$scope.totalRowCount = ctrl.$scope.excelEmailIds.length;
					slicedElements = ctrl.$scope.excelEmailIds.splice((ctrl.$scope.pageRowCount*(page-1)), (ctrl.$scope.pageRowCount*page));
					ctrl.$scope.searchReqObj.emailId = slicedElements.join(',');
	            } else {
					ctrl.$scope.searchReqObj.userId = '';
	            	ctrl.$scope.searchReqObj.emailId = '';
	            }
	            ctrl.$scope.pageCount = Math.ceil(ctrl.$scope.totalRowCount/ctrl.$scope.pageRowCount);
			}

			console.log(this.$scope.searchReqObj, page, ctrl.$scope.pageCount);
			if ((this.$scope.searchReqObj.emailId != '' && this.$scope.searchReqObj.emailId != undefined) || (this.$scope.searchReqObj.userId != '' && this.$scope.searchReqObj.userId != undefined)) {
				this.searchUsers(this.$scope.searchReqObj, page);
			} else {
				this.$scope.users = [];
				this.messageBox.showMessage(this.MESSAGES.INVALID_USERID_EMAIL_OR_FILE, 'danger');
			}
		},

		searchUsers : function(searchReqObj, currentPage) {
			var ctrl = this,
				scope = this.$scope,
				msgBox = this.messageBox,
				messages = this.MESSAGES;

			this.userSearchService.getUserData(searchReqObj).then(function(response) {
				if (angular.isDefined(response)) {
					if (angular.isDefined(response.data) && response.data.length > 0) {
						ctrl.$scope.fileName = '';
						ctrl.$scope.currentPage = currentPage;
						scope.users = response.data;
					} else {
						scope.users = [];
						msgBox.showMessage(messages.NO_RESULTS_FOUND, 'danger');
					}
				} else {
					scope.users = [];
					msgBox.showMessage(messages.ERROR_IN_RESPONSE, 'danger');
				}
			});
		},

		/* Function for Single User Update: Not using now since we are using multiuser update now.*/
		openEditStatusModal: function(userID, currentStatus) {

			var modalInstance = this.$modal.open({
				animation: true,
				templateUrl: 'templates/search/editStatusModal.html',
				controller: 'editStatusModalCtrl',
				size: 'sm',
				resolve: {
					requestObj: function() {
						return {
							userID: userID,
							currentStatus: currentStatus
						};
					}
				}
			});
			var self = this;
			modalInstance.result.then(function(res) {
				if (res.statusCode == 200) {
					self.messageBox.showMessage(self.MESSAGES.STATUS_UPDATED_SUCCESS, 'success');
					angular.forEach(self.$scope.status, function(val, key) {
						if (val.code === res.status) {
							self.$scope.user.userState = key;
						}
					});
				}
			}, function() {
				// Error log
			});
		},
		/* handle the Multi User update From Here*/
		openMultiEditStatusModal: function() {
			/*Iterate thru the user's list--*/

			var selectedUserList= [], msgBox = this.messageBox, messages = this.MESSAGES;
			angular.forEach(this.$scope.users, function(user, key) {
				if (user.selected === true) {
					selectedUserList.push(user.id || user.userLogonName);
				}
			});
			console.log('selectedUserList', selectedUserList);
			if (selectedUserList.length > 0) {
				var modalInstance = this.$modal.open({
					animation: true,
					templateUrl: 'templates/search/editStatusModal.html',
					controller: 'editStatusModalCtrl',
					size: 'sm',
					resolve: {
						requestObj: function() {
							return {
								userID: selectedUserList.join(),
								currentStatus: "" //currentStatus NA for multi user Update scenario
							};
						}
					}
				});
				var self = this;
				modalInstance.result.then(function(res) {
					if (res.statusCode == 200) {
						self.messageBox.showMessage(self.MESSAGES.STATUS_UPDATED_SUCCESS, 'success');
						angular.forEach(self.$scope.status, function(val, key) {
							if (val.code === res.status) {
								//self.$scope.users.userState = key;
								//Time to Iterate and upadte each user
								angular.forEach(self.$scope.users, function(user, userkey){
									user.userState = key;
								});
							}
						});
					}
				}, function() {
					// Error log
				});
			} else {
				msgBox.showMessage(messages.PLEASE_SELECT_USER, 'danger');
			}
		},

		viewAddress: function(userID) {
			var modalInstance = this.$modal.open({
				animation: true,
				templateUrl: 'templates/search/userAddressModal.html',
				controller: 'userAddressModalCtrl',
				size: 'md',
				resolve: {
					requestObj: function() {
						return {
							userID: userID
						};
					}
				}
			});
		}
	};


})();