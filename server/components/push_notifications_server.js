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
    apn: {
  certData: Assets.getText('fbdev.pem'),
  keyData: Assets.getText('fbkeydev.pem'),
  passphrase: 'hamadoun',
  production: true,
  //gateway: 'gateway.push.apple.com',
}
    production: true,
    badge: true,
    sound: true,
    alert: true,
    vibrate: true,
    sendInterval: 3000,
    sendBatchSize: 1
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
