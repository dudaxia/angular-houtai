'use strict';

angular.module('ngTicket').directive('uploadImgList', ['$upload', '$rootScope', '$toaster', '$locale', function($upload, $rootScope, $toaster, $locale) {
  return {
    restrict: 'AE',
    scope: {
      fileList: '=?',
      maxCount: '=?',
      indexVal: '=?'
    },
    templateUrl: '/app/components/uploadzhan/upload.img.html',
    link: function(scope, iElement, iAttrs) {

      scope.del = function($index) {
        console.log($index)
        scope.fileList.splice($index, 1)
      };
      scope.maxCount = scope.maxCount || 5;

      scope.fileList = scope.fileList || [];
      var fileRema = function() {
        return scope.maxCount - scope.fileList.length;
      };
      if (!String.IsNullOrEmpty(scope.indexVal)) {
        angular.forEach(scope.fileList, function(item, index) {
          if (item.indexOf(scope.indexVal) > -1) {
            scope.selectIndex = index;
          }

        })


      } else {
        scope.selectIndex = 0;
      }
      scope.selectIndexFun = function($index) {
        scope.selectIndex = $index;
        scope.indexVal = scope.fileList[$index].replace('@0e_640w_640h_0c_0i_0o_90Q_1x.src', '');
      }

      scope.$watch('files', function() {
        scope.upload(scope.files);
      });

      scope.upload = function(files) {
        var shopData = $rootScope.locals.shopData;

        if (!files) return;
        var remaining = fileRema();
        if (remaining < files.length) {
          $toaster.info($locale.FORMTIPS.uplodMax.format(remaining));
          return false;
        };
        for (var i = 0; i < files.length; i++) {
          var file = files[i];
          var upload = $upload.upload({
            url: 'api2/uploadimage/saveimage',
            fields: {
              shop_id: shopData.shop_id
            },
            file: file,
            fileFormDataName: "uploadimage"

          }).progress(function(evt) {
            evt.config.file.fileProgress = parseInt(100.0 * evt.loaded / evt.total);
            scope.fileProgress = parseInt(100.0 * evt.loaded / evt.total);

          }).success(function(data, status, headers, config) {
            //TODO 判断成功上传 后再添加 +
            scope.fileList.push(data.data[0] + "@0e_640w_640h_0c_0i_0o_90Q_1x.src");
            console.log(scope.fileList)
          }).error(function(data, status, headers, config) {
            //移除
          });
        }
      }

    }
  };
}]).directive('uploadFileList', ['$upload', '$config', '$rootScope', '$toaster', '$locale', function($upload, $config, $rootScope, $toaster, $locale) {
  return {
    restrict: 'AE',
    scope: {
      fileList: '=?',
      maxSizeFile: '=?',
      maxCount: '=?'
    },
    templateUrl: '/app/components/uploadzhan/upload.file.html',
    link: function(scope, iElement, iAttrs) {

      scope.del = function($index) {
        scope.fileList.splice($index, 1)
      };
      scope.maxCount = scope.maxCount || 5;
      scope.maxSizeFile = scope.maxSizeFile || 2;

      scope.fileList = scope.fileList || [];
      var fileRema = function() {
        return scope.maxCount - scope.fileList.length;
      };
      scope.$watch('files', function() {
        scope.upload(scope.files);
      });

      scope.upload = function(files) {
        var userData = $rootScope.locals.userData;
        scope.freLoading = true;
        if (!files) return;
        var remaining = fileRema();
        if (remaining < files.length) {
          $toaster.info($locale.FORMTIPS.uplodMax.format(remaining));
          return false;
        };
        for (var i = 0; i < files.length; i++) {
          var file = files[i];
          file.success = true;
          if (file.size / (1024 * 1024) > scope.maxSizeFile) {
            $toaster.info($locale.FORMTIPS.uplodSizeMax.format(scope.maxSizeFile));
          } else {
            file.success = false;
            var upload = $upload.upload({
              url: $config.api3.upload.upfile + "?Authorization=" + $rootScope.locals.access_token + "&uid=" + userData.id,
              fields: {
                uid: userData.id
              },
              file: file,
              fileFormDataName: "imgfile"

            }).progress(function(evt) {
              evt.config.file.fileProgress = parseInt(100.0 * evt.loaded / evt.total);
              scope.fileProgress = parseInt(100.0 * evt.loaded / evt.total);

            }).success(function(data, status, headers, config) {
              config.file.success = true;
              //TODO 判断成功上传 后再添加 +
              if (data.code == "10001") {
                data.data.urls = [data.data.url];
                scope.fileList.push(data.data);
              } else {
                $toaster.info(data.message);
              }
              scope.freLoading = false;
            }).error(function(data, status, headers, config) {
              config.file.success = true;
              //移除
            });
          }

        }
      }

    }
  };
}]).directive('uploadButton', ['$upload', '$config', '$rootScope', '$toaster', '$locale', function($upload, $config, $rootScope, $toaster, $locale) {
  return {
    restrict: 'AE',
    scope: {
      fileList: '=?',
      maxSizeFile: '=?',
      accept: '@',
      tooltip: '@',
      maxCount: '=?',
      fields:'=?',
      callback:'&'
    },
    templateUrl: '/app/components/uploadzhan/upload.button.html',
    link: function(scope, iElement, iAttrs) {
      console.log("$upload",$upload)
      scope.del = function($index) {
        scope.fileList.splice($index, 1)
      };
      scope.maxCount = scope.maxCount || 100;
      scope.maxSizeFile = scope.maxSizeFile || 2;
      scope.fileList = scope.fileList || [];
      var fileRema = function() {
        return scope.maxCount - scope.fileList.length;
      };
      scope.$watch('files', function() {
        scope.upload(scope.files);
      });

      scope.upload = function(files) {
        scope.freLoading = true;
        if (!files) return;
        var remaining = fileRema();
        if (remaining < files.length) {
          $toaster.info($locale.FORMTIPS.uplodMax.format(remaining));
          return false;
        };
        for (var i = 0; i < files.length; i++) {
          var file = files[i];
          file.success = true;
          if (file.size / (1024 * 1024) > scope.maxSizeFile) {
            $toaster.info($locale.FORMTIPS.uplodSizeMax.format(scope.maxSizeFile));
            return false;
          }
          var upload = $upload.upload({
            url: $config.host.apifix + $config.api3.fileupload.upload,
            file: file,
            fileFormDataName: "multipartFile"
          }).progress(function(evt) {
            //  evt.config.file.fileProgress = parseInt(100.0 * evt.loaded / evt.total);
            //  scope.fileProgress = parseInt(100.0 * evt.loaded / evt.total);
            console.log('fileProgress',parseInt(100.0 * evt.loaded / evt.total))
            scope.uploadloading = true;

          }).success(function(data, status, headers, config) {
            scope.uploadloading = false;
            if (data.code == "0") {
              // data.data.urls = [data.data.url];
              // scope.fileList.push(data.data);
              // console.log(data.data)
              scope.callback&&scope.callback({data:data});
            } else {
              $toaster.info(data.errmsg);
            }
            scope.disabled = false;
          }).error(function(data, status, headers, config) {

            //移除
          });
        }

      }

    }
  };
}]).directive('uploadButtonZhan', ['$upload', '$config', '$rootScope', '$toaster', '$locale', function($upload, $config, $rootScope, $toaster, $locale) {
  return {
    restrict: 'AE',
    scope: {
      fileList: '=?',
      maxSizeFile: '=?',
      accept: '@',
      tooltip: '@',
      maxCount: '=?',
      fields:'=?',
      callback:'&'
    },
    templateUrl: '/app/components/uploadzhan/upload.button.html',
    link: function(scope, iElement, iAttrs) {

      scope.del = function($index) {
        scope.fileList.splice($index, 1)
      };
      scope.maxCount = scope.maxCount || 100;
      scope.maxSizeFile = scope.maxSizeFile || 2;

      scope.fileList = scope.fileList || [];
      var fileRema = function() {
        return scope.maxCount - scope.fileList.length;
      };
      scope.$watch('files', function() {
        scope.upload(scope.files);
      });

      scope.upload = function(files) {
        scope.freLoading = true;
        if (!files) return;
        var remaining = fileRema();
        if (remaining < files.length) {
          $toaster.info($locale.FORMTIPS.uplodMax.format(remaining));
          return false;
        };
        for (var i = 0; i < files.length; i++) {
          var file = files[i];
          file.success = true;
          if (file.size / (1024 * 1024) > scope.maxSizeFile) {
            $toaster.info($locale.FORMTIPS.uplodSizeMax.format(scope.maxSizeFile));
            return false;
          }
        }
        if (files.length) {
          var upload = $upload.upload({
            url: $config.api3Zhan.material.zhanUpload,
            file: files,
            fields:scope.fields,
            fileFormDataName: "files"

          }).progress(function(evt) {
            //  evt.config.file.fileProgress = parseInt(100.0 * evt.loaded / evt.total);
            //  scope.fileProgress = parseInt(100.0 * evt.loaded / evt.total);
            console.log('fileProgress',parseInt(100.0 * evt.loaded / evt.total))
            scope.uploadloading = true;

          }).success(function(data, status, headers, config) {
            scope.uploadloading = false;
            if (data.errcode == "0") {
              // data.data.urls = [data.data.url];
              // scope.fileList.push(data.data);
              // console.log(data.data)
              scope.callback&&scope.callback({data:data.data});
            } else {
              $toaster.info(data.errmsg);
            }
            scope.disabled = false;
          }).error(function(data, status, headers, config) {

            //移除
          });
        }

      }

    }
  };
}]);
