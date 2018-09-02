'use strict';

angular.module('ngTicket')
/**
 * @ngdoc directive
 * @name global.directive:uiFullscreen
 * @element ANY
 * @function
 *
* @description
* 全屏
*
*
* @example
<example module="rfx">
 <file name="index.html">
   <a ui-fullscreen></a>
 </file>
</example>
*/
.directive('uiFullscreen', ['$document', '$window', function($document, $window) {
    return {
        restrict: 'AC',
        template: '<i class="fa fa-expand fa-fw text"></i><i class="fa fa-compress fa-fw text-active"></i>',
        link: function(scope, el, attr) {
            el.addClass('hide');
            // disable on ie11
            if (screenfull.enabled && !navigator.userAgent.match(/Trident.*rv:11\./)) {
                el.removeClass('hide');
            }
            el.on('click', function() {
                var target;
                attr.target && (target = $(attr.target)[0]);
                screenfull.toggle(target);
            });
            $document.on(screenfull.raw.fullscreenchange, function() {
                if (screenfull.isFullscreen) {
                    el.addClass('active');
                } else {
                    el.removeClass('active');
                }
            });

        }
    };
}])
.directive('countdown', ['$interval', '$filter', '$locale', 'formatTimefun', function($interval, $filter, $locale, formatTimefun) {
    return {
        restrict: 'AE',
        scope: {
            time: '='
        },
        link: function(scope, iElement, iAttrs, ngModelCtrl) {

            if (scope.time) {
                var difference = function() {
                    return (new Date(scope.time) - Date.now()) / 1000;
                };

                var timer = $interval(function() {
                    var df = difference();
                    if (df < 1) {
                        $interval.cancel(timer);
                    };
                    iElement.html(formatTimefun(df))
                }, 1000);
                iElement.html(formatTimefun(difference()))
            };




        }
    };
}])
/**
  * @ngdoc directive
  * @name global.directive:uiButterbar
  * @element ANY
  * @function
  *
 * @description
 * 加载进度条
 *
 *
 * @example
 <example module="rfx">
  <file name="index.html">
    <a ui-butterbar></a>
  </file>
 </example>
 */
.directive('uiButterbar', ['$rootScope', '$anchorScroll', function($rootScope, $anchorScroll) {
    return {
        restrict: 'AC',
        template: '<span class="bar"></span>',
        link: function(scope, el, attrs) {
            el.addClass('butterbar hide');
            scope.$on('$stateChangeStart', function(event) {
                $anchorScroll();
                el.removeClass('hide').addClass('active');
            });
            scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState) {
                event.targetScope.$watch('$viewContentLoaded', function() {
                    el.addClass('hide').removeClass('active');
                })
            });
        }
    };
}])
/**
 * @ngdoc directive
 * @name global.directive:uiToggleClass
 * @element ANY
 * @function
 *
* @description
* 显示||隐藏 class 并且指定ID
*
* @param {string} ui-toggle-class 显隐的class 多个用,分开
* @param {string} target 显隐的 ID或class  多个用,分开
*
* @example
<example module="rfx">
 <file name="index.html">
   <a ui-toggle-class="nav-xs,app-aside-folded" data-target="#nav,.stretch"></a>
 </file>
</example>
*/
.directive('uiToggleClass', ['$timeout', '$document', function($timeout, $document) {
    return {
        restrict: 'AC',
        link: function(scope, el, attr) {
            el.on('click', function(e) {
                e.preventDefault();
                var classes = attr.uiToggleClass.split(','),
                    targets = (attr.target && attr.target.split(',')) || Array(el),
                    key = 0;
                angular.forEach(classes, function(_class) {
                    var target = targets[(targets.length && key)];
                    (_class.indexOf('*') !== -1) && magic(_class, target);
                    $(target).toggleClass(_class);
                    key++;
                });
                $(el).toggleClass('active');

                function magic(_class, target) {
                    var patt = new RegExp('\\s' +
                        _class.replace(/\*/g, '[A-Za-z0-9-_]+').split(' ').join('\\s|\\s') +
                        '\\s', 'g');
                    var cn = ' ' + $(target)[0].className + ' ';
                    while (patt.test(cn)) {
                        cn = cn.replace(patt, ' ');
                    }
                    $(target)[0].className = $.trim(cn);
                }
            });
        }
    };
}])
/**
* @ngdoc directive
* @name global.directive:formValidator
* @element ANY
* @function
*
* @description
* 表单验证 规则老规矩
*
* @param {Object} formvalidatorconfig 验证配置
* @param {Object} formvalidatorapi  2个validate,valid回调方法
*
* @example
<example module="rfx">
<file name="index.html">
<form class="form-horizontal form-validate form-modal"  method="post"   formvalidator formvalidatorconfig="eventformvalidate"  formvalidatorapi="eventformvalidateapi">
<div class="form-group">
<label class="col-sm-2 control-label">商品名称</label>
<div class="col-sm-7 must">
<input type="text" class="form-control" data-rule-required="true"  ng-model="entity.name" />
</div>
</div>

<button type="submit" class="btn btn-primary" >保存</button>
</form>
</file>
<file name="app.js">
$scope.eventformvalidate = {
rules: {},
messages: {}, //配置可以写这里 也可以写input上
submitHandler: function() {
//ajax submit
}
};
$scope.save = function(scope) { //add form ng-submit="save()"
if (scope.eventformvalidateapi.valid()) {
    //==submitHandler
};
};
</file>
</example>
*/
.directive('formValidator', ["$timeout", function($timeout) {
    return {
        restrict: 'A',
        scope: {
            formvalidatorconfig: '=',
            formvalidatorapi: '='
        },
        link: function(scope, elem, attr, ctrl) {
            scope.$watch('formvalidatorconfig', function(value) {
                var vdefault = {
                    errorClass: "help-block error",
                    errorPlacement: function(a, e) {
                        var g = e.closest('.js_valid_position').length?e.closest('.js_valid_position'):e.parents(".input-group");
                        g.length > 0 ? g.after(a) : e.after(a)
                    },
                    highlight: function(a) {
                        $(a).removeClass("help-block error has-success").addClass("help-block error");
                    },
                    submitHandler: function(form) {
                        //save;
                    }
                };
                var options = $.extend(true, vdefault, value);
                elem.validate(options);
            })
            if (scope.formvalidatorapi) {
                scope.formvalidatorapi = {
                    validate: function() {
                        elem.validate().form();
                    },
                    valid: function() {
                        return elem.valid();
                    }
                };
            };

        }
    };
}])
/**
  * @ngdoc directive
  * @name global.directive:formSerialize
  * @element form
  * @function
  *
 * @description
 * 表单提交 主要用在ng-table上的搜索功能 其他模块应该用不到
 *
 * @param {Object} table-params  关联的tableParams
 *
 * @example
 <example module="rfx">
  <file name="index.html">
      <form class="talbe-search" form-serialize method="post" table-params="tableParams" >
  </file>
 </example>
 */
.directive('formSerialize', [function() {
    return {
        restrict: 'A',
        scope: {
            tableParams: '='
        },
        link: function(scope, iElement, iAttrs) {
            var $form = $(iElement)
            scope.$form = $form;
            $form.on("submit", function() {
                var $this = $(this),
                    $formdata = $this.serializeArray();
                var filters = {};

                if (scope.tableParams) {
                    scope.$apply(function() {
                        angular.forEach($formdata, function(item) {
                            scope.tableParams.filter()[item.name] = item.value;
                        });
                    });
                }
                return false;
            })
        }
    };
}])
.directive("btnLoading", function() {
    return {
        restrict: 'A',
        scope: {
            loadingText: '@',
            btnLoading: '=',
            ifDisabled: '=?'
        },
        link: function(scope, element, attrs) {
            var text = element.html();
            scope.$watch('btnLoading', function(loading) {
                if (!angular.isUndefined(loading)) {
                    scope.ifDisabled = angular.isUndefined(scope.ifDisabled) ? true : scope.ifDisabled;
                    if (scope.ifDisabled) {
                        element.prop('disabled', loading)
                    };
                    scope.loadingText = scope.loadingText == "@" ? '<i class="fa fa-spinner fa-spin"></i>' : scope.loadingText;
                    element.html(loading ? scope.loadingText || "loading..." : text);
                };

            });
        }
    }
})
.directive('loadingContainer', ["$rootScope", '$parse', function($rootScope, $parse) {
    return {
        restrict: 'A',
        scope: false,
        link: function(scope, element, attrs) {
            var overlay = $parse(attrs.overlay || 'true')(scope)
            var loadingLayer = angular.element('<div class="loading"></div>');
            if (overlay) {
                element.append(loadingLayer);
                element.addClass('loading-container');
            };
            scope.$watch(attrs.loadingContainer, function(value) {
                if (overlay) {
                    loadingLayer.toggleClass('ng-hide', !value);
                }
                $rootScope.loading_done = !value;
            });

        }
    };
}])
.directive('refreshState', ['$state2', function($state2) {
    return {
        restrict: 'A',
        link: function(scope, iElement, iAttrs) {
            iElement.bind("click", function() {
                $state2.current();
                // location.reload()
            })
        }
    };
}])
.directive('backState', ['$window', function($window) {
    return {
        restrict: 'A',
        link: function(scope, iElement, iAttrs) {
            iElement.bind("click", function() {
                $window.history.back();
            })
        }
    };
}]).directive('dateFormat', ['$filter', function($filter) {
    var dateFilter = $filter('date'); //   <input type="text" class="form-control date-format" data-ng-model="entity.addtime">
    return {
        require: 'ngModel',
        restrict: 'AC',
        link: function(scope, elm, attrs, ctrl) {
            function formatter(value) {
                value && elm.val(value).valid()
                return dateFilter(value, scope.$root.$config.dateformat); //format
            }

            function parser() {
                return ctrl.$modelValue;
            }
            ctrl.$formatters.push(formatter);
            ctrl.$parsers.unshift(parser);

        }
    };
}]).directive('iframe2', [function() {
    return {
        restrict: 'AE',
        require: '?ngModel',
        template: '<iframe  width="100%" height="0px" scrolling="no" frameborder="0"   onload="setIframeHeight(this)" ></iframe>',
        link: function(scope, iElement, iAttrs, ngModelCtrl) {
            ngModelCtrl.$render = function() {
                //<iframe src="demo.jsp" id="iframeA" width="100%" height="100%" scrolling="no" frameborder="0" onload="javascript:setIframeHeight(this)" ></iframe>


                // angular.element(iElement.children()[0]).attr("src", function() {
                //     return "javascript:'{0}'".format('<link rel="stylesheet" type="text/css" href="/assets/stylesheets/combination/normalize.css">'+ngModelCtrl.$viewValue)
                // })
                var  iframe = iElement.children()[0].contentWindow;
                iframe.document.open();
                iframe.document.write('<link rel="stylesheet" type="text/css" href="/assets/stylesheets/combination/normalize.css"> <base target="_blank" />'+ngModelCtrl.$viewValue);
                iframe.document.close();
            }
        }
    };
}]).directive('ngBindAttrs', function() {
    return function(scope, element, attrs) {
        scope.$watch(attrs.ngBindAttrs, function(value) {
            angular.forEach(value, function(value, key) {
                attrs.$set(key, value);
            })
        }, true)
    }
}).filter('cut', function() {
    return function(value, wordwise, max, tail) {
        console.log(value)
        if (!value) return '';

        max = parseInt(max, 10);
        if (!max) return value;
        if (value.length <= max) return value;

        value = value.substr(0, max);
        if (wordwise) {
            var lastspace = value.lastIndexOf(' ');
            if (lastspace != -1) {
                value = value.substr(0, lastspace);
            }
        }

        return value + (tail || ' …');
    };
}).filter('strLimit', [function() {
    return function(input, limit) {
        if (!input) return;
        if (input.length <= limit) {
            return input;
        }
        return input.substr(0, limit) + '...';
    };
}]).directive('fixFooterEx', ['$parse', '$timeout', function ($parse, $timeout) {
    //和fixFooter的区别，永远固定到底部，左右的位置与fixConSelector容器的左右边齐平
    return {
      link: function (scope, elm, attrs, ctrl) {
        //getBoundingClientRect也可以获取相对于浏览器的位置。
        //参考网址：
        //http://www.ruanyifeng.com/blog/2009/09/find_element_s_position_using_javascript.html
        //http://harttle.com/2016/04/24/client-height-width.html
        function getElementLeft(element) {
          var actualLeft = element.offsetLeft;
          var current = element.offsetParent;
          while (current !== null) {
            actualLeft += current.offsetLeft;
            current = current.offsetParent;
          }
          return actualLeft;
        }
        var con = elm.closest(attrs.fixConSelector);
        if (!con) {
          con = $(document);
        }

        function updateFooter(event) {

          var dom = con[0];
          var rect = elm[0].getBoundingClientRect();
          var right = document.body.offsetWidth - rect.right;
          elm.css({
            "position": "fixed",
            "left": rect.left + "px",
            right: right + "px"
          });
        };
        $(window).on('resize', function () {
          //console.log(event);
          //console.log("con:", con);
          updateFooter(event);
        });

        $timeout(function () {
          updateFooter();
        }, 0);

        scope.$on('$destroy', function () {



        });

      }
    };
  }]).directive("friendlyTime", ["$timeout", function($timeout) {

    var JUST_NOW = "刚刚",
        SEC_FORMAT = "秒前",
        MIN_FORMAT = "分钟前",
        TODAY_FORMAT = "今天 HH:mm",
        YEAR_FORMAT = "MM-DD HH:mm",
        ALL_FORMAT = "YYYY-MM-DD HH:mm",
        TITLE_FORMAT = "YYYY-MM-DD HH:mm:ss";

    function update(element, time, format, timer) {
        var now = moment(),
            duration = now - time,
            str = "",
            timeout = 0;
        format ? str = time.format(format) : time.isAfter(now) ? str = time.format(ALL_FORMAT) : 1e3 > duration ? (str = JUST_NOW, timeout = 1e3) : 6e4 > duration ? (str = moment.duration(duration).seconds() + SEC_FORMAT, timeout = 1e4 - duration % 1e4) : 36e5 > duration ? (str = moment.duration(duration).minutes() + MIN_FORMAT, timeout = 6e4 - duration % 6e4) : str = time.isAfter(now.startOf("day")) ? time.format(TODAY_FORMAT) : time.isAfter(now.startOf("year")) ? time.format(YEAR_FORMAT) : time.format(ALL_FORMAT), element.text(str), timeout > 0 && (timer = $timeout(function() {
            update(element, time, format, timer)
        }, timeout))
    }
    function reset(element, time, format, timer) {
        time && (timer > 0 && $timeout.cancel(timer), time = moment(time), element.attr({
            title: time.format(TITLE_FORMAT)
        }), update(element, time, format, timer))
    }

    return {
        restrict: "AE",
        scope: {
            time: "=friendlyTime"
        },
        link: function(scope, element, attrs) {
            var timer, format = attrs.friendlyTimeFormat;
            scope.$watch("time", function(newVal, oldVal) {
                reset(element, newVal, format, timer)
            }), reset(element, scope.time, format, timer), scope.$on("$destroy", function() {
                $timeout.cancel(timer)
            })
        }
    }
}]).directive('countTo', ['$timeout', function($timeout) {
    return {
        replace: false,
        scope: true,
        link: function(scope, element, attrs) {

            var e = element[0];
            var num, refreshInterval, duration, steps, step, countTo, value, increment;

            var calculate = function() {
                refreshInterval = 30;
                step = 0;
                scope.timoutId = null;
                countTo = parseFloat(attrs.countTo).toFixed(attrs.decimals || 0) || 0;

                scope.value = parseInt(attrs.value, 10) || 0;
                duration = (parseFloat(attrs.duration) * 1000) || 0;

                steps = Math.ceil(duration / refreshInterval);
                increment = ((countTo - scope.value) / steps);
                num = scope.value;
            }

            var tick = function() {
                scope.timoutId = $timeout(function() {
                    num += increment;
                    step++;
                    if (step >= steps) {
                        $timeout.cancel(scope.timoutId);
                        num = countTo;

                        e.textContent = countTo;
                    } else {
                        e.textContent = Math.round(num);
                        tick();
                    }
                }, refreshInterval);

            }

            var start = function() {
                if (scope.timoutId) {
                    $timeout.cancel(scope.timoutId);
                }
                calculate();
                tick();
            }

            attrs.$observe('countTo', function(val) {
                if (val) {
                    start();
                }
            });

            attrs.$observe('value', function(val) {
                start();
            });

            return true;
        }
    }

}])
.directive('wmoPagination', ['$rootScope', '$timeout',
  function($rootScope, $timeout) {
    return {
      restrict: 'A',
      replace: true,
      scope: {
        pageIndex: "=",
        pageSize: "=",
        totalCnt: "=",
        showGotoPage: "=?", //是否显示跳转输入框
        onPageIndexChanged: "&"
      },
      controller: "wmoPaginationCtrl",
      templateUrl: "/app/components/pagination/pagination.tpl.html",
      link: function(scope, element, attrs) {
        scope.pageCntLimit = 5; //展开显示的分页数限制
        scope.pageStart = 1; //展开显示的起始页
        scope.pageEnd = scope.pageStart + scope.pageCntLimit; //展开显示的结束页
        scope.pages = []; //展开显示的分页集合；
        var defaultSize = 20;

        var calcPageRange = function() {
          var pages = [];
          // if(scope.pageCnt<=5){
          //   scope.pageStart
          // }
          var pageExtend = Math.floor(scope.pageCntLimit / 2);
          var start = scope.pageIndex - pageExtend;
          var end = scope.pageIndex + pageExtend;
          if (start <= 1) start = 1;
          if (end >= scope.pageCnt) end = scope.pageCnt;

          scope.pageStart = start;
          scope.pageEnd = end;
          for (var i = start; i <= end; i++) {
            pages.push({
              page: i
            });
          }
          scope.pages = pages;
        };
        var build = function() {
          var pages = [];
          scope.inputPageIndex = scope.pageIndex
          scope.pageSize <= 0 ? (scope.pageSize = defaultSize) : angular.noop;
          scope.totalCnt <= 0 ? (scope.pageCnt = 1) : (scope.pageCnt = Math.ceil(scope.totalCnt / scope.pageSize));

          calcPageRange();


        };
        build();

        scope.watcher = scope.$watch('pageIndex+pageSize+totalCnt', function() {

          build();
        });
        scope.$on('$destroy', function() {

          if (scope.watcher) {

            scope.watcher();
            scope.watcher = null;
          }

        })
      }
    };
  }
])
.controller('wmoPaginationCtrl', ['$scope', '$toaster', '$config', '$locale', '$state', '$rootScope', 'ipCookie', '$timeout',"$stateParams",
  function($scope, $toaster, $config, $locale, $state, $rootScope, ipCookie, $timeout, $stateParams) {

    var triggerPageIndexChanged = function() {
      $timeout(function() {
        $scope.onPageIndexChanged();
      }, 0)
    };
    $scope.clickNextPage = function() {
      if ($scope.pageIndex >= $scope.pageCnt)
        return;
      $scope.pageIndex++;
      $scope.inputPageIndex = $scope.pageIndex;

      triggerPageIndexChanged();

    };
    $scope.clickPrevPage = function() {
      if ($scope.pageIndex <= 1)
        return;
      $scope.pageIndex--;
      $scope.inputPageIndex = $scope.pageIndex;
      triggerPageIndexChanged();
    };
    $scope.clickFirstPage = function() {
      if ($scope.pageIndex <= 1)
        return;
      $scope.pageIndex = 1;
      $scope.inputPageIndex = $scope.pageIndex;
      triggerPageIndexChanged();
    };
    $scope.clickLastPage = function() {
      if ($scope.pageIndex >= $scope.pageCnt)
        return;
      $scope.pageIndex = $scope.pageCnt;
      $scope.inputPageIndex = $scope.pageIndex;
      triggerPageIndexChanged();
    };

    $scope.clickGoToPage = function(pageIndex) {
      pageIndex = pageIndex / 1;
      if (isNaN(pageIndex)) {
        $toaster.warning("请输入合法的页码");


        return;
      }

      if (pageIndex > $scope.pageCnt) {
        $toaster.warning("页码超出范围");
        return;
      }
      if (pageIndex < 1) {
        $toaster.warning("页码超出范围");
        return;
      }

      $scope.pageIndex = pageIndex;
      $scope.inputPageIndex = $scope.pageIndex;
      triggerPageIndexChanged();
    };

    $scope.myKeyup = function(e) {
      var keycode = window.event ? e.keyCode : e.which;
      if (keycode == 13) {
        $scope.clickGoToPage($scope.inputPageIndex);
      }
    };

    $scope.checkNum= function (event,value) {  
      var keyCode = event.keyCode;  
      console.log("ff",keyCode)
      if(value<1){  
        if((keyCode<49||keyCode>57)&&keyCode!=8&&value){  
          $toaster.warning('只能输入正整数1');
          value = value.replace(/\D/g,"");
          // $scope.gotoPage = value;  
      //     event.returnValue = false;  
      //     return false;  
        }  
      }else{  
        if((keyCode<48||keyCode>57)&&keyCode!=8&&value) {  
      //     $scope.gotoPage = 1;  
          $toaster.warning('只能输入正整数2');
          value = value.replace(/\D/g,"");
          // $scope.gotoPage = value;  
      //     event.returnValue = false;  
      //     return false;  
        }  
      }  
    };

  }
]);
