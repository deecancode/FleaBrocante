import { _meteorAngular } from 'meteor/angular';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base'

angular
    .module('salephone')
    .controller('AuthCtrl', AuthCtrl);

 function AuthCtrl ($scope, $reactive, $state, $ionicLoading, $ionicHistory, $rootScope, $cordovaToast) {
    $reactive(this).attach($scope);
    var self = this;

    //Method is located at tapshop/server/methods/profile_server.js
    Meteor.call('hasPassword', function(err, result){
      if ( err || result === false ){
        $ionicHistory.goBack();
      }
    });

    //Change password through token sent in email.
    this.changePass = function() {
        $rootScope.$broadcast('loadspinner');

        let passwordRegex = new RegExp(/^\S{6,}$/);

        if ( 
          self.oldPassword && 
          self.oldPassword !== self.password &&
          self.password && 
          passwordRegex.test(self.password) === true && 
          self.password === self.confirm 
        ) {
          Accounts.changePassword(self.oldPassword, self.password, function(err){
            if(err){
              $ionicLoading.hide();
              if ( err.error === 403 ){
                if (Meteor.isCordova) {
                  $cordovaToast.showLongBottom('Mot de passe incorrect');
                } else {
                  toastr.error('Mot de passe incorrect');
                }
                return;
              }
              else {
                if (Meteor.isCordova) {
                  $cordovaToast.showLongBottom('Erreur. Veuillez réessayez.');
                } else {
                  toastr.error('Erreur. Veuillez réessayez.');
                }
                return;
              }
            }
            else{
              self.oldPassword = '';
              self.password = '';
              self.confirm = '';
              if (Meteor.isCordova) {
                $cordovaToast.showShortBottom('Mot de passe change');
              } else {
                toastr.success('Mot de passe change');
              }
              Meteor.logoutOtherClients();
              $ionicLoading.hide();
              $ionicHistory.goBack();
            }
          })
        }
        else {
          $ionicLoading.hide();
          if( !self.oldPassword ){
            if (Meteor.isCordova) {
              $cordovaToast.showLongBottom('Veuillez taper votre mot de passe actuel');
            } else {
              toastr.error('Veuillez taper votre mot de passe actuel');
            }
            return;
          }
          else if( self.oldPassword === self.password ){
            if (Meteor.isCordova) {
              $cordovaToast.showLongBottom('Mots de passe non identiques');
            } else {
              toastr.error('Mots de passe non identiques');
            }
            return;
          }
          else if ( !self.password || passwordRegex.test(self.password) === false ){
            if (Meteor.isCordova) {
              $cordovaToast.showLongBottom('Mot de passe doit contenir au moins 6 characteres');
            } else {
              toastr.error('Mot de passe doit contenir au moins 6 characteres');
            }
            return;
          }
          else if (self.password !== self.confirm){
            if (Meteor.isCordova) {
              $cordovaToast.showLongBottom('Mots de passe non identiques');
            } else {
              toastr.error('Mots de passe non identiques');
            }
            return;
          }
          return;
        }
    }

    $scope.$on('$ionicView.afterEnter', function () {
        $ionicLoading.hide();
    });
 };
