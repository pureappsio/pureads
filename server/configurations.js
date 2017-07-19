Meteor.startup(function () {

  ServiceConfiguration.configurations.remove({
    service: "facebook"
  });

  if (process.env.ROOT_URL == "http://localhost:3000/") {
    ServiceConfiguration.configurations.insert({
      service: "facebook",
      appId: Meteor.settings.facebookLocal.appId,
      secret: Meteor.settings.facebookLocal.secret
    });  
  }
  else {
    ServiceConfiguration.configurations.insert({
      service: "facebook",
      appId: Meteor.settings.facebookOnline.appId,
      secret: Meteor.settings.facebookOnline.secret
    });
  }

});