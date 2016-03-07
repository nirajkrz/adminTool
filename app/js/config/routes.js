(function() {
    'use strict';

    var mainApp = angular.module('userStatusApp');

    mainApp.config([
        '$stateProvider',
        '$urlRouterProvider',
        function($stateProvider, $urlRouterProvider) {

            $urlRouterProvider.otherwise('/search');
            $stateProvider
                .state('app', {
                    abstract: true,
                    views: {
                        root: {
                            templateUrl: 'templates/common/main.html',
                            controller: 'mainCtrl',
                            controllerAs: 'main'
                        }
                    }
                })
                .state('app.login', {
                    url: '/login',
                    views: {
                        "content@app": {
                            templateUrl: 'templates/login/login.html',
                            controller: 'loginCtr1',
                            controllerAs: 'login'
                        }
                    },
                    data: {
                        header: false
                    }
                })
                .state('app.search', {
                    url: '/search',
                    views: {
                        "content@app": {
                            templateUrl: 'templates/search/search.html',
                            controller: 'searchCtrl',
                            controllerAs: 'searchScope'
                        }
                    }
                });

        }
    ]);

})();
