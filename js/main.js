angular.module('emp', ['dialogs']).
  controller('employees', function(notification) {
      var store = new MemoryStore(function() {
        notification.alert('Store initialized.', 'Info', 'Cool');
      });
      
      this.name = '';
      this.employees = [];
      
      this.search = function() {
        var self = this;
        store.findByName(this.name, function(employees) {
          self.employees = employees;
        });
      };
  });
angular.bootstrap(angular.element('#app'), ['emp']);