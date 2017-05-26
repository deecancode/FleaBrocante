import { _meteorAngular } from 'meteor/angular';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

angular
    .module('salephone')
    .controller('ForgotPwdCtrl', ForgotPwdCtrl);

 function ForgotPwdCtrl ($scope, $reactive, $state, $ionicLoading, $stateParams, $rootScope, $ionicHistory) {
    $reactive(this).attach($scope);
    var self = this;

    if( $state.is('app.forgot') ){
      //Send password to email.
      this.resetPass = function() {
        let regex = new RegExp(/.+@(.+){2,}\.(.+){2,}/);

        if ( regex.test(self.email) === true ) {
          $rootScope.$broadcast('loadspinner');

          //Method is located at tapshop/server/methods/profile_server.js
          Meteor.call('resetPwd', self.email, function(err){
            if (!err){
              if (Meteor.isCordova) {
                $cordovaToast.showShortBottom('Email envoyé');
              } else {
                toastr.success('Email envoyé');
              }
              $ionicLoading.hide();
            }
            else if (err.error === 'Pas inscrit') {
              if (Meteor.isCordova) {
                $cordovaToast.showLongBottom('Email non inscrite.');
              } else {
                toastr.error('Email non inscrite.');
              }
              $ionicLoading.hide();
            }
            else {
              if (Meteor.isCordova) {
                $cordovaToast.showLongBottom('Erreur. Veuillez reessayer.');
              } else {
                toastr.error('Erreur. Veuillez reessayer.');
              }
              $ionicLoading.hide();
            }
          });
        }
        else if ( regex.test(self.email) === false ) {
          if (Meteor.isCordova) {
            $cordovaToast.showLongBottom('Address email invalide');
          } else {
            toastr.error('Addresse email invalide');
          }
        } else { return; }
      }
    }
    else if( $state.is('app.reset') && $stateParams.token ) {
      //Change password through token sent in email.
      this.changePass = function() {
        if( self.password.length >= 6 ) {
          $rootScope.$broadcast('loadspinner');
          if ( self.password === self.confirm ) {
            Accounts.resetPassword($stateParams.token, self.password, function(err){
              if(!err) {
                if (Meteor.isCordova) {
                  $cordovaToast.showShortBottom('Mot de passe changé');
                } else {
                  toastr.success('Mot de pass changé');
                }
                $state.go('app.shop');
                }
              else {
                if(err.error === 403) {
                  if (Meteor.isCordova) {
                    $cordovaToast.showLongBottom('Le lien de renitialization a expiré');
                  } else {
                    toastr.error('Le lien de renitialization a expiré');
                  }
                }
                else {
                  if (Meteor.isCordova) {
                    $cordovaToast.showLongBottom('Erreur. Veuillez reessayer.');
                  } else {
                    toastr.error('Erreur. Veuillez reessayer.');
                  }
                }
                $ionicLoading.hide();
              }
            });
          }
          else {
            if (Meteor.isCordova) {
              $cordovaToast.showLongBottom('Les mots de passe ne sont pas identiques');
            } else {
              toastr.error('Les mots de passe ne sont pas indentiques');
            }
            $ionicLoading.hide();
          }
        } else if ( self.password.length < 6 ) {
          if (Meteor.isCordova) {
            $cordovaToast.showLongBottom('Le mot de passe doit contenir au moins 6 characteres.');
          } else {
            toastr.error('Le mot de passe doit contenir au moins 6 characteres');
          }
        }
        else { return; }
      }
    }
    else {
      $state.go('app.login')
    }

    $scope.$on('$ionicView.afterEnter', function () {
        $ionicLoading.hide();
    });
 };
