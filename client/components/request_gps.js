import { Meteor } from 'meteor/meteor';

Meteor.startup(function () {
  if ( Meteor.isCordova ){
    cordova.plugins.locationAccuracy.canRequest(function(canRequest){
        if( canRequest ) {
          cordova.plugins.locationAccuracy.request(
            function (success){
              return;
            },
            function (error){
              if( error.code === cordova.plugins.locationAccuracy.ERROR_INVALID_ACCURACY ){

                cordova.plugins.locationAccuracy.request(
                  function(success){
                    return;
                  },
                  function(error){
                    if( error.code === cordova.plugins.locationAccuracy.ERROR_INVALID_ACCURACY ) {

                      cordova.plugins.locationAccuracy.request(
                        function(success){
                          return;
                        },
                        function(error){
                          $cordovaToast.showLongBottom('Veuillez activer votre GPS pour continuer.');
                          return;
                        },
                        cordova.plugins.locationAccuracy.REQUEST_PRIORITY_LOW_POWER
                      );
                    }
                    else {
                      $cordovaToast.showLongBottom('Veuillez activer votre GPS pour continuer.');
                    }
                  },
                  cordova.plugins.locationAccuracy.REQUEST_PRIORITY_BALANCED_POWER_ACCURACY
                )
              }
              else {
                $cordovaToast.showLongBottom('Veuillez activer votre GPS pour continuer.');
              }
            },
            cordova.plugins.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY
          );
        }
    });
  }
});
