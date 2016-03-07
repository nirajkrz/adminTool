/**
 * Created by msameer on 7/22/2015.
 */
(function() {
    "use strict";
    angular.module("userStatusApp")
        .factory('commonService', CommonService);

    CommonService.$inject = ['profileToolHttp'];

    function CommonService(http) {

        var commonService = {};
        commonService.doLogout = function() {
            var request = {
                apiName: 'LOGOUT'
            };

            return http.execute(request);
        };

        commonService.changeDBConnection = function(DBtype) {
            switch (DBtype) {
                case 'qa':
                    DBtype = "QACIS"
                    break;
                case 'prod':
                    DBtype = "PRODCIS"
                    break;
                default:
                    DBtype = "QACIS"
                    break;
            }
            var reqObj= {"dbType": DBtype};
            var request = {
                apiName: 'CHANGE_DB',
                data: reqObj
            };
            return http.execute(request);
        }

        return commonService;
    };
})();