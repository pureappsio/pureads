Router.configure({
    layoutTemplate: 'layout'
});

// Main route
Router.route('/', function() {

    if (!Meteor.userId()) {

        this.render('login');

    } else {

        this.render('home');

    }

});

Router.route('/login', {
    name: 'login'
});

Router.route('/brands', {
    name: 'brands'
});

Router.route('/signup', {
    name: 'signup'
});

Router.route('/settings', {
    name: 'settings'
});


Router.route('/admin', {
    name: 'admin'
});

Router.route('/campaigns/:_id', {
    name: 'campaignDetails',
    data: function() {
        return Campaigns.findOne(this.params._id);
    }
});
