import FacebookAPI from 'fbgraph';
Future = Npm.require('fibers/future');
FacebookAPI.setVersion("2.8");

Meteor.methods({

    updateFacebookCampaigns: function(userId) {

        // Meteor.call('getFacebookCampaigns', userId);
        Meteor.call('getFacebookCampaignInsights', userId);

    },
    getFacebookCampaignInsight: function(campaignId, userId) {

        // Find token
        var token = Services.findOne({ type: 'facebook' }).accessToken;

        // Set token
        FacebookAPI.setAccessToken(token);

        // Set version
        FacebookAPI.setVersion("2.8");

        // Get insights
        var myFuture = new Future();
        FacebookAPI.get(campaignId + "/insights?limit=50&time_increment=1&date_preset=last_30d&fields=objective,actions,impressions,clicks,account_id,campaign_id,spend", function(err, res) {

            if (err) {
                console.log('Campaigns error: ');
                console.log(err);
                myFuture.return({});
            } else {
                // console.log(res);
                myFuture.return(res.data);
            }

        });

        var campaignData = myFuture.wait();
        // console.log(campaignData);

        var history = {}
        var dates = [];
        var clicks = [];
        var impressions = [];
        var clickRate = [];
        var conversion = [];
        var actions = [];

        for (i in campaignData) {

            // Main data
            dates.push(campaignData[i].date_start);
            clicks.push(parseInt(campaignData[i].clicks));
            impressions.push(parseInt(campaignData[i].impressions));
            clickRate.push(parseInt(campaignData[i].clicks) / parseInt(campaignData[i].impressions) * 100);

            // Actions
            action_found = false;
            if (campaignData[i].objective == 'LINK_CLICKS') {

                for (a in campaignData[i].actions) {
                    if (campaignData[i].actions[a].action_type == 'onsite_conversion.messaging_first_reply') {
                        actions.push(parseInt(campaignData[i].actions[a].value));
                        action_found = true;
                    }
                }

            }

            if (campaignData[i].objective == 'CONVERSIONS') {

                for (a in campaignData[i].actions) {
                    if (campaignData[i].actions[a].action_type == 'offsite_conversion') {
                        actions.push(parseInt(campaignData[i].actions[a].value));
                        action_found = true;
                    }
                }

            }
            if (!action_found) {
                actions.push(0);
            }
            if (parseInt(campaignData[i].clicks) != 0) {
                conversion.push(actions[i] / parseInt(campaignData[i].impressions) * 100);
            } else {
                conversion.push(0);
            }

        }

        history.dates = dates;
        history.clicks = clicks;
        history.impressions = impressions;

        history.clickRate = clickRate;

        history.actions = actions;
        history.conversion = conversion;

        Campaigns.update({ campaignId: campaignId }, { $set: { history: history } });

        console.log(Campaigns.findOne({ campaignId: campaignId }));
    },
    getFacebookCampaignInsights: function(userId) {

        // Get campaigns
        var campaigns = Campaigns.find({ userId: userId }).fetch();

        // Find token
        var token = Services.findOne({ type: 'facebook' }).accessToken;

        // Set token
        FacebookAPI.setAccessToken(token);

        // Set version
        FacebookAPI.setVersion("2.8");

        var batchRequest = [];

        for (i = 0; i < campaigns.length; i++) {

            batchRequest.push({
                method: "GET",
                relative_url: campaigns[i].campaignId + "/insights?date_preset=last_30d&fields=objective,actions,impressions,clicks,account_id,campaign_id,spend"
            });

        }

        var myFuture = new Future();

        FacebookAPI.batch(batchRequest, function(err, res) {
            if (err) {
                console.log(err);
                myFuture.return([]);
            } else {

                myFuture.return(res);
            }

        });

        var batchResult = myFuture.wait();
        var results = [];

        for (k = 0; k < batchResult.length; k++) {

            results.push(JSON.parse(batchResult[k].body));

        }

        // for (i in results) {
        //     if (results[i].data.length > 0) {
        //         console.log(results[i]);
        //         console.log(results[i].data[0].actions);
        //     }
        // }

        console.log(results[0]);

        for (i = 0; i < campaigns.length; i++) {

            if (results[i].data.length > 0) {

                // Click rate
                var clickRate = parseInt(results[i].data[0].clicks) / parseInt(results[i].data[0].impressions) * 100;

                // Find action type
                var data = results[i].data[0];
                var actions = 0;

                if (data.objective == 'LINK_CLICKS') {

                    for (a in data.actions) {
                        if (data.actions[a].action_type == 'onsite_conversion.messaging_first_reply') {
                            actions = data.actions[a].value;
                        }
                    }

                }

                if (data.objective == 'CONVERSIONS') {

                    for (a in data.actions) {
                        if (data.actions[a].action_type == 'offsite_conversion') {
                            actions = data.actions[a].value;
                        }
                    }

                }

                var conversion = actions / parseInt(results[i].data[0].impressions) * 100;

                if (actions != 0) {
                    var actionCost = parseFloat(results[i].data[0].spend) / actions;
                } else {
                    var actionCost = 'N/A';
                }

                Campaigns.update(campaigns[i]._id, {
                    $set: {
                        impressions: parseInt(results[i].data[0].impressions),
                        clicks: parseInt(results[i].data[0].clicks),
                        spend: parseFloat(results[i].data[0].spend),
                        clickRate: clickRate,
                        conversion: conversion,
                        actions: actions,
                        actionCost: actionCost
                    }
                });

            }
        }

    },

    getFacebookCampaigns: function(userId) {

        // Find token
        var token = Services.findOne({ type: 'facebook' }).accessToken;

        // Set token
        FacebookAPI.setAccessToken(token);

        // Set version
        FacebookAPI.setVersion("2.8");

        // Parameters
        var parameters = { fields: "name" }

        // Get Ads ID
        var facebookAdsId = Services.findOne({ type: 'facebookAds' }).adsAccountId;

        // Get insights
        var myFuture = new Future();
        FacebookAPI.get('act_' + facebookAdsId + '/campaigns', function(err, res) {

            if (err) {
                console.log('Campaigns error: ');
                console.log(err);
                myFuture.return([]);
            } else {
                // console.log(res);
                myFuture.return(res.data);
            }

        });

        var campaignIds = myFuture.wait();

        var campaigns = [];

        var batchRequest = [];

        for (i = 0; i < campaignIds.length; i++) {

            batchRequest.push({
                method: "GET",
                relative_url: campaignIds[i].id + '?fields=objective,name,effective_status'
            });

        }

        var myFuture = new Future();

        FacebookAPI.batch(batchRequest, function(err, res) {
            if (err) {
                console.log(err);
                myFuture.return([]);
            } else {

                myFuture.return(res);
            }

        });

        var batchResult = myFuture.wait();

        for (k = 0; k < batchResult.length; k++) {

            campaigns.push(JSON.parse(batchResult[k].body));

        }

        // console.log(campaigns);

        for (i in campaigns) {

            // Check if exists
            if (Campaigns.findOne({ campaignId: campaigns[i].id })) {

                // Update
                Campaigns.update({
                    campaignId: campaigns[i].id
                }, {
                    $set: {
                        objective: campaigns[i].objective,
                        name: campaigns[i].name,
                        status: campaigns[i].effective_status
                    }
                });

            } else {

                // Insert new
                var campaign = {
                    objective: campaigns[i].objective,
                    name: campaigns[i].name,
                    campaignId: campaigns[i].id,
                    userId: userId,
                    status: campaigns[i].effective_status
                }
                console.log(campaign);

                Campaigns.insert(campaign);

            }

        }

    },
    linkAdsAccount: function(adsAccount) {

        console.log(adsAccount);

        // Check if exists
        if (Services.findOne({ type: 'facebookAds', userId: Meteor.user()._id })) {

            console.log('Already existing Facebook data');

        } else {

            service = {
                type: 'facebookAds',
                userId: Meteor.user()._id,
                adsAccountId: adsAccount
            }

            Services.insert(service);
        }

    },
    userAddFacebookOauthCredentials: function(token, secret) {

        var service = Facebook.retrieveCredential(token, secret).serviceData;
        service.userId = Meteor.user()._id;
        service.type = 'facebook';

        console.log('Facebook account data: ');
        console.log(service);

        // Check if exists
        if (Services.findOne({ type: 'facebook', userId: Meteor.user()._id })) {

            console.log('Already existing Facebook data');
            Services.update({ type: 'facebook', userId: Meteor.user()._id }, { $set: { accessToken: service.accessToken } })

        } else {
            Services.insert(service);
        }

    }

});
