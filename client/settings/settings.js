Template.settings.events({


    // 'click #add-integration': function() {

    //     var accountData = {
    //         type: $('#integration-type :selected').val(),
    //         key: $('#integration-key').val(),
    //         url: $('#integration-url').val(),
    //         userId: Meteor.user()._id
    //     };
    //     Meteor.call('addIntegration', accountData);

    // },
    'click #import-campaigns': function() {

        Meteor.call('getFacebookCampaignInsights', Meteor.user()._id);

    },
    'click #link-facebook': function() {

        Facebook.requestCredential({ requestPermissions: ['ads_read'] }, function(token) {

            var secret = Package.oauth.OAuth._retrieveCredentialSecret(token);

            Meteor.call("userAddFacebookOauthCredentials", token, secret);
        });
    },
    'click #link-facebook-ad': function() {

        Meteor.call('linkAdsAccount', $('#ads-account').val());
    }
});

Template.settings.helpers({

    facebookAdsAccount: function() {

        return Services.findOne({ type: 'facebookAds', userId: Meteor.user()._id }).adsAccountId;

    },
    integrations: function() {
        return Integrations.find({});
    },

    isFacebookLinked: function() {
        if (Services.findOne({ type: 'facebook' })) {
            return true;
        }
    }
});
