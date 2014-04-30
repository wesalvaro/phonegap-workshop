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

phonegang.run = function($rootScope) {
  var events = [
      'pause', 'resume', 'online', 'offline', 'backbutton',
      'batterycritical', 'batterylow', 'batterystatus', 'menubutton',
      'searchbutton', 'startcallbutton', 'endcallbutton',
      'volumedownbutton', 'volumeupbutton'];
  angular.forEach(events, function(eventName) {
    document.addEventListener(eventName, function() {
      $rootScope.$broadcast(eventName);
    }, false);
  });
};

angular.module('phonegang', []).
  factory('waitForDevice', phonegang.waitForDevice).
  run(phonegang.run);

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
  return function(message, opt_title, opt_buttonLabel) {
    return dialogs.then(function(d) {
      var dfr = $q.defer();
      d.alert(message, function() {
        dfr.resolve();
        $rootScope.$apply();
      }, opt_title, opt_buttonLabel);
      return dfr.promise;
    }, function() { // dialogs doesn't resolve.
      $window.alert(message);
    });
  };
};
phonegang.dialogs.confirm = function(dialogs, $window, $q, $rootScope) {
  return function(message, opt_title, opt_buttonLabels) {
    return dialogs.then(function(d) {
      var dfr = $q.defer();
      d.confirm(message, function(buttonIndex) {
        dfr.resolve(buttonIndex);
        $rootScope.$apply();
      }, opt_title, opt_buttonLabels);
      return dfr.promise;
    }, function() { // dialogs doesn't resolve.
      var yes = $window.confirm(message);
      return $q.when(yes ? 1 : 0)
    });
  };
};
phonegang.dialogs.prompt = function(dialogs, $window, $q, $rootScope) {
  return function(message, opt_title, opt_buttonLabels) {
    return dialogs.then(function(d) {
      var dfr = $q.defer();
      d.prompt(message, function(results) {
        dfr.resolve(results);
        $rootScope.$apply();
      }, opt_title, opt_buttonLabels);
      return dfr.promise;
    }, function() { // dialogs doesn't resolve.
      var input = $window.confirm(message);
      return $q.when({buttonIndex: 1, input1: input});
    });
  };
};
phonegang.dialogs.beep = function(dialogs) {
  return function(times) {
    dialogs.then(function(d) {
      d.beep(times);
    });
  };
};
phonegang.dialogs.vibrate = function(dialogs) {
  return function(ms) {
    dialogs.then(function(d) {
      d.vibrate(ms);
    });
  };
};

angular.module('dialogs', ['phonegang']).
  factory('dialogs', phonegang.dialogs).
  factory('alert', phonegang.dialogs.alert).
  factory('confirm', phonegang.dialogs.confirm).
  factory('prompt', phonegang.dialogs.prompt).
  factory('beep', phonegang.dialogs.beep).
  factory('vibrate', phonegang.dialogs.vibrate).
  ;