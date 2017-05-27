import { Meteor } from 'meteor/meteor';

Meteor.startup(function () {
  Push.Configure({
    gcm: {
      apiKey: 'AIzaSyDiCqlOao_Wf1cTGb1jqNCNNVXgGcio0V0',
      senderID: '388901352874'
    },
    apn: {
  certData: Assets.getText('dev.pem'),
  keyData: Assets.getText('devkey.pem'),
  passphrase: 'hamadoun',
  production: false,
  gateway: 'gateway.push.apple.com',
},
    production: false,
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

    Push.send({
      from: 'FleaBrocante',
      title: 'FleaBrocante',
      text: 'Vous avez un nouveau message.',
      badge: 1,
      query: {
        userId: user
      }
    });
  }
});
