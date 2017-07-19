Template.campaign.helpers({

    brands: function() {

        return Brands.find({});

    },
    noBrand: function() {
        if (this.brandId) {
            return false;
        } else {
            return true;
        }
    },
    statusColor: function() {
        if (this.status == 'PAUSED') {
            return 'danger';
        } else {
            return 'success';
        }
    },
    clickRate: function() {
        if (this.clickRate) {
            return this.clickRate.toFixed(2) + '%';
        } else {
            return "0%";
        }
    },
    conversion: function() {
        if (this.conversion) {
            return this.conversion.toFixed(2) + '%';
        } else {
            return "0%";
        }
    },
    actionCost: function() {
        if (this.actionCost) {
            if (this.actionCost != 'N/A') {
                return '$' + this.actionCost.toFixed(2);
            } else {
                return "N/A";
            }
        } else {
            return "N/A";
        }
    }

});

Template.campaign.events({

    'change .brand-select': function() {

        if ($('#brand-' + this._id).val() != 'null') {
            Meteor.call('setCampaignBrand', this._id, $('#brand-' + this._id).val());
        }

    }

});

Template.campaign.onRendered(function() {

    if (this.data) {

        if (this.data.brandId) {
            $('#brand-' + this.data._id).val(this.data.brandId);
        }

    }

});
