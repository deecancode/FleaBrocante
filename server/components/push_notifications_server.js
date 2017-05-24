import { Meteor } from 'meteor/meteor';

Meteor.startup(function () {

  if( !Meteor.settings.fcm.serverKey || !Meteor.settings.public.fcm.senderId ){
    return;
  }

  Push.Configure({
    gcm: {
      apiKey: Meteor.settings.fcm.serverKey,
      senderID: Meteor.settings.public.fcm.senderId
    },
  });
});

Meteor.methods({
  'sendNotification': function(user) {
    check(user, String);

    if( !Meteor.settings.fcm.serverKey || !Meteor.settings.public.fcm.senderId ){
		  if( Meteor.isDevelopment ){
        console.log('Push Notifications are not enabled. Please enter your API keys for Google FCM.')
      }
      return;
    }

    Push.send({
      from: 'FleaBrocante',
      title: 'FleaBrocante',
      text: 'Vous avez un nouveau message',
      badge: 1,
      query: {
        userId: user
      }
    });
  }
});
