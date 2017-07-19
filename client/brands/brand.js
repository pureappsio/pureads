Template.brands.events({

    'click .delete': function() {

        Meteor.call('deleteBrand', this._id);

    }

});