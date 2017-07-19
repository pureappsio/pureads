Meteor.methods({

    deleteUser: function(id) {

        // Delete
        Meteor.users.remove(id);
    },
    addIntegration: function(data) {

        // Insert
        console.log(data);
        Integrations.insert(data);

    },
    removeIntegration: function(data) {

        // Insert
        Integrations.remove(data);

    }

});
