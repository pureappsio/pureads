Template.brandCampaign.helpers({

    campaigns: function() {

        return Campaigns.find({ brandId: this._id }, {sort: {conversion: -1}});

    }

});
