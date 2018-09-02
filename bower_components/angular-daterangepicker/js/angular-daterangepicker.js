(function() {
    var picker;

    picker = angular.module('daterangepicker', []);

    picker.value('dateRangePickerConfig', {
        separator: ' - ',
        format: 'YYYY/MM/DD',
        applyClass: 'btn-primary',
        locale: {
            applyLabel: '确定',
            cancelLabel: '取消',
            fromLabel: '开始时间',
            toLabel: '结束时间',
            weekLabel: 'W',
            customRangeLabel: '自定义范围'
        }
    });
    picker.factory('$dateRange', ['dateRangePickerConfig', function(dateRangePickerConfig) {
        var dateRange = function(start, end) {
            return {
                startDate: start,
                endDate: end,
                diffDay: end.diff(start, "days"),
                toString: start.format(dateRangePickerConfig.format) + ' - ' + end.format(dateRangePickerConfig.format)
            }
        }
        var format = function(start, end) {
            if (typeof start == "string") {
                start = moment(start);
            }
            if (typeof end == "string") {
                end = moment(end);
            }
            return dateRange(start, end)
        };
        return {
            formatObject: function(date) {
                var start = date.startDate,
                    end = date.endDate;
                return format(start, end);
            },
            format: function(start, end) {
                return format(start, end);
            },

            convert: function(str) { //
                var time = str.split("-");
                var t1 = moment(time[0]);
                var t2 = moment(time[1]);
                return dateRange(t1, t2)
            },
            defaultDate: {
                startDate: moment().subtract('days', 6),
                endDate: moment()
            },
            defaultDateOne: {
                startDate: moment().subtract('days', 0),
                endDate: moment()
            }
        };
    }])

    picker.directive('dateRangePicker', ['$compile', '$timeout', '$parse', 'dateRangePickerConfig', '$dateRange', function($compile, $timeout, $parse, dateRangePickerConfig,$dateRange) {
        return {
            require: 'ngModel',
            restrict: 'A',
            scope: {
                dateMin: '=min',
                dateMax: '=max',
                opts: '=options'
            },
            link: function($scope, element, attrs, modelCtrl) {
                var customOpts, el, opts, _formatted, _getPicker, _init, _validateMax, _validateMin;
                el = $(element),newdateRange=null;
                customOpts = $parse(attrs.dateRangePicker)($scope, {});
                var postion = el.data("position") || "right",
                    min = el.data("mindate") || false,
                    max = el.data("maxdate") || false,
                    config=el.data("config");
                    var defaultConfig=$dateRange.defaultDate;
                    if(config){
                        if($dateRange[config]){
                            defaultConfig=$dateRange[config];
                        }
                        
                    }
                    if(max=="now"){
                        max=moment();
                    }
                    var defaults={};
                    newdateRange = modelCtrl.$viewValue ? $dateRange.formatObject(modelCtrl.$viewValue) : $dateRange.formatObject(defaultConfig);
                    defaults = {
                        ranges: {
                            '今天': [moment(), moment()],
                            '昨天': [moment().subtract('days', 1), moment().subtract('days', 1)],
                            '最近7天': [moment().subtract('days', 6), moment()],
                            '最近30天': [moment().subtract('days', 29), moment()],
                            '这个月': [moment().startOf('month'), moment().endOf('month')],
                            '上个月': [moment().subtract('month', 1).startOf('month'), moment().subtract('month', 1).endOf('month')]
                        },
                        minDate: min,
                        maxDate: max,
                        opens: postion,
                        startDate: newdateRange.startDate || moment(),
                        endDate: newdateRange.endDate || moment()
                    };
                
                opts = angular.extend({}, dateRangePickerConfig, customOpts,defaults);
                _formatted = function(viewVal) {
                    var f;
                    f = function(date) {
                        if (!moment.isMoment(date)) {
                            return moment(date).format(opts.format);
                        }
                        return date.format(opts.format);
                    };
                    return [f(viewVal.startDate), f(viewVal.endDate)].join(opts.separator);
                };
                _validateMin = function(min, start) {
                    var valid;
                    min = moment(min);
                    start = moment(start);
                    valid = min.isBefore(start) || min.isSame(start, 'day');
                    modelCtrl.$setValidity('min', valid);
                    return valid;
                };
                _validateMax = function(max, end) {
                    var valid;
                    max = moment(max);
                    end = moment(end);
                    valid = max.isAfter(end) || max.isSame(end, 'day');
                    modelCtrl.$setValidity('max', valid);
                    return valid;
                };
                modelCtrl.$formatters.push(function(val) {
                    if (val && val.startDate && val.endDate) {
                        picker = _getPicker();
                        picker.setStartDate(val.startDate);
                        picker.setEndDate(val.endDate);
                        return val;
                    }
                    return '';
                });
                modelCtrl.$parsers.push(function(val) {
                    if (!angular.isObject(val) || !(val.hasOwnProperty('startDate') && val.hasOwnProperty('endDate'))) {
                        return modelCtrl.$modelValue;
                    }
                    if ($scope.dateMin && val.startDate) {
                        _validateMin($scope.dateMin, val.startDate);
                    } else {
                        modelCtrl.$setValidity('min', true);
                    }
                    if ($scope.dateMax && val.endDate) {
                        _validateMax($scope.dateMax, val.endDate);
                    } else {
                        modelCtrl.$setValidity('max', true);
                    }
                    return val;
                });
                modelCtrl.$isEmpty = function(val) {
                    return !val || (val.startDate === null || val.endDate === null);
                };
                modelCtrl.$render = function() {
                    if(!modelCtrl.$viewValue&&config){
                        modelCtrl.$setViewValue({
                            startDate: $dateRange.formatObject(defaultConfig).startDate._d,
                            endDate:$dateRange.formatObject(defaultConfig).endDate._d
                        });
                    }
                    if (!modelCtrl.$viewValue) {
                        return el.val('');
                    }
                    if (modelCtrl.$viewValue.startDate === null) {
                        return el.val('');
                    }
                    if (el.find("span").length) {
                        el.find("span").html(_formatted(modelCtrl.$viewValue));
                    }
                    return el.val(_formatted(modelCtrl.$viewValue));
                };
                _init = function() {
                    return el.daterangepicker(opts, function(start, end, label) {
                        return $timeout(function() {
                            return $scope.$apply(function() {
                                if(el.find("span").length){
                                    el.find("span").html(moment(start).format(opts.format)+opts.separator+moment(end).format(opts.format));
                                }
                                modelCtrl.$setViewValue({
                                    startDate: start.toDate(),
                                    endDate: end.toDate()
                                });
                                el.blur();
                                return modelCtrl.$render();
                            });
                        });
                    });
                };
                _getPicker = function() {
                    return el.data('daterangepicker');
                };
                _init();
                el.change(function() {
                    if ($.trim(el.val()) === '') {
                        return $timeout(function() {
                            return $scope.$apply(function() {
                                return modelCtrl.$setViewValue({
                                    startDate: null,
                                    endDate: null
                                });
                            });
                        });
                    }
                });
                if (attrs.min) {
                    $scope.$watch('dateMin', function(date) {
                        if (date) {
                            if (!modelCtrl.$isEmpty(modelCtrl.$viewValue)) {
                                _validateMin(date, modelCtrl.$viewValue.startDate);
                            }
                            opts['minDate'] = moment(date);
                        } else {
                            opts['minDate'] = false;
                        }
                        return _init();
                    });
                }
                if (attrs.max) {
                    $scope.$watch('dateMax', function(date) {
                        if (date) {
                            if (!modelCtrl.$isEmpty(modelCtrl.$viewValue)) {
                                _validateMax(date, modelCtrl.$viewValue.endDate);
                            }
                            opts['maxDate'] = moment(date);
                        } else {
                            opts['maxDate'] = false;
                        }
                        return _init();
                    });
                }
                if (attrs.options) {
                    return $scope.$watch('opts', function(newOpts) {
                        opts = angular.extend({}, opts, newOpts);
                        return _init();
                    });
                }
            }
        };
    }]);
    picker.directive('dateRangePickerNew', ['$compile', '$timeout', '$parse', 'dateRangePickerConfig', '$dateRange', function($compile, $timeout, $parse, dateRangePickerConfig, $dateRange) {
        return {
            require: 'ngModel',
            restrict: 'A',
            scope: {
                dateMin: '=min',
                dateMax: '=max',
                opts: '=options'
            },
            link: function($scope, element, attrs, modelCtrl) {
                var customOpts, el, opts, _formatted, _getPicker, _init, _validateMax, _validateMin;
                el = $(element), newdateRange = null;
                customOpts = $parse(attrs.dateRangePicker)($scope, {});
                var postion = el.data("position") || "right",
                    min = el.data("mindate") || false,
                    max = el.data("maxdate") || false,
                    config = el.data("config");
                var defaultConfig = $dateRange.defaultDate;
                if (config) {
                    if ($dateRange[config]) {
                        defaultConfig = $dateRange[config];
                    }

                }
                if (max == "now") {
                    max = moment();
                }
                var defaults = {};
                newdateRange = modelCtrl.$viewValue ? $dateRange.formatObject(modelCtrl.$viewValue) : $dateRange.formatObject(defaultConfig);
                defaults = {
                    ranges: {
                        '今天': [moment(), moment()],
                        '昨天': [moment().subtract('days', 1), moment().subtract('days', 1)],
                        '最近7天': [moment().subtract('days', 6), moment()],
                        '最近30天': [moment().subtract('days', 29), moment()],
                        '这个月': [moment().startOf('month'), moment().endOf('month')],
                        '上个月': [moment().subtract('month', 1).startOf('month'), moment().subtract('month', 1).endOf('month')]
                    },
                    minDate: min,
                    maxDate: max,
                    opens: postion,
                    startDate: newdateRange.startDate || moment(),
                    endDate: newdateRange.endDate || moment()
                };

                opts = angular.extend({}, dateRangePickerConfig, customOpts, defaults);
                _formatted = function(viewVal) {
                    var f;
                    f = function(date) {
                        if (!moment.isMoment(date)) {
                            return moment(date).format(opts.format);
                        }
                        return date.format(opts.format);
                    };
                    return [f(viewVal.startDate), f(viewVal.endDate)].join(opts.separator);
                };
                _validateMin = function(min, start) {
                    var valid;
                    min = moment(min);
                    start = moment(start);
                    valid = min.isBefore(start) || min.isSame(start, 'day');
                    modelCtrl.$setValidity('min', valid);
                    return valid;
                };
                _validateMax = function(max, end) {
                    var valid;
                    max = moment(max);
                    end = moment(end);
                    valid = max.isAfter(end) || max.isSame(end, 'day');
                    modelCtrl.$setValidity('max', valid);
                    return valid;
                };
                modelCtrl.$formatters.push(function(val) {
                    if (val && val.startDate && val.endDate) {
                        picker = _getPicker();
                        picker.setStartDate(val.startDate);
                        picker.setEndDate(val.endDate);
                        return val;
                    }
                    return '';
                });
                modelCtrl.$parsers.push(function(val) {
                    if (!angular.isObject(val) || !(val.hasOwnProperty('startDate') && val.hasOwnProperty('endDate'))) {
                        return modelCtrl.$modelValue;
                    }
                    if ($scope.dateMin && val.startDate) {
                        _validateMin($scope.dateMin, val.startDate);
                    } else {
                        modelCtrl.$setValidity('min', true);
                    }
                    if ($scope.dateMax && val.endDate) {
                        _validateMax($scope.dateMax, val.endDate);
                    } else {
                        modelCtrl.$setValidity('max', true);
                    }
                    return val;
                });
                modelCtrl.$isEmpty = function(val) {
                    return !val || (val.startDate === null || val.endDate === null);
                };
                modelCtrl.$render = function() {
                    if (!modelCtrl.$viewValue && config) {
                        modelCtrl.$setViewValue({
                            startDate: $dateRange.formatObject(defaultConfig).startDate._d,
                            endDate: $dateRange.formatObject(defaultConfig).endDate._d
                        });
                    }
                    if (!modelCtrl.$viewValue) {
                        return el.val('');
                    }
                    if (modelCtrl.$viewValue.startDate === null) {
                        return el.val('');
                    }
                    if (el.find("span").length) {
                        el.find("span").html(_formatted(modelCtrl.$viewValue));
                    }
                    return el.val(_formatted(modelCtrl.$viewValue));
                };
                _init = function() {
                    return el.daterangepicker(opts, function(start, end, label) {
                        return $timeout(function() {
                            return $scope.$apply(function() {
                                if (el.find("span").length) {
                                    el.find("span").html(moment(start).format(opts.format) + opts.separator + moment(end).format(opts.format));
                                }
                                modelCtrl.$setViewValue({
                                    startDate: start.toDate(),
                                    endDate: end.toDate()
                                });
                                el.blur();
                                return modelCtrl.$render();
                            });
                        });
                    });
                };
                _getPicker = function() {
                    return el.data('daterangepicker');
                };
                _init();
                el.change(function() {
                    if ($.trim(el.val()) === '') {
                        return $timeout(function() {
                            return $scope.$apply(function() {
                                return modelCtrl.$setViewValue({
                                    startDate: null,
                                    endDate: null
                                });
                            });
                        });
                    }
                });
                if (attrs.min) {
                    $scope.$watch('dateMin', function(date) {
                        if (date) {
                            if (!modelCtrl.$isEmpty(modelCtrl.$viewValue)) {
                                _validateMin(date, modelCtrl.$viewValue.startDate);
                            }
                            opts['minDate'] = moment(date);
                        } else {
                            opts['minDate'] = false;
                        }
                        return _init();
                    });
                }
                if (attrs.max) {
                    $scope.$watch('dateMax', function(date) {
                        if (date) {
                            if (!modelCtrl.$isEmpty(modelCtrl.$viewValue)) {
                                _validateMax(date, modelCtrl.$viewValue.endDate);
                            }
                            opts['maxDate'] = moment(date);
                        } else {
                            opts['maxDate'] = false;
                        }
                        return _init();
                    });
                }
                if (attrs.options) {
                    return $scope.$watch('opts', function(newOpts) {
                        opts = angular.extend({}, opts, newOpts);
                        return _init();
                    });
                }
            }
        };
    }]);
    picker.directive('reportRange', ['dateRangePickerConfig', '$dateRange', function(dateRangePickerConfig, $dateRange) {
        return {
            restrict: 'A',
            template: '<span class="input-group-addon"><i class="fa fa-calendar fa-lg"></i><small class="daterangepicker-title">{{title}}</small></span><input  class="form-control input-sm" value="{{str}}" type="text"  readonly="" /> <span class="input-group-addon"><b class="caret" ></b></span>',
            require: 'ngModel',
            scope: {
                title: '@',
                opts: '=options'
            },
            link: function(scope, iElement, iAttrs, ngModelCtrl) {
                var opts = angular.extend({}, dateRangePickerConfig, scope.opts);
                var $this = $(iElement),
                    newdateRange = null;
                ngModelCtrl.$render = function() {
                    newdateRange = ngModelCtrl.$viewValue ? $dateRange.formatObject(ngModelCtrl.$viewValue) : $dateRange.formatObject($dateRange.defaultDate)
                    return init();
                }


                var init = function() {
                    scope.str = newdateRange.toString;
                    var postion = $this.data("position") || "right",
                        min = $this.data("mindate") || false,
                        max = $this.data("maxdate") || false,
                        datelimit = $this.data("datelimit") || false;
                    var datelimitobj = false;
                    if (datelimit) {
                        var arrs = datelimit.split(",");
                        switch (arrs[0]) {
                            case "months":
                                datelimitobj = {
                                    months: arrs[1] - 0
                                };
                                break;
                            case "days":
                                datelimitobj = {
                                    days: arrs[1] - 0
                                };
                                break;
                        }
                    }
                    var defaults = {
                        ranges: {
                            '今天': [moment(), moment()],
                            '昨天': [moment().subtract('days', 1), moment().subtract('days', 1)],
                            '最近7天': [moment().subtract('days', 6), moment()],
                            '最近30天': [moment().subtract('days', 29), moment()],
                            '这个月': [moment().startOf('month'), moment().endOf('month')],
                            '上个月': [moment().subtract('month', 1).startOf('month'), moment().subtract('month', 1).endOf('month')]
                        },
                        minDate: min,
                        maxDate: max,
                        dateLimit: datelimitobj,
                        opens: postion,
                        startDate: newdateRange.startDate || moment(),
                        endDate: newdateRange.endDate || moment()
                    };
                    opts = angular.extend({}, opts, defaults);

                    $this.daterangepicker(opts,
                        function(start, end, label) {
                            var startstr = start.format(dateRangePickerConfig.format),
                                endstr = end.format(dateRangePickerConfig.format);
                            var datestr = "{0} - {1}".format(startstr, endstr);
                            $('input', $this).val(datestr);
                            scope.$apply(function() {
                                ngModelCtrl.$setViewValue($dateRange.format(start, end));
                            })
                        }
                    );
                }
            }
        };
    }])
    picker.directive('dateRangePickerSearch', ['$compile', '$timeout', '$parse', 'dateRangePickerConfig', '$dateRange', function($compile, $timeout, $parse, dateRangePickerConfig, $dateRange) {
        return {
            require: 'ngModel',
            restrict: 'A',
            scope: {
                dateMin: '=min',
                dateMax: '=max',
                opts: '=options'
            },
            link: function($scope, element, attrs, modelCtrl) {
                var customOpts, el, opts, _formatted, _getPicker, _init, _validateMax, _validateMin;
                el = $(element), newdateRange = null;
                customOpts = $parse(attrs.dateRangePicker)($scope, {});
                var postion = el.data("position") || "right",
                    min = el.data("mindate") || false,
                    max = el.data("maxdate") || false,
                    config = el.data("config"),
                    one = el.data("now"),
                    defaultConfig = $dateRange.defaultDate;
                if (one) {
                    defaultConfig = $dateRange.defaultDateOne
                }
                var defaults = {};
                if (config) {
                    newdateRange = modelCtrl.$viewValue ? $dateRange.formatObject(modelCtrl.$viewValue) : $dateRange.formatObject(defaultConfig);
                    defaults = {
                        minDate: min,
                        maxDate: max,
                        opens: postion,
                        startDate: newdateRange.startDate || moment(),
                        endDate: newdateRange.endDate || moment()
                    };
                }

                opts = angular.extend({}, dateRangePickerConfig, customOpts, defaults);
                _formatted = function(viewVal) {
                    var f;
                    f = function(date) {
                        if (!moment.isMoment(date)) {
                            return moment(date).format(opts.format);
                        }
                        return date.format(opts.format);
                    };
                    return [f(viewVal.startDate), f(viewVal.endDate)].join(opts.separator);
                };
                _validateMin = function(min, start) {
                    var valid;
                    min = moment(min);
                    start = moment(start);
                    valid = min.isBefore(start) || min.isSame(start, 'day');
                    modelCtrl.$setValidity('min', valid);
                    return valid;
                };
                _validateMax = function(max, end) {
                    var valid;
                    max = moment(max);
                    end = moment(end);
                    valid = max.isAfter(end) || max.isSame(end, 'day');
                    modelCtrl.$setValidity('max', valid);
                    return valid;
                };
                modelCtrl.$formatters.push(function(val) {
                    if (val && val.startDate && val.endDate) {
                        picker = _getPicker();
                        picker.setStartDate(val.startDate);
                        picker.setEndDate(val.endDate);
                        return val;
                    }
                    return '';
                });
                modelCtrl.$parsers.push(function(val) {
                    if (!angular.isObject(val) || !(val.hasOwnProperty('startDate') && val.hasOwnProperty('endDate'))) {
                        return modelCtrl.$modelValue;
                    }
                    if ($scope.dateMin && val.startDate) {
                        _validateMin($scope.dateMin, val.startDate);
                    } else {
                        modelCtrl.$setValidity('min', true);
                    }
                    if ($scope.dateMax && val.endDate) {
                        _validateMax($scope.dateMax, val.endDate);
                    } else {
                        modelCtrl.$setValidity('max', true);
                    }
                    return val;
                });
                modelCtrl.$isEmpty = function(val) {
                    return !val || (val.startDate === null || val.endDate === null);
                };
                modelCtrl.$render = function() {
                    if (!modelCtrl.$viewValue && config) {
                        modelCtrl.$setViewValue({
                            startDate: $dateRange.formatObject(defaultConfig).startDate._d,
                            endDate: $dateRange.formatObject(defaultConfig).endDate._d
                        });
                    }
                    if (!modelCtrl.$viewValue) {
                        return el.val('');
                    }
                    if (modelCtrl.$viewValue.startDate === null) {
                        return el.val('');
                    }

                    return el.val(_formatted(modelCtrl.$viewValue));
                };
                _init = function() {
                    return el.daterangepicker(opts, function(start, end, label) {
                        return $timeout(function() {
                            return $scope.$apply(function() {
                                modelCtrl.$setViewValue({
                                    startDate: start.toDate(),
                                    endDate: end.toDate()
                                });
                                return modelCtrl.$render();
                            });
                        });
                    });
                };
                _getPicker = function() {
                    return el.data('daterangepicker');
                };
                _init();
                el.change(function() {
                    if ($.trim(el.val()) === '') {
                        return $timeout(function() {
                            return $scope.$apply(function() {
                                return modelCtrl.$setViewValue({
                                    startDate: null,
                                    endDate: null
                                });
                            });
                        });
                    }
                });
                if (attrs.min) {
                    $scope.$watch('dateMin', function(date) {
                        if (date) {
                            if (!modelCtrl.$isEmpty(modelCtrl.$viewValue)) {
                                _validateMin(date, modelCtrl.$viewValue.startDate);
                            }
                            opts['minDate'] = moment(date);
                        } else {
                            opts['minDate'] = false;
                        }
                        return _init();
                    });
                }
                if (attrs.max) {
                    $scope.$watch('dateMax', function(date) {
                        if (date) {
                            if (!modelCtrl.$isEmpty(modelCtrl.$viewValue)) {
                                _validateMax(date, modelCtrl.$viewValue.endDate);
                            }
                            opts['maxDate'] = moment(date);
                        } else {
                            opts['maxDate'] = false;
                        }
                        return _init();
                    });
                }
                if (attrs.options) {
                    return $scope.$watch('opts', function(newOpts) {
                        opts = angular.extend({}, opts, newOpts);
                        return _init();
                    });
                }
            }
        };
    }]);

}).call(this);