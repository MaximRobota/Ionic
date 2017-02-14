//var UserToken;
//function registerPushwooshAndroid() {
//var pushNotification_title = "asdasd";
//	var pushNotification = cordova.require("pushwoosh-cordova-plugin.PushNotification");
//	//set push notifications handler
//	document.addEventListener('push-notification',
//		function(event) {
//			var title = event.notification.title;
//			var userData = event.notification.userdata;
//			//dump custom data to the console if it exists
//			if (typeof(userData) != "undefined") {
//				console.warn('user data: ' + JSON.stringify(userData));
//			}
//			//and show alert
//			alert(title);
//			console.log(title);
//      localStorage.setItem("push_chat_title", title);
//		}
//	);
//	//initialize Pushwoosh with projectid: "GOOGLE_PROJECT_ID", appid : "PUSHWOOSH_APP_ID". This will trigger all pending push notifications on start.
//	pushNotification.onDeviceReady({ projectid: "469696478637", appid : "FC87C-16655" });
//	//register for push notifications
//	pushNotification.registerDevice(
//		function(token) {
//			// alert(token);
//
//      UserToken = token;
//      localStorage.setItem("user_token", UserToken);
//
//      // $.post("http://192.168.0.115/traxi/public/add_device/", {
//      //     token: token
//      //   },
//      //   function(data){
//      //     alert("Data: " + data + "\nStatus: " + status);
//      //   });
//      //callback when pushwoosh is ready
//			onPushwooshAndroidInitialized(token);
//		},
//		function(status) {
//			alert("You don't have android services or you doesn't have internet connection: ");
//			console.warn(JSON.stringify(["You don't have android services or you doesn't have internet connection", status]));
//		}
//	);
//}

angular.module('starter.controllers', ['ionic', 'ngCordova', 'rzModule', 'google.places', 'ngResource', 'angular-toArrayFilter', 'ionic.contrib.ui.tinderCards2', 'angularMoment', 'firebase'])
//---------------------------------------------------------------------------------------------------------------------------------------------------------------
  .controller('AppCtrl', function ($scope, $ionicModal, $timeout, $rootScope) {
  })
//Loading
.constant('$ionicLoadingConfig', {
    content: 'Loading...',
    animation: 'fade-out',
    maxWidth: 200,
    showDelay: 500,
    duration: 30000
})
// email validator
  .directive('validateEmail', function () {
    var EMAIL_REGEXP = /^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;
    return {
      require: 'ngModel',
      restrict: '',
      link: function (scope, elm, attrs, ctrl) {
        if (ctrl && ctrl.$validators.email) {
          ctrl.$validators.email = function (modelValue) {
            return ctrl.$isEmpty(modelValue) || EMAIL_REGEXP.test(modelValue);
          };
        }
      }
    };
  })
// password validator
  .directive('validatePassword', function () {
    return {
      require: 'ngModel',
      link: function (scope, elm, attrs, ctrl) {
        ctrl.$parsers.unshift(function (viewValue) {
          var noMatch = viewValue != scope.myForm.password.$viewValue;
          ctrl.$setValidity('noMatch', !noMatch)
        })
      }
    }
  })
// phone number validator
  .directive('phoneInput', function ($filter, $browser) {
    return {
      require: 'ngModel',
      link: function ($scope, $element, $attrs, ngModelCtrl) {
        var listener = function () {
          var value = $element.val().replace(/[^0-9]/g, '');
          $element.val($filter('tel')(value, false));
        };
        ngModelCtrl.$parsers.push(function (viewValue) {
          return viewValue.replace(/[^0-9]/g, '').slice(0, 10);
        });
        ngModelCtrl.$render = function () {
          $element.val($filter('tel')(ngModelCtrl.$viewValue, false));
        };
        $element.bind('change', listener);
        $element.bind('keydown', function (event) {
          var key = event.keyCode;
          if (key == 91 || (15 < key && key < 19) || (37 <= key && key <= 40)) {
            return;
          }
          $browser.defer(listener);
        });
        $element.bind('paste cut', function () {
          $browser.defer(listener);
        });
      }
    };
  })
// phone number validator filter
//  .filter('tel', function () {
//    return function (tel) {
//      if (!tel) {
//        return '';
//      }
//      var value = tel.toString().trim().replace(/^\+/, '');
//      if (value.match(/[^0-9]/)) {
//        return tel;
//      }
//      var city, number;
//      switch (value.length) {
//        case 1:
//        case 2:
//          city = value;
//          break;
//        default:
//          city = value.slice(0, 2);
//          number = value.slice(2);
//      }
//      if (number) {
//        if (number.length > 3) {
//          number = number.slice(0, 3) + '-' + number.slice(3, 7);
//        }
//        else {
//          number = number;
//        }
//        return ("" + city + " " + number).trim();
//      }
//      else {
//        return "(" + city;
//      }
//    };
//  })
//3 radioButton Filter
  .directive('groupedRadio', function() {
    return {
      restrict: 'A',
      require: 'ngModel',
      scope: {
        model: '=ngModel',
        value: '=groupedRadio'
      },
      link: function(scope, element, attrs, ngModelCtrl) {
        element.addClass('button');
        element.on('click', function(e) {
          scope.$apply(function() {
            ngModelCtrl.$setViewValue(scope.value);
          });
        });

        scope.$watch('model', function(newVal) {
          element.removeClass('button-positive');
          if (newVal === scope.value) {
            element.addClass('button-positive');
            console.log(newVal);
          }
        });
      }
    };
  })
//---------------------------------------------------------------------------------------------------------------------------------------------------------------
  .controller('step-1', function ($scope, $state, $ionicSlideBoxDelegate) {
    if (localStorage.getItem('Verification_Phone')) {
                $rootScope.verificationPhone = localStorage.getItem('Verification_Phone');
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
                        $rootScope.editProfileUser = false;
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
    $scope.next = function () {
      $ionicSlideBoxDelegate.next();
    };
    $scope.previous = function () {
      $ionicSlideBoxDelegate.previous();
    };
  })
//---------------------------------------------------------------------------------------------------------------------------------------------------------------
  .controller('step-2', function ($scope, $rootScope, $ionicLoading, $http, $ionicPopup,  $timeout) {
  // SMS verification
    if(( /(ipad|iphone|ipod|android)/i.test(navigator.userAgent) )) {
        document.addEventListener('deviceready', initApp, false);
    } else {
        $scope.updateStatus('need run on mobile device for full functionalities.');
    }
    // we will restore the intercepted SMS here, for later restore
    var smsList = [];
    var interceptEnabled = false;
    function initApp() {
      if (! SMS ) { alert( 'SMS plugin not ready' ); return; }
        document.addEventListener('onSMSArrive', function(e){
         var data = {body : e.data.body};
         $scope.data = {body : e.data.body};
              $scope.codePopup = function(data) {
                var myPopup = $ionicPopup.show({
                  template: '<input type="text" id="lol" ng-model="data.body">',
                  title: 'Please enter code',
                  scope: $scope,
                  buttons: [
                    {text: 'Cancel'},
                    {
                      text: '<b>Send</b>',
                      type: 'button-positive',
                      onTap: function (e) {
                        if (!data.body) {
                          e.preventDefault();
                        } else {
  // past function for IOS (copy/past)
                        }
                      }
                    }
                  ]
                })
                myPopup.then(function() {
                  $ionicLoading.show();
                  $scope.verificationCodePost = {"code": $scope.data.body, "phone": $rootScope.verificationPhone};
                  $http.post('http://leadr.jellyworkz.com/api/v1/phone/check', $scope.verificationCodePost)
                   .success(function (data) {
                     $ionicLoading.hide();
                     if(data.success == true){
                       $ionicLoading.show();
                       $http({
                         method: 'GET',
                         url: 'http://leadr.jellyworkz.com/api/v1/user-find/' + $rootScope.verificationPhone
                       }).success(function (data) {
                         if (data) {
                           $ionicLoading.hide();
                           location.href = '#/app/step-3';
                           $scope.stopWatch();
                           $rootScope.userAccount = data;
                           console.log($rootScope.userAccount);
                           console.log($rootScope.verificationPhone);
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
                           $scope.stopWatch();
                         }
                       })
                       .error(function (data, status, header) {
                         $ionicLoading.hide();
                         alert("Alert )))")
                       });
                     }else{
                       $ionicLoading.hide();
                       $scope.codePopup($scope.data);
                     }
                   })
                   .error(function (data, status, header) {
                     $ionicLoading.hide();
                     alert("Alert code )))")
                     $scope.codePopup($scope.data);
                   });
                });
                $timeout(function() {
                     myPopup.close(); //close the popup after 3 seconds for some reason
                  }, 3000);
                }
          $scope.codePopup($scope.data);
          smsList.push( data );
          $scope.updateStatus('SMS arrived, count: ' + smsList.length );
          var divdata = angular.element(document.getElementById('data'));
          divdata.html( divdata.html() + JSON.stringify( data ) );
        });
    }
    $scope.update = function (id, str) {
      angular.element(document.getElementById(id)).html( str );
    }
    $scope.updateStatus = function (str) {
      angular.element(document.getElementById('status')).html( str );
    }
    $scope.updateData = function (str) {
    alert(str.body);
    $scope.codeBody = str.body;
      angular.element(document.getElementById('data')).html( str );
    }
     $scope.sendSMS = function () {
      var sendto = angular.element(document.getElementById('sendto')).val().trim();
      var textmsg =  angular.element(document.getElementById('textmsg')).val();
      if(sendto.indexOf(";") >=0) {
        sendto = sendto.split(";");
        for(i in sendto) {
          sendto[i] = sendto[i].trim();
        }
      }
      if(SMS) SMS.sendSMS(sendto, textmsg, function(){}, function(str){alert(str);});
    }
    $scope.listSMS = function () {
    $scope.updateData('');
      if(SMS) SMS.listSMS({}, function(data){
      $scope.updateStatus('sms listed as json array');
      var html = "";
        if(Array.isArray(data)) {
          for(var i in data) {
            var sms = data[i];
            smsList.push(sms);
            html += sms.address + ": " + sms.body + "<br/>";
          }
        }
        $scope.updateData( html );

      }, function(err){
        $scope.updateStatus('error list sms: ' + err);
      });
    }
    $scope.deleteLastSMS = function () {
    $scope.updateData('');
      if(smsList.length == 0) {
        $scope.updateStatus( 'no sms id to delete' );
        return;
      }
    var sms = smsList.pop();
      if(SMS) SMS.deleteSMS({
        _id : sms["_id"]
      }, function( n ){
        $scope.updateStatus( n + ' sms messages deleted' );
      }, function(err){
        $scope.updateStatus('error delete sms: ' + err);
      });
    }
     $scope.restoreAllSMS = function () {
    $scope.updateData('');
      if(SMS) SMS.restoreSMS(smsList, function( n ){
        // clear the list if restore successfully
        smsList.length = 0;
        $scope.updateStatus(n + ' sms messages restored');
      }, function(err){
        $scope.updateStatus('error restore sms: ' + err);
      });
    }
    $scope.startWatch = function () {
    console.log("startWatch");
      if(SMS) SMS.startWatch(function(){
        $scope.update('watching', 'watching started');
      }, function(){
        $scope.updateStatus('failed to start watching');
      });
    }
    $scope.stopWatch = function () {
      if(SMS) SMS.stopWatch(function(){
        $scope.update('watching', 'watching stopped');
      }, function(){
        $scope.updateStatus('failed to stop watching');
      });
    }
    $scope.toggleIntercept = function () {
      interceptEnabled = ! interceptEnabled;
      if(interceptEnabled) { // clear the list before we start intercept
        smsList.length = 0;
      }

      if(SMS) SMS.enableIntercept(interceptEnabled, function(){}, function(){});
      angular.element(document.getElementById('intercept')).text( 'intercept ' + (interceptEnabled ? 'ON' : 'OFF') );
      angular.element(document.getElementById('enable_intercept')).text( interceptEnabled ? 'Disable' : 'Enable' );
    }
  //
    $scope.mobNumberNext = function (data) {
      $ionicLoading.show();
      $rootScope.verificationPhone = "";
      $rootScope.verificationPhone = (data.code + data.phone).replace(/\s+/g, '');
      console.log($rootScope.verificationPhone);
      if (data.code && data.phone) {
      $scope.startWatch();
        $scope.verificationPhonePost = {"phone": $rootScope.verificationPhone};
        $http.post('http://leadr.jellyworkz.com/api/v1/phone/verification', $scope.verificationPhonePost)
        .success(function (data) {
           console.log(data.success);
           if(data.success == true){
            $ionicLoading.hide();
           }
        })
        .error(function (data, status, header) {
          alert("Alert tel )))")
        });
      }
    };
    $scope.countries = [
                       {
                       "name": "Afghanistan",
                       "dial_code": " +    93  ",
                       "code": "AF"
                       },
                       {
                       "name": "Aland Islands",
                       "dial_code": " + 358  ",
                       "code": "AX"
                       },
                       {
                       "name": "Albania",
                       "dial_code": "+355 ",
                       "code": "AL"
                       },
                       {
                       "name": "Algeria",
                       "dial_code": "+213 ",
                       "code": "DZ"
                       },
                       {
                       "name": "AmericanSamoa",
                       "dial_code": "+1684",
                       "code": "AS"
                       },
                       {
                       "name": "Andorra",
                       "dial_code": "+376 ",
                       "code": "AD"
                       },
                       {
                       "name": "Angola",
                       "dial_code": "+244 ",
                       "code": "AO"
                       },
                       {
                       "name": "Anguilla",
                       "dial_code": "+1264",
                       "code": "AI"
                       },
                       {
                       "name": "Antarctica",
                       "dial_code": "+672 ",
                       "code": "AQ"
                       },
                       {
                       "name": "Antigua and Barbuda",
                       "dial_code": "+1268",
                       "code": "AG"
                       },
                       {
                       "name": "Argentina",
                       "dial_code": "+54  ",
                       "code": "AR"
                       },
                       {
                       "name": "Armenia",
                       "dial_code": "+374 ",
                       "code": "AM"
                       },
                       {
                       "name": "Aruba",
                       "dial_code": "+297 ",
                       "code": "AW"
                       },
                       {
                       "name": "Australia",
                       "dial_code": "+61  ",
                       "code": "AU"
                       },
                       {
                       "name": "Austria",
                       "dial_code": "+43  ",
                       "code": "AT"
                       },
                       {
                       "name": "Azerbaijan",
                       "dial_code": "+994 ",
                       "code": "AZ"
                       },
                       {
                       "name": "Bahamas",
                       "dial_code": "+1242",
                       "code": "BS"
                       },
                       {
                       "name": "Bahrain",
                       "dial_code": "+973 ",
                       "code": "BH"
                       },
                       {
                       "name": "Bangladesh",
                       "dial_code": "+880 ",
                       "code": "BD"
                       },
                       {
                       "name": "Barbados",
                       "dial_code": "+1246",
                       "code": "BB"
                       },
                       {
                       "name": "Belarus",
                       "dial_code": "+375 ",
                       "code": "BY"
                       },
                       {
                       "name": "Belgium",
                       "dial_code": "+32  ",
                       "code": "BE"
                       },
                       {
                       "name": "Belize",
                       "dial_code": "+501 ",
                       "code": "BZ"
                       },
                       {
                       "name": "Benin",
                       "dial_code": "+229 ",
                       "code": "BJ"
                       },
                       {
                       "name": "Bermuda",
                       "dial_code": "+1441",
                       "code": "BM"
                       },
                       {
                       "name": "Bhutan",
                       "dial_code": "+975 ",
                       "code": "BT"
                       },
                       {
                       "name": "Bolivia, Plurinational State of",
                       "dial_code": "+591 ",
                       "code": "BO"
                       },
                       {
                       "name": "Bosnia and Herzegovina",
                       "dial_code": "+387 ",
                       "code": "BA"
                       },
                       {
                       "name": "Botswana",
                       "dial_code": "+267 ",
                       "code": "BW"
                       },
                       {
                       "name": "Brazil",
                       "dial_code": "+55  ",
                       "code": "BR"
                       },
                       {
                       "name": "British Indian Ocean Territory",
                       "dial_code": "+246 ",
                       "code": "IO"
                       },
                       {
                       "name": "Brunei Darussalam",
                       "dial_code": "+673 ",
                       "code": "BN"
                       },
                       {
                       "name": "Bulgaria",
                       "dial_code": "+359 ",
                       "code": "BG"
                       },
                       {
                       "name": "Burkina Faso",
                       "dial_code": "+226 ",
                       "code": "BF"
                       },
                       {
                       "name": "Burundi",
                       "dial_code": "+257 ",
                       "code": "BI"
                       },
                       {
                       "name": "Cambodia",
                       "dial_code": "+855 ",
                       "code": "KH"
                       },
                       {
                       "name": "Cameroon",
                       "dial_code": "+237 ",
                       "code": "CM"
                       },
                       {
                       "name": "Canada",
                       "dial_code": "+1   ",
                       "code": "CA"
                       },
                       {
                       "name": "Cape Verde",
                       "dial_code": "+238 ",
                       "code": "CV"
                       },
                       {
                       "name": "Cayman Islands",
                       "dial_code": "+345 ",
                       "code": "KY"
                       },
                       {
                       "name": "Central African Republic",
                       "dial_code": "+236 ",
                       "code": "CF"
                       },
                       {
                       "name": "Chad",
                       "dial_code": "+235 ",
                       "code": "TD"
                       },
                       {
                       "name": "Chile",
                       "dial_code": "+56  ",
                       "code": "CL"
                       },
                       {
                       "name": "China",
                       "dial_code": "+86  ",
                       "code": "CN"
                       },
                       {
                       "name": "Christmas Island",
                       "dial_code": "+61  ",
                       "code": "CX"
                       },
                       {
                       "name": "Cocos (Keeling) Islands",
                       "dial_code": "+61  ",
                       "code": "CC"
                       },
                       {
                       "name": "Colombia",
                       "dial_code": "+57  ",
                       "code": "CO"
                       },
                       {
                       "name": "Comoros",
                       "dial_code": "+269 ",
                       "code": "KM"
                       },
                       {
                       "name": "Congo",
                       "dial_code": "+242 ",
                       "code": "CG"
                       },
                       {
                       "name": "Congo, The Democratic Republic of the Congo",
                       "dial_code": "+243 ",
                       "code": "CD"
                       },
                       {
                       "name": "Cook Islands",
                       "dial_code": "+682 ",
                       "code": "CK"
                       },
                       {
                       "name": "Costa Rica",
                       "dial_code": "+506 ",
                       "code": "CR"
                       },
                       {
                       "name": "Cote d'Ivoire",
                       "dial_code": "+225 ",
                       "code": "CI"
                       },
                       {
                       "name": "Croatia",
                       "dial_code": "+385 ",
                       "code": "HR"
                       },
                       {
                       "name": "Cuba",
                       "dial_code": "+53  ",
                       "code": "CU"
                       },
                       {
                       "name": "Cyprus",
                       "dial_code": "+357 ",
                       "code": "CY"
                       },
                       {
                       "name": "Czech Republic",
                       "dial_code": "+420 ",
                       "code": "CZ"
                       },
                       {
                       "name": "Denmark",
                       "dial_code": "+45  ",
                       "code": "DK"
                       },
                       {
                       "name": "Djibouti",
                       "dial_code": "+253 ",
                       "code": "DJ"
                       },
                       {
                       "name": "Dominica",
                       "dial_code": "+1767",
                       "code": "DM"
                       },
                       {
                       "name": "Dominican Republic",
                       "dial_code": "+1849",
                       "code": "DO"
                       },
                       {
                       "name": "Ecuador",
                       "dial_code": "+593 ",
                       "code": "EC"
                       },
                       {
                       "name": "Egypt",
                       "dial_code": "+20  ",
                       "code": "EG"
                       },
                       {
                       "name": "El Salvador",
                       "dial_code": "+503 ",
                       "code": "SV"
                       },
                       {
                       "name": "Equatorial Guinea",
                       "dial_code": "+240 ",
                       "code": "GQ"
                       },
                       {
                       "name": "Eritrea",
                       "dial_code": "+291 ",
                       "code": "ER"
                       },
                       {
                       "name": "Estonia",
                       "dial_code": "+372 ",
                       "code": "EE"
                       },
                       {
                       "name": "Ethiopia",
                       "dial_code": "+251 ",
                       "code": "ET"
                       },
                       {
                       "name": "Falkland Islands (Malvinas)",
                       "dial_code": "+500 ",
                       "code": "FK"
                       },
                       {
                       "name": "Faroe Islands",
                       "dial_code": "+298 ",
                       "code": "FO"
                       },
                       {
                       "name": "Fiji",
                       "dial_code": "+679 ",
                       "code": "FJ"
                       },
                       {
                       "name": "Finland",
                       "dial_code": "+358 ",
                       "code": "FI"
                       },
                       {
                       "name": "France",
                       "dial_code": "+33  ",
                       "code": "FR"
                       },
                       {
                       "name": "French Guiana",
                       "dial_code": "+594 ",
                       "code": "GF"
                       },
                       {
                       "name": "French Polynesia",
                       "dial_code": "+689 ",
                       "code": "PF"
                       },
                       {
                       "name": "Gabon",
                       "dial_code": "+241 ",
                       "code": "GA"
                       },
                       {
                       "name": "Gambia",
                       "dial_code": "+220 ",
                       "code": "GM"
                       },
                       {
                       "name": "Georgia",
                       "dial_code": "+995 ",
                       "code": "GE"
                       },
                       {
                       "name": "Germany",
                       "dial_code": "+49  ",
                       "code": "DE"
                       },
                       {
                       "name": "Ghana",
                       "dial_code": "+233 ",
                       "code": "GH"
                       },
                       {
                       "name": "Gibraltar",
                       "dial_code": "+350 ",
                       "code": "GI"
                       },
                       {
                       "name": "Greece",
                       "dial_code": "+30  ",
                       "code": "GR"
                       },
                       {
                       "name": "Greenland",
                       "dial_code": "+299 ",
                       "code": "GL"
                       },
                       {
                       "name": "Grenada",
                       "dial_code": "+1473",
                       "code": "GD"
                       },
                       {
                       "name": "Guadeloupe",
                       "dial_code": "+590 ",
                       "code": "GP"
                       },
                       {
                       "name": "Guam",
                       "dial_code": "+1671",
                       "code": "GU"
                       },
                       {
                       "name": "Guatemala",
                       "dial_code": "+502 ",
                       "code": "GT"
                       },
                       {
                       "name": "Guernsey",
                       "dial_code": "+44  ",
                       "code": "GG"
                       },
                       {
                       "name": "Guinea",
                       "dial_code": "+224 ",
                       "code": "GN"
                       },
                       {
                       "name": "Guinea-Bissau",
                       "dial_code": "+245 ",
                       "code": "GW"
                       },
                       {
                       "name": "Guyana",
                       "dial_code": "+595 ",
                       "code": "GY"
                       },
                       {
                       "name": "Haiti",
                       "dial_code": "+509 ",
                       "code": "HT"
                       },
                       {
                       "name": "Holy See (Vatican City State)",
                       "dial_code": "+379 ",
                       "code": "VA"
                       },
                       {
                       "name": "Honduras",
                       "dial_code": "+504 ",
                       "code": "HN"
                       },
                       {
                       "name": "Hong Kong",
                       "dial_code": "+852 ",
                       "code": "HK"
                       },
                       {
                       "name": "Hungary",
                       "dial_code": "+36  ",
                       "code": "HU"
                       },
                       {
                       "name": "Iceland",
                       "dial_code": "+354 ",
                       "code": "IS"
                       },
                       {
                       "name": "India",
                       "dial_code": "+91  ",
                       "code": "IN"
                       },
                       {
                       "name": "Indonesia",
                       "dial_code": "+62  ",
                       "code": "ID"
                       },
                       {
                       "name": "Iran, Islamic Republic of Persian Gulf",
                       "dial_code": "+98  ",
                       "code": "IR"
                       },
                       {
                       "name": "Iraq",
                       "dial_code": "+964 ",
                       "code": "IQ"
                       },
                       {
                       "name": "Ireland",
                       "dial_code": "+353  ",
                       "code": "IE"
                       },
                       {
                       "name": "Isle of Man",
                       "dial_code": "+44  ",
                       "code": "IM"
                       },
                       {
                       "name": "Israel",
                       "dial_code": "+972 ",
                       "code": "IL"
                       },
                       {
                       "name": "Italy",
                       "dial_code": "+39  ",
                       "code": "IT"
                       },
                       {
                       "name": "Jamaica",
                       "dial_code": "+1876",
                       "code": "JM"
                       },
                       {
                       "name": "Japan",
                       "dial_code": "+81  ",
                       "code": "JP"
                       },
                       {
                       "name": "Jersey",
                       "dial_code": "+44  ",
                       "code": "JE"
                       },
                       {
                       "name": "Jordan",
                       "dial_code": "+962 ",
                       "code": "JO"
                       },
                       {
                       "name": "Kazakhstan",
                       "dial_code": "+7 7 ",
                       "code": "KZ"
                       },
                       {
                       "name": "Kenya",
                       "dial_code": "+254 ",
                       "code": "KE"
                       },
                       {
                       "name": "Kiribati",
                       "dial_code": "+686 ",
                       "code": "KI"
                       },
                       {
                       "name": "Korea, Democratic People's Republic of Korea",
                       "dial_code": "+850 ",
                       "code": "KP"
                       },
                       {
                       "name": "Korea, Republic of South Korea",
                       "dial_code": "+82 ",
                       "code": "KR"
                       },
                       {
                       "name": "Kuwait",
                       "dial_code": "+965 ",
                       "code": "KW"
                       },
                       {
                       "name": "Kyrgyzstan",
                       "dial_code": "+996 ",
                       "code": "KG"
                       },
                       {
                       "name": "Laos",
                       "dial_code": "+856 ",
                       "code": "LA"
                       },
                       {
                       "name": "Latvia",
                       "dial_code": "+371 ",
                       "code": "LV"
                       },
                       {
                       "name": "Lebanon",
                       "dial_code": "+961 ",
                       "code": "LB"
                       },
                       {
                       "name": "Lesotho",
                       "dial_code": "+266 ",
                       "code": "LS"
                       },
                       {
                       "name": "Liberia",
                       "dial_code": "+231 ",
                       "code": "LR"
                       },
                       {
                       "name": "Libyan Arab Jamahiriya",
                       "dial_code": "+218 ",
                       "code": "LY"
                       },
                       {
                       "name": "Liechtenstein",
                       "dial_code": "+423 ",
                       "code": "LI"
                       },
                       {
                       "name": "Lithuania",
                       "dial_code": "+370 ",
                       "code": "LT"
                       },
                       {
                       "name": "Luxembourg",
                       "dial_code": "+352 ",
                       "code": "LU"
                       },
                       {
                       "name": "Macao",
                       "dial_code": "+853 ",
                       "code": "MO"
                       },
                       {
                       "name": "Macedonia",
                       "dial_code": "+389 ",
                       "code": "MK"
                       },
                       {
                       "name": "Madagascar",
                       "dial_code": "+261 ",
                       "code": "MG"
                       },
                       {
                       "name": "Malawi",
                       "dial_code": "+265 ",
                       "code": "MW"
                       },
                       {
                       "name": "Malaysia",
                       "dial_code": "+60  ",
                       "code": "MY"
                       },
                       {
                       "name": "Maldives",
                       "dial_code": "+960 ",
                       "code": "MV"
                       },
                       {
                       "name": "Mali",
                       "dial_code": "+223 ",
                       "code": "ML"
                       },
                       {
                       "name": "Malta",
                       "dial_code": "+356 ",
                       "code": "MT"
                       },
                       {
                       "name": "Marshall Islands",
                       "dial_code": "+692 ",
                       "code": "MH"
                       },
                       {
                       "name": "Martinique",
                       "dial_code": "+596 ",
                       "code": "MQ"
                       },
                       {
                       "name": "Mauritania",
                       "dial_code": "+222 ",
                       "code": "MR"
                       },
                       {
                       "name": "Mauritius",
                       "dial_code": "+230 ",
                       "code": "MU"
                       },
                       {
                       "name": "Mayotte",
                       "dial_code": "+262 ",
                       "code": "YT"
                       },
                       {
                       "name": "Mexico",
                       "dial_code": "+52  ",
                       "code": "MX"
                       },
                       {
                       "name": "Micronesia, Federated States of Micronesia",
                       "dial_code": "+691 ",
                       "code": "FM"
                       },
                       {
                       "name": "Moldova",
                       "dial_code": "+373 ",
                       "code": "MD"
                       },
                       {
                       "name": "Monaco",
                       "dial_code": "+377 ",
                       "code": "MC"
                       },
                       {
                       "name": "Mongolia",
                       "dial_code": "+976 ",
                       "code": "MN"
                       },
                       {
                       "name": "Montenegro",
                       "dial_code": "+382 ",
                       "code": "ME"
                       },
                       {
                       "name": "Montserrat",
                       "dial_code": "+1664",
                       "code": "MS"
                       },
                       {
                       "name": "Morocco",
                       "dial_code": "+212 ",
                       "code": "MA"
                       },
                       {
                       "name": "Mozambique",
                       "dial_code": "+258 ",
                       "code": "MZ"
                       },
                       {
                       "name": "Myanmar",
                       "dial_code": "+95  ",
                       "code": "MM"
                       },
                       {
                       "name": "Namibia",
                       "dial_code": "+264 ",
                       "code": "NA"
                       },
                       {
                       "name": "Nauru",
                       "dial_code": "+674 ",
                       "code": "NR"
                       },
                       {
                       "name": "Nepal",
                       "dial_code": "+977 ",
                       "code": "NP"
                       },
                       {
                       "name": "Netherlands",
                       "dial_code": "+31  ",
                       "code": "NL"
                       },
                       {
                       "name": "Netherlands Antilles",
                       "dial_code": "+599 ",
                       "code": "AN"
                       },
                       {
                       "name": "New Caledonia",
                       "dial_code": "+687 ",
                       "code": "NC"
                       },
                       {
                       "name": "New Zealand",
                       "dial_code": "+64  ",
                       "code": "NZ"
                       },
                       {
                       "name": "Nicaragua",
                       "dial_code": "+505 ",
                       "code": "NI"
                       },
                       {
                       "name": "Niger",
                       "dial_code": "+227 ",
                       "code": "NE"
                       },
                       {
                       "name": "Nigeria",
                       "dial_code": "+234 ",
                       "code": "NG"
                       },
                       {
                       "name": "Niue",
                       "dial_code": "+683 ",
                       "code": "NU"
                       },
                       {
                       "name": "Norfolk Island",
                       "dial_code": "+672 ",
                       "code": "NF"
                       },
                       {
                       "name": "Northern Mariana Islands",
                       "dial_code": "+1670",
                       "code": "MP"
                       },
                       {
                       "name": "Norway",
                       "dial_code": "+47  ",
                       "code": "NO"
                       },
                       {
                       "name": "Oman",
                       "dial_code": "+968 ",
                       "code": "OM"
                       },
                       {
                       "name": "Pakistan",
                       "dial_code": "+92  ",
                       "code": "PK"
                       },
                       {
                       "name": "Palau",
                       "dial_code": "+680 ",
                       "code": "PW"
                       },
                       {
                       "name": "Palestinian Territory, Occupied",
                       "dial_code": "+970 ",
                       "code": "PS"
                       },
                       {
                       "name": "Panama",
                       "dial_code": "+507 ",
                       "code": "PA"
                       },
                       {
                       "name": "Papua New Guinea",
                       "dial_code": "+675 ",
                       "code": "PG"
                       },
                       {
                       "name": "Paraguay",
                       "dial_code": "+595 ",
                       "code": "PY"
                       },
                       {
                       "name": "Peru",
                       "dial_code": "+51  ",
                       "code": "PE"
                       },
                       {
                       "name": "Philippines",
                       "dial_code": "+63  ",
                       "code": "PH"
                       },
                       {
                       "name": "Pitcairn",
                       "dial_code": "+872 ",
                       "code": "PN"
                       },
                       {
                       "name": "Poland",
                       "dial_code": "+48  ",
                       "code": "PL"
                       },
                       {
                       "name": "Portugal",
                       "dial_code": "+351 ",
                       "code": "PT"
                       },
                       {
                       "name": "Puerto Rico",
                       "dial_code": "+1939",
                       "code": "PR"
                       },
                       {
                       "name": "Qatar",
                       "dial_code": "+974 ",
                       "code": "QA"
                       },
                       {
                       "name": "Romania",
                       "dial_code": "+40  ",
                       "code": "RO"
                       },
                       {
                       "name": "Russia",
                       "dial_code": "+7   ",
                       "code": "RU"
                       },
                       {
                       "name": "Rwanda",
                       "dial_code": "+250 ",
                       "code": "RW"
                       },
                       {
                       "name": "Reunion",
                       "dial_code": "+262 ",
                       "code": "RE"
                       },
                       {
                       "name": "Saint Barthelemy",
                       "dial_code": "+590 ",
                       "code": "BL"
                       },
                       {
                       "name": "Saint Helena, Ascension and Tristan Da Cunha",
                       "dial_code": "+290 ",
                       "code": "SH"
                       },
                       {
                       "name": "Saint Kitts and Nevis",
                       "dial_code": "+1869",
                       "code": "KN"
                       },
                       {
                       "name": "Saint Lucia",
                       "dial_code": "+1758",
                       "code": "LC"
                       },
                       {
                       "name": "Saint Martin",
                       "dial_code": "+590 ",
                       "code": "MF"
                       },
                       {
                       "name": "Saint Pierre and Miquelon",
                       "dial_code": "+508 ",
                       "code": "PM"
                       },
                       {
                       "name": "Saint Vincent and the Grenadines",
                       "dial_code": "+1784",
                       "code": "VC"
                       },
                       {
                       "name": "Samoa",
                       "dial_code": "+685 ",
                       "code": "WS"
                       },
                       {
                       "name": "San Marino",
                       "dial_code": "+378 ",
                       "code": "SM"
                       },
                       {
                       "name": "Sao Tome and Principe",
                       "dial_code": "+239 ",
                       "code": "ST"
                       },
                       {
                       "name": "Saudi Arabia",
                       "dial_code": "+966 ",
                       "code": "SA"
                       },
                       {
                       "name": "Senegal",
                       "dial_code": "+221 ",
                       "code": "SN"
                       },
                       {
                       "name": "Serbia",
                       "dial_code": "+381 ",
                       "code": "RS"
                       },
                       {
                       "name": "Seychelles",
                       "dial_code": "+248 ",
                       "code": "SC"
                       },
                       {
                       "name": "Sierra Leone",
                       "dial_code": "+232 ",
                       "code": "SL"
                       },
                       {
                       "name": "Singapore",
                       "dial_code": "+65  ",
                       "code": "SG"
                       },
                       {
                       "name": "Slovakia",
                       "dial_code": "+421 ",
                       "code": "SK"
                       },
                       {
                       "name": "Slovenia",
                       "dial_code": "+386 ",
                       "code": "SI"
                       },
                       {
                       "name": "Solomon Islands",
                       "dial_code": "+677 ",
                       "code": "SB"
                       },
                       {
                       "name": "Somalia",
                       "dial_code": "+252 ",
                       "code": "SO"
                       },
                       {
                       "name": "South Africa",
                       "dial_code": "+27  ",
                       "code": "ZA"
                       },
                       {
                       "name": "South Georgia and the South Sandwich Islands",
                       "dial_code": "+500 ",
                       "code": "GS"
                       },
                       {
                       "name": "Spain",
                       "dial_code": "+34  ",
                       "code": "ES"
                       },
                       {
                       "name": "Sri Lanka",
                       "dial_code": "+94  ",
                       "code": "LK"
                       },
                       {
                       "name": "Sudan",
                       "dial_code": "+249 ",
                       "code": "SD"
                       },
                       {
                       "name": "Suriname",
                       "dial_code": "+597 ",
                       "code": "SR"
                       },
                       {
                       "name": "Svalbard and Jan Mayen",
                       "dial_code": "+47  ",
                       "code": "SJ"
                       },
                       {
                       "name": "Swaziland",
                       "dial_code": "+268 ",
                       "code": "SZ"
                       },
                       {
                       "name": "Sweden",
                       "dial_code": "+46  ",
                       "code": "SE"
                       },
                       {
                       "name": "Switzerland",
                       "dial_code": "+41  ",
                       "code": "CH"
                       },
                       {
                       "name": "Syrian Arab Republic",
                       "dial_code": "+963 ",
                       "code": "SY"
                       },
                       {
                       "name": "Taiwan",
                       "dial_code": "+886 ",
                       "code": "TW"
                       },
                       {
                       "name": "Tajikistan",
                       "dial_code": "+992 ",
                       "code": "TJ"
                       },
                       {
                       "name": "Tanzania, United Republic of Tanzania",
                       "dial_code": "+255 ",
                       "code": "TZ"
                       },
                       {
                       "name": "Thailand",
                       "dial_code": "+66  ",
                       "code": "TH"
                       },
                       {
                       "name": "Timor-Leste",
                       "dial_code": "+670 ",
                       "code": "TL"
                       },
                       {
                       "name": "Togo",
                       "dial_code": "+228 ",
                       "code": "TG"
                       },
                       {
                       "name": "Tokelau",
                       "dial_code": "+690 ",
                       "code": "TK"
                       },
                       {
                       "name": "Tonga",
                       "dial_code": "+676 ",
                       "code": "TO"
                       },
                       {
                       "name": "Trinidad and Tobago",
                       "dial_code": "+1868",
                       "code": "TT"
                       },
                       {
                       "name": "Tunisia",
                       "dial_code": "+216 ",
                       "code": "TN"
                       },
                       {
                       "name": "Turkey",
                       "dial_code": "+90  ",
                       "code": "TR"
                       },
                       {
                       "name": "Turkmenistan",
                       "dial_code": "+993 ",
                       "code": "TM"
                       },
                       {
                       "name": "Turks and Caicos Islands",
                       "dial_code": "+1649",
                       "code": "TC"
                       },
                       {
                       "name": "Tuvalu",
                       "dial_code": "+688 ",
                       "code": "TV"
                       },
                       {
                       "name": "Uganda",
                       "dial_code": "+256",
                       "code": "UG"
                       },
//                       {
//                       "name": "Ukraine",
//                       "dial_code": "+380 ",
//                       "code": "UA"
//                       },
                       {
                       "name": "United Arab Emirates",
                       "dial_code": "+971 ",
                       "code": "AE"
                       },
                       {
                       "name": "United Kingdom",
                       "dial_code": "+44  ",
                       "code": "GB"
                       },
                       {
                       "name": "United States",
                       "dial_code": "+1 ",
                       "code": "US"
                       },
                       {
                       "name": "Uruguay",
                       "dial_code": "+598 ",
                       "code": "UY"
                       },
                       {
                       "name": "Uzbekistan",
                       "dial_code": "+998 ",
                       "code": "UZ"
                       },
                       {
                       "name": "Vanuatu",
                       "dial_code": "+678 ",
                       "code": "VU"
                       },
                       {
                       "name": "Venezuela, Bolivarian Republic of Venezuela",
                       "dial_code": "+58  ",
                       "code": "VE"
                       },
                       {
                       "name": "Vietnam",
                       "dial_code": "+84  ",
                       "code": "VN"
                       },
                       {
                       "name": "Virgin Islands, British",
                       "dial_code": "+1284",
                       "code": "VG"
                       },
                       {
                       "name": "Virgin Islands, U.S.",
                       "dial_code": "+1340",
                       "code": "VI"
                       },
                       {
                       "name": "Wallis and Futuna",
                       "dial_code": "+681 ",
                       "code": "WF"
                       },
                       {
                       "name": "Yemen",
                       "dial_code": "+967 ",
                       "code": "YE"
                       },
                       {
                       "name": "Zambia",
                       "dial_code": "+260 ",
                       "code": "ZM"
                       },
                       {
                       "name": "Zimbabwe",
                       "dial_code": "+263 ",
                       "code": "ZW"
                       },
                                              {
                                              "name": "Ukraine",
                                              "dial_code": "+380 ",
                                              "code": "UA"
                                              }
                       ];
  })
//---------------------------------------------------------------------------------------------------------------------------------------------------------------
  .controller('step-3', function ($scope, UserService, $rootScope, $http, $ionicLoading, backcallFactory) {
    backcallFactory.backcallfun();
    $rootScope.verificationLinkedin, $rootScope.verificationFacebook, $rootScope.verificationGoogle, $rootScope.verificationEmail, $rootScope.verificationOther = null;
//linkedin login
    var app = {
      initialize: function () {
        this.bindEvents();
      },
      bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
      },
      onDeviceReady: function () {
        app.receivedEvent('deviceready');
      },
      receivedEvent: function (id) {
        SocialGap.Linkedin_ChangeSettings('apiKey', 'secretKey', 'ldAppDomain', 'ldScopes');
        console.log('Received Event: ' + id + apiKey + ldAppDomain + ldScopes);
      },
      logonSuccess: function (accessToken) {
        console.log(accessToken);
        $rootScope.verificationLinkedin = accessToken;
        var rand = 2 + Math.random() * (9999 - 2);
        rand = Math.round(rand);
        $rootScope.verificationEmail = "qwe" + rand + "@grail.com";
        $ionicLoading.show();
        $http({
          method: 'GET',
          url: 'http://leadr.jellyworkz.com/api/v1/user-token/' + $rootScope.verificationLinkedin
        }).success(function (data) {
          if (data) {
            location.href = '#/tab/content1';
            $rootScope.editProfileUser = false;
            $rootScope.userAccount = data;
            localStorage.setItem('Verification_Phone', $rootScope.verificationPhone);
            localStorage.setItem('Verification_LinkedIn_Token', $rootScope.verificationLinkedin);
          } else {
            $http({
              method: 'GET',
              url: 'http://leadr.jellyworkz.com/api/v1/user-find/' + $rootScope.verificationPhone
            }).success(function (data) {
              if (data) {
                console.log(data);
                $ionicLoading.hide();
                $rootScope.userAccount = data;
                location.href = '#/tab/content1';
                $rootScope.editProfileUser = false;
                $scope.addTokenOldUser =
                {
                  "linkedin": $rootScope.verificationLinkedin
                };
                $http.post('http://leadr.jellyworkz.com/api/v1/user-vendor/'+data.id, $scope.addTokenOldUser)
                  .success(function (data) {
                    location.href = '#/tab/content1';
                    $rootScope.editProfileUser = false;
                    $rootScope.userAccount = data;
                    localStorage.setItem('Verification_Phone', $rootScope.verificationPhone);
                  })
                  .error(function (data, status, header) {
                    alert("Alert accaunt )))")
                  });
              } else {
                location.href = '#/app/reg1';
              }
            })
          }
        });
      },
      logonFailure: function () {
        console.log('Fail');
      }
    };
    $scope.linkedin = function () {
      if (localStorage.getItem('Verification_LinkedIn_Token')) {
        $rootScope.verificationLinkedin = localStorage.getItem('Verification_LinkedIn_Token');
        var rand = 2 + Math.random() * (9999 - 2);
        rand = Math.round(rand);
        $rootScope.verificationEmail = "qwe" + rand + "@gmail.com";
        $ionicLoading.show();
        $http({
          method: 'GET',
          url: 'http://leadr.jellyworkz.com/api/v1/user-token/' + $rootScope.verificationLinkedin
        }).success(function (data) {
          if (data) {
            location.href = '#/tab/content1';
            $rootScope.editProfileUser = false;
            $rootScope.userAccount = data;
            localStorage.setItem('Verification_Phone', $rootScope.verificationPhone);
            $ionicLoading.hide();
          } else {
            //location.href = '#/app/reg1';
          }
        });
      } else {
        SocialGap.Linkedin_PerformLogon(app.logonSuccess, app.logonFailure); // to line:150
      }
    };
    //
    $scope.facebook = function () {
      if (localStorage.getItem('Verification_Facebook_Token')) {
        $rootScope.verificationFacebook = localStorage.getItem('Verification_Facebook_Token');
        $ionicLoading.show();
        $http({
          method: 'GET',
          url: 'http://leadr.jellyworkz.com/api/v1/user-token/' + $rootScope.verificationFacebook
        }).success(function (data) {
          if (data) {
            location.href = '#/tab/content1';
            $rootScope.editProfileUser = false;
            $rootScope.userAccount = data;
            localStorage.setItem('Verification_Phone', $rootScope.verificationPhone);
            $ionicLoading.hide();
          } else {
            //location.href = '#/app/reg1';
          }
        });
      } else {
        if (!window.cordova) {
          var appId = prompt("Enter FB Application ID", "");
          facebookConnectPlugin.browserInit(appId);
        }
        facebookConnectPlugin.login(["email"],
          function (response) {
            $rootScope.verificationFacebook = response.authResponse.userID;
            var rand = 2 + Math.random() * (9999 - 2);
            rand = Math.round(rand);
            $rootScope.verificationEmail = "qwe" + rand + "@gmail.com";
            $ionicLoading.show();
            $http({
              method: 'GET',
              url: 'http://leadr.jellyworkz.com/api/v1/user-token/' + $rootScope.verificationFacebook
            }).success(function (data) {
              if (data) {
                location.href = '#/tab/content1';
                $rootScope.editProfileUser = false;
                $rootScope.userAccount = data;
                localStorage.setItem('Verification_Facebook_Token', $rootScope.verificationFacebook);
              } else {
                $http({
                  method: 'GET',
                  url: 'http://leadr.jellyworkz.com/api/v1/user-find/' + $rootScope.verificationPhone
                }).success(function (data) {
                  if (data) {
                    console.log(data);
                    $ionicLoading.hide();
                    $rootScope.userAccount = data;
                    //location.href = '#/tab/content1';
                    $scope.addTokenOldUser =
                    {
                      "facebook": $rootScope.verificationFacebook
                    };
                    $http.post('http://leadr.jellyworkz.com/api/v1/user-vendor/'+data.id, $scope.addTokenOldUser)
                      .success(function (data) {
                        location.href = '#/tab/content1';
                        $rootScope.editProfileUser = false;
                        $rootScope.userAccount = data;
                        localStorage.setItem('Verification_Phone', $rootScope.verificationPhone);
                      })
                      .error(function (data, status, header) {
                        alert("Alert accaunt )))")
                      });
                  } else {
                    location.href = '#/app/reg1';
                  }
                });
              }
            });
          },
          function (response) {
            console.log(JSON.stringify(response));
          });
      }
      //$scope.logout = function () {
      //  facebookConnectPlugin.logout(
      //    function (response) {
      //      console.log(response);
      //    },
      //    function (response) {
      //      console.log(response);
      //    });
      //}
    };
    $scope.google = function () {
      if (localStorage.getItem('Verification_Google_Token')) {
        $rootScope.verificationFacebook = localStorage.getItem('Verification_Google_Token');
        var rand = 2 + Math.random() * (9999 - 2);
        rand = Math.round(rand);
        $rootScope.verificationEmail = "qwe" + rand + "@gael.com";
        $ionicLoading.show();
        $http({
          method: 'GET',
          url: 'http://leadr.jellyworkz.com/api/v1/user-token/' + $rootScope.verificationGoogle
        }).success(function (data) {
          if (data) {
            location.href = '#/tab/content1';
            $rootScope.editProfileUser = false;
            $rootScope.userAccount = data;
            localStorage.setItem('Verification_Phone', $rootScope.verificationPhone);
            $ionicLoading.hide();
          } else {
            location.href = '#/app/reg1';
          }
        });
      } else {
        window.plugins.googleplus.login({},
          function (obj) {
            console.log(obj.email);
            localStorage.setItem('SocialGap_Google_Token', obj.email);
            $rootScope.verificationGoogle = obj.email;
            var rand = 2 + Math.random() * (9999 - 2);
            rand = Math.round(rand);
            $rootScope.verificationEmail = "qwe" + rand + "@gmail.com";
            $ionicLoading.show();
            $http({
              method: 'GET',
              url: 'http://leadr.jellyworkz.com/api/v1/user-token/' + $rootScope.verificationGoogle
            }).success(function (data) {
              if (data) {
                location.href = '#/tab/content1';
                $rootScope.editProfileUser = false;
                $rootScope.userAccount = data;
                localStorage.setItem('Verification_Google_Token', $rootScope.verificationGoogle);
              } else {// проверка на совм
                $http({
                  method: 'GET',
                  url: 'http://leadr.jellyworkz.com/api/v1/user-find/' + $rootScope.verificationPhone
                }).success(function (data) {
                  if (data) {
                    console.log(data);
                    $ionicLoading.hide();
                    $rootScope.userAccount = data;
                    location.href = '#/tab/content1';
                    $rootScope.editProfileUser = false;
                    $scope.addTokenOldUser =
                    {
                      "google": $rootScope.verificationGoogle
                    };
                    $http.post('http://leadr.jellyworkz.com/api/v1/user-vendor/'+data.id, $scope.addTokenOldUser)
                      .success(function (data) {
                        location.href = '#/tab/content1';
                        $rootScope.editProfileUser = false;
                        $rootScope.userAccount = data;
                        localStorage.setItem('Verification_Phone', $rootScope.verificationPhone);
                      })
                      .error(function (data, status, header) {
                        alert("Alert accaunt )))")
                      });
                  } else {
                    location.href = '#/app/reg1';
                  }
                })
              }
            });
          },
          function (msg) {
            console.log(msg);
          }
        );
      }
      //function logout() {
      //  window.plugins.googleplus.logout(
      //    function (msg) {
      //      document.querySelector("#image").style.visibility = 'hidden';
      //      document.querySelector("#feedback").innerHTML = msg;
      //    }
      //  );
      //}
    };
  })
//---------------------------------------------------------------------------------------------------------------------------------------------------------------
  .controller('reg1Ctrl', function ($scope, $ionicActionSheet, $ionicLoading, $cordovaCamera, backcallFactory, $rootScope) {
    $scope.user = $rootScope.userAccount;
    console.log($scope.user)
    $ionicLoading.hide();
//come-back close
    //backcallFactory.backcallfun();
    $scope.newImage = false;
    $scope.imageData = false;
//Menu AddFoto
    $scope.toggleFooter = function () {
      $ionicActionSheet.show({
        buttons: [
          {text: '<a class="bar-modal" href="#">Take a photo</a>'},
          {text: '<a class="bar-modal" href="#">Choose from library</a>'},
          {text: '<a class="bar-modal" href="#">Cancel</a>'}
        ],
        buttonClicked: function (index) {
          if (index == 0) {
            $scope.takePhoto();//add Avatar camera
          }
          if (index == 1) {
            $scope.choosePhoto();
          }
          return true;
        }
      });
    };
    //
    $scope.takePhoto = function () {
      var options = {
        quality: 90,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.CAMERA,
        encodingType: Camera.EncodingType.JPEG,
        targetWidth: 100,
        targetHeight: 100,
        allowEdit: true,
        correctOrientation: true,
        popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: false
      };
      $cordovaCamera.getPicture(options).then(function (imageData) {
        var image = document.getElementById('avatar');
        image.src = "data:image/jpeg;base64," + imageData;
        $scope.newImage = true;
      }, function (err) {
      });
    };
    // Choose Photo
    $scope.choosePhoto = function () {
      var options = {
        quality: 90,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
        encodingType: Camera.EncodingType.JPEG,
        targetWidth: 100,
        targetHeight: 100,
        allowEdit: true,
        correctOrientation: true,
        popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: false
      };
      $cordovaCamera.getPicture(options).then(function (imageData) {
        var image = document.getElementById('avatar');
        image.src = "data:image/jpeg;base64," + imageData;
        $scope.imageData = true;
      }, function (err) {
      });
    };
//Del Avatar
    $scope.avaterDel = function () {
      angular.element(document.getElementById('avatar'))[0].src = "";
      $scope.newImage = $scope.imageData = null;
    };
//Validation Next
    $scope.reg1Next = function (user) {
      $scope.masterfullNameError = false;
      $scope.allNameError = false;
      $scope.master = angular.copy(user);
      if (!$scope.master || $scope.master.fullName == "") {
        $scope.allNameError = true;
      } else if ($scope.master.fullName == undefined || $scope.master.fullName == "" || $scope.master.fullName.length < 3) {
        $scope.masterfullNameError = true;
      } else if ($scope.master.fullName.length > 2) {
        location.href = '#/app/reg2';
        if (angular.element(document.getElementById('avatar'))[0] == undefined) {
          user.img = "";
        } else {
          user.img = angular.element(document.getElementById('avatar'))[0].src;
          console.log(user.img);
        }
        $rootScope.userReg1 = user;
        console.log($rootScope.userReg1);
      }
    }
  })
//come-back don't work Reg1
  .factory('backcallFactory', ['$state', '$ionicPlatform', '$ionicHistory', '$timeout', function ($state, $ionicPlatform, $ionicHistory) {
    var obj = {};
    obj.backcallfun = function () {
      $ionicPlatform.registerBackButtonAction(function () {
         if ($state.current.name == "app.step-3") {
        } else if ($state.current.name == "tabs.content1") {
        } else {
          $ionicHistory.goBack();
        }
      }, 100);
    };
    return obj;
  }])
//---------------------------------------------------------------------------------------------------------------------------------------------------------------
  .controller('reg2Ctrl', function ($scope, $ionicActionSheet, $rootScope, $http, $cordovaGeolocation, $ionicLoading) {
    $scope.countAddLocation = $scope.addradiusValid = 0; //Count limit add location//Valid all completed input
    $scope.addLocationInput = {};
    $scope.regLocation = [];
    $scope.usere = {
      distance: false
    };
    $scope.addLocationInput = {
      distance: false
    };
    $scope.oneUseGps = true;
//LocalGPS
    $scope.centerOnMe = function (usere) {
      if ($scope.oneUseGps) {
        $ionicLoading.show({
          template: 'Loading...'
        });
        var posOptions = {
          timeout: 10000,
          enableHighAccuracy: false
        };
        $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
          $http({
            method: 'GET',
            url: 'http://leadr.jellyworkz.com/api/v1/get-location-name?lat=' + position.coords.latitude + '&lng=' + position.coords.longitude
          }).success(function (data, status) {
            if (usere) {
              $scope.usere.loc = {};
              $scope.usere.loc.formatted_address = "" + data;
              $scope.usere.lat = position.coords.latitude;
              $scope.usere.lng = position.coords.longitude;
              $scope.errorOnLocation = $scope.oneUseGps = false;
            } else {
              if (!$scope.addLocationInput.addradius) {
                $scope.addradiusValid = 1; //Valid all completed input
              } else {
                $scope.addradiusValid = 0; //Valid all completed input
                $scope.regLocation.push({
                  name: "" + data,
                  radius: $scope.addLocationInput.addradius,
                  lat: position.coords.latitude,
                  lng: position.coords.longitude,
                  distance: $scope.addLocationInput.distance
                });
                $scope.addLocationInput.text = $scope.addLocationInput.addradius = "";
                $scope.addLocationInput.distance = $scope.errorOnLocation = $scope.oneUseGps = false;
                $scope.countAddLocation++;
              }
            }
            if (status == 200) {
              $ionicLoading.hide();
            }
          });
        }, function (err) {
          console.log(err);
          $scope.errorOnLocation = "Please turn On location and try again";
          $ionicLoading.hide();
        })
      }
    };
//
    $scope.addLocation = function () {
      if ($scope.addLocationInput.text == undefined) {
        $scope.addTextValid = 1;
      } else if (!$scope.addLocationInput.addradius) {
        $scope.addradiusValid = 1; //Valid all completed input
      } else {
        $scope.addTextValid = 0;
        $scope.addradiusValid = 0; //Valid all completed input
        if (!$scope.addLocationInput.text || !$scope.addLocationInput.text.formatted_address) {
        } else {
          $scope.regLocation.push({
            name: $scope.addLocationInput.text.formatted_address || $scope.addLocationInput.text,
            radius: $scope.addLocationInput.addradius,
            lat: $scope.addLocationInput.text.geometry.location.lat(),
            lng: $scope.addLocationInput.text.geometry.location.lng(),
            distance: $scope.addLocationInput.distance
          });
          $scope.addLocationInput.text = $scope.addLocationInput.addradius = "";
          $scope.addLocationInput.distance = false;
          $scope.countAddLocation++; //Count limit add location
        }
      }
    };
    $scope.removeFirstLocation = function (usere) {
      delete usere.radius;
      delete usere.loc;
      delete usere.distance;
      $scope.oneUseGps = true;
    };
    $scope.removeLocation = function (index) {
      $scope.regLocation.splice(index, 1);
      $scope.countAddLocation--; //Count limit add location
    };
    //NEXT
    $scope.reg2Next = function (usere) {
      $scope.reg2 = {};
      if (usere.loc == undefined) {
        $scope.allNameError = true;
      } else if (usere.loc.formatted_address == undefined) {
        $scope.allNameError = true;
      } else if (usere.radius == undefined) {
        $scope.radiusValid = 1;
      } else {
        $scope.allNameError = false;
        $scope.radiusValid = 0;
        $scope.reg2.name = usere.loc.formatted_address;
        $scope.reg2.radius = usere.radius;
        $scope.reg2.distance = usere.distance;
        if (!!usere.loc.geometry) {
          $scope.reg2.lat = usere.loc.geometry.location.lat();
          $scope.reg2.lng = usere.loc.geometry.location.lng();
        } else {
          $scope.reg2.lat = $scope.usere.lat;
          $scope.reg2.lng = $scope.usere.lng;
        }
        $rootScope.userReg2_1 = $scope.regLocation;
        $rootScope.userReg2_2 = $scope.reg2;
        location.href = '#/app/reg3';
      }
    }
  })
//---------------------------------------------------------------------------------------------------------------------------------------------------------------
  .controller('reg3Ctrl', function ($scope, $rootScope, $http) {
//******************get category -server
    $http({
      method: 'GET',
      url: 'http://leadr.jellyworkz.com/api/v1/category'
    }).success(function (data) {
      $scope.category = data;
    });
//Add category
    $scope.count = 0;
    $scope.countCategory = [];
    $scope.countCategoryId = [];
    $scope.nextCategoryId = [];
    $scope.categoryAdd = function (itemsName, itemsId, name, id) {
      if ($scope.countCategoryId.indexOf(id) === -1) {
        $scope.countCategory.push({
          nameItems: itemsName,
          nameItem: name
        });
        $scope.countCategoryId.push(id);
        $scope.nextCategoryId.push(itemsId, id);
        $scope.count++;
      } else {
      }
    };
//Delete category
    $scope.categoryDelete = function (index) {
      $scope.countCategory.splice(index, 1);
      $scope.countCategoryId.splice(index, 1);
      $scope.nextCategoryId.splice(index * 2, 2);
      $scope.count--;
    };
//NEXT
    $scope.reg3Next = function (nextCategoryId) {
      $scope.regCategoryId = [];
      nextCategoryId.forEach(function (item) {
        if ($scope.regCategoryId.indexOf(item) === -1) {
          $scope.regCategoryId.push(item);
        }
      });
      $rootScope.userReg3 = $scope.regCategoryId;
      if (!!$scope.countCategory.length) {
        location.href = '#/app/reg4';
      } else {
        $scope.countCategoryEmpty = true;
      }
    }
  })
//---------------------------------------------------------------------------------------------------------------------------------------------------------------
  .controller('reg4Ctrl', function ($scope, $rootScope) {
    //NEXT
    $scope.reg4Next = function (credit) {
      $scope.location = angular.copy(credit);
      location.href = '#/app/reg5';
      $rootScope.userReg4 = credit;
    }
  })
//---------------------------------------------------------------------------------------------------------------------------------------------------------------
  .controller('reg5Ctrl', function ($scope, $http, $ionicLoading, $rootScope, $ionicPopup) {
//VERification
    if (localStorage.getItem('SocialGap_LinkedIn_Token')) {
      $scope.linkedinChecked = true;
    }
    if ($rootScope.verificationFacebook) {
      $scope.faceChecked = true;
    }
    if ($rootScope.verificationGoogle) {
      $scope.googleChecked = true;
    }
    var app = {
      initialize: function () {
        this.bindEvents();
      },
      bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
      },
      onDeviceReady: function () {
        app.receivedEvent('deviceready');
      },
      receivedEvent: function (id) {
        SocialGap.Linkedin_ChangeSettings('apiKey', 'secretKey', 'ldAppDomain', 'ldScopes');
        console.log('Received Event: ' + id);
      },
      logonSuccess: function (accessToken) {
        console.log(accessToken);
        $rootScope.verificationLinkedin = accessToken;
      },
      logonFailure: function () {
        console.log('Fail');
      }
    };
//verificationLinkedin
    $scope.verificationLinkedin = function () {
      if (!$scope.verificationLinkedin.checked1) {
        $scope.verificationLinkedin.checked1 = false;
        $rootScope.verificationLinkedin = null;
      } else {
        $scope.verificationLinkedin.checked1 = false;
        if (localStorage.getItem('SocialGap_LinkedIn_Token')) {
          $rootScope.verificationLinkedin = localStorage.getItem('SocialGap_LinkedIn_Token');
          $scope.verificationLinkedin.checked1 = true;
        }else{
         SocialGap.Linkedin_PerformLogon(app.logonSuccess, app.logonFailure);
         $scope.verificationLinkedin.checked1 = true;
        }
      }
    };
//verificationFacebook
    $scope.verificationFacebook = function () {
      if (!$scope.verificationFacebook.checked2) {
        $scope.verificationFacebook.checked2 = false;
        $rootScope.verificationFacebook = null;
      } else {
       $scope.verificationFacebook.checked2 = false;
        if (localStorage.getItem('SocialGap_Facebook_Token')) {
          $rootScope.verificationFacebook = localStorage.getItem('SocialGap_Facebook_Token');
          $scope.verificationFacebook.checked2 = true;
        }else{
          facebookConnectPlugin.login(["email"], function (response) {
              $rootScope.verificationFacebook = response.authResponse.userID;
              $scope.verificationFacebook.checked2 = true;
          });
        }
      }
    };
    //verificationGoogle+
    $scope.verificationGoogle = function () {
      if (!$scope.verificationGoogle.checked3) {
        $scope.verificationGoogle.checked3 = false;
        $rootScope.verificationGoogle = null;
      } else {
         $scope.verificationGoogle.checked3 = false;
         if (localStorage.getItem('SocialGap_Google_Token')) {
           $rootScope.verificationGoogle = localStorage.getItem('SocialGap_Google_Token');
           $scope.verificationGoogle.checked3 = true;
         }else{
          window.plugins.googleplus.login(
            {},
            function (obj) {
              console.log(obj.email);
              $rootScope.verificationGoogle = obj.email;
              $scope.verificationGoogle.checked3  = true;
            },
            function (msg) {
             $scope.verificationGoogle.checked3 = false;
              console.log(msg);
            }
          );
        }
      }
    };
//verificationEmail
    if (localStorage.getItem('Verification_Email_Token')) {
      $rootScope.verificationEmail = localStorage.getItem('Verification_Email_Token');
      $rootScope.verificationEmailPassword = localStorage.getItem('Verification_EmailPassword_Token');
    }
//verificationLicense



$scope.licenseText = '<p>Lorem sdfsdfsdsd sd fsdf sd sd fsdsd fsdfsd fsd sdf Lorem sdfsdfsdsd sd fsdf sd sd fsdsd fsdfsd fsd sdf Lorem sdfsdfsdsd sd fsdf sd sd fsdsd fsdfsd fsd sdf Lorem sdfsdfsdsd Lorem sdfsdfsdsd sd fsdf sd sd fsdsd fsdfsd fsd sdf Lorem sdfsdfsdsd sd fsdf sd sd fsdsd fsdfsd fsd sdf Lorem sdfsdfsdsd sd fsdf sd sd fsdsd fsdfd fsdsd fsdfsd fsdLorem sdfsdfsdsd sd fsdf sd sd fsdsd fsdfsd fsd sdf Lorem sdfsdfsdsd sd fsdf sd sd fsdsd fsdfsd fsd sdf Lorem sdfsdfsdsd sd fsdf sd sd fsdsd fsdfsd fsdsd fsdf sd sd fsdsd fsdfsd fsd sdf Lorem sdfsdfsdsd sd fsdf sd sd fsdsd fsdfsd fsd sdfsd fsdLorem sdfsdfsdsd sd fsdf sd sd fsdsd fsdfsd fsd sdf Lorem sdfsdfsdsd sd fsdf sd sd fsdsd fsdfsd fsd sdf Lorem sdfsdfsdsd sd fsdf sd sd fsdsd fsdfsd fsdsd fsdf sd sd fsdsd fsdfsd fsd sdf Lorem sdfsdfsdsd sd fsdf sd sd fsdsd fsdfsd fsd sdf </p>';
    $scope.verificationLicense = function () {
          $scope.data = {};
          var myPopup = $ionicPopup.show({
            template: $scope.licenseText,
            title: 'License',
            scope: $scope,
            buttons: [
              {text: 'Cancel'}

            ]
          });
      }
//NEXT
    $scope.reg5Next = function () {
      if($scope.verificationLicense.checked4){
        $scope.postRegNewUser = function () {
          $ionicLoading.show();
          $scope.registration = [];
          var reg1 = $rootScope.userReg1;
          $rootScope.userReg2_1.push($rootScope.userReg2_2);
          var reg2 = $rootScope.userReg2_1;
          var reg3 = $rootScope.userReg3;
          $scope.registration.push(reg1, reg2, reg3);
          //
          $scope.registrationPost =
          {
            "fullName": $scope.registration[0].fullName,
            "businessName": "",
            "additionalInfo": "",
            "avatar": "",
            "location": $scope.registration[1],
            "category": $scope.registration[2],
            "verification": {
              "linkedin": $rootScope.verificationLinkedin,
              "facebook": $rootScope.verificationFacebook,
              "google": $rootScope.verificationGoogle,
              "phone": $rootScope.verificationPhone,
              "email": $rootScope.verificationEmail
            },
            "credentials": {
              "email": $rootScope.verificationEmail,
              "password": $rootScope.verificationEmailPassword,
              "phone": $rootScope.verificationPhone
            }
          };
          if(!!$scope.registration[0].businessName){
            $scope.registrationPost.businessName = $scope.registration[0].businessName;
          }
          if(!!$scope.registration[0].additionalName){
            $scope.registrationPost.additionalInfo = $scope.registration[0].additionalName;
          }
          if(!!$scope.registration[0].img){
            $scope.registrationPost.avatar = $scope.registration[0].img;
          }
          if(!!$scope.registration[0].webSite){
            $scope.registrationPost.phone = $scope.registration[0].webSite;
          }
          if($rootScope.editProfileUser){    //EDIT
            $scope.registrationPostReg1 =
              {
                "id": $rootScope.userAccount.id,
                "fullName": $scope.registration[0].fullName,
                "businessName": "",
                "additionalInfo": "",
                "avatar": ""
              }
              if(!!$scope.registration[0].businessName){
                $scope.registrationPostReg1.businessName = $scope.registration[0].businessName;
              }
              if(!!$scope.registration[0].additionalInfo){
                $scope.registrationPostReg1.additionalInfo = $scope.registration[0].additionalName;
              }
  //              if(!!$scope.registration[0].img){
  //                $scope.registrationPostReg1.avatar = $scope.registration[0].img;
  //              }
              if(!!$scope.registration[0].webSite){
                $scope.registrationPostReg1.phone = $scope.registration[0].webSite;
              }
              $rootScope.registrationPostReg1 =$scope.registrationPostReg1;
              console.log($scope.registrationPostReg1);

              $http.put('http://leadr.jellyworkz.com/api/v1/user/'+$rootScope.userAccount.id, $rootScope.registrationPostReg1)
              .success(function (data) {
                console.log(data);
                location.href = '#/tab/me-profile';
                $ionicLoading.hide();
                $rootScope.editProfileUser = false;
                //$rootScope.userAccount = data;
                console.log("Success reg5 data: " + $rootScope.userAccount);
                //localStorage Set
                localStorage.setItem('Verification_Phone', $rootScope.verificationPhone);
                if (localStorage.getItem('SocialGap_LinkedIn_Token')) {
                  localStorage.setItem('Verification_LinkedIn_Token', localStorage.getItem('SocialGap_LinkedIn_Token'));
                }
                if (localStorage.getItem('SocialGap_Facebook_Token')) {
                  localStorage.setItem('Verification_Facebook_Token', localStorage.getItem('SocialGap_Facebook_Token'));
                }
                if (localStorage.getItem('SocialGap_Google_Token')) {
                  localStorage.setItem('Verification_Google_Token', localStorage.getItem('SocialGap_Google_Token'));
                }
                if (localStorage.getItem('SocialGap_Email_Token')) {
                  localStorage.setItem('Verification_Email_Token', localStorage.getItem('SocialGap_Email_Token'));
                }
                if (localStorage.getItem('SocialGap_EmailPassword_Token')) {
                  localStorage.setItem('Verification_EmailPassword_Token', localStorage.getItem('SocialGap_EmailPassword_Token'));
                }
                $rootScope.editProfileUser = false;
              })
              .error(function (data) {
                console.log('error');
              });
          }else{  //registration
            $http.post('http://leadr.jellyworkz.com/api/v1/registration', $scope.registrationPost)
              .success(function (data) {
                location.href = '#/tab/content1';
                $rootScope.editProfileUser = false;
                $rootScope.userAccount = data;
                console.log("Success reg5 data: " + $rootScope.userAccount);
                //localStorage Set
                localStorage.setItem('Verification_Phone', $rootScope.verificationPhone);
                if (localStorage.getItem('SocialGap_LinkedIn_Token')) {
                  localStorage.setItem('Verification_LinkedIn_Token', localStorage.getItem('SocialGap_LinkedIn_Token'));
                }
                if (localStorage.getItem('SocialGap_Facebook_Token')) {
                  localStorage.setItem('Verification_Facebook_Token', localStorage.getItem('SocialGap_Facebook_Token'));
                }
                if (localStorage.getItem('SocialGap_Google_Token')) {
                  localStorage.setItem('Verification_Google_Token', localStorage.getItem('SocialGap_Google_Token'));
                }
                if (localStorage.getItem('SocialGap_Email_Token')) {
                  localStorage.setItem('Verification_Email_Token', localStorage.getItem('SocialGap_Email_Token'));
                }
                if (localStorage.getItem('SocialGap_EmailPassword_Token')) {
                  localStorage.setItem('Verification_EmailPassword_Token', localStorage.getItem('SocialGap_EmailPassword_Token'));
                }
              })
              .error(function (data, status, header, config) {
              });
          }
        }
//verification
        $scope.verificationAll = [];
        if ($rootScope.verificationLinkedin) {
          $scope.verificationAll.push($rootScope.verificationLinkedin);
        }
        if ($rootScope.verificationFacebook) {
          $scope.verificationAll.push($rootScope.verificationFacebook);
        }
        if ($rootScope.verificationGoogle) {
          $scope.verificationAll.push($rootScope.verificationGoogle);
        }
        if ($rootScope.verificationEmail) {
          $scope.verificationAll.push($rootScope.verificationEmail);
        }
        console.log($scope.verificationAll);
  //
        if ($scope.verificationAll.length == 0) {
          console.log("err");
        } else if ($scope.verificationAll.length > 0) {
          $scope.postRegNewUser();
        }
        $scope.verificationLicense.checked4 = true;
      }else{
        $scope.verificationLicense.checked4 = false;
      }
    }
  })
//---------------------------------------------------------------------------------------------------------------------------------------------------------------
  .controller('tab', function ($scope, $ionicModal, $rootScope, $ionicLoading) {
    $ionicModal.fromTemplateUrl('templates/modalMenu.html', {
      scope: $scope
    }).then(function (modal) {
      $scope.modal = modal;
    });
    $scope.reloadContent = function () {
      $rootScope.getFiltrContent = null;
      location.href = '#/tab/content1';
      $rootScope.editProfileUser = false;
      $rootScope.getContent();
    };
    $scope.reloadMine = function () {
      $ionicLoading.show();
      location.href = '#/tab/mine';
      $rootScope.getMineBought();
    };
  })
//---------------------------------------------------------------------------------------------------------------------------------------------------------------
  .controller('create1', function ($scope, $http, $rootScope, $cordovaGeolocation, $ionicLoading) {
    $rootScope.recordHideShowCreat4 = false;
    $scope.addLocationHide = true;
//Record audio
    $scope.positionButtonRec = 1;
    $scope.recAudio = function () {
      $rootScope.recordHideShowCreat4 = true;
      $scope.onSuccess = function () {
      };
      $scope.onError = function (e) {
      };
      $scope.onStatus = function (type) {
      };
      $scope.playRecording = function () {
        $rootScope.recorder.play();
        $scope.positionButtonRec = 2;
        setTimeout($scope.timer, 1000);
      };
      $scope.stopRecording = function () {
        $rootScope.recorder.stopRecord();
        $scope.positionButtonRec = 3;
      };
      $scope.delRecording = function () {
        //$rootScope.recorder.del();
        $scope.positionButtonRec = 1;
        $rootScope.recordHideShowCreat4 = false;
      };
      $rootScope.recorder = new Media('recordLeadr.mp3', $scope.onSuccess, $scope.onError, $scope.onStatus);
      $rootScope.recorder.startRecord();
      $scope.positionButtonRec = 2;
      $scope.timer = function () {
        var obj = document.getElementById('timer_inp');
        obj.innerHTML--;
        if (obj.innerHTML < 1) {
          $scope.stopRecording();
          setTimeout(function () {
          }, 1000);
        } else {
          setTimeout($scope.timer, 1000);
        }
      };
      setTimeout($scope.timer, 1000);
    };
//
    $scope.createLocation = [];
    $scope.centerOnMe = function () {
      $ionicLoading.show({
        template: 'Loading...'
      });
      var posOptions = {
        timeout: 10000,
        enableHighAccuracy: false
      };
      $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
        $http({
          method: 'GET',
          url: 'http://leadr.jellyworkz.com/api/v1/get-location-name?lat=' + position.coords.latitude + '&lng=' + position.coords.longitude
        }).success(function (data, status) {
          $scope.geoLocation = data;
          $scope.addLocationHide = false;
          $scope.errorOnLocation = false;
          $scope.createLocation.push({
            name: data[0],
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          $rootScope.localItems = $scope.createLocation;
          $scope.errorAddloc = true;
          if (status == 200) {
            $ionicLoading.hide();
          }
        });
      }, function (err) {
        console.log(err);
        $scope.errorOnLocation = "Please turn on location";
        $ionicLoading.hide();
      });
    };
//Add/Del Location
    $scope.addLocation = function () {
      if (!$scope.addLocation.text || !$scope.addLocation.text.formatted_address) {
      } else {
        $scope.createLocation.push({
          name: $scope.addLocation.text.formatted_address || $scope.addLocation.text,
          lat: $scope.addLocation.text.geometry.location.lat(),
          lng: $scope.addLocation.text.geometry.location.lng()
        });
        $rootScope.localItems = $scope.createLocation;
        $scope.addLocation.text = "";
        $scope.addLocationHide = false;
        $scope.errorAddloc = true;
      }
    };
    $scope.removeLocation = function (index) {
      $scope.createLocation.splice(index, 1);
      $rootScope.localItems = null;
      $scope.errorAddloc = false;
      $scope.addLocationHide = true;
    };

//NEXT
    $scope.create1Next = function (item) {
      $scope.addLocation();
      $scope.msgError = item == undefined ? true : false;
      $scope.msgErrorTitleText = !item.titleText || item.titleText.length < 3 ? true : false;
      $scope.msgErrorDescriptionText = !item.description || item.description.length < 3 ? true : false;
      $scope.msgErrorLocation = !$scope.errorAddloc ? true : false;
      if (!($scope.msgError || $scope.msgErrorTitleText || $scope.msgErrorDescriptionText || $scope.msgErrorLocation)) {
        item.location = $rootScope.localItems;
        $rootScope.create1 = angular.copy(item);
        location.href = '#/app/create2';
      }
    }
  })
//---------------------------------------------------------------------------------------------------------------------------------------------------------------
  .controller('create2', function ($scope, $rootScope, $http) {
//***********get category -server
    $http({
      method: 'GET',
      url: 'http://leadr.jellyworkz.com/api/v1/category'
    }).success(function (data) {
      $scope.category = data;
    });
//*******Bestseller
    $scope.userCategory = $rootScope.userAccount.category;
//Add category
    $scope.count = 0;
    $scope.countCategory = [];
    $scope.countCategoryId = [];
    $scope.nextCategoryId = [];
    $scope.categoryAdd = function (itemsName, itemsId, name, id) {
      if ($scope.countCategoryId.indexOf(id) === -1) {
        $scope.countCategory.push({
          nameItems: itemsName,
          nameItem: name
        });
        $scope.countCategoryId.push(id);
        $scope.nextCategoryId.push(itemsId, id);
        $scope.count++;
        $scope.countCategoryEmpty = false;
      } else {
      }
    };
//Delete category
    $scope.categoryDelete = function (index) {
      $scope.countCategory.splice(index, 1);
      $scope.countCategoryId.splice(index, 1);
      $scope.nextCategoryId.splice(index * 2, 2);
      $scope.count--;
    };
//NEXT
    $scope.creat2Next = function (nextCategoryId) {
      $scope.createCategoryId = [];
      nextCategoryId.forEach(function (item) {
        if ($scope.createCategoryId.indexOf(item) === -1) {
          $scope.createCategoryId.push(item);
        }
      });
      $rootScope.countCreateCategory = $scope.countCategory;
      $rootScope.createCategory = $scope.createCategoryId;
      if (!!$scope.countCategory.length) {
        location.href = '#/app/create3';
      } else {
        $scope.countCategoryEmpty = true;
      }
    }
  })
//---------------------------------------------------------------------------------------------------------------------------------------------------------------
  .controller('create3', function ($scope, $rootScope, $http) {
  // callLog
//      $scope.callLog = function () {
//        $scope.userAccount.phone = "+3 8056 536 32 32";
//      }
//***********get avg_price -server
    $http({
      method: 'GET',
      url: 'http://leadr.jellyworkz.com/api/v1/lead-util?action=price-avg'
    }).success(function (data) {
      $scope.priceAvg = data.avg_price - (data.avg_price % 1);
    });
//
    $scope.item = {
      leadJob: false
    };
    $scope.item = {
      jobCommissionProcent: false
    };
    //NEXT
    $scope.create3Next = function (item) {
      $scope.msgError = !item.address && !item.phone ? true : false;
      $scope.msgErrorAddress = !$scope.msgError && !item.address;
      $scope.msgErrorPhone = !$scope.msgError && !item.phone ? true : false;
      $scope.msgErrorPrice = !item.price;
      $scope.msgErrorCommission = item.leadJob ? item.price.commission = true : false;
      if (item.leadJob) {
        if (!!item.commission) {
          $scope.msgErrorCommission = false;
        }
      }else{
        item.commission = null;
        item.commissionType = null;
      }
      if (!($scope.msgError || $scope.msgErrorAddress || $scope.msgErrorPhone || $scope.msgErrorPrice || $scope.msgErrorCommission)) {
        $rootScope.create3 = angular.copy(item);
        location.href = '#/app/create4';
      }
    }
  })
  .directive('ngFiles', ['$parse', function ($parse) {
    function fn_link(scope, element, attrs) {
      var onChange = $parse(attrs.ngFiles);
      element.on('change', function (event) {
        onChange(scope, {$files: event.target.files});
      })
    }
    return {
      link: fn_link
    }
  }])
//---------------------------------------------------------------------------------------------------------------------------------------------------------------
.directive('fileModel', ['$parse', function ($parse) {
      return {
          restrict: 'A',
          link: function(scope, element, attrs) {
              var model = $parse(attrs.fileModel);
              var modelSetter = model.assign;

              element.bind('change', function(){
                  scope.$apply(function(){
                      modelSetter(scope, element[0].files[0]);
                  });
              });
          }
      };
  }])
  .service('fileUpload', ['$http', function ($http, $rootScope, $ionicLoading) {
      this.uploadFileToUrl = function(file, data, uploadUrl){
          var fd = new FormData();
          fd.append('data', data);
          fd.append('audio', file);
          $http.post(uploadUrl, fd, {
              transformRequest: angular.identity,
              headers: {'Content-Type': undefined}
          })
          .success(function(){
            location.href = '#/tab/mine';
            $rootScope.mineUnsold();
            $ionicLoading.hide();
            //clear
            $scope.checkShareFriends = [];
          })
          .error(function(){
          console.log('error');
           $ionicLoading.hide();
          });
      }
  }])
  .controller('create4', function ($scope, $ionicActionSheet, $rootScope, $http, $cordovaContacts, $ionicPopup, $timeout, $ionicLoading, fileUpload) {
    $scope.showSearch = function () {
      $scope.openSearch = $scope.openSearch === true ? false : true;
    };
//
    $scope.playRecording = function () {
      $rootScope.recorder.play();
      $scope.stopAudioBottom = true;
    };
    $scope.stopRecording = function () {
      $rootScope.recorder.stopRecord();
      $scope.stopAudioBottom = false;
    };
    //Title-Menu toggle
    $scope.toggleContMenu = function () {
      $scope.toggleContValue = $scope.toggleContValue === true ? false : true;
    };
    $scope.toggleAddExtraInfo = function () {
      $scope.toggleAddExtraValue = $scope.toggleAddExtraValue === true ? false : true;
    };
    $scope.publish = function (item) {

//      $ionicActionSheet.show({
//        titleText: '<p class="creat4-text-modal">Allow contact me by chat</p>' + '<span class="creat4-text-modal">Recommended for Jobs and expensive leads</span>',
////        buttons: [{text: 'Move'}, {text: '<ion-checkbox ng-model="contactMeChat" ng-click="toggleFooterFriends(people.id)"></ion-checkbox>'}],
////        destructiveText2: '<ion-checkbox ng-model="contactMeChat" ng-click="toggleFooterFriends(people.id)"></ion-checkbox>',
//        destructiveText: '<a class="bottom-modal" href="#">PUBLISH</a>',
//        buttonClicked: function (index) {
//          if (index == 0) {
//            $scope.create4Next(item);
//          }
//          return true;
//        },
//        destructiveButtonClicked: function () {
//          $scope.create4Next(item);
//        }
//      });
    };
//searchFriend
    // Initialization
    //$scope.onEditChangeResult = "";
    ////
    //$scope.searchFriend = function () {
    //  $scope.searchFriendPost = "" + $scope.editValue;
    //  $http({method: 'GET', url: 'http://leadr.jellyworkz.com/api/v1/user-find/' + $scope.searchFriendPost}).success(function(data, status, headers, config) {
    //    alert(data);
    //   //var cardTypes = data;
    //  });
    //};
//****************************************--------------------------------------------------------------------
    $rootScope.loadContact = function () {
      $scope.friends = [];
      $http({
        method: 'GET',
        url: 'http://leadr.jellyworkz.com/api/v1/user/' + $rootScope.userAccount.id
      }).success(function (data) {
        var friendsList = data.friendUser;
        if(!!data.friendUser){
          $scope.friends = Array.prototype.slice.call(friendsList, 0);
          console.log($scope.friends);
        }
      });
//
      $scope.mobTelephone = "";
      $cordovaContacts.find({filter: ''}).then(function (result) {
        $scope.contacts = result;
        for (var i = 0; i < result.length - 1; i++) {
          if (!!$scope.contacts[i].phoneNumbers) {
            $scope.mobTelephone = $scope.contacts[i].phoneNumbers[0].value;
            $http({
              method: 'GET',
              url: 'http://leadr.jellyworkz.com/api/v1/user-find/' + $scope.mobTelephone
            }).success(function (data) {
              if (!!data) {
                $scope.mobLeadFriends = Array.prototype.slice.call(data, 0);
                $scope.friends.push($scope.mobLeadFriends[0]);
                console.log($scope.friends);
              }
            });
          }
        }
      }, function (error) {
        console.log("ERROR: " + error);
      });
    };
    $rootScope.loadContact();
//Get-groups
    $scope.groups = $rootScope.groups;
//Title-Menu toggle
    $scope.toggleContMenu = function () {
      $scope.toggleContValue = $scope.toggleContValue === true ? false : true;
    };
    $scope.tagChoose = function (index) {
      $scope.groupsId = {
        id: $scope.groups[index].user[0].id
      };
      $scope.toggleContMenu();
    };
//footer context_menu_but
    $scope.checkShareFriends = [];
    $scope.toggleCheckShare = function (peopleId) {

      if ($scope.checkShareFriends.indexOf(peopleId) < 0) {
        $scope.checkShareFriends.push(peopleId);
      } else {
        $scope.checkShareFriends.splice($scope.checkShareFriends.indexOf(peopleId), 1);
      }
      console.log($scope.checkShareFriends);
    };
//
    $scope.addTag = function () {
      $scope.data = {};
      var myPopup = $ionicPopup.show({
        template: '<input type="text" ng-model="data.nameShareFriends">',
        title: 'Please enter Tag name',
        scope: $scope,
        buttons: [
          {text: 'Cancel'},
          {
            text: '<b>Create</b>',
            type: 'button-positive',
            onTap: function (e) {
              if (!$scope.data.nameShareFriends) {
                e.preventDefault();
              } else if($scope.data.nameShareFriends.splice($scope.checkShareFriends.indexOf(peopleId), 1)){

              } else {
                $scope.sendGroupTag();
              }
            }
          }
        ]
      });
      $scope.sendGroupTag = function () {
        $scope.addGroup = {
          "groupOwner": $rootScope.userAccount.id,
          "name": $scope.data.nameShareFriends,
          "user": $scope.checkShareFriends
        };
        var sObj = JSON.stringify($scope.addGroup);
        localStorage.setItem("groupFriends", sObj)
      }
    };
//
    $scope.toggleInputSearch = function () {
      $scope.toggleInputSearchShow = $scope.toggleInputSearchShow === true ? false : true;
    };
// verified icon color
    $scope.setVerified = function (is_verified) {
      return is_verified > 2 ? "icon-verified icon color" : " ";
    };
//NEXT
//    $scope.upload = function(el) {
//      console.log(el);
//      console.log($scope.recorderfff);
//      $scope.file = el.files;
//    };
    $scope.formdata = new FormData();

    $scope.getFile = function ($files) {
      $scope.audiosrc = [];
      for (var i = 0; i < $files.length; i++) {
        var reader = new FileReader();
        reader.fileName = $files[0].name;

        reader.onload = function (event) {
          var audio = {};
          audio.Name = event.target.fileName;
          audio.Size = (event.total / 1024).toFixed(2);
          audio.Src = event.target.result;
          $scope.audiosrc.push(audio);
          $scope.$apply();
        };
        reader.readAsDataURL($files[0]);
      }

      angular.forEach($files, function (value, key) {
        $scope.formdata.append(key, value);
      })
    };
    $scope.create4Next = function (item) {                        //NEXT CREATE LEAD
      $ionicLoading.show();
       if ($scope.checkShareFriends !== null) {
          if ($scope.checkShareFriends.length == 0) {
            $scope.checkShareFriends = null;
          }
       }
       $scope.postCreateLeadYESAudio = function () {
          if(item.myFile){
            var file = item.myFile;
            var data = JSON.stringify($scope.createLeadPost);
            var uploadUrl = "http://leadr.jellyworkz.com/api/v1/lead";
            fileUpload.uploadFileToUrl(file, data, uploadUrl);
          }
       }
       $scope.postCreateLeadNOAudio = function () {
         $http({
           method: 'POST',
           url: 'http://leadr.jellyworkz.com/api/v1/lead',
           headers: {'Content-Type': 'multipart/form-data'},
           data: $scope.createLeadPost
         })
         .success(function (data, status) {
           console.log($scope.createLeadPost);
           location.href = '#/tab/mine';
           $rootScope.mineUnsold();
           $ionicLoading.hide();
           $scope.checkShareFriends = []; //clear
           $scope.createLeadPost = {};
         })
         .error(function (data, status, header, config) {
         });
       }
       $scope.createLeadPost = {
         "createdBy": $rootScope.userAccount.id,
         "title": $rootScope.create1.titleText,
         "description": $rootScope.create1.description,
         "price": $rootScope.create3.price,
         "phone": $rootScope.create3.phone,
         "email": $rootScope.create3.address,
         "leadType": $rootScope.create3.leadJob,
         "createdAt": "" + new Date().getFullYear() + "-" + ("0" + (new Date().getMonth() + 1)).slice(-2) + "-" + ("0" + (new Date().getDate())).slice(-2) + "T" + ("0" + (new Date().getHours())).slice(-2) + ":" + ("0" + (new Date().getMinutes())).slice(-2) + ":" + ("0" + (new Date().getSeconds())).slice(-2) + "+03:00",
         "commissionType": $rootScope.create3.jobCommissionProcent,
         "commission": $rootScope.create3.commission,
         "location": $rootScope.create1.location,
         "category": $rootScope.createCategory,
         "statusId": 1,
         "chat": false,
         "share": $scope.checkShareFriends
       };
       if(!!item){ //if true item - maybe it extra or audio
          if(!!item.budget && !!item.time && !!item.source){ //if true item - it's extra
             $scope.createLeadPost.extra = {
                 "budget": item.budget,
                 "time": item.time,
                 "source": item.source
             };
          }
          if(item.myFile){ //if true item - it's audio
             $scope.postCreateLeadYESAudio();
          }else{
             $scope.postCreateLeadNOAudio();
          }
      }else{
        $scope.postCreateLeadNOAudio();
      }
    };
  })
//---------------------------------------------------------------------------------------------------------------------------------------------------------------
  .controller('filter', function ($scope, $http, $rootScope, $ionicLoading, $cordovaGeolocation, $ionicScrollDelegate, $location) {
    $rootScope.filter = function(){
      //
      $scope.active = 'All';
      $scope.setActive = function(type) {
        $scope.active = type;
      };
      $scope.isActive = function(type) {
        return type === $scope.active;
      };
      //
      $http({
        method: 'GET',
        url: 'http://leadr.jellyworkz.com/api/v1/category'
      }).success(function (data) {
        $scope.category = data;
      });
//Add category
      $scope.count = 0;
      $scope.countCategory = [];
      $scope.countCategoryId = [];
      $scope.nextCategoryId = [];
      $scope.categoryAdd = function (itemsName, itemsId, name, id) {
        if ($scope.countCategoryId.indexOf(id) === -1) {
          $scope.countCategory.push({
            nameItems: itemsName,
            nameItem: name
          });
          $scope.countCategoryId.push(id);
          $scope.nextCategoryId.push(itemsId, id);
          $scope.count++;
          $scope.countCategoryEmpty = false;
        } else {
        }
      };
//Delete category
      $scope.categoryDelete = function (index) {
        $scope.countCategory.splice(index, 1);
        $scope.countCategoryId.splice(index, 1);
        $scope.nextCategoryId.splice(index * 2, 2);
        $scope.count--;
      };
      $scope.countAddLocation = $scope.addradiusValid = 0; //Count limit add location//Valid all completed input
      $scope.addLocationInput = {};
      $scope.regLocation = [];
      $scope.usere = {
        distance: false
      };
      $scope.addLocationInput = {
        distance: false
      };
      $scope.oneUseGps = true;
//addLoc
      $scope.centerOnMe = function (usere) {
        if ($scope.oneUseGps) {
          $ionicLoading.show({
            template: 'Loading...'
          });
          var posOptions = {
            timeout: 10000,
            enableHighAccuracy: false
          };
          $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
            $http({
              method: 'GET',
              url: 'http://leadr.jellyworkz.com/api/v1/get-location-name?lat=' + position.coords.latitude + '&lng=' + position.coords.longitude
            }).success(function (data, status) {
              if (usere) {
                $scope.usere.loc = {};
                $scope.usere.loc.formatted_address = "" + data;
                $scope.usere.lat = position.coords.latitude;
                $scope.usere.lng = position.coords.longitude;
                $scope.errorOnLocation = $scope.oneUseGps = false;
              } else {
                if (!$scope.addLocationInput.addradius) {
                  $scope.addradiusValid = 1; //Valid all completed input
                } else {
                  $scope.addradiusValid = 0; //Valid all completed input
                  $scope.regLocation.push({
                    name: "" + data,
                    radius: $scope.addLocationInput.addradius,
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    distance: $scope.addLocationInput.distance
                  });
                  $scope.addLocationInput.text = $scope.addLocationInput.addradius = "";
                  $scope.addLocationInput.distance = $scope.errorOnLocation = $scope.oneUseGps = false;
                  $scope.countAddLocation++;
                }
              }
              if (status == 200) {
                $ionicLoading.hide();
              }
            });
          }, function (err) {
            console.log(err);
            $scope.errorOnLocation = "Please turn On location and try again";
            $ionicLoading.hide();
          })
        }
      };
      $scope.addLocation = function () {
        if ($scope.addLocationInput.text == undefined) {
          $scope.addTextValid = 1;
        } else if (!$scope.addLocationInput.addradius) {
          $scope.addradiusValid = 1; //Valid all completed input
        } else {
          $scope.addTextValid = 0;
          $scope.addradiusValid = 0; //Valid all completed input
          if (!$scope.addLocationInput.text || !$scope.addLocationInput.text.formatted_address) {
          } else {
            $scope.regLocation.push({
              name: $scope.addLocationInput.text.formatted_address || $scope.addLocationInput.text,
              radius: $scope.addLocationInput.addradius,
              lat: $scope.addLocationInput.text.geometry.location.lat(),
              lng: $scope.addLocationInput.text.geometry.location.lng(),
              distance: $scope.addLocationInput.distance
            });
            $scope.addLocationInput.text = $scope.addLocationInput.addradius = "";
            $scope.addLocationInput.distance = false;
            $scope.countAddLocation++; //Count limit add location
          }
        }
      };
      $scope.removeFirstLocation = function (usere) {
        delete usere.radius;
        delete usere.loc;
        delete usere.distance;
        $scope.oneUseGps = true;
      };
      $scope.removeLocation = function (index) {
        $scope.regLocation.splice(index, 1);
        $scope.countAddLocation--; //Count limit add location
      };

      $scope.slider = {
        minValue: $rootScope.minValue,
        maxValue: $rootScope.maxValue,
        options: {
          floor: $rootScope.minValue,
          ceil: $rootScope.maxValue,
          step: 1,
          translate: function (value) {
            return '$ ' + value;
          }
        }
      };
//
      $scope.data = {
        kmMi: false
      };

//VERification
      $scope.allVerification = {};
      $scope.allVerification.linkedin = $scope.allVerification.facebook = $scope.allVerification.google = $scope.allVerification.phone =  $scope.allVerification.email = $scope.allVerification.ssn  = null;
      $scope.verificationLinkedin = function () {
        console.log('Push Notification Change', $scope.verificationLinkedin.checked);
        if ($scope.verificationLinkedin.checked) {
          $scope.allVerification.linkedin = "linkedin";
        } else {
          $scope.allVerification.linkedin = null;
        }
      };
      $scope.verificationFacebook = function () {
        console.log('Push Notification Change', $scope.verificationFacebook.checked);
        if ($scope.verificationFacebook.checked) {
          $scope.allVerification.facebook = "facebook";
        } else {
          $scope.allVerification.facebook = null;
        }
      };
      $scope.verificationGoogle = function () {
        console.log('Push Notification Change', $scope.verificationGoogle.checked);
        if ($scope.verificationGoogle.checked) {
          $scope.allVerification.google = "google";
        } else {
          $scope.allVerification.google = null;
        }
      };
      $scope.verificationPhone = function () {
        console.log('Push Notification Change', $scope.verificationPhone.checked);
        if ($scope.verificationPhone.checked) {
          $scope.allVerification.phone = "phone";
        } else {
          $scope.allVerification.phone = null;
        }
      };
      $scope.verificationEmail = function () {
        console.log('Push Notification Change', $scope.verificationEmail.checked);
        if ($scope.verificationEmail.checked) {
          $scope.allVerification.email = "email";
        } else {
          $scope.allVerification.email = null;
        }
      };
      $scope.verificationSsn = function () {
        console.log('Push Notification Change', $scope.verificationSsn.checked);
        if ($scope.verificationSsn.checked) {
          $scope.allVerification.ssn = "ssn";
        } else {
          $scope.allVerification.ssn = null;
        }
      };
      $rootScope.getFiltrContent = false;
      $scope.addTextValid = $scope.addTextValidVerif = false;
//NEXT
      $scope.filterNext = function (usere) {
        if ($scope.nextCategoryId.length == 0) {
          $scope.countCategoryEmpty = true;
          $location.hash("anchor_category");
          $ionicScrollDelegate.anchorScroll(true);
        } else if (usere.loc == undefined) {
          $scope.allNameError = true;
          $scope.addTextValid = true;
          $location.hash("anchor_location");
          $ionicScrollDelegate.anchorScroll(true);
        } else if (usere.loc.formatted_address == undefined) {
          $scope.allNameError = true;
          $scope.addTextValid = true;
          $location.hash("anchor_location");
          $ionicScrollDelegate.anchorScroll(true);
        } else if (usere.radius == undefined) {
          $scope.radiusValid = 1;
          $scope.addTextValid = true;
        } else if ($scope.allVerification.linkedin == null && $scope.allVerification.facebook == null && $scope.allVerification.google == null && $scope.allVerification.phone == null &&  $scope.allVerification.email == null && $scope.allVerification.ssn  == null) {
          $scope.allNameError = $scope.addTextValid = false;
          $scope.addTextValidVerif = true;
          $location.hash("anchor_verification");
          $ionicScrollDelegate.anchorScroll(true);
        } else {
          //location option
          $scope.allNameError = false;
          $scope.radiusValid = 0;

          if (!!usere.loc.geometry) {
            $scope.regLocation.push({
              name: usere.loc.formatted_address,
              radius: usere.radius,
              lat: usere.loc.geometry.location.lat(),
              lng: usere.loc.geometry.location.lng(),
              distance: usere.distance
            });
          } else {
            $scope.regLocation.push({
              name: usere.loc.formatted_address,
              radius: usere.radius,
              lat: $scope.usere.lat,
              lng: $scope.usere.lng,
              distance: usere.distance
            });
          }
          //
          $scope.filterGet = {
            "user_id": $rootScope.userAccount.id,
            "category": $scope.nextCategoryId,
            "location": $scope.regLocation,
            "price": [
              $scope.slider.minValue,
              $scope.slider.maxValue
            ],
            "verification": [
              $scope.allVerification.linkedin,
              $scope.allVerification.facebook,
              $scope.allVerification.google,
              $scope.allVerification.phone,
              $scope.allVerification.email,
              $scope.allVerification.ssn
            ]
          };
          if($scope.active == 'Lead'){
            $scope.filterGet.lead_type = false; // false - job, true - lead
          }else if($scope.active == 'Job'){
            $scope.filterGet.lead_type = true; // false - job, true - lead
          }

          console.log($scope.filterGet);
          $rootScope.getFiltrContent = $scope.filterGet;
          $scope.filterGet = {};
          console.log($rootScope.getFiltrContent);
          location.href = '#/tab/content1';
          $rootScope.editProfileUser = false;
          $rootScope.getContent();
          $scope.regLocation = [];
          $scope.usere = [];
          $scope.countCategory = [];
        }
      };
    };
    $rootScope.filter();
  })
//---------------------------------------------------------------------------------------------------------------------------------------------------------------
  .controller('content1', function ($scope, $http, $rootScope, $ionicActionSheet, TDCardDelegate, $ionicPlatform, $ionicLoading, $cordovaMedia, backcallFactory, $timeout, $state) {
    $ionicLoading.hide();
    $scope.filtrOpen = function () {
      location.href = '#/app/filter';
      $scope.getPriceRange();
      $rootScope.filter();
    };
//come-back close
    backcallFactory.backcallfun();
//Min/Max price
    $scope.getPriceRange = function () {
      $http({
          method: 'GET',
          url: 'http://leadr.jellyworkz.com/api/v1/lead-util?action=price-range'
        }).success(function (data) {
          $rootScope.minValue = data.min;
          $rootScope.maxValue = data.max;
        });
    }
    $scope.getPriceRange();
//
    $scope.timeCreateLead = function (n) {
      if(!n){
        n = 0;
      }
      $scope.leadTime =  $scope.cards.active[n].createdAt.date;
      $scope.today = new Date();
      $scope.mo = $scope.leadTime[5] +$scope.leadTime[6]-1;
      $scope.d = $scope.leadTime[8] +$scope.leadTime[9];
      $scope.t = $scope.leadTime[11] +$scope.leadTime[12];
      $scope.h = $scope.leadTime[14] +$scope.leadTime[15];
      $scope.m = $scope.leadTime[17] +$scope.leadTime[18];
      $scope.BigDay = new Date(parseFloat($scope.leadTime),$scope.mo,$scope.d,$scope.t,$scope.h,$scope.m);
      $scope.msPerDay = 24 * 60 * 60 * 1000 ;
      $scope.timeLeft = ($scope.today.getTime()  - $scope.BigDay.getTime());
      $scope.e_daysLeft = $scope.timeLeft / $scope.msPerDay;
      $scope.daysLeft = Math.floor($scope.e_daysLeft);
      $scope.e_hrsLeft = ($scope.e_daysLeft - $scope.daysLeft)*24;
      $scope.hrsLeft = Math.floor($scope.e_hrsLeft);
      $scope.minsLeft = Math.floor(($scope.e_hrsLeft - $scope.hrsLeft)*60);
      console.log($scope.daysLeft+" day "+$scope.hrsLeft+" "+$scope.minsLeft);
      $scope.time = [];
      $scope.time[0] = $scope.daysLeft;
      $scope.time[1] = $scope.hrsLeft;
      $scope.time[2] = $scope.minsLeft;
      $scope.timeAllSecond = $scope.daysLeft * 60 + $scope.hrsLeft;
    };
//
    $rootScope.getContent = function () {
     $ionicLoading.show();
      if (!$rootScope.getFiltrContent) {
        $http({
          method: 'GET',
          url: 'http://leadr.jellyworkz.com/api/v1/lead?user_id=' + $rootScope.userAccount.id + '&limit=4'
        }).success(function (data) {
          //if content or filter
        $scope.data = data;
          $scope.countGetContent = 4;
          $scope.contentCards = Array.prototype.slice.call(data, 0);
          $scope.cards = {
            master: Array.prototype.slice.call($scope.contentCards, 0),
            active: Array.prototype.slice.call($scope.contentCards, 0)
          };
          //Time Fresh
          if ($scope.cards.active.length !== 0) {
            $scope.timeCreateLead();
          }
          $scope.refreshCards();

        });
      }else {
       $ionicLoading.show();
        var config = {
          headers: {
            'Token': '1111'
          }
        };
        $http.post('http://leadr.jellyworkz.com/api/v1/lead-filter', $rootScope.getFiltrContent, config)
        .success(function (data2) {
          console.log(data2);
          if(data2){
            $timeout(function () {
              $scope.filterCards = Array.prototype.slice.call(data2, 0);
              console.log('data filtr: ' + $scope.filterCards);
              $scope.cards = {
                master: Array.prototype.slice.call($scope.filterCards, 0),
                active: Array.prototype.slice.call($scope.filterCards, 0)
              };
            });
            //Time Fresh
            if ($scope.cards.active.length !== 0) {
              $scope.timeCreateLead();
            }
            //
          }
            $scope.refreshCards();
            $ionicLoading.hide();
        })
      .error(function (data, status, header, config) {
        });
      }
        $scope.cardDestroyed = function (index) {
        //$scope.cardDestroyed = function () {
          $scope.cards.active.splice(index, 1);
        };
        $scope.addCard = function () {
          var newCard = $scope.contentCards[0];
          $scope.cards.active.push(angular.extend({}, newCard));
        };
        $scope.refreshCards = function () {
          $scope.cards.active = null;
          $timeout(function () {
            $scope.cards.active = Array.prototype.slice.call($scope.cards.master, 0);
          });
        };
        $scope.nextDownloadCards = function () {
          $ionicLoading.show({
            template: '<p>Loading...</p>'
          });
          $scope.cards.active = null;
          $http({
            method: 'GET',
            url: 'http://leadr.jellyworkz.com/api/v1/lead?user_id=' + $rootScope.userAccount.id + '&offset=' + $scope.countGetContent + '&limit=4'
          }).success(function (data) {
            $scope.contentCards = Array.prototype.slice.call(data, 0);
            $scope.cards = {
              master: Array.prototype.slice.call($scope.contentCards, 0),
              active: Array.prototype.slice.call($scope.contentCards, 0)
            };
            $ionicLoading.hide();

          });
          $scope.countGetContent = $scope.countGetContent + 3;
        };
        $scope.cardSwipedLeft = function (index) {
          console.log('LEFT SWIPE' + index);
          //
          var card = $scope.cards.active[index];
          if ($scope.cards.active.length == 1) {
            $scope.nextDownloadCards();
          }else{
            $scope.timeCreateLead(1);
          }
        };
        $scope.cardSwipedRight = function (index) {
          console.log('RIGHT SWIPE' + $scope.cards.active.length);
          //
          var card = $scope.cards.active[index];
          if ($scope.cards.active.length == 1) {
            $scope.nextDownloadCards();
          }else{
            $scope.timeCreateLead(1);
          }
        };
        $ionicLoading.hide();
    };

//Groups tag
    $scope.groupFriends = false;
      if(localStorage.getItem("groupFriends")){
        $scope.groupFriends = [JSON.parse(localStorage.getItem("groupFriends"))];
        $scope.groupFriends = Array.prototype.slice.call($scope.groupFriends, 0);
        console.log($scope.groupFriends);
      }
//Title-Menu toggle
    $scope.toggleContMenu = function () {
      $scope.toggleContValue = $scope.toggleContValue === true ? false : true;
    };
    $scope.tagChoose = function (index) {
      $scope.groupsId = {
        id: $scope.groups[index].user[0].id
      };
      $scope.toggleContMenu();
    };
    $rootScope.getContent();
// END-Slide
//Player
    $ionicPlatform.ready(function () {
      var my_media = null;
      var mediaTimer = null;
      $scope.stopAudioBottom = false;
      $scope.playAudio = function (src) {
        src = 'http://leadr.jellyworkz.com' + src;
        my_media = new Media(src, onSuccess, onError);
        my_media.play();
        $scope.stopAudioBottom = true;
        if (mediaTimer == null) {
          mediaTimer = setInterval(function () {
            my_media.getCurrentPosition(
              function (position) {
                if (position > -1) {
//                  setAudioPosition((position) + " sec");
                }
              },
              function (e) {
//                setAudioPosition("Error: " + e);
              }
            );
             if(position == 0 ){
              $scope.stopAudioBottom = false;
            }else{
              $scope.stopAudioBottom = true;
            }
          }, 1000);


        }
      };
      $scope.stopAudio = function () {
        if (my_media) {
          my_media.stop();
        }
        clearInterval(mediaTimer);
        mediaTimer = null;
        $scope.stopAudioBottom = false;
      };
      function onSuccess() {
      }

      function onError(error) {
        alert('code: ' + error.code + '\n' +
          'message: ' + error.message + '\n');
      }

//      function setAudioPosition(position) {
//        document.getElementById('audio_position').innerHTML = parseInt(position).toFixed();
//        if (parseInt(position).toFixed() == 0) {
//          $scope.stopAudioBottom = false;
//        }
//      }

      $scope.$on('destroy', function () {
        media.release();
      });
    });
//footer context_menu_but
    $scope.toggleFooter = function (card) {
      $ionicActionSheet.show({
        buttons: [
          {text: '<a class="bar-modal" href="#/tab/seller-profile">Seller profile</a>'},
          {text: '<a class="bar-modal" href="#/app/chat">Contact by chat</a>'},
          {text: '<a class="bar-modal" href="#">Cancel</a>'}
        ],
        buttonClicked: function (index) {
          if (index == 0) {
            $rootScope.sellerAccount = card.createdBy;
            location.href = '#/tab/seller-profile';
            $rootScope.sellerProfile();
          }else if (index == 1) {
          //$rootScope.card = card;
            $rootScope.chatLead= card;
            $state.go('app.chat');
            $rootScope.mobileChat();
            console.log(card.id);
          }
          return true;
        }
      });
    };
//Title-Menu toggle
    $scope.toggleContMenu = function () {
      $scope.toggleContValue = $scope.toggleContValue === true ? false : true;
    };
//
    $scope.buyNow = function (self) {

      console.log(self);
      self.boughtBy = $rootScope.userAccount.id;
      $scope.buyLeadPut = {
        "statusId": 2,
        "boughtBy": $rootScope.userAccount.id
      };
      var config = {
        headers: {
          'Token': '1111'
        }
      };
      $http.post('http://leadr.jellyworkz.com/api/v1/lead/' + self.id, $scope.buyLeadPut, config)
        .success(function (data) {
          location.href = '#/tab/mine';
          $rootScope.getMineBought();
          console.log(data);
          var config = {
            headers: {
              'Token': '1111'
            }
          };
          $http.post('http://leadr.jellyworkz.com/api/v1/user-friend/' + $rootScope.userAccount.id + '/' + data.createdBy, $scope.buyLeadPut, config)
            .success(function (data) {
              console.log(data);
            })
            .error(function (data, status, header, config) {
            });
        })
        .error(function (data, status, header, config) {
        });
    };
  })
//---------------------------------------------------------------------------------------------------------------------------------------------------------------
  .controller('mine', function ($scope,  $state, $rootScope, $http, $ionicActionSheet, TDCardDelegate, $ionicLoading, $timeout, $ionicPlatform, $ionicLoading, $cordovaMedia) {
    $scope.timeCreateLead = function (n) {
      if(!n){
        n = 0;
      }
      $scope.leadTime =  $scope.cards.active[n].createdAt.date;
      $scope.today = new Date();
      $scope.mo = $scope.leadTime[5] +$scope.leadTime[6]-1;
      $scope.d = $scope.leadTime[8] +$scope.leadTime[9];
      $scope.t = $scope.leadTime[11] +$scope.leadTime[12];
      $scope.h = $scope.leadTime[14] +$scope.leadTime[15];
      $scope.m = $scope.leadTime[17] +$scope.leadTime[18];
      $scope.BigDay = new Date(parseFloat($scope.leadTime),$scope.mo,$scope.d,$scope.t,$scope.h,$scope.m);
      $scope.msPerDay = 24 * 60 * 60 * 1000 ;
      $scope.timeLeft = ($scope.today.getTime()  - $scope.BigDay.getTime());
      $scope.e_daysLeft = $scope.timeLeft / $scope.msPerDay;
      $scope.daysLeft = Math.floor($scope.e_daysLeft);
      $scope.e_hrsLeft = ($scope.e_daysLeft - $scope.daysLeft)*24;
      $scope.hrsLeft = Math.floor($scope.e_hrsLeft);
      $scope.minsLeft = Math.floor(($scope.e_hrsLeft - $scope.hrsLeft)*60);
      console.log($scope.daysLeft+" day "+$scope.hrsLeft+" "+$scope.minsLeft);
      $scope.time = [];
      $scope.time[0] = $scope.daysLeft;
      $scope.time[1] = $scope.hrsLeft;
      $scope.time[2] = $scope.minsLeft;
      $scope.timeAllSecond = $scope.daysLeft * 60 + $scope.hrsLeft;
    };
//get mine-bought -server
    $rootScope.getMineBought = function () {
      $scope.indexName = 'Bought';
      $scope.mineBoughtCards = null;
      $http({
        method: 'GET',
        url: 'http://leadr.jellyworkz.com/api/v1/lead-mine/' + $rootScope.userAccount.id + '?action=bought'
      }).success(function (data) {
        $ionicLoading.hide();
        $scope.mineBoughtCards = Array.prototype.slice.call(data, 0);
        $scope.cards = {
          master: Array.prototype.slice.call($scope.mineBoughtCards, 0),
          active: Array.prototype.slice.call($scope.mineBoughtCards, 0)
        };
        $scope.indexChoose = 0;
        //Time Fresh
        if ($scope.cards.active.length !== 0) {
          $scope.timeCreateLead();
        }
        //
        $scope.cardDestroyed = function (index) {
          $scope.cards.active.splice(index, 1);
        };
        $scope.addCard = function () {
          var newCard = $rootScope.mineBoughtCards[0];
          $scope.cards.active.push(angular.extend({}, newCard));
        };
        $scope.refreshCards = function () {
          $scope.cards.active = null;
          $timeout(function () {
            $scope.cards.active = Array.prototype.slice.call($scope.cards.master, 0);
          });
        };
        $scope.nextDownloadCards = function () {
          $ionicLoading.show({
            template: '<p>Loading...</p>'
          });
          $scope.cards.active = null;
          $http({
            method: 'GET',
            url: 'http://leadr.jellyworkz.com/api/v1/lead-mine/' + $rootScope.userAccount.id + '?action=bought'
          }).success(function (data) {
            $scope.contentCards = Array.prototype.slice.call(data, 0);
            $scope.cards = {
              master: Array.prototype.slice.call($scope.contentCards, 0),
              active: Array.prototype.slice.call($scope.contentCards, 0)
            };
            //Time Fresh
            if ($scope.cards.active.length !== 0) {
              $scope.timeCreateLead();
            }
            //
            $ionicLoading.hide();
          });
          $scope.countGetContent = $scope.countGetContent + 3;
        };
        $scope.cardSwipedLeft = function () {
          console.log('LEFT SWIPE' );
          if ($scope.cards.active.length == 1) {
            $scope.nextDownloadCards();
          }else{
            $scope.timeCreateLead(1);
          }
        };
        $scope.cardSwipedRight = function () {
          if ($scope.cards.active.length == 1) {
            $scope.nextDownloadCards();
          }else{
            $scope.timeCreateLead(1);
          }
        };
        $ionicLoading.hide();
        $scope.refreshCards();
      });
      $scope.toggleContValue = false;
    };
    $rootScope.getMineBought();
//get mine-unsold -server
    $rootScope.mineUnsold = function () {
      $scope.cards = null;
      $http({
        method: 'GET',
        url: 'http://leadr.jellyworkz.com/api/v1/lead-mine/' + $rootScope.userAccount.id + '?action=unsold'
      }).success(function (data) {
        $scope.mineBoughtCards = Array.prototype.slice.call(data, 0);
        $scope.cards = {
          master: Array.prototype.slice.call($scope.mineBoughtCards, 0),
          active: Array.prototype.slice.call($scope.mineBoughtCards, 0)
        };
        //Time Fresh
        if ($scope.cards.active.length !== 0) {
          $scope.timeCreateLead();
        }
        //
        $scope.cardDestroyed = function (index) {
          $scope.cards.active.splice(index, 1);
        };
        $scope.addCard = function () {
          var newCard = $rootScope.mineBoughtCards[0];
          $scope.cards.active.push(angular.extend({}, newCard));
        };
        $scope.refreshCards = function () {
          $scope.cards.active = null;
          $timeout(function () {
            $scope.cards.active = Array.prototype.slice.call($scope.cards.master, 0);
          });
        };
        $scope.nextDownloadCards = function () {
          $ionicLoading.show({
            template: '<p>Loading...</p>'
          });
          $scope.cards.active = null;
          $http({
            method: 'GET',
            url: 'http://leadr.jellyworkz.com/api/v1/lead-mine/' + $rootScope.userAccount.id + '?action=unsold'
          }).success(function (data) {
            $scope.contentCards = Array.prototype.slice.call(data, 0);
            $scope.cards = {
              master: Array.prototype.slice.call($scope.contentCards, 0),
              active: Array.prototype.slice.call($scope.contentCards, 0)
            };
            if ($scope.cards.active.length !== 0) {
              $scope.timeCreateLead();
            }
            $ionicLoading.hide();
          });
          $scope.countGetContent = $scope.countGetContent + 3;
        };
        $scope.cardSwipedLeft = function () {
          if ($scope.cards.active.length == 1) {
            $scope.nextDownloadCards();
          }else{
            $scope.timeCreateLead(1);
          }
        };
        $scope.cardSwipedRight = function () {
          if ($scope.cards.active.length == 1) {
            $scope.nextDownloadCards();
          }else{
            $scope.timeCreateLead(1);
          }
        };
        $ionicLoading.hide();
        $scope.refreshCards();
      });
      $scope.toggleContValue = false;
    };
//get mine-sold -server
    $rootScope.mineSold = function () {
      $scope.cards = null;
      $http({
        method: 'GET',
        url: 'http://leadr.jellyworkz.com/api/v1/lead-mine/' + $rootScope.userAccount.id + '?action=sold'
      }).success(function (data) {
        $scope.mineBoughtCards = Array.prototype.slice.call(data, 0);
        $scope.cards = {
          master: Array.prototype.slice.call($scope.mineBoughtCards, 0),
          active: Array.prototype.slice.call($scope.mineBoughtCards, 0)
        };
        //Time Fresh
        if ($scope.cards.active.length !== 0) {
          $scope.timeCreateLead();
        }
        $scope.cardDestroyed = function (index) {
          $scope.cards.active.splice(index, 1);
        };
        $scope.addCard = function () {
          var newCard = $rootScope.mineBoughtCards[0];
          $scope.cards.active.push(angular.extend({}, newCard));
        };
        $scope.refreshCards = function () {
          $scope.cards.active = null;
          $timeout(function () {
            $scope.cards.active = Array.prototype.slice.call($scope.cards.master, 0);
          });
        };
        $scope.nextDownloadCards = function () {
          $ionicLoading.show({
            template: '<p>Loading...</p>'
          });
          $scope.cards.active = null;
          $http({
            method: 'GET',
            url: 'http://leadr.jellyworkz.com/api/v1/lead-mine/' + $rootScope.userAccount.id + '?action=sold'
          }).success(function (data) {
            $scope.contentCards = Array.prototype.slice.call(data, 0);
            $scope.cards = {
              master: Array.prototype.slice.call($scope.contentCards, 0),
              active: Array.prototype.slice.call($scope.contentCards, 0)
            };
            if ($scope.cards.active.length !== 0) {
              $scope.timeCreateLead();
            }
            $ionicLoading.hide();
          });
          $scope.countGetContent = $scope.countGetContent + 3;
        };
        $scope.cardSwipedLeft = function () {
          if ($scope.cards.active.length == 1) {
            $scope.nextDownloadCards();
          }else{
            $scope.timeCreateLead(1);
          }
        };
        $scope.cardSwipedRight = function () {
          if ($scope.cards.active.length == 1) {
            $scope.nextDownloadCards();
          }else{
            $scope.timeCreateLead(1);
          }
        };
        $ionicLoading.hide();
        $scope.refreshCards();
      });
      $scope.toggleContValue = false;
    };
    //get mine-Issues -server
        $rootScope.mineIssues = function () {
          $scope.cards = null;
          $http({
            method: 'GET',
            url: 'http://leadr.jellyworkz.com/api/v1/lead-mine/' + $rootScope.userAccount.id + '?action=sold'
          }).success(function (data) {
            $scope.mineBoughtCards = [];
            for(var i in data){
              console.log(data[i], i);
              if(data[i].ticket){
                $scope.mineBoughtCards.push(data[i]);
              }
            }
            //$scope.mineBoughtCards = Array.prototype.slice.call(data, 0);
            $scope.cards = {
              master: Array.prototype.slice.call($scope.mineBoughtCards, 0),
              active: Array.prototype.slice.call($scope.mineBoughtCards, 0)
            };
            //Time Fresh
            if ($scope.cards.active.length !== 0) {
              $scope.timeCreateLead();
            }
            $scope.cardDestroyed = function (index) {
              $scope.cards.active.splice(index, 1);
            };
            $scope.addCard = function () {
              var newCard = $rootScope.mineBoughtCards[0];
              $scope.cards.active.push(angular.extend({}, newCard));
            };
            $scope.refreshCards = function () {
              $scope.cards.active = null;
              $timeout(function () {
                $scope.cards.active = Array.prototype.slice.call($scope.cards.master, 0);
              });
            };
            $scope.nextDownloadCards = function () {
              $ionicLoading.show({
                template: '<p>Loading...</p>'
              });
              $scope.cards.active = null;
              $http({
                method: 'GET',
                url: 'http://leadr.jellyworkz.com/api/v1/lead-mine/' + $rootScope.userAccount.id + '?action=sold'
              }).success(function (data) {
                $scope.contentCards = [];
                for(var i in data){
                  console.log(data[i], i);
                  if(data[i].ticket){
                    $scope.contentCards.push(data[i]);
                  }
                }
                $scope.cards = {
                  master: Array.prototype.slice.call($scope.contentCards, 0),
                  active: Array.prototype.slice.call($scope.contentCards, 0)
                };
                if ($scope.cards.active.length !== 0) {
                  $scope.timeCreateLead();
                }
                $ionicLoading.hide();
              });
              $scope.countGetContent = $scope.countGetContent + 3;
            };
            $scope.cardSwipedLeft = function () {
              if ($scope.cards.active.length == 1) {
                $scope.nextDownloadCards();
              }else{
                $scope.timeCreateLead(1);
              }
            };
            $scope.cardSwipedRight = function () {
              if ($scope.cards.active.length == 1) {
                $scope.nextDownloadCards();
              }else{
                $scope.timeCreateLead(1);
              }
            };
            $ionicLoading.hide();
            $scope.refreshCards();
          });
          $scope.toggleContValue = false;
        };
//groupList
    $scope.indexChoose = 0;
    $scope.groupList = [{text: 'Bought'}, {text: 'Unsold'}, {text: 'Sold'}, {text: 'Issues'}];
    $scope.indexName = $scope.groupList[0].text;
    $scope.tagChoose = function (index) {
      $scope.indexChoose = index;
      $scope.indexName = $scope.groupList[index].text;
      switch (index) {
        case 0:
          $ionicLoading.show();
          $rootScope.getMineBought();
          break;
        case 1:
          $ionicLoading.show();
          $scope.mineUnsold();
          break;
        case 2:
          $ionicLoading.show();
          $scope.mineSold();
          break;
        case 3:
          $ionicLoading.show();
          $scope.mineIssues();
          break;
      }
    };
  //Player
    $ionicPlatform.ready(function () {
      var my_media = null;
      var mediaTimer = null;
      $scope.stopAudioBottom = false;
      $scope.playAudio = function (src) {
      src = 'http://leadr.jellyworkz.com' + src;
        my_media = new Media(src, onSuccess, onError);
        my_media.play();
        $scope.stopAudioBottom = true;
        if (mediaTimer == null) {
          mediaTimer = setInterval(function () {
            my_media.getCurrentPosition(
              function (position) {
                if (position > -1) {
//                  setAudioPosition((position) + " sec");
                }
              },
              function (e) {
//                setAudioPosition("Error: " + e);
              }
            );
          }, 1000);
        }
      };
      $scope.stopAudio = function () {
        if (my_media) {
          my_media.stop();
        }
        clearInterval(mediaTimer);
        mediaTimer = null;
        $scope.stopAudioBottom = false;
      };
      function onSuccess() {
      }

      function onError(error) {
        alert('code: ' + error.code + '\n' +
          'message: ' + error.message + '\n');
      }

//      function setAudioPosition(position) {
//        document.getElementById('audio_position').innerHTML = parseInt(position).toFixed();
//        if (parseInt(position).toFixed() == 0) {
//          $scope.stopAudioBottom = false;
//        }
//      }

      $scope.$on('destroy', function () {
        media.release();
      });
    });
//footer context_menu_but
    $scope.toggleFooter = function (card) {
      console.log(card);
      $ionicActionSheet.show({
        buttons: [
          {text: '<a class="bar-modal" href="#/tab/seller-profile">Seller profile</a>'},
          {text: '<a class="bar-modal" href="#/app/chat">Contact by chat</a>'},
          {text: '<a class="bar-modal">Open ticket</a>'},
          {text: '<a class="bar-modal" href="#">Cancel</a>'}
        ],
        buttonClicked: function (index) {
          if (index == 0) {
              $rootScope.sellerAccount = card.createdBy;
              console.log("asdasd" + $rootScope.chatTitle);
              location.href = '#/tab/seller-profile';
              $rootScope.sellerProfile();
          }else if (index == 1) {
              $rootScope.chatLead= card;
              $state.go('app.chat');
              $rootScope.mobileChat();
              console.log(card.id);
          }else if (index == 2) {
              $scope.hrefTicket(card);
              console.log(card.id);
          }
          return true;
        }
      });
    };
//hrefTicket
    $scope.hrefTicket = function (ticket) {
      location.href = '#/tab/ticket';
      console.log(ticket.id);
      $rootScope.ticketId = ticket.id;
    };
//Title-Menu toggle
    $scope.toggleContMenu = function () {
      $scope.toggleContValue = $scope.toggleContValue === true ? false : true;
    };
// END-Slide
  })
//---------------------------------------------------------------------------------------------------------------------------------------------------------------
  .controller('contacts', function ($scope, TDCardDelegate, $http, $ionicActionSheet, $rootScope, $cordovaContacts) {
    $rootScope.loadContact = function () {
      $scope.friends = [];
      $http({
        method: 'GET',
        url: 'http://leadr.jellyworkz.com/api/v1/user/' + $rootScope.userAccount.id
      }).success(function (data) {
        if (!!data.friendUser) {
          for (var i = 0; i < data.friendUser.length; i++) {
            if (!!data.favoriteUser) {
              for (var k = 0; k < data.favoriteUser.length; k++) {
                if (data.friendUser[i].id == data.favoriteUser[k].id) {
                  data.friendUser[i].idFavor = true;
                }
              }
            }
          }
          var friendsList = data.friendUser;
          $scope.friends = Array.prototype.slice.call(friendsList, 0);
          console.log($scope.friends);
        }
      });
      $scope.mobTelephone = "";
      $cordovaContacts.find({filter: ''}).then(function (result) {
        $scope.contacts = result;
        $scope.friends2 = [];
        //rawId
        for (var i = 0; i < result.length - 1; i++) {
          if (!!$scope.contacts[i].phoneNumbers) {
            $scope.mobTelephone = $scope.contacts[i].phoneNumbers[0].value;
            $http({
              method: 'GET',
              url: 'http://leadr.jellyworkz.com/api/v1/user-find/' + $scope.mobTelephone
            }).success(function (data) {
              if (!!data) {
                $scope.friendsLeadSim = Array.prototype.slice.call(data, 0);
                if (!!$scope.friendsLeadSim) {
                  if (!!$scope.friends.length) {
                    $scope.friendsLeadSim[0].id += '';
                    $scope.friends[0].id += '';
                    if ($scope.friends[0].id == $scope.friendsLeadSim[0].id) {
                      console.log($scope.friendsLeadSim[0].id + '=' + $scope.friends[0].id);
                    } else {
                      $scope.friends2.push($scope.friendsLeadSim[0]);
                    }
                  } else {
                    $scope.friends2.push($scope.friendsLeadSim[0]);
                  }
                }
              }
            });
          }
        }
      }, function (error) {
        console.log("ERROR: " + error);
      });
    };
    $rootScope.loadContact();
    $scope.toggleInputSearch = function () {
      $scope.toggleInputSearchShow = $scope.toggleInputSearchShow === true ? false : true;
    };
//Get-groups
    $scope.groups = $rootScope.groups;
//Title-Menu toggle
    $scope.toggleContMenu = function () {
      $scope.toggleContValue = $scope.toggleContValue === true ? false : true;
    };
    $scope.tagChooseSimCard = function () {
      $scope.showSimContact = false;
      $scope.toggleContMenu();
    };
    $scope.tagChoose = function (index) {
      $scope.groupsId = {
        id: $scope.groups[index].user[0].id
      };
      $scope.toggleContMenu();
    };
// verified icon color
    $scope.setVerified = function (is_verified) {
      return is_verified > 2 ? "icon-verified icon color" : " ";
    };
    //footer context_menu_but
    $scope.toggleFooterLeadFriends = function (people) {
      console.log(people.idFavor);
      $ionicActionSheet.show({
        buttons: [
          {text: '<a class="bar-modal" href="#">Del Favorite</a>'},
          {text: '<a class="bar-modal" href="#">Cancel</a>'}
        ],
        buttonClicked: function (index) {
          if (index == 0) {
            if ($rootScope.userAccount.verification.linkedin) {
              $http.delete('http://leadr.jellyworkz.com/api/v1/user-friend/' + $rootScope.userAccount.id + '/' + people.id + '/' + $rootScope.userAccount.verification.linkedin)
                .success(function (data, status, headers, config) {
                  $http.delete('http://leadr.jellyworkz.com/api/v1/favorite/' + $rootScope.userAccount.id + '/' + people.id + '/' + $rootScope.userAccount.verification.linkedin)
                    .success(function (data, status, headers, config) {
                      $rootScope.loadContact();
                    })
                    .error(function (data, status, header, config) {
                    });
                })
                .error(function (data, status, header, config) {
                });
            }
            else if ($rootScope.userAccount.verification.facebook) {
              $http.delete('http://leadr.jellyworkz.com/api/v1/user-friend/' + $rootScope.userAccount.id + '/' + people.id + '/' + $rootScope.userAccount.verification.facebook)
                .success(function (data, status, headers, config) {
                  $http.delete('http://leadr.jellyworkz.com/api/v1/favorite/' + $rootScope.userAccount.id + '/' + people.id + '/' + $rootScope.userAccount.verification.facebook)
                    .success(function (data, status, headers, config) {
                      $rootScope.loadContact();
                    })
                    .error(function (data, status, header, config) {
                    });
                })
                .error(function (data, status, header, config) {
                });
            }
            else if ($rootScope.userAccount.verification.google) {
              $http.delete('http://leadr.jellyworkz.com/api/v1/user-friend/' + $rootScope.userAccount.id + '/' + people.id + '/' + $rootScope.userAccount.verification.google)
                .success(function (data, status, headers, config) {
                  $http.delete('http://leadr.jellyworkz.com/api/v1/favorite/' + $rootScope.userAccount.id + '/' + people.id + '/' + $rootScope.userAccount.verification.google)
                    .success(function (data, status, headers, config) {
                      $rootScope.loadContact();
                    })
                    .error(function (data, status, header, config) {
                    });
                })
                .error(function (data, status, header, config) {
                });
            }
            else if ($rootScope.userAccount.verification.email) {
              $http.delete('http://leadr.jellyworkz.com/api/v1/user-friend/' + $rootScope.userAccount.id + '/' + people.id + '/' + $rootScope.userAccount.verification.email)
                .success(function (data, status, headers, config) {
                  $http.delete('http://leadr.jellyworkz.com/api/v1/favorite/' + $rootScope.userAccount.id + '/' + people.id + '/' + $rootScope.userAccount.verification.email)
                    .success(function (data, status, headers, config) {
                      $rootScope.loadContact();
                    })
                    .error(function (data, status, header, config) {
                    });
                })
                .error(function (data, status, header, config) {
                });
            }
          }
          return true;
        }
      });
    };
//
    $scope.toggleFooterMobLeadFriends = function (peopleId) {
      $ionicActionSheet.show({
        buttons: [
          {text: '<a class="bar-modal" href="#">Favorite</a>'},
          {text: '<a class="bar-modal" href="#">Cancel</a>'}
        ],
        buttonClicked: function (index) {
          if (index == 0) {
//            $http.post('http://leadr.jellyworkz.com/api/v1/user-friend/' + $rootScope.userAccount.id + '/' + peopleId)
//              .success(function (data, status, headers, config) {
//                $http.post('http://leadr.jellyworkz.com/api/v1/favorite/' + $rootScope.userAccount.id + '/' + peopleId)
//                  .success(function (data, status, headers, config) {
//                    $rootScope.loadContact();
//                  })
//                  .error(function (data, status, header, config) {
//                  });
//              })
//              .error(function (data, status, header, config) {
//              });
          }
          return true;
        }
      });
    };
//footer context_menu_but_telephoneBook
    $scope.toggleFooterTelephoneBook = function (contact) {
      $ionicActionSheet.show({
        buttons: [
          {text: '<a class="bar-modal" href="#">Send offer</a>'},
          {text: '<a class="bar-modal" href="#">Cancel</a>'}
        ],
        buttonClicked: function (index) {
          if (index == 0) {
            console.log(contact);
            if(contact.phoneNumbers !== null){
              console.log(contact.phoneNumbers[0].value);
              $scope.mobileNumberSim = ""+ contact.phoneNumbers[0].value;
              if($scope.mobileNumberSim.indexOf("+380")){
                $scope.mobileNumberSim = "+38" + $scope.mobileNumberSim;
              }

                $scope.sendOfferNumberMess = {
                  "phone": $scope.mobileNumberSim,
                  "message": "You have been invited to buy new leads with Leader"
                };
                console.log($scope.sendOfferNumberMess);
                $http.post('http://leadr.jellyworkz.com/api/v1/phone/send', $scope.sendOfferNumberMess)
                  .success(function (data, status, headers, config) {
                  console.log(data);
                   alert("Ssent message");
                  })
                  .error(function (data, status, header, config) {
                    alert("(((");
                  });
            }else{
              alert('Number is not!')
            }
          }
          return true;
        }
      });
    };
  })
//---------------------------------------------------------------------------------------------------------------------------------------------------------------
  .controller('cashflow', function ($scope) {
//Title-Menu toggle
    $scope.toggleContMenu = function () {
      $scope.toggleContValue = $scope.toggleContValue === true ? false : true;
    };
  })
//---------------------------------------------------------------------------------------------------------------------------------------------------------------
  .controller('help', function ($scope) {
//Back-chat
    $scope.reload = function () {
      document.location.href = 'index.html';
    }
  })
//---------------------------------------------------------------------------------------------------------------------------------------------------------------
  .controller('myProfile', function ($scope, $state, $rootScope, $ionicHistory, $http, $ionicLoading, $timeout, $ionicActionSheet, $ionicPlatform, $cordovaMedia, $firebaseArray) {
  //Chat
    var ref = new Firebase('https://queupapp123.firebaseio.com');
    $scope.profChat = function(chatLeadId){
    $rootScope.chatLeadId = chatLeadId;
      $scope.queue = $firebaseArray(ref.child("iosRooms/roomLeadId_"+$rootScope.chatLeadId));
      console.log(chatLeadId);
      if($scope.queue){
        //location.href = '#/app/chat';
        $state.go('app.chat');
        $rootScope.mobileChat();
      }
    }
  //timeCreateLead
    $scope.timeCreateLead = function (n) {
      if(!n){
        n = 0;
      }
      $scope.leadTime =  $scope.cards.active[n].createdAt.date;
      $scope.today = new Date();
      $scope.mo = $scope.leadTime[5] +$scope.leadTime[6]-1;
      $scope.d = $scope.leadTime[8] +$scope.leadTime[9];
      $scope.t = $scope.leadTime[11] +$scope.leadTime[12];
      $scope.h = $scope.leadTime[14] +$scope.leadTime[15];
      $scope.m = $scope.leadTime[17] +$scope.leadTime[18];
      $scope.BigDay = new Date(parseFloat($scope.leadTime),$scope.mo,$scope.d,$scope.t,$scope.h,$scope.m);
      $scope.msPerDay = 24 * 60 * 60 * 1000 ;
      $scope.timeLeft = ($scope.today.getTime()  - $scope.BigDay.getTime());
      $scope.e_daysLeft = $scope.timeLeft / $scope.msPerDay;
      $scope.daysLeft = Math.floor($scope.e_daysLeft);
      $scope.e_hrsLeft = ($scope.e_daysLeft - $scope.daysLeft)*24;
      $scope.hrsLeft = Math.floor($scope.e_hrsLeft);
      $scope.minsLeft = Math.floor(($scope.e_hrsLeft - $scope.hrsLeft)*60);
      console.log($scope.daysLeft+" day "+$scope.hrsLeft+" "+$scope.minsLeft);
      $scope.time = [];
      $scope.time[0] = $scope.daysLeft;
      $scope.time[1] = $scope.hrsLeft;
      $scope.time[2] = $scope.minsLeft;
      $scope.timeAllSecond = $scope.daysLeft * 60 + $scope.hrsLeft;
    };
//
    $rootScope.myProfile = function () {
      $http({method: 'GET', url: 'http://leadr.jellyworkz.com/api/v1/user/' + $rootScope.userAccount.id}).success(function(data) {
        if(data){
          $rootScope.userAccount = data;
        }else{
          console.log("Error");
        }
      });
      $http({method: 'GET', url: 'http://leadr.jellyworkz.com/api/v1/lead-mine/' + $rootScope.userAccount.id + '?action=unsold'
      }).success(function (data) {
        if(data){
          $scope.profCards = data;
        }else{
          $scope.profCards = [];
        }
        console.log($scope.profCards);
        $http({method: 'GET',url: 'http://leadr.jellyworkz.com/api/v1/lead-mine/' + $rootScope.userAccount.id + '?action=sold'
        }).success(function (data) {
          if(data){
            $scope.contentCards = data;
          }else{
            $scope.contentCards = [];
          }
          console.log($scope.contentCards);
          if ($scope.profCards.length > 0 && $scope.contentCards.length > 0) {
            for(var i = 0; i < $scope.contentCards.length; i++){
              $scope.profCards.push($scope.contentCards[i]);
            }
            $scope.leadProcent = ($scope.profCards.length * 100) / ($scope.contentCards.length + $scope.profCards.length);
          } else if ($scope.contentCards.length > 0){
            $scope.profCards = $scope.contentCards;
            $scope.leadProcent = ($scope.profCards.length * 100) / ($scope.contentCards.length + $scope.profCards.length);
          } else {
            $scope.leadProcent = 0;
          }
          $scope.cards = {
            master: Array.prototype.slice.call($scope.profCards, 0),
            active: Array.prototype.slice.call($scope.profCards, 0)
          };
          console.log($scope.cards);
          //Time Fresh
          if ($scope.cards.active.length !== 0) {
            $scope.timeCreateLead();
          }
          //
          $scope.leadLength = $scope.cards.master.length;
          //
          $scope.cardDestroyed = function (index) {
            $scope.cards.active.splice(index, 1);
          };
          $scope.addCard = function () {
            var newCard = $scope.profCards[0];
            $scope.cards.active.push(angular.extend({}, newCard));
          };
          $scope.refreshCards = function () {
            $scope.cards = {
              active: null,
              master: Array.prototype.slice.call($scope.profCards, 0)
            };
            $timeout(function () {
              $scope.cards.active = Array.prototype.slice.call($scope.cards.master, 0);
            });
          };
          $scope.nextDownloadCards = function () {
            $ionicLoading.show({
              template: '<p>Loading...</p>'
            });
            $scope.cards.active = 1;
            $ionicLoading.hide();
          };
          //$scope.nextDownloadCards = function () {
          //  $ionicLoading.show({
          //    template: '<p>Loading...</p>'
          //  });
          //  $scope.cards.active = null;
          //  $http({
          //    method: 'GET',
          //    url: 'http://leadr.jellyworkz.com/api/v1/lead-mine/' + $rootScope.userAccount.id + '?action=sold'
          //  }).success(function (data) {
          //    $scope.contentCards = Array.prototype.slice.call(data, 0);
          //    $scope.cards = {
          //      master: Array.prototype.slice.call($scope.contentCards, 0),
          //      active: Array.prototype.slice.call($scope.contentCards, 0)
          //    };
          //    if ($scope.cards.active.length !== 0) {
          //      $scope.timeCreateLead();
          //    }
          //    $ionicLoading.hide();
          //  });
          //  $scope.countGetContent = $scope.countGetContent + 3;
          //};
          $scope.cardSwipedLeft = function () {
            if ($scope.cards.active.length == 1) {
              $scope.nextDownloadCards();
            }else{
              $scope.timeCreateLead(1);
            }
          };
          $scope.cardSwipedRight = function () {
            if ($scope.cards.active.length == 1) {
              $scope.nextDownloadCards();
            }else{
              $scope.timeCreateLead(1);
            }
          };
          $ionicLoading.hide();
          $scope.refreshCards();
        });
        //
      });
      $scope.toggleContValue = false;
    };
    $rootScope.myProfile();
    $scope.toggleFooter = function () {
      $ionicActionSheet.show({
        buttons: [
          {text: '<a class="bar-modal" href="#">Edit</a>'},
          {text: '<a class="bar-modal" href="#">Cancel</a>'}
        ],
        buttonClicked: function (index) {
          if (index == 0) {
            location.href = '#/app/reg1';
            console.log($rootScope.userAccount);
            $rootScope.editProfileUser = true;
          }
          return true;
        }
      });
    }
    //Player
        $ionicPlatform.ready(function () {
          var my_media = null;
          var mediaTimer = null;
          $scope.stopAudioBottom = false;
          $scope.playAudio = function (src) {
            src = 'http://leadr.jellyworkz.com' + src;
            my_media = new Media(src, onSuccess, onError);
            my_media.play();
            $scope.stopAudioBottom = true;
            if (mediaTimer == null) {
              mediaTimer = setInterval(function () {
                my_media.getCurrentPosition(
                  function (position) {
                    if (position > -1) {
//                      setAudioPosition((position) + " sec");
                    }
                  },
                  function (e) {
//                    setAudioPosition("Error: " + e);
                  }
                );
              }, 1000);
            }
          };
          $scope.stopAudio = function () {
            if (my_media) {
              my_media.stop();
            }
            clearInterval(mediaTimer);
            mediaTimer = null;
            $scope.stopAudioBottom = false;
          };
          function onSuccess() {
          }

          function onError(error) {
            alert('code: ' + error.code + '\n' +
              'message: ' + error.message + '\n');
          }

//          function setAudioPosition(position) {
//            document.getElementById('audio_position').innerHTML = parseInt(position).toFixed();
//            if (parseInt(position).toFixed() == 0) {
//              $scope.stopAudioBottom = false;
//            }
//          }

          $scope.$on('destroy', function () {
            media.release();
          });
        });
  })
//---------------------------------------------------------------------------------------------------------------------------------------------------------------
  .controller('sellerProfile', function ($scope, $rootScope, $ionicHistory, $http, $ionicLoading, $timeout, $ionicActionSheet) {
    $scope.timeCreateLead = function (n) {
      if(!n){
        n = 0;
      }
      $scope.leadTime =  $scope.cards.active[n].createdAt.date;
      $scope.today = new Date();
      $scope.mo = $scope.leadTime[5] +$scope.leadTime[6]-1;
      $scope.d = $scope.leadTime[8] +$scope.leadTime[9];
      $scope.t = $scope.leadTime[11] +$scope.leadTime[12];
      $scope.h = $scope.leadTime[14] +$scope.leadTime[15];
      $scope.m = $scope.leadTime[17] +$scope.leadTime[18];
      $scope.BigDay = new Date(parseFloat($scope.leadTime),$scope.mo,$scope.d,$scope.t,$scope.h,$scope.m);
      $scope.msPerDay = 24 * 60 * 60 * 1000 ;
      $scope.timeLeft = ($scope.today.getTime()  - $scope.BigDay.getTime());
      $scope.e_daysLeft = $scope.timeLeft / $scope.msPerDay;
      $scope.daysLeft = Math.floor($scope.e_daysLeft);
      $scope.e_hrsLeft = ($scope.e_daysLeft - $scope.daysLeft)*24;
      $scope.hrsLeft = Math.floor($scope.e_hrsLeft);
      $scope.minsLeft = Math.floor(($scope.e_hrsLeft - $scope.hrsLeft)*60);
      console.log($scope.daysLeft+" day "+$scope.hrsLeft+" "+$scope.minsLeft);
      $scope.time = [];
      $scope.time[0] = $scope.daysLeft;
      $scope.time[1] = $scope.hrsLeft;
      $scope.time[2] = $scope.minsLeft;
      $scope.timeAllSecond = $scope.daysLeft * 60 + $scope.hrsLeft;
    };
    $rootScope.sellerProfile = function () {
      console.log($rootScope.sellerAccount);
      $http({
        method: 'GET',
        url: 'http://leadr.jellyworkz.com/api/v1/lead-mine/' + $rootScope.sellerAccount.id + '?action=unsold'
      }).success(function (data, status, headers, config) {
        $scope.profCards = Array.prototype.slice.call(data, 0);
        $http({
          method: 'GET',
          url: 'http://leadr.jellyworkz.com/api/v1/lead-mine/' + $rootScope.sellerAccount.id + '?action=sold'
        }).success(function (data, status, headers, config) {
          $scope.contentCards = Array.prototype.slice.call(data, 0);
          if ($scope.contentCards.length > 0) {
            $scope.profCards.push($scope.contentCards);
            $scope.leadProcent = ($scope.profCards.length * 100) / ($scope.contentCards.length + $scope.profCards.length);
          } else {
            $scope.leadProcent = 0;
          }
          $scope.cards = {
            master: Array.prototype.slice.call($scope.profCards, 0),
            active: Array.prototype.slice.call($scope.profCards, 0)
          };
          //Time Fresh
          if ($scope.cards.active.length !== 0) {
            $scope.timeCreateLead();
          }
          //
          $scope.leadLength = $scope.cards.master.length;
        });
        $scope.cardDestroyed = function (index) {
          $scope.cards.active.splice(index, 1);
        };
        $scope.addCard = function () {
          var newCard = $scope.profCards[0];
          $scope.cards.active.push(angular.extend({}, newCard));
        };
        $scope.refreshCards = function () {
          $scope.cards = {
            active: null,
            master: Array.prototype.slice.call($scope.profCards, 0)
          };
          $timeout(function () {
            $scope.cards.active = Array.prototype.slice.call($scope.cards.master, 0);
          });
        };
        $scope.nextDownloadCards = function () {
          $ionicLoading.show({
            template: '<p>Loading...</p>'
          });
          $scope.cards.active = 1;
          $ionicLoading.hide();
        };
        $scope.cardSwipedLeft = function () {
          if ($scope.cards.active.length == 1) {
            $scope.nextDownloadCards();
          }else{
            $scope.timeCreateLead(1);
          }
        };
        $scope.cardSwipedRight = function () {
          if ($scope.cards.active.length == 1) {
            $scope.nextDownloadCards();
          }else{
            $scope.timeCreateLead(1);
          }
        };
        $ionicLoading.hide();
        $scope.refreshCards();
      });
      $scope.toggleContValue = false;
    };
    $rootScope.sellerProfile();
    $scope.toggleFooter = function () {
      $ionicActionSheet.show({
        buttons: [
          {text: '<a class="bar-modal" href="#">Add friend</a>'},
          {text: '<a class="bar-modal" href="#">Cancel</a>'}
        ],
        buttonClicked: function (index) {
          if (index == 0) {
          }
          return true;
        }
      });
    }
//hrefTicket
    $scope.hrefTicket = function (ticket) {
      location.href = '#/tab/ticket';
      console.log(ticket.id);
      $rootScope.ticketId = ticket.id;
    };
  })
//---------------------------------------------------------------------------------------------------------------------------------------------------------------
  .controller('ticket', function ($scope, TDCardDelegate, $timeout, $rootScope, $http) {
    $scope.ticketSudmit = function (ticket) {
      if (!(ticket !== undefined && ticket.titleText !== undefined && ticket.titleText.length > 0 && ticket.description !== undefined && ticket.description.length > 0)) {
        $scope.addTextValid = $scope.addTextdescription = 1;
      } else {
        $scope.addTextValid = $scope.addTextdescription = 0;
        $scope.ticketPut = {
          "createdBy": $rootScope.userAccount.id,
          "leadId": $rootScope.ticketId,
          "title": ticket.titleText,
          "description": ticket.description
        };
        $http.post('http://leadr.jellyworkz.com/api/v1/ticket', $scope.ticketPut)
          .success(function (data) {
            if(data){
              location.href = '#/tab/mine';
            }else{
              alert("Error");
            }
          })
          .error(function (data, status, header, config) {
          });
      }
    }
  })
  //---------------------------------------------------------------------------------------------------------------------------------------------------------------
  .controller('menuInMore', function ($scope, TDCardDelegate, $timeout, $rootScope, $http) {
  })
//---------------------------------------------------------------------------------------------------------------------------------------------------------------
  .controller('loginEmail', function ($scope, $rootScope, $http, $ionicPopup, $ionicLoading) {
    $scope.logInEmail = function (login) {
      console.log(login);
      $http.post('http://leadr.jellyworkz.com/api/v1/auth', login)
        .success(function (data) {
          if (typeof(data) == "object") {
            console.log(data);
            location.href = '#/tab/content1';
            $rootScope.editProfileUser = false;
            $rootScope.userAccount = data;
          } else {
            console.log(data);
            var regPopup = $ionicPopup.alert({
              title: 'Incorrect password entered.',
              template: 'Please try again.'
            });
            alertPopup.then(function (reg) {
              console.log('Please try again.');
            });
          }
        })
        .error(function (data) {
          var regPopup = $ionicPopup.alert({
            title: 'Incorrect password entered.',
            template: 'Please try again.'
          });
          alertPopup.then(function (reg) {
            console.log('Please try again.');
          });
        });
    };
    $scope.regIstrEmail = function (reg) {
      console.log(reg);
      if(reg.email && reg.password && reg.password == reg.password_c){
        $scope.regEmail =
              {
                "email": reg.email,
                "password": reg.password
              };
              $http.post('http://leadr.jellyworkz.com/api/v1/auth', $scope.regEmail)
                .success(function (data) {
                  if (typeof(data) == "object") {
                    var regPopup = $ionicPopup.alert({
                      title: 'Account already exists',
                      template: 'Please try again.'
                    });
                    alertPopup.then(function (reg) {
                      console.log('Please try again.');
                    });
                  } else {
                    console.log(data);
                  }
                })
                .error(function () {
                 $ionicLoading.show();
                  $http({
                    method: 'GET',
                    url: 'http://leadr.jellyworkz.com/api/v1/user-find/' + $rootScope.verificationPhone
                  }).success(function (data) {
                    if (data) {
                      console.log(data);
                      $ionicLoading.hide();
                      $rootScope.userAccount = data;
                      location.href = '#/tab/content1';
                      $rootScope.editProfileUser = false;
                      //$scope.addTokenOldUser =
                      //{
                      //  "verification": {
                      //    "facebook": $rootScope.verificationFacebook
                      //  }
                      //};
                      //$http.put('http://leadr.jellyworkz.com/api/v1/user/'+data.id, $scope.addTokenOldUser)
                      //  .success(function (data) {
                      //    location.href = '#/tab/content1';
                      //    $rootScope.userAccount = data;
                      //    localStorage.setItem('Verification_Phone', $rootScope.verificationPhone);
                      //  })
                      //  .error(function (data, status, header) {
                      //    alert("Dubl accaunt )))")
                      //  });
                    } else {
                      location.href = '#/app/reg1';
                      $ionicLoading.hide();
                      $rootScope.verificationEmail = reg.email;
                      $rootScope.verificationEmailPassword = reg.password;

                      localStorage.setItem('SocialGap_Email_Token', $rootScope.verificationEmail);
                      localStorage.setItem('SocialGap_EmailPassword_Token', $rootScope.verificationEmailPassword);
                      console.log($rootScope.verificationEmail, $rootScope.verificationEmailPassword);
                    }
                  });
                });
      }

    }
  })
//---------------------------------------------------------------------------------------------------------------------------------------------------------------
    .controller('chat', function ($scope, $ionicHistory, $rootScope, $location, $timeout, $ionicScrollDelegate, $firebaseArray) {
       $scope.chatTitleTop = $rootScope.chatLead.title;
          $rootScope.mobileChat = function(){
            var ref = new Firebase('https://queupapp123.firebaseio.com');
                $scope.queue = $firebaseArray(ref.child($rootScope.userAccount.id+"/"+$rootScope.chatLead.id+"/"+$rootScope.chatLead.createdBy.id));
                $scope.queue2 = $firebaseArray(ref.child($rootScope.chatLead.createdBy.id+"/"+$rootScope.chatLead.id+"/"+$rootScope.userAccount.id));

                $scope.person = {
                  avatar: $rootScope.userAccount.avatar,
                  titleLead: $rootScope.chatLead.title || "und",
                  name: $rootScope.userAccount.fullName,
                  createdBy: $rootScope.chatLead.createdBy.fullName || "und",
                  message: '',
                };
                $scope.save = function() {
                  if($scope.person.message){
                    $scope.person.avatar = $rootScope.userAccount.avatar || "img/icon-attention.png";
                    $scope.queue.$add($scope.person);
                    $scope.queue2.$add($scope.person);
                    $scope.person = {};
                  }
                };
                $scope.$watch('person', function() {
                  if($scope.queue.length > 5){
                    $location.hash("anchor_chat_bottom");
                    $ionicScrollDelegate.anchorScroll(true);
                  }
                });
                $scope.$watch('queue', function() {
                 if($scope.queue.length > 5){
                    $location.hash("anchor_chat_bottom");
                    $ionicScrollDelegate.anchorScroll(true);
                  }
                });
          }
         $rootScope.mobileChat();

  //Back-chat
      $scope.myGoBack = function () {
        $ionicHistory.goBack();
      }
    })
 //---------------------------------------------------------------------------------------------------------------------------------------------------------------
 .controller('roomsChat', function ($scope, $ionicHistory, $rootScope, $location, $timeout, $ionicScrollDelegate, $firebaseArray, $http) {

 $rootScope.mobileRoomsChat = function(){
  var ref = new Firebase('https://queupapp123.firebaseio.com');
     $scope.queue = $firebaseArray(ref.child($rootScope.userAccount.id+"/"));
     $scope.rooms = $scope.queue;
     console.log($scope.rooms);
     $scope.goChatRoom = function(id){
       console.log(id);
       $rootScope.roomsChatSec = id;
       location.href = '#/tab/roomsChatSecond';
     }
     //Back-chat
       $scope.myGoBack = function () {
         $ionicHistory.goBack();
       }
     }
     $rootScope.mobileRoomsChat();
  })
//---------------------------------------------------------------------------------------------------------------------------------------------------------------
 .controller('roomsChatSecond', function ($scope, $rootScope,  $firebaseArray, $ionicHistory, $firebaseArray, $state) {
    var ref = new Firebase('https://queupapp123.firebaseio.com');
    $scope.queue2 = $firebaseArray(ref.child($rootScope.userAccount.id+"/"+$rootScope.roomsChatSec));
    console.log($scope.queue2);
    $scope.roomsSecond = $scope.queue2;


 console.log($scope.keys );

    $scope.goChat = function(id){
          console.log(id);
           $rootScope.chatLead = {"createdBy":{"id":id},"id":$rootScope.roomsChatSec, "fullName": "gdfg" };
           $rootScope.userAccount.avatar
          $state.go('app.chat');
          $rootScope.mobileChat();
        }
    //Back-chat
          $scope.myGoBack = function () {
            $ionicHistory.goBack();
          }
 });
