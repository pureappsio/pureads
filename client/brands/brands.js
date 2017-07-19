Template.brands.events({

    'click #add-brand': function() {

        Meteor.call('createBrand', $('#brand-name').val());

    }

});

Template.brands.helpers({

    brands: function() {
        return Brands.find({});
    }

});
