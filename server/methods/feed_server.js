import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

Meteor.methods({
  //Generate activity feed for user.
  'insertFeed': function(action, recUser, listing, linkid) {
    check(this.userId, String);
    check(action, String);
    check(recUser, String);
    check(listing, Match.OneOf(String, null) );
    check(linkid, Match.OneOf(String, null) );
    let username = Meteor.users.findOne({ _id: this.userId }).username;

    switch (action) {
      case 'newOffer':
        var type = 'mypost';
        var feedmsg = "<b>" + username + "</b>" + " vous a envoyé une offre pour: " + "<b>" + listing + "." + "</b>";
        break;

        case 'changeOffer':
          var type = 'mypost';
          var feedmsg = "<b>" + username + "</b>" + " a changé le montant de son offre pour: " + "<b>" + listing + "." + "</b>";
          break;

        case 'removeBuyer':
          var type = null;
          var feedmsg = "<b>" + username + "</b>" + " refusé votre offre pour: " + "<b>" + listing + "." + "</b>";
          break;

        case 'postFeedback':
          var type = 'profile';
          var feedmsg = "<b>" + username + "</b>" + " vous a noté."
          break;

        case 'changePrice':
          var type = 'listing';
          var feedmsg = "<b>" + username + "</b>" + " a changé le prix de " + "<b>" + listing + "." + "</b>";
          break;

        case 'updatePost':
          var type = 'listing';
          var feedmsg = "<b>" + username + "</b>" + " a mis a jour les de details de " + "<b>" + listing + "." + "</b>";
          break;

        case 'soldProduct':
          var type = null;
          var feedmsg = "<b>" + username + "</b>" + " a deja vendu: " + "<b>" + listing + "." + "</b>";
          break;

        case 'removePost':
          var type = null;
          var feedmsg = "<b>" + username + "</b>" + " a supprimé le produit " + "<b>" + listing + "." + "</b>";
          break;
        }
        Feeds.insert({
          userID: recUser,
          postDate: new Date(),
          linkID: linkid,
          linkType: type,
          body: feedmsg,
          read: false,
        });
      }
});
