Meteor.methods({

    deleteBrand: function(brandId) {

        Brands.remove(brandId);

    },
    createBrand: function(name) {

        Brands.insert({
            name: name,
            userId: Meteor.user()._id
        })

    },
    setCampaignBrand: function(campaignId, brandId) {

        Campaigns.update(campaignId, { $set: { brandId: brandId } });

    },
    createUserAccount: function(data) {

        console.log(data);

        // Check if exist
        if (Meteor.users.findOne({ "emails.0.address": data.email })) {

            console.log('Updating existing user');
            var userId = Meteor.users.findOne({ "emails.0.address": data.email })._id;

        } else {

            console.log('Creating new user');

            // Create
            var userId = Accounts.createUser({
                email: data.email,
                password: data.password
            });

            // Assign role & teacher ID
            Meteor.users.update(userId, { $set: { role: data.role } });

        }

        return userId;

    }

});
