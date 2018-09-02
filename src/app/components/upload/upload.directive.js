'use strict';

angular.module('ngTicket').directive('uploadImgList', ['$upload', '$rootScope', '$toaster', '$locale','$config', function($upload, $rootScope, $toaster, $locale,$config) {
    return {
        restrict: 'AE',
        scope: {
            fileList: '=?',
            maxCount: '=?',
            maxSizeFile:"=?",
            indexVal: '=?',
            tips: '@',
            uploadParams:"=?",
            hide:"=?",
            haslink:"=?",
            url:"@"
        },
        templateUrl: '/app/components/upload/upload.img.html',
        link: function(scope, iElement, iAttrs) {

            scope.del = function($index) {
                scope.fileList.splice($index, 1)
            };
            scope.maxCount = scope.maxCount || 5;
             scope.maxSizeFile = scope.maxSizeFile || 1;
            scope.fileList = scope.fileList || [];
            var fileRema = function() {
                return scope.maxCount - scope.fileList.length;
            };
            if (!String.IsNullOrEmpty(scope.indexVal)) {
                angular.forEach(scope.fileList, function(item, index) {
                    if (item.indexOf(scope.indexVal)>-1) {
                        scope.selectIndex = index;
                    }

                })


            } else {
                scope.selectIndex = 0;
            }
            scope.selectIndexFun=function  ($index) {
                scope.selectIndex = $index;
                scope.indexVal=scope.fileList[$index];
            }

            scope.$watch('files', function() {
                scope.upload(scope.files);
            });

            scope.upload = function(files) {
                if (!files) return;
                var remaining = fileRema();
                if (remaining < files.length) {
                    $toaster.info($locale.FORMTIPS.uplodMax.format(remaining));
                    return false;
                };
                for (var i = 0; i < files.length; i++) {
                    var file = files[i];
                    file.success=true;
                    if(file.size/(1024*1024)>scope.maxSizeFile){
                        $toaster.info($locale.FORMTIPS.uplodSizeMax.format(scope.maxSizeFile));
                   }else{
                        file.success=false;
                        scope.fileUploadLoading=true;
                        var upload = $upload.upload({
                            url: scope.url || $config.api3.upload,
                            fields: scope.uploadParams,
                            file: file,
                            fileFormDataName: "file"

                        }).progress(function(evt) {
                            evt.config.file.fileProgress = parseInt(100.0 * evt.loaded / evt.total);
                            scope.fileProgress = parseInt(100.0 * evt.loaded / evt.total);

                        }).success(function(data, status, headers, config) {
                            //TODO 判断成功上传 后再添加 +
                                config.file.success = true;
                                //TODO 判断成功上传 后再添加 +
                                if (data.code.errcode == "0") {
                                    data.data.urls = [data.data.url];
                                    scope.fileList.push(data.data);
                                } else {
                                    $toaster.info(data.code.errmsg.message);
                                }
                                scope.fileUploadLoading=false;

                        }).error(function(data, status, headers, config) {
                            //移除
                            config.file.success=true;
                             scope.fileUploadLoading=false;
                        });
                   }

                }
            }

        }
    };
}]).directive('uploadFileList', ['$upload', '$config','$rootScope', '$toaster', '$locale', function($upload, $config,$rootScope, $toaster, $locale) {
    return {
        restrict: 'AE',
        scope: {
            fileList: '=?',
            maxSizeFile: '=?',
            maxCount: '=?'
        },
        templateUrl: '/app/components/upload/upload.file.html',
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
                if(!userData){
                    userData={};
                }
                scope.freLoading=true;
                if (!files) return;
                var remaining = fileRema();
                if (remaining < files.length) {
                    $toaster.info($locale.FORMTIPS.uplodMax.format(remaining));
                    return false;
                };
                for (var i = 0; i < files.length; i++) {
                    var file = files[i];
                    file.success=true;
                   if(file.size/(1024*1024)>scope.maxSizeFile){
                        $toaster.info($locale.FORMTIPS.uplodSizeMax.format(scope.maxSizeFile));
                   }else{
                        file.success=false;
                        var upload = $upload.upload({
                            url: $config.api3.upload,
                            fields: {
                                uid: userData.id
                            },
                            file: file,
                            fileFormDataName: "imgfile"

                        }).progress(function(evt) {
                            evt.config.file.fileProgress = parseInt(100.0 * evt.loaded / evt.total);
                            scope.fileProgress = parseInt(100.0 * evt.loaded / evt.total);

                        }).success(function(data, status, headers, config) {
                            config.file.success=true;
                            //TODO 判断成功上传 后再添加 +
                            if(data.code=="10001"){
                                data.data.urls = [data.data.url];
                                scope.fileList.push(data.data);
                            }else{
                                $toaster.info(data.message);
                            }
                            scope.freLoading = false;
                        }).error(function(data, status, headers, config) {
                            config.file.success=true;
                            //移除
                        });
                   }

                }
            }

        }
    };
}]).directive('uploadFileSingle', ['$upload', '$config','$rootScope', '$toaster', '$locale', function($upload, $config,$rootScope, $toaster, $locale) {
    return {
        restrict: 'AE',
        scope: {
            fileList: '=?',
            maxCount: '=?',
            maxSizeFile:"=?",
            indexVal: '=?',
            hide:"=?",
            uploadParams:"=?",
            fileType: "=?",
            url: "@"
        },
        templateUrl: '/app/components/upload/upload.file.single.html',
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
            scope.fileType = scope.fileType || '.txt,.rar,.zip,.doc,.docx,.ini,.conf,.eml,.xls,.csv';
            var innerParams={
                "activity_id": $rootScope.locals.data.activity_id,
                "aid": $rootScope.locals.data.aid,
                "bid": $rootScope.locals.data.bid
            }

            scope.uploadParams = angular.extend({}, innerParams, scope.uploadParams);

            scope.upload = function(files) {
                var userData = $rootScope.locals.userData;
                scope.freLoading=true;
                if (!files) return;
                var remaining = fileRema();
                if (remaining < files.length) {
                    $toaster.info($locale.FORMTIPS.uplodMax.format(remaining));
                    return false;
                };
                for (var i = 0; i < files.length; i++) {
                    var file = files[i];
                    file.success=true;
                   if(file.size/(1024*1024)>scope.maxSizeFile){
                        $toaster.info($locale.FORMTIPS.uplodSizeMax.format(scope.maxSizeFile));
                   }else{
                        file.success=false;
                        var upload = $upload.upload({
                            url: scope.url || $config.api3.batchImportOption,
                            fields: scope.uploadParams,
                            file: file,
                            fileFormDataName: "csvFile"

                        }).progress(function(evt) {
                            evt.config.file.fileProgress = parseInt(100.0 * evt.loaded / evt.total);
                            scope.fileProgress = parseInt(100.0 * evt.loaded / evt.total);

                        }).success(function(data, status, headers, config) {
                            config.file.success=true;
                            //TODO 判断成功上传 后再添加 +
                            if(data.code.errcode == "0"){
                                data.data.url = [data.data.url];
                                scope.fileList.push(data.data);
                                if(data.data.number){
                                    $toaster.info('成功读取【' + data.data.number + '】条数据');
                                }
                            }else{
                                $toaster.warning(data.code.errmsg);
                            }
                            scope.freLoading = false;
                        }).error(function(data, status, headers, config) {
                            config.file.success=true;
                            //移除
                        });
                   }

                }
            }

        }
    };
}]).directive('uploadImgSingle', ['$upload', '$rootScope', '$toaster', '$locale','$config', function($upload, $rootScope, $toaster, $locale,$config) {
    return {
        restrict: 'AE',
        scope: {
            fileList: '=?',
            maxCount: '=?',
            centreShow:'=?',
            maxSizeFile:"=?",
            indexVal: '=?',
            tips: '@',
            uploadParams:"=?",
            hide:"=?",
            haslink:"=?",
            url: "@"
        },
        templateUrl: '/app/components/upload/upload.img.single.html',
        link: function(scope, iElement, iAttrs) {
            scope.del = function($index) {
                scope.fileList.splice($index, 1)
            };
            scope.maxCount = scope.maxCount || 1;
            scope.maxSizeFile = scope.maxSizeFile || 1;
            scope.fileList = scope.fileList || [];
            var fileRema = function() {
                return scope.maxCount - scope.fileList.length;
            };
            if (!String.IsNullOrEmpty(scope.indexVal)) {
                angular.forEach(scope.fileList, function(item, index) {
                    if (item.indexOf(scope.indexVal)>-1) {
                        scope.selectIndex = index;
                    }

                })
            } else {
                scope.selectIndex = 0;
            }
            scope.selectIndexFun=function  ($index) {
                scope.selectIndex = $index;
                scope.indexVal=scope.fileList[$index];
            }
            var innerParams={
                "activity_id": $rootScope.locals.data.activity_id,
                "aid": $rootScope.locals.data.aid,
                "bid": $rootScope.locals.data.bid,
            }
            scope.uploadParams = angular.extend({}, innerParams, scope.uploadParams);
            scope.$watch('files', function(v) {
                scope.upload(scope.files);
            });

            scope.upload = function(files) {
                if (!files) return;
                var remaining = fileRema();
                if (remaining < files.length) {
                    $toaster.info($locale.FORMTIPS.uplodMax.format(remaining));
                    return false;
                };
                for (var i = 0; i < files.length; i++) {
                    var file = files[i];
                    file.success=true;
                    if(file.size/(1024*1024)>scope.maxSizeFile){
                        $toaster.info($locale.FORMTIPS.uplodSizeMax.format(scope.maxSizeFile));
                   }else{
                        file.success=false;
                        scope.fileUploadLoading=true;
                        var upload = $upload.upload({
                            url: scope.url || $config.api3.upload,
                            fields: scope.uploadParams,
                            file: file,
                            fileFormDataName: "file"

                        }).progress(function(evt) {
                            evt.config.file.fileProgress = parseInt(100.0 * evt.loaded / evt.total);
                            scope.fileProgress = parseInt(100.0 * evt.loaded / evt.total);

                        }).success(function(data, status, headers, config) {
                            //TODO 判断成功上传 后再添加 +
                                config.file.success = true;
                                //TODO 判断成功上传 后再添加 +
                                if (data.code.errcode == "0") {
                                    data.data.urls = [data.data.url];
                                    scope.fileList.push(data.data);
                                } else {
                                    $toaster.info(data.code.errmsg.message);
                                }
                                scope.fileUploadLoading=false;

                        }).error(function(data, status, headers, config) {
                            //移除
                            config.file.success=true;
                             scope.fileUploadLoading=false;
                        });
                   }

                }
            }

        }
    };
}]).directive('uploadMp3Single', ['$upload', '$rootScope', '$toaster', '$locale','$config', function($upload, $rootScope, $toaster, $locale,$config) {
    return {
        restrict: 'AE',
        scope: {
            fileList: '=?',
            maxCount: '=?',
            maxSizeFile:"=?",
            indexVal: '=?',
            uploadParams:"=?",
            hide:"=?"
        },
        templateUrl: '/app/components/upload/upload.mp3.single.html',
        link: function(scope, iElement, iAttrs) {
            scope.del = function($index) {
                var player = new _mu.Player({
                    // baseDir是必填初始化参数，指向刚才签出的MuPlayer静态资源目录
                    baseDir: '/muplayer/'
                });
                player.reset();
                scope.fileList.splice($index, 1)
            };
            scope.maxCount = scope.maxCount || 1;
            scope.maxSizeFile = scope.maxSizeFile || 2;
            scope.fileList = scope.fileList || [];
            var fileRema = function() {
                return scope.maxCount - scope.fileList.length;
            };
            if (!String.IsNullOrEmpty(scope.indexVal)) {
                angular.forEach(scope.fileList, function(item, index) {
                    if (item.indexOf(scope.indexVal)>-1) {
                        scope.selectIndex = index;
                    }

                })


            } else {
                scope.selectIndex = 0;
            }
            scope.selectIndexFun=function  ($index) {
                scope.selectIndex = $index;
                scope.indexVal=scope.fileList[$index];
            }
            var innerParams={
                "activity_id": $rootScope.locals.data.activity_id,
                "aid": $rootScope.locals.data.aid,
                "bid": $rootScope.locals.data.bid,
            }
            scope.uploadParams = angular.extend({}, innerParams, scope.uploadParams);
            scope.$watch('files', function() {
                scope.upload(scope.files);
            });
            scope.upload = function(files) {
                if (!files) return;
                var remaining = fileRema();
                if (remaining < files.length) {
                    $toaster.info($locale.FORMTIPS.uplodMax.format(remaining));
                    return false;
                };
                for (var i = 0; i < files.length; i++) {
                    var file = files[i];
                    file.success=true;
                    if(file.size/(1024*1024)>scope.maxSizeFile){
                        $toaster.info($locale.FORMTIPS.uplodSizeMax.format(scope.maxSizeFile));
                   }else{
                        file.success=false;
                        scope.fileUploadLoading=true;
                        var upload = $upload.upload({
                            url: $config.api3.upload,
                            fields: scope.uploadParams,
                            file: file,
                            fileFormDataName: "file"

                        }).progress(function(evt) {
                            evt.config.file.fileProgress = parseInt(100.0 * evt.loaded / evt.total);
                            scope.fileProgress = parseInt(100.0 * evt.loaded / evt.total);

                        }).success(function(data, status, headers, config) {
                            //TODO 判断成功上传 后再添加 +
                                config.file.success = true;
                                //TODO 判断成功上传 后再添加 +
                                if (data.code.errcode == "0") {
                                    data.data.url = [data.data.url];
                                    scope.fileList.push(data.data);
                                } else {
                                    $toaster.info(data.code.errmsg.message);
                                }
                                scope.fileUploadLoading=false;

                        }).error(function(data, status, headers, config) {
                            //移除
                            config.file.success=true;
                            scope.fileUploadLoading=false;
                        });
                   }

                }
            }

        }
    };
}]).directive('uploadCsvSingle', ['$upload', '$config','$rootScope', '$toaster', '$locale', function($upload, $config,$rootScope, $toaster, $locale) {
    return {
        restrict: 'AE',
        scope: {
            fileList: '=?',
            maxCount: '=?',
            maxSizeFile:"=?",
            indexVal: '=?',
            hide:"=?",
            uploadParams:"=?",
            fileType: "=?",
            saveFu:"=?",
            url: "@"
        },
        templateUrl: '/app/components/upload/upload.csv.single.html',
        link: function(scope, iElement, iAttrs) {
            scope.del = function($index) {
                scope.fileList.splice($index, 1)
            };
            scope.saveFu = scope;
            scope.maxCount = scope.maxCount || 5;
            scope.maxSizeFile = scope.maxSizeFile || 2;

            scope.fileList = scope.fileList || [];
            var fileRema = function() {
                return scope.maxCount - scope.fileList.length;
            };
            // scope.$watch('files', function() {
            //     scope.upload(scope.files);
            // });
            scope.fileType = scope.fileType || '.txt,.rar,.zip,.doc,.docx,.ini,.conf,.eml,.xls,.csv';
            var innerParams={
                // "activity_id": $rootScope.locals.data.activity_id,
                // "aid": $rootScope.locals.data.aid,
                // "bid": $rootScope.locals.data.bid
            }

            scope.uploadParams = angular.extend({}, innerParams, scope.uploadParams);

            // scope.upload = function(files) {
            //     var userData = $rootScope.locals.userData;
            //     scope.freLoading=true;
            //     if (!files) return;
            //     var remaining = fileRema();
            //     if (remaining < files.length) {
            //         $toaster.info($locale.FORMTIPS.uplodMax.format(remaining));
            //         return false;
            //     };
            //     for (var i = 0; i < files.length; i++) {
            //         var file = files[i];
            //         file.success=true;
            //        if(file.size/(1024*1024)>scope.maxSizeFile){
            //             $toaster.info($locale.FORMTIPS.uplodSizeMax.format(scope.maxSizeFile));
            //        }else{
            //             file.success=false;
            //             var upload = $upload.upload({
            //                 url: scope.url || $config.api3.batchImportOption,
            //                 fields: scope.uploadParams,
            //                 file: file,
            //                 fileFormDataName: "csvFile"

            //             }).progress(function(evt) {
            //                 evt.config.file.fileProgress = parseInt(100.0 * evt.loaded / evt.total);
            //                 scope.fileProgress = parseInt(100.0 * evt.loaded / evt.total);

            //             }).success(function(data, status, headers, config) {
            //                 config.file.success=true;
            //                 //TODO 判断成功上传 后再添加 +
            //                 if(data.code.errcode == "0"){
            //                     data.data.url = [data.data.url];
            //                     scope.fileList.push(data.data);
            //                     if(data.data.number){
            //                         $toaster.info('成功读取【' + data.data.number + '】条数据');
            //                     }
            //                 }else{
            //                     $toaster.warning(data.code.errmsg);
            //                 }
            //                 scope.freLoading = false;
            //             }).error(function(data, status, headers, config) {
            //                 config.file.success=true;
            //                 //移除
            //             });
            //        }

            //     }
            // }

        }
    };
}])

