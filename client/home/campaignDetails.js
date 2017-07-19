Template.campaignDetails.events({

    'click #refresh': function() {
        Meteor.call('getFacebookCampaignInsight', this.campaignId, Meteor.user()._id);
    }

})

Template.campaignDetails.onRendered(function() {

    var ctx = document.getElementById("ads-graph");

    var data = {
        labels: this.data.history.dates,
        datasets: [{
            label: "Click Rate",
            fill: false,
            lineTension: 0.1,
            backgroundColor: "orange",
            borderColor: "orange",
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: "orange",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "orange",
            pointHoverBorderColor: "orange",
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: this.data.history.clickRate,
            spanGaps: false,
        },
        {
            label: "Conversion Rate",
            fill: false,
            lineTension: 0.1,
            backgroundColor: "red",
            borderColor: "red",
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: "red",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "red",
            pointHoverBorderColor: "red",
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: this.data.history.conversion,
            spanGaps: false,
        }]
    };

    var myLineChart = new Chart(ctx, {
        type: 'line',
        data: data
    });

});
