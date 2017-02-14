//function onPushwooshAndroidInitialized(pushToken) {
//	console.warn('push token: ' + pushToken);
//	var pushNotification = cordova.require("pushwoosh-cordova-plugin.PushNotification");
//	pushNotification.getPushToken(
//		function(token) {
//			console.warn('push token: ' + token);
//		}
//	);
//	pushNotification.getPushwooshHWID(
//		function(token) {
//			console.warn('Pushwoosh HWID: ' + token);
//		}
//	);
//	pushNotification.getTags(
//		function(tags) {
//			console.warn('tags for the device: ' + JSON.stringify(tags));
//		},
//		function(error) {
//			console.warn('get tags error: ' + JSON.stringify(error));
//		}
//	);
//	pushNotification.setLightScreenOnNotification(false);
//	pushNotification.setTags({
//			deviceName: "hello",
//			deviceId: 10
//		},
//		function(status) {
//			console.warn('setTags success');
//		},
//		function(status) {
//			console.warn('setTags failed');
//		}
//	);
//}
//
//function initPushwoosh() {
//  var pushNotification = cordova.require("pushwoosh-cordova-plugin.PushNotification");
//
//  if (device.platform == "Android") {
//    registerPushwooshAndroid();
//  }
//
//  if (device.platform == "iPhone" || device.platform == "iOS") {
//    registerPushwooshIOS();
//  }
//
//  if (device.platform == "Win32NT") {
//    registerPushwooshWP();
//  }
//
//
//  pushNotification.getLaunchNotification(
//    function (notification) {
//      if (notification != null) {
//        alert(JSON.stringify(notification));
//      } else {
//        // alert("No launch notification");
//      }
//    }
//  );
//
//}

angular.module('starter', ['ionic', 'starter.controllers', 'ionic.contrib.ui.tinderCards2', 'config', 'angularMoment', 'firebase'])

.run(function($ionicPlatform, $ionicPopup, $rootScope, $ionicLoading, $http) {
  $ionicPlatform.ready(function() {

    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
    //Internet Disconnected
    if(window.Connection) {
        if(navigator.connection.type == Connection.NONE) {
            $ionicPopup.confirm({
                title: "Internet Disconnected",
                content: "The internet is disconnected on your device."
            })
            .then(function(result) {
                if(!result) {
                    ionic.Platform.exitApp();
                }else{
                  document.location.href = 'index.html';
                  //navigator.app.loadUrl("file:///android_asset/www/index.html");
                }
            });
        }
        if (localStorage.getItem('Verification_Phone')) {
              $rootScope.verificationPhone = localStorage.getItem('Verification_Phone');
              console.log(localStorage.getItem('Verification_Phone'));
                 $ionicLoading.show();
                  $http({
                    method: 'GET',
                    url: 'http://leadr.jellyworkz.com/api/v1/user-find/' + $rootScope.verificationPhone
                  }).success(function (data) {
                    if (data) {
                      $ionicLoading.hide();
                      $rootScope.userAccount = data;
                      console.log($rootScope.userAccount);
                      console.log($rootScope.verificationPhone);
                      location.href = '#/tab/content1';
                      localStorage.setItem('SocialGap_Phone_Token', $rootScope.verificationPhone);
                      if($rootScope.userAccount.verification.linkedin){
                        localStorage.setItem('Verification_LinkedIn_Token', $rootScope.userAccount.verification.linkedin);
                      }
                      if($rootScope.userAccount.verification.facebook){
                        localStorage.setItem('Verification_Facebook_Token', $rootScope.userAccount.verification.facebook);
                      }
                      if($rootScope.userAccount.verification.google){
                        localStorage.setItem('SocialGap_Google_Token', $rootScope.userAccount.verification.google);
                      }
                      localStorage.setItem('Verification_Phone', $rootScope.verificationPhone);
                    } else {
                      $ionicLoading.hide();
                      location.href = '#/app/step-3';
                    }
                  });
        }
    }
//    initPushwoosh();
  });
  console.log("Version: " + ionic.Platform.version());
})
//
.directive('noScroll', function($document) {
  return {
    restrict: 'A',
    link: function($scope, $element, $attr) {
      $document.on('touchmove', function(e) {
        e.preventDefault();
      });
    }
  }
})
//FB .service
.service('UserService', function() {
  var setUser = function(user_data) {
    window.localStorage.starter_facebook_user = JSON.stringify(user_data);
  };
  var getUser = function(){
    return JSON.parse(window.localStorage.starter_facebook_user || '{}');
  };
  return {
    getUser: getUser,
    setUser: setUser
  };
})
//Router navigation all project
.config(function($stateProvider, $urlRouterProvider, baseURL) {
  $stateProvider
  //Global common app
  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: baseURL + 'menu.html',
    controller: 'menuInMore'
  })
   /*START Info*/
  .state('app.step-1', {
    url: '/step-1',
    views: {
      'menuContent': {
        templateUrl: baseURL + 'step-1.html',
      }
    }
  })
  .state('app.step-2', {
    url: '/step-2',
    views: {
      'menuContent': {
        templateUrl: baseURL + 'step-2.html',
        controller: 'step-2'
      }
    }
  })
  .state('app.step-3', {
    url: '/step-3',
    views: {
      'menuContent': {
        templateUrl: baseURL + 'step-3.html',
        controller: 'step-3'
      }
    }
  })
  .state('app.loginEmail', {
    url: '/loginEmail',
    views: {
      'menuContent': {
        templateUrl: baseURL + 'loginEmail.html',
        controller: 'loginEmail'
      }
    }
  })
  .state('app.regEmail', {
    url: '/regEmail',
    views: {
      'menuContent': {
        templateUrl: baseURL + 'regEmail.html',
        controller: 'loginEmail'
      }
    }
  })
  /*Registration*/
  .state('app.reg1', {
    url: '/reg1',
    views: {
      'menuContent': {
        templateUrl: baseURL + 'reg1.html',
        controller: 'reg1Ctrl'
      }
    }
  })
  .state('app.reg2', {
    url: '/reg2',
    views: {
      'menuContent': {
        templateUrl: baseURL + 'reg2.html',
        controller: 'reg2Ctrl'
      }
    }
  })
  .state('app.reg3', {
    url: '/reg3',
    views: {
      'menuContent': {
        templateUrl: baseURL + 'reg3.html',
        controller: 'reg3Ctrl'
      }
    }
  })
  .state('app.reg4', {
    url: '/reg4',
    views: {
      'menuContent': {
        templateUrl: baseURL + 'reg4.html',
        controller: 'reg4Ctrl'
      }
    }
  })
  .state('app.reg5', {
    url: '/reg5',
    views: {
      'menuContent': {
        templateUrl: baseURL + 'reg5.html',
        controller: 'reg5Ctrl'
      }
    }
  })
  /*Content*/
  .state('app.filter', {
    url: '/filter',
    views: {
      'menuContent': {
        templateUrl: baseURL + 'filter.html',
         controller: 'filter'
      }
    }
  })
  .state('app.chat', {
    url: '/chat',
    views: {
      'menuContent': {
        templateUrl: baseURL + 'chat.html',
        controller: 'chat'
      }
    }
  })
  /*ContentTabs*/
  .state('tabs', {
    url: "/tab",
    abstract: true,
    templateUrl: baseURL + "tab.html",
    controller: 'tab'
  })
  .state('tabs.mine', {
    url: "/mine",
    views: {
      'mine-tab': {
        templateUrl: baseURL + "content1.mine.html",
        controller: 'mine'
      }
    }
  })
  .state('tabs.content1', {
    url: "/content1",
    views: {
      'buy-tab': {
        templateUrl: baseURL + "content1.html",
        controller: 'content1'
      }
    }
  })
  /*Create*/
  .state('app.create1', {
    url: '/create1',
    views: {
      'menuContent': {
        templateUrl: baseURL + 'create1.html',
        controller: 'create1'
      }
    }
  })
  .state('app.create2', {
    url: '/create2',
    views: {
      'menuContent': {
        templateUrl: baseURL + 'create2.html',
        controller: 'create2'
      }
    }
  })
  .state('app.create3', {
    url: '/create3',
    views: {
      'menuContent': {
        templateUrl: baseURL + 'create3.html',
        controller: 'create3'
      }
    }
  })
  .state('app.create4', {
    url: '/create4',
    views: {
      'menuContent': {
        templateUrl: baseURL + 'create4.html',
        controller: 'create4'
      }
    }
  })
  //Menu
  .state('tabs.contacts', {
    url: '/contacts',
    views: {
      'more-tab': {
        templateUrl: baseURL + 'contacts.html',
        controller: 'contacts'
      }
    }
  })
  .state('tabs.me-profile', {
    url: '/me-profile',
    views: {
      'more-tab': {
        templateUrl: baseURL + 'myProfile.html',
         controller: 'myProfile'
      }
    }
  })
  .state('tabs.seller-profile', {
    url: '/seller-profile',
    views: {
      'more-tab': {
        templateUrl: baseURL + 'sellerProfile.html',
        controller: 'sellerProfile'
      }
    }
  })
  .state('tabs.roomsChat', {
    url: '/roomsChat',
    views: {
      'more-tab': {
        templateUrl: baseURL + 'roomsChat.html',
        controller: 'roomsChat'
      }
    }
  })
  .state('tabs.roomsChatSecond', {
    url: '/roomsChatSecond',
    views: {
      'more-tab': {
        templateUrl: baseURL + 'roomsChatSecond.html',
        controller: 'roomsChatSecond'
      }
    }
  })
  .state('tabs.cashflow', {
    url: '/cashflow',
    views: {
      'more-tab': {
        templateUrl: baseURL + 'cashflow.html',
        controller: 'cashflow'
      }
    }
  })
  .state('tabs.user-selling', {
    url: '/user-selling',
    views: {
      'more-tab': {
        templateUrl: baseURL + 'user-selling.html',
        controller: 'content1'
      }
    }
  })
  .state('tabs.share', {
    url: '/share',
    views: {
      'more-tab': {
        templateUrl: baseURL + 'share.html',
      }
    }
})
  .state('tabs.help', {
    url: '/help',
    views: {
      'more-tab': {
        templateUrl: baseURL + 'help.html',
      }
    }
  })
  .state('tabs.settings', {
    url: '/settings',
    views: {
      'more-tab': {
        templateUrl: baseURL + 'settings.html',
      }
    }
  })
  .state('tabs.ticket', {
    url: '/ticket',
    views: {
      'mine-tab': {
        templateUrl: baseURL + 'ticket.html',
        controller: 'ticket'
      }
    }
  })

/*Step-0-Start*/
  $urlRouterProvider.otherwise('/app/step-1');
  //$urlRouterProvider.otherwise('/app/create4');
})
