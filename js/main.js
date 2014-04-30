var app = {

    findByName: function() {
        console.log('findByName');
        this.store.findByName($('.search-key').val(), function(employees) {
            var l = employees.length;
            var e;
            var elist = $('.employee-list').empty();
            for (var i=0; i<l; i++) {
                e = employees[i];
                elist.append('<li><a href="#employees/' + e.id + '">' + e.firstName + ' ' + e.lastName + '</a></li>');
            }
        });
    },
    showAlert: function (message, title) {
        if (navigator.notification) {
            navigator.notification.alert(message, null, title, 'Sweet');
        } else {
            alert(title ? (title + ": " + message) : message);
        }
    },

    initialize: function() {
        var self = this;
        this.store = new MemoryStore(function() {
            self.showAlert('Store initialized.', 'Info');
        });
        $('.search-key').on('keyup', $.proxy(this.findByName, this));
    }

};

app.initialize();