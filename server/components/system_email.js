import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

Accounts.emailTemplates.siteName = "FleaBrocante";
Accounts.emailTemplates.from = "Email <info@fleabrocante.com>";

//System email templates for Verify Account and Reset Password.

Accounts.emailTemplates.verifyEmail.subject = function (user) {
    return "Verifier votre compte.";
};

Accounts.emailTemplates.verifyEmail.text = function (user, url) {
   return "Bonjour " + user.username + ",\n\n\n"
      + "Merci pour votre inscription. Cliquez sur le lien ci-dessous pour confirmer votre compte.\n\n"
      + url
      + "\n\n\n\n\n\n"
      + "L'Equipe FleaBrocante";
};

Accounts.emailTemplates.resetPassword.subject = function (user) {
    return "Mot de passe oublié.";
};

Accounts.emailTemplates.resetPassword.text = function (user, url) {
   return "Bonjour " + user.username + ",\n\n\n"
      + "Cliquez sur le lien ci-dessous pour renitialiser votre mot de passe.\n\n"
      + url
      + "\n\n\n\n\n\n"
      + "L'Equipe FleaBrocante";
};

Accounts.urls.verifyEmail = (token) => {
  return Meteor.absoluteUrl('#/app/shop/verify/' + token);
};

Accounts.urls.resetPassword = (token) => {
  return Meteor.absoluteUrl('#/app/reset/' + token);
};
