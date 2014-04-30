var phonegang = {};

phonegang.waitForDevice = function($q, $timeout, $window) {
  var dfr = $q.defer();
  var timer = $timeout(function() {
    if (!$window.cordova) dfr.reject();
  }, 5000);
  document.addEventListener('deviceready', function(){
    $timeout.cancel(timer);
    dfr.resolve();
  }, false);
  return dfr.promise;
};

angular.module('phonegang', []).
  factory('waitForDevice', phonegang.waitForDevice);

phonegang.dialogs = {};

phonegang.dialogs = function(waitForDevice) {
  return waitForDevice.then(function() {
    if (navigator.notification) {
      return navigator.notification;
    } else {
      throw 'Dialogs was not loaded.';
    }
  });
};

phonegang.dialogs.alert = function(dialogs, $window, $q, $rootScope) {
  return function(message, opt_title, opt_buttonText) {
    return dialogs.then(function(d) {
      var dfr = $q.defer();
      d.alert(message, function() {
        dfr.resolve();
        $rootScope.$apply();
      }, opt_title, opt_buttonText);
      return dfr.promise;
    }, function() {
      $window.alert(message);
    });
  };
};
phonegang.dialogs.confirm = function() { };
phonegang.dialogs.prompt = function() { };
phonegang.dialogs.beep = function() { };

angular.module('dialogs', ['phonegang']).
  factory('dialogs', phonegang.dialogs).
  factory('alert', phonegang.dialogs.alert)
  ;