import { _meteorAngular } from 'meteor/angular';
import { Meteor } from 'meteor/meteor';

angular
    .module('salephone')
    .controller('EditCtrl', EditCtrl);

function EditCtrl (
    $scope,
    $stateParams,
    $reactive,
    $cordovaToast,
    $ionicModal,
    $state,
    $rootScope,
    $ionicLoading,
    $ionicPopup,
    $timeout,
    $cordovaDevice,
    $cordovaFile,
    geolocation
  ) {
  $reactive(this).attach($scope);
  var self = this;

  //Array variables for image upload and preview function.
  self.preview = [];
  self.uploads = [];
  self.removeUploaded = [];
  self.imgSelect = [];
  $scope.newImg = '';
  self.uploadOption = null;

  self.isApp = Meteor.isCordova;

  this.subscribe('productSeller', () => [ $stateParams.listingId ], {
    onReady: function() {
      self.subscribe('product', () => [ self.getReactively('post.productID') ], {
        onReady: function() {
          return;
        }
      });
      $ionicLoading.hide();
    }
  });

  this.helpers({
    post: () => Listings.findOne({ _id: $stateParams.listingId }),
    product: () => Products.findOne({ _id: self.getReactively('post.productID') }),
    profile: () => Profile.findOne({ profID: Meteor.userId() })
  });

  this.autorun( () => {
    self.sellerLocation = self.getReactively('profile.location.city') || self.getReactively('profile.location.region');

    //Get listing data to be editted, and detect changes.
    if( self.getCollectionReactively('post') ) {
      self.postNotes = self.post.listingNotes.replace(/<br\s*[\/]?>/g, "\n");
      self.price = self.post.sellPrice.toString();

      if ( self.post.condition !== 'New') {
        self.condition = 'Seconde Main';
      }
      else {
        self.condition = 'Neuf';
      }
      if ( self.post.images.length !== 0 && self.preview.length === 0 && self.uploads.length === 0  && self.removeUploaded.length === 0 ) {
        for (let i = 0; i < self.post.images.length; i++) {
          self.preview.push({
            id: self.post.images[i],
            url: null
          });
          self.uploads.push({
            file: self.post.images[i],
            uploaded: true
          });
        }
      }
    }
  });

  this.getLocation = function() {
    $rootScope.$broadcast('loadspinner');

    let timeout = setTimeout( function(){ 
      $ionicLoading.hide();
      if (Meteor.isCordova) {
        $cordovaToast.showLongBottom('Erreur. Veuillez r??essayez.');
      } 
      else {
        toastr.error('Erreur. Veuillez r??essayez.');
      }
    }, 15000);       

    geolocation.getCurrentPosition()
      .then( function(coords){
        clearTimeout(timeout);
        Session.set('myCoordinates', coords);

        Meteor.call('getLocation', coords, function(err, location) {
          if (!err) {
            //Method is located at tapshop/lib/methods/profile.js
            Meteor.call('updateLocation', location, coords, function(err){
              if(!err){
                if (Meteor.isCordova) {
                  $cordovaToast.showShortBottom('Location mise ?? jour');
                } 
                else {
                  toastr.success('Location mise ?? jour');
                }
                $ionicLoading.hide();
                return;
              }
              else {
                if (Meteor.isCordova) {
                  $cordovaToast.showLongBottom('Erreur. Veuillez r??essayez.');
                } 
                else {
                  toastr.error('Erreur. Veuillez r??essayez.');
                }
                $ionicLoading.hide();
              }
            });
          }
          else {
            if (Meteor.isCordova) {
              $cordovaToast.showLongBottom('Erreur. Veuillez r??essayez.');
            } 
            else {
              toastr.error('Erreur. Veuillez r??essayez.');
            }
            $ionicLoading.hide();
          }
        });        
        return;
      },
      function(error){
        clearTimeout(timeout);
        console.log(error.message);
        
        if (Meteor.isCordova) {
          $cordovaToast.showLongBottom('Erreur. Activez le GPS.');
        } 
        else {
          toastr.error('Erreur. Activez le GPS.');
        }
        return;
      });
  }

  if (Meteor.isCordova) {
    //If its a mobile app, ask if image is from camera or files.
    this.setOptions = function() {
      var optionsPopup = $ionicPopup.confirm({
        title: 'Ajouter des photos:',
        scope: $scope,
        buttons: [{
          text: '<i class="fa fa-folder-o"></i> Files',
          type: 'button-stable',
          onTap: function() {
            self.uploadOption = 'Files';
            if ( self.isAndroid4 === true ){
              return self.addFile();
            } else {
              $timeout( function(){
                angular.element(document.querySelector('#addImg')).click();
                return;
              }, 680);
            }
          }
        },{
          text: '<i class="fa fa-camera"></i> Camera',
          type: 'button-stable',
          onTap: function() {
            self.uploadOption = 'Camera';
            return self.addCamera();
          }
        }]
      });
    };

    //Upload image from camera or files.
    this.addCamera = function() {
      if (self.uploads.length < 4 ) {
        MeteorCameraUI.getPictureNoUI({ quality: 100 }, function(error, data){
          if (data) {
            $scope.newImg = data;
            //Load image cropper.
            $scope.imgCrop.show();
            angular.element(document.querySelector('#newUpload')).on('load', function() {
              $('#newUpload').cropper({
                aspectRatio: 1/1,
                dragMode: 'move',
                rotatable: true,
                movable: true,
                responsive: false,
                toggleDragModeOnDblclick: false,
                minContainerHeight: 500,
                minCropBoxWidth: 50,
                minCropBoxHeight: 50,
                built: function(e) {
                  $scope.croppedImg = $(this).cropper('getCroppedCanvas', { width: 500, height: 500 }).toDataURL("image/jpeg", 1.0);
                },
                cropend: function(e) {
                  $scope.croppedImg = $(this).cropper('getCroppedCanvas', { width: 500, height: 500 }).toDataURL("image/jpeg", 1.0);
                }
              })
            });
          }
        });
      }
      else {
        $cordovaToast.showShortBottom('Limite maximale atteinte.');
      }
    };
    if ( $cordovaDevice.getPlatform() === "Android" /* && $cordovaDevice.getVersion().indexOf("4.4") === 0 */ ) {
      self.isAndroid4 = true;

      window.imagePicker.hasReadPermission( function(result) {
        if( result === false ){
          window.imagePicker.requestReadPermission();
        }
        else {
          return;
        }
      });

      //Upload image from file.
      this.addFile = function() {
        if (self.uploads.length < 4 ) {
          let options = {
            maximumImagesCount: 1,
            width: 1000,
            height: 1000,
            quality: 70
          };
          window.imagePicker.getPictures( function(files) {
              if ( files[0] ) {
                let file = files[0].substring( files[0].indexOf("cache/") + 6 )
                $cordovaFile.readAsDataURL(cordova.file.cacheDirectory, file)
                  .then( function(result){
                    $scope.newImg = result;
                    $scope.imgCrop.show();
                    angular.element(document.querySelector('#newUpload')).on('load', function() {
                      $('#newUpload').cropper({
                        aspectRatio: 1/1,
                        dragMode: 'move',
                        rotatable: true,
                        movable: true,
                        responsive: false,
                        toggleDragModeOnDblclick: false,
                        minContainerHeight: 500,
                        minCropBoxWidth: 50,
                        minCropBoxHeight: 50,
                        built: function(e) {
                          $scope.croppedImg = $(this).cropper('getCroppedCanvas', { width: 500, height: 500 }).toDataURL("image/jpeg", 1.0);
                        },
                        cropend: function(e) {
                          $scope.croppedImg = $(this).cropper('getCroppedCanvas', { width: 500, height: 500 }).toDataURL("image/jpeg", 1.0);
                        }
                      })
                    });
                  },
                  function(error){
                    $scope.newImg = '';
                  });
              }
              else {
                $scope.newImg = '';
              }
            },
            function (error) {
              $scope.newImg = '';
            },
            options
          );
        }
        else {
          $cordovaToast.showShortBottom('Limite maximale atteinte.');
        }
      }
    } else {
      self.isAndroid4 = false;
    }
  };

  this.addImg = function(files) {
    if (self.uploads.length < 4 ) {
      if (files[0]) {
        $scope.imgCrop.show();
        $scope.newImg = window.URL.createObjectURL(files[0]);
        angular.element(document.querySelector('#newUpload')).on('load', function() {
          $('#newUpload').cropper({
            aspectRatio: 1/1,
            dragMode: 'move',
            rotatable: true,
            movable: true,
            responsive: false,
            toggleDragModeOnDblclick: false,
            minContainerHeight: 500,
            minCropBoxWidth: 50,
            minCropBoxHeight: 50,
            built: function(e) {
              $scope.croppedImg = $(this).cropper('getCroppedCanvas', { width: 500, height: 500 }).toDataURL("image/jpeg", 1.0);
            },
            cropend: function(e) {
              $scope.croppedImg = $(this).cropper('getCroppedCanvas', { width: 500, height: 500 }).toDataURL("image/jpeg", 1.0);
            }
          })
        })
      }
      else {
        $scope.newImg = '';
      }
    }
    else {
      if (Meteor.isCordova) {
        $cordovaToast.showShortBottom('Limite maximale atteinte.');
      } else {
        toastr.error('Limite maximale atteinte.');
      }
    }
  };

  //Rotate Image
  $scope.rotate = function() {
    $('#newUpload').cropper('rotate', 90);
    $scope.croppedImg = $('#newUpload').cropper('getCroppedCanvas', { width: 500, height: 500 }).toDataURL("image/jpeg", 1.0);
  }

  //Zoom Image
  $scope.zoomIn = function() {
    $('#newUpload').cropper('zoom', 0.1);
    $scope.croppedImg = $('#newUpload').cropper('getCroppedCanvas', { width: 500, height: 500 }).toDataURL("image/jpeg", 1.0);
  }

  $scope.zoomOut = function() {
    $('#newUpload').cropper('zoom', -0.1);
    $scope.croppedImg = $('#newUpload').cropper('getCroppedCanvas', { width: 500, height: 500 }).toDataURL("image/jpeg", 1.0);
  }

  //Save cropped image to array.
  $scope.uploadImg = function() {
    $scope.croppedImg = $('#newUpload').cropper('getCroppedCanvas', { width: 500, height: 500 }).toDataURL("image/jpeg", 1.0);
    
    if ($scope.croppedImg) {
      let prevImg = {
        id: null,
        url: $scope.croppedImg
      }
      self.preview.push( prevImg );

      let uploadImg = {
        file: MeteorCameraUI.dataURIToBlob($scope.croppedImg),
        uploaded: false
      }
      self.uploads.push( uploadImg );

      $scope.newImg = '';
      $scope.croppedImg = '';
      $scope.imgCrop.hide();
      $('#newUpload').cropper('destroy');
    }
    else {
      console.log("Erreur");
      if (Meteor.isCordova) {
        $cordovaToast.showLongBottom('Erreur. Veuillez r??essayez.');
      } else {
        toastr.error('Erreur. Veuillez r??essayez.');
      }
      $scope.newImg = '';
      $scope.croppedImg = '';
      $scope.imgCrop.hide();
      $('#newUpload').cropper('destroy');
    }
  };

  //Cancel image upload.
  $scope.cancelImg = function() {
    $scope.imgCrop.hide();
    $scope.newImg = '';
    $scope.croppedImg = '';
    $('#newUpload').cropper('destroy');
  };

  //Image cropper canvas.
  $ionicModal.fromTemplateUrl('client/templates/sell/components/img_crop.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.imgCrop = modal;
  });

  //Show current images in database.
  this.uploadedPreview = function(imgId) {
    return Uploads.findOne({ _id: imgId });
  };

  //Function for selecting uploaded image.
  this.selectImg = function(select) {
    if ( self.imgSelect.length  === 0 ) {
      self.imgSelect.push(select);
    }
    else {
      let images = self.imgSelect;
      let selected = false;
      images.forEach(function(img){
        if (select === img) {
          let index = images.indexOf(select);
          images.splice(index, 1);
          return selected = true;
        }
      });
      if (selected === false) {
        images.push(select);
      }
      self.imgSelect = images;
    }
  };

  //Remove selected image.
  this.removeUpload = function() {
    for (let i = 0; i < self.imgSelect.length; i++) {
      if ( self.preview[ self.imgSelect[i] ].id != null ) {
        self.removeUploaded.push( self.preview[ self.imgSelect[i] ].id )
      }
      self.preview.splice( self.imgSelect[i], 1 );
      self.uploads.splice( self.imgSelect[i], 1 );
    };
      self.imgSelect = [];
  };

  //Variables for form validation.
  self.noPrice = false;
  self.noLocation = false;
  self.noCond = false;
  self.noUpload = false;
  self.noTitle = false;

  //Save changes in listing.
  this.updatePost = function() {
    //Form validation functions.
    if( !self.price ||
        !self.post.meetLocation ||
        !self.condition ||
        isNaN( self.price.replace(/,/g, '') ) === true ||
        self.uploads.length === 0 ||
        ( !self.post.title )
    ){
      if (Meteor.isCordova) {
        $cordovaToast.showLongBottom('Les champs en rouge sont obligatoires.');
      } else {
        toastr.error('Les champs en rouge sont obligatoires.');
      }
      if ( !self.price || isNaN( self.price.replace(/,/g, '') ) === true ) { self.noPrice = true; } else { self.noPrice = false; }
      if ( !self.post.meetLocation ) { self.noLocation = true; } else { self.noLocation = false; }
      if ( !self.condition ) { self.noCond = true; } else { self.noCond = false; }
      if ( !self.post.title ) { self.noTitle = true; } else { self.noTitle = false; }
      if ( self.uploads.length === 0 ) { self.noUpload = true; } else { self.noUpload = false; }
    }
    else {
      $rootScope.$broadcast('loadspinner');

      //Delete images selected for removal from database.
      for (let i = 0; i < self.removeUploaded.length; i++) {
        //Method is located at tapshop/server/methods/listings_server.js
        Meteor.call('removeUpload', self.post._id, self.removeUploaded[i], function(err) {
          if (err) {
            console.log("Impossible de supprimer la photo.");
            if (Meteor.isCordova) {
              $cordovaToast.showLongBottom('Erreur. Veuillez r??essayez.');
            } else {
              toastr.error('Erreur. Veuillez r??essayez.');
            }
            $ionicLoading.hide();
            return;
          }
        });
      }
      //Save form data to object.
      var updateListing = {
        title: self.post.title,
        sellPrice: parseInt( self.price.replace(/,/g, '') ),
        condition: self.condition.toString(),
        meetLocation: self.post.meetLocation.toString(),
        listingNotes: self.postNotes.toString().replace(/(?:\r\n|\r|\n)/g, '<br />')
      };

      //Insert to form data to database.
      //Method is located at tapshop/server/methods/listings_server.js
      Meteor.call('updateListing', self.post._id, self.post.productID, updateListing, function(err) {
        if (!err) {
          if ( Offers.find({ listingID: self.post._id }).count() != 0 ){
            Offers.find({ listingID: self.post._id }).forEach( function(thisoffer) {
              //Method is located at tapshop/server/methods/feed_server.js
              Meteor.call('insertFeed', 'updatePost', thisoffer.offerBy, self.post.title, self.post._id, function(){
                if (err){
                  if (Meteor.isCordova) {
                    $cordovaToast.showLongBottom('Erreur. Veuillez r??essayez.');
                  } else {
                    toastr.error('Erreur. Veuillez r??essayez.');
                  }
                  $ionicLoading.hide();
                }
              });
            });
          }
          //Upload new images to database.
          if ( self.uploads.length !== 0 ){
            let uploadCount = 0;
            let meta = {
              listID: self.post._id
            }
            self.uploads.forEach( function(imgFile) {
              if ( imgFile.uploaded === false ) {

                let filename = self.post.title + uploadCount.toString();
                let fileData = self.newFile( imgFile.file, filename );

                var uploadInstance = Uploads.insert({
                  file: fileData,
                  meta: meta,
                  streams: 'dynamic',
                  chunkSize: 'dynamic'
                }, false);

                uploadInstance.on('end', function(error, fileObj) {
                  if (!error) {
                    //Method is located at tapshop/server/methods/listings_server.js
                    Meteor.call('insertImage', fileObj.meta.listID, fileObj._id, function(err){
                      if(!err){
                        uploadCount++;
                        if (uploadCount === self.uploads.length) {
                          if (Meteor.isCordova) {
                            $cordovaToast.showShortBottom('Offre mise ?? jour');
                          } else {
                            toastr.success('Offre mise ?? jour');
                          }
                          $state.go('app.myproduct', { listingId: self.post._id });
                        } else {
                          return;
                        }
                      }
                      else {
                        console.log("Erreur de chargement");
                        if (Meteor.isCordova) {
                          $cordovaToast.showLongBottom('Erreur. Veuillez r??essayez.');
                        } else {
                          toastr.error('Erreur. Veuillez r??essayez.');
                        }
                        $ionicLoading.hide();
                        return;
                      }
                    });
                  }
                  else {
                    console.log("Erreur de chargement");
                    if (Meteor.isCordova) {
                      $cordovaToast.showLongBottom('Erreur. Veuillez r??essayez.');
                    } else {
                      toastr.error('Erreur. Veuillez r??essayez.');
                    }
                    $ionicLoading.hide();
                    return;
                  }
                });
                uploadInstance.start();
              }
              else {
                uploadCount++;
                if (uploadCount === self.uploads.length) {
                  if (Meteor.isCordova) {
                    $cordovaToast.showShortBottom('Offre mise ?? jour');
                  } else {
                    toastr.success('Offre mise ?? jour');
                  }
                  $state.go('app.myproduct', { listingId: self.post._id });
                } else {
                    return;
                }
              }
            });
          }
        } else {
          if (Meteor.isCordova) {
            $cordovaToast.showLongBottom('Erreur. Veuillez r??essayez.');
          } else {
            toastr.error('Erreur. Veuillez r??essayez.');
          }
          $ionicLoading.hide();
        }
      });
    }
  };

  //Cancel changes.
  this.cancel = function() {
    $scope.imgCrop.remove();
    $state.go('app.myproduct', { listingId: $stateParams.listingId });
  };

  this.newFile = function(blob, name){
    let filename = '';
    if (blob.type === "image/jpeg") {
      filename = name + '.jpg';
    } else if (blob.type === "image/png") {
      filename = name + '.png';
    } else if (blob.type === "image/gif") {
      filename = name + '.gif';
    } else {
      throw error;
    }
    let newFile = _.extend(blob,{
      name: filename
    })
    return newFile;
  }

  $scope.$on('$ionicView.afterEnter', function (event, viewData) {
    if ( document.getElementById("content-main") !== null ) {
      $ionicLoading.hide();
    }
  });
  $scope.$on('$ionicView.beforeLeave', function (event, viewData) {
    $scope.imgCrop.remove();
    $('#newUpload').cropper('destroy');
  });
};
