angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      StatusBar.styleLightContent();
    }
  });
})
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: "templates/tabs.html"
  })
  .state('tab.city', {  
    url: '/city',
    views: {
      'tab-city': {
        templateUrl: 'templates/tab-city.html',
        controller: 'CityCtrl'
      }
    }
  })
  .state('tab.city-detail', {
    url: '/city/:id',
    views: {
      'tab-city': {
        templateUrl: 'templates/city-detail.html',
        controller: 'CityDetailCtrl'
      }
    }
  });
  $urlRouterProvider.otherwise('/tab/city');
});
