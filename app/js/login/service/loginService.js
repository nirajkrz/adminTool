/**
 * Created by msameer on 7/22/2015.
 */
(function() {
    "use strict";
    angular.module("userStatusApp")
        .factory('loginService', LoginService);

    LoginService.$inject = ['profileToolHttp'];
   
    function LoginService(http) {

        var loginService = {};
        loginService.doLogin = function(inputParams) {
            var request = {
                apiName : 'LOGIN',
                data : inputParams,
                headers: {
                    'ACCEPT': 'text/html'
                }
            };

            return http.execute(request);
        };

        return loginService;
    };
})();