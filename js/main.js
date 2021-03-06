angular.module('emp', ['org.apache.cordova.dialogs', 'org.apache.cordova.geolocation']).
  controller('employees', function(notification, $scope, geolocation) {
      var store = new MemoryStore(function() {
        notification.alert('Store initialized.', 'Info', 'Cool');
      });
      
      this.name = '';
      this.employees = [];
      
      
      var self = this;
      geolocation.getCurrentPosition().then(function(pos) {
        self.pos = pos;
      });
      this.search = function() {
        store.findByName(this.name, function(employees) {
          self.employees = employees;
        });
      };
      
      $scope.$on('position', function(pos) {
        console.log('Position', pos);
        self.pos = pos;
      });
  });
angular.bootstrap(angular.element('#app'), ['emp']);