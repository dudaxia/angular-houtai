    'use strict';
    angular.module('ngTicket').value('kindeditorConfig', {
            default: {
                items: ['source', '|', 'undo', 'redo', '|', 'preview', 'print', 'template', 'cut', 'copy', 'paste', 'plainpaste', 'wordpaste', '|', 'justifyleft', 'justifycenter', 'justifyright', 'justifyfull', 'insertorderedlist', 'insertunorderedlist', 'indent', 'outdent', 'subscript', 'superscript', 'clearhtml', 'quickformat', 'selectall', '|', 'fullscreen', '/', 'formatblock', 'fontname', 'fontsize', '|', 'forecolor', 'hilitecolor', 'bold', 'italic', 'underline', 'strikethrough', 'lineheight', 'removeformat', '|', 'insertfile', 'table', 'hr', 'emoticons', 'code', 'pagebreak', 'link', 'unlink','addcustom'],
                height: "300px",
                themeType: 'simple',
                width: "100%"
            },
            simple: {
                items: ['undo', 'redo', 'plainpaste', 'plainpaste', 'wordpaste', 'clearhtml', 'quickformat', 'selectall', 'fullscreen', 'fontname', 'fontsize', '|', 'forecolor', 'hilitecolor', 'bold', 'italic', 'underline', 'hr', 'removeformat', '|', 'justifyleft', 'justifycenter', 'justifyright', 'insertorderedlist', 'insertunorderedlist', '|', 'emoticons', 'image', 'link', 'unlink', 'preview'],
                height: "200px",
                themeType: 'simple',
                width: "100%"
            },
            mini: {
                items: ['source', 'fontsize', 'forecolor', 'hilitecolor', 'bold', 'italic', 'removeformat', 'justifyleft', 'justifycenter', 'justifyright', 'insertorderedlist', 'insertunorderedlist', 'link', 'unlink'],
                height: "300px",
                themeType: 'simple',
                width: "100%"
            }

        })
        .directive('kindeditor', ['kindeditorConfig', '$rootScope', '$config', '$toaster', function(kindeditorConfig, $rootScope, $config, $toaster) {
            return {
                restrict: 'A',
                require: '^ngModel',
                scope: {
                    path: "@",
                    opts: "="
                },
                link: function(scope, iElement, iAttrs, ngModelCtrl) {



                    var parseImg = function(editor) {
                        $(editor.edit.doc).pastableTextarea();
                        $(editor.edit.doc).on('pasteImage', function(ev, data) {

                            var filesize = data.blob.size / 1024;
                            if (filesize > 2028) {
                                scope.$apply(function() {
                                    $toaster.warning("粘贴文件不能大于2mb");
                                })

                                return false;
                            };
                            var formdata = new FormData();
                            formdata.append('imgfile', data.blob, '2b.png');
                            var userData = $rootScope.locals.userData;
                            var dg = dialog();
                            $.ajax({
                                type: 'POST',
                                url: $config.api3.upload.upfile + "?Authorization=" + $rootScope.locals.access_token + "&uid=" + userData.id,
                                data: formdata,
                                processData: false,
                                contentType: false
                            }).done(function(data) {
                                dg.remove();
                                if (data.code == "10001") {
                                    editor.insertHtml('<img src="' + data.data.url + '" >')
                                } else {
                                    scope.$apply(function() {
                                        $toaster.warning(data.message || "上传失败");
                                    })
                                }

                            }).fail(function() {
                                $toaster.warning("网络异常");
                            });
                        });
                        var dialog = function() {
                            var dialog = KindEditor.dialog({
                                width: 500,
                                title: '上传图片',
                                body: '<div class="load" >图片上传中...</div>',
                                closeBtn: {
                                    name: '关闭',
                                    click: function(e) {
                                        dialog.remove();
                                    }
                                }
                            });
                            return dialog;
                        }
                    }


                    var getopts = iAttrs.config ? kindeditorConfig[iAttrs.config] : kindeditorConfig["default"];
                    var newopts = angular.extend({}, getopts, scope.opts, {
                        afterCreate: function() {
                            this.sync()
                            parseImg(this);
                        },
                        afterBlur: function() {
                            this.sync()
                        },
                        afterChange: function() {
                            var _self = this;
                            if (!scope.$$phase && !scope.$root.$$phase) {
                                scope.$apply(function() {
                                    ngModelCtrl.$setViewValue(_self.html());
                                });
                            };
                        }

                    });
                    if ($rootScope.locals.userData) {
                        var locals = $rootScope.locals;
                        newopts = angular.extend({}, newopts, {
                            uploadJson: '/api3/upfile/index?uid={0}&Authorization={1}&edit=1'.format(locals.userData.id, locals.access_token),
                            fileManagerJson: '/api3/upfile/manager?uid={0}&Authorization={1}'.format(locals.userData.id, locals.access_token)
                        })

                    };
                    // if (angular.isUndefined(socpe.kindeditorDisplay)) { socpe.kindeditorDisplay=true;};



                    var editor = KindEditor.create(iElement, newopts);

                    ngModelCtrl.$render = function() {
                        editor.html(ngModelCtrl.$viewValue || '')
                    }


                }
            };
        }]).directive('kindeditorImg', ['$timeout', function($timeout) {
            return {
                restrict: 'A',
                templateUrl: '/app/components/kindeditor/kindeditor.img.html',
                scope: {
                    imgPath: '=ngModel',
                    tip: '@',
                    title: '@',
                    fileManager: '=',
                    callback: '&',
                    uploadParams: '='
                },
                link: function(scope, iElement, iAttrs) {
                    $timeout(function() {
                        var editor = KindEditor.editor({
                            allowFileManager: scope.allowFileManager || true,
                            extraFileUploadParams: scope.uploadParams
                        });
                        scope.select = function() {
                            editor.loadPlugin('image', function() {
                                editor.plugin.imageDialog({
                                    imageUrl: scope.imgPath,
                                    clickFn: function(url, title, width, height, border, align) {
                                        scope.$apply(function() {
                                            scope.imgPath = url;
                                        })
                                        if (angular.isFunction(scope.callback)) {
                                            scope.callback()
                                        };
                                        editor.hideDialog();
                                    }
                                });
                            });
                        }
                    })

                }
            };
        }]).directive('kindeditorPreView', [function() {
            return {
                restrict: 'AE',
                scope: {
                    content: '=?',
                    preview: '=?'
                },
                templateUrl: '/app/components/kindeditor/kindeditor.preview.html',
                link: function(scope, iElement, iAttrs) {
                    if (angular.isUndefined(scope.preview)) {
                        scope.preview = true;
                    }
                    $(function() {
                        $(document).on("click", function(e) {
                            if (!scope.preview && !$.contains(iElement, e.target) && $(e.target).closest('.ke-dialog-default', 'ke-container').length == 0) {
                                scope.$apply(function() {
                                    scope.preview = true;
                                })
                            };
                        })
                        $(iElement).on("click", function(e) {
                            e.stopPropagation();
                            scope.$apply(function() {
                                scope.preview = !scope.preview;
                            })
                        })



                    })

                }
            };
        }]);
