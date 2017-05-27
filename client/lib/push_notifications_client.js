import { Meteor } from 'meteor/meteor';

Meteor.startup(function () {

  Push.Configure({
    android: {
      senderID: 388901352874,
      iconColor: '#0C431B',
      icon: 'pushicon',
      badge: true,
      sound: true,
      alert: true,
      vibrate: true,
    }
  });
});
