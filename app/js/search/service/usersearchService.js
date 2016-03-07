/**
 * Created by nkuma15 on 7/9/2015.
 */
(function() {
    "use strict";
    angular.module("userStatusApp")
        .factory('userSearchService', UserSearchService);

    UserSearchService.$inject = ['profileToolHttp'];

    function UserSearchService(http) {

        var userSearchService = {};
        userSearchService.getUserData = function(searchReqObj) {
            var request = {
                apiName : 'SEARCH_USER',
                data : searchReqObj
            };

            return http.execute(request);
        };

        userSearchService.updateStatus = function(userId, status) {
            var inputParam = {
                'userIds' : userId
            };
            var request = {};
            if (status === 1){
                request.apiName = 'STATUS_TO_ACTIVE';
                request.data = inputParam;
            } else {
                request.apiName = 'UPDATE_STATUS';
                inputParam.userState = status;
                request.data = inputParam;
            }
            return http.execute(request);

        };

        userSearchService.fetchAddress = function(requestObj) {

            var request = {
                apiName : 'FETCH_ADDRESS',
                data : requestObj
            };

            return http.execute(request);
        };
        userSearchService.createSSOId = function(createSSOObject) {
            var request = {
                apiName : 'METADAT_CREATE_SSO',
                data : createSSOObject
            };

            return http.execute(request);
        };


        return userSearchService;
    };
})();