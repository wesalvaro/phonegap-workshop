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

phonegang.notification = {};

phonegang.notification = function(notificationPlugin, $window, $q, $rootScope) {
  return {
      alert: function(message, opt_title, opt_buttonLabel) {
        return notificationPlugin.then(function(d) {
          var dfr = $q.defer();
          d.alert(message, function() {
            dfr.resolve();
            $rootScope.$apply();
          }, opt_title, opt_buttonLabel);
          return dfr.promise;
        }, function() { // dialogs doesn't resolve.
          $window.alert(message);
        });
      },
      confirm: function(message, opt_title, opt_buttonLabels) {
        return notificationPlugin.then(function(d) {
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
      },
      prompt: function(message, opt_title, opt_buttonLabels) {
        return notificationPlugin.then(function(d) {
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
      },
      beep: function(times) {
        notificationPlugin.then(function(d) {
          d.beep(times);
        });
      },
      vibrate: function(ms) {
        notificationPlugin.then(function(d) {
          d.vibrate(ms);
        });
      }
  };
};

phonegang.notification.plugin = function(waitForDevice) {
  return waitForDevice.then(function() {
    if (navigator.notification) {
      return navigator.notification;
    } else {
      throw 'Dialogs was not loaded.';
    }
  });
}


angular.module('org.apache.cordova.dialogs', ['phonegang']).
  factory('notification', phonegang.notification).
  factory('notificationPlugin', phonegang.notification.plugin)
  ;
  
phonegang.geolocation = {};

phonegang.geolocation = function(geolocationPlugin, $q, $rootScope) {
  return {
      getCurrentPosition: function(opt_options) {
        return geolocationPlugin.then(function(g) {
          var dfr = $q.defer();
          g.getCurrentLocation(function(pos) {
            $q.resolve(pos);
            $rootScope.$apply();
          }, function(err) {
            $q.reject(err);
            $rootScope.$apply();
          }, opt_options);
          return dfr.promise;
        });
      }
  };
};

phonegang.geolocation.plugin = function(waitForDevice) {
  return waitForDevice.then(function() {
    if (navigator.geolocation) {
      return navigator.geolocation;
    } else {
      throw 'GeoLocation was not loaded.';
    }
  });
};

phonegang.geolocation.run = function(geolocationPlugin, $rootScope) {
  var options = {};  // configure and inject this
  geolocationPlugin.then(function(g) {
    g.watchPosition(function(pos) {
      $rootScope.$broadcast('position', pos);
    }, function(err) {
      $rootScope.$broadcast('positionError', err);
    }, options);
  });
};

angular.module('org.apache.cordova.geolocation', ['phonegang']).
  factory('geolocationPlugin', phonegang.geolocation.plugin).
  factory('geolocation', phonegang.geolocation).
  run(phonegang.geolocation.run)
  ;