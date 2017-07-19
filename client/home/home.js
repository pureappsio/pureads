Template.home.helpers({

    campaigns: function() {

        return Campaigns.find({ brandId: { $exists: false } });

    },
    brandCampaigns: function() {

        return Brands.find({});

    }

});

Template.home.events({

    'click #refresh': function() {
        Meteor.call('updateFacebookCampaigns', Meteor.user()._id);
    }

})
