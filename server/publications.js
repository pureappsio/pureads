Meteor.publish("userCampaigns", function() {
    return Campaigns.find({});
});

Meteor.publish("userBrands", function() {
    return Brands.find({});
});

Meteor.publish("userServices", function() {
    return Services.find({});
});

Meteor.publish("allUsers", function() {
    return Meteor.users.find({});
});