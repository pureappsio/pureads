Meteor.startup(function() {

    // Allow delete users
    Meteor.users.allow({
        remove: function() {
            return true;
        }
    });
    
});
