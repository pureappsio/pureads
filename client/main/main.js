// Tracker
Tracker.autorun(function() {
    Meteor.subscribe('userServices');
    Meteor.subscribe('userCampaigns');
    Meteor.subscribe('userBrands');

    Meteor.subscribe('userIntegrations');
});

// Imports
import 'bootstrap';
import '/node_modules/bootstrap/dist/css/bootstrap.min.css';

const Spinner = require('spin');

import 'chart.js';
