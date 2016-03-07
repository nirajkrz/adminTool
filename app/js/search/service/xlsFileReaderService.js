/**
 * @author: nkuma15 on 8/12/2015.
 */
(function() {
    "use strict";
    angular.module("userStatusApp")
        .factory('XLSXReaderService', XLSXReaderService);

    XLSXReaderService.$inject = ['$q', '$rootScope'];

    function XLSXReaderService($q, $rootScope) {
        var service = function(data) {
            angular.extend(this, data);
        };

        service.readFile = function(file) {
            var deferred = $q.defer();

            XLSXReader(file, function(data) {
                $rootScope.$apply(function() {
                    deferred.resolve(data);
                });
            });

            return deferred.promise;
        };

        return service;

    };

})();