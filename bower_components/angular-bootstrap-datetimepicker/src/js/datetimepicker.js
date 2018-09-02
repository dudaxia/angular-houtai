/*globals define, jQuery */
/*jslint vars:true */

/**
 * @license angular-bootstrap-datetimepicker  version: 0.3.8
 * (c) 2013-2014 Knight Rider Consulting, Inc. http://www.knightrider.com
 * License: MIT
 */

/**
 *
 *    @author        Dale "Ducky" Lotts
 *    @since        2013-Jul-8
 */

(function(factory) {
    'use strict';
    /* istanbul ignore if */
    if (typeof define === 'function' && /* istanbul ignore next */ define.amd) {
        define(['angular', 'moment'], factory); // AMD
    } else {
        factory(window.angular, window.moment); // Browser global
    }
}(function(angular, moment) {
    'use strict';
    angular.module('ui.bootstrap.datetimepicker', [])
        .constant('dateTimePickerConfig', {
            minuteStep: 5,
            minView: 'minute',
            startView: 'day'
        })
        .directive('datetimepicker', ['$log', 'dateTimePickerConfig', function datetimepickerDirective($log, defaultConfig) {

            function DateObject() {

                this.dateValue = new Date().getTime();
                this.selectable = true;

                var validProperties = ['dateValue', 'display', 'active', 'selectable', 'past', 'future'];

                for (var prop in arguments[0]) {
                    /* istanbul ignore else */
                    //noinspection JSUnfilteredForInLoop
                    if (validProperties.indexOf(prop) >= 0) {
                        //noinspection JSUnfilteredForInLoop
                        this[prop] = arguments[0][prop];
                    }
                }
            }

            var validateConfiguration = function validateConfiguration(configuration) {
                // var validOptions = ['startView', 'minView', 'minuteStep', 'format'];

                // for (var prop in configuration) {
                //     //noinspection JSUnfilteredForInLoop
                //     if (validOptions.indexOf(prop) < 0) {
                //         throw ('invalid option: ' + prop);
                //     }
                // }

                // Order of the elements in the validViews array is significant.
                var validViews = ['minute', 'hour', 'day', 'month', 'year'];

                if (validViews.indexOf(configuration.startView) < 0) {
                    throw ('invalid startView value: ' + configuration.startView);
                }

                if (validViews.indexOf(configuration.minView) < 0) {
                    throw ('invalid minView value: ' + configuration.minView);
                }

                if (validViews.indexOf(configuration.minView) > validViews.indexOf(configuration.startView)) {
                    throw ('startView must be greater than minView');
                }

                if (!angular.isNumber(configuration.minuteStep)) {
                    throw ('minuteStep must be numeric');
                }
                if (configuration.minuteStep <= 0 || configuration.minuteStep >= 60) {
                    throw ('minuteStep must be greater than zero and less than 60');
                }


            };
            var configFormat = function(minview) {

                var ViewsFormat = {
                    "minute": "yyyy-MM-dd hh:mm",
                    "hour": "yyyy-MM-dd hh",
                    "day": "yyyy-MM-dd",
                    "month": "yyyy-MM",
                    "year": "yyyy"
                }
                return ViewsFormat[minview] || ViewsFormat["minute"]
            }
            return {
                restrict: 'E',
                require: 'ngModel',
                template: '<div class="datetimepicker table-responsive">' +
                    '<table class="table">' +
                    '   <thead>' +
                    '       <tr>' +
                    '           <th class="left" data-ng-click="changeView(data.currentView, data.leftDate, $event)" data-ng-show="data.leftDate.selectable"><i class="fa fa-chevron-left"></i></th>' +
                    '           <th class="switch" colspan="5" data-ng-show="data.previousViewDate.selectable" data-ng-click="changeView(data.previousView, data.previousViewDate, $event)">{{ data.previousViewDate.display }}</th>' +
                    '           <th class="right" data-ng-click="changeView(data.currentView, data.rightDate, $event)" data-ng-show="data.rightDate.selectable"><i class="fa fa-chevron-right"></i></th>' +
                    '       </tr>' +
                    '       <tr>' +
                    '           <th class="dow" data-ng-repeat="day in data.dayNames" >{{ day }}</th>' +
                    '       </tr>' +
                    '   </thead>' +
                    '   <tbody>' +
                    '       <tr data-ng-if="data.currentView !== \'day\'" >' +
                    '           <td colspan="7" >' +
                    '              <span    class="{{ data.currentView }}" ' +
                    '                       data-ng-repeat="dateObject in data.dates"  ' +
                    '                       data-ng-class="{active: dateObject.active, past: dateObject.past, future: dateObject.future, disabled: !dateObject.selectable}" ' +
                    '                       data-ng-click="changeView(data.nextView, dateObject, $event)">{{ dateObject.display }}</span> ' +
                    '           </td>' +
                    '       </tr>' +
                    '       <tr data-ng-if="data.currentView === \'day\'" data-ng-repeat="week in data.weeks">' +
                    '           <td data-ng-repeat="dateObject in week.dates" ' +
                    '               data-ng-click="changeView(data.nextView, dateObject, $event)"' +
                    '               class="day" ' +
                    '               data-ng-class="{active: dateObject.active, past: dateObject.past, future: dateObject.future, disabled: !dateObject.selectable}" >{{ dateObject.display }}</td>' +
                    '       </tr>' +
                    '   </tbody>' +
                    '</table></div>',
                scope: {
                    onSetTime: '&',
                    beforeRender: '&',
                    isOpen: '=?'
                },
                replace: true,
                link: function link(scope, element, attrs, ngModelController) {

                    var directiveConfig = {};
                    directiveConfig = attrs;
                    var configuration = {};
                    angular.extend(configuration, defaultConfig, directiveConfig);
                    validateConfiguration(configuration);
                    configuration.format = configFormat(configuration.minView);
                    
                    var startOfDecade = function startOfDecade(unixDate) {
                        var startYear = (parseInt(moment.utc(unixDate).year() / 10, 10) * 10);
                        return moment.utc(unixDate).year(startYear).startOf('year');
                    };

                    var dataFactory = {
                        year: function year(unixDate) {
                            var selectedDate = moment.utc(unixDate).startOf('year');
                            // View starts one year before the decade starts and ends one year after the decade ends
                            // i.e. passing in a date of 1/1/2013 will give a range of 2009 to 2020
                            // Truncate the last digit from the current year and subtract 1 to get the start of the decade
                            var startDecade = (parseInt(selectedDate.year() / 10, 10) * 10);
                            var startDate = moment.utc(startOfDecade(unixDate)).subtract(1, 'year').startOf('year');

                            var activeYear = ngModelController.$modelValue ? moment(ngModelController.$modelValue).year() : 0;

                            var result = {
                                'currentView': 'year',
                                'nextView': configuration.minView === 'year' ? 'setTime' : 'month',
                                'previousViewDate': new DateObject({
                                    dateValue: null,
                                    display: startDecade + '-' + (startDecade + 9)
                                }),
                                'leftDate': new DateObject({
                                    dateValue: moment.utc(startDate).subtract(9, 'year').valueOf()
                                }),
                                'rightDate': new DateObject({
                                    dateValue: moment.utc(startDate).add(11, 'year').valueOf()
                                }),
                                'dates': []
                            };

                            for (var i = 0; i < 12; i += 1) {
                                var yearMoment = moment.utc(startDate).add(i, 'years');
                                var dateValue = {
                                    'dateValue': yearMoment.valueOf(),
                                    'display': yearMoment.format('YYYY'),
                                    'past': yearMoment.year() < startDecade,
                                    'future': yearMoment.year() > startDecade + 9,
                                    'active': yearMoment.year() === activeYear
                                };

                                result.dates.push(new DateObject(dateValue));
                            }

                            return result;
                        },

                        month: function month(unixDate) {

                            var startDate = moment.utc(unixDate).startOf('year');
                            var previousViewDate = startOfDecade(unixDate);
                            var activeDate = ngModelController.$modelValue ? moment(ngModelController.$modelValue).format('YYYY-MMM') : 0;

                            var result = {
                                'previousView': 'year',
                                'currentView': 'month',
                                'nextView': configuration.minView === 'month' ? 'setTime' : 'day',
                                'previousViewDate': new DateObject({
                                    dateValue: previousViewDate.valueOf(),
                                    display: startDate.format('YYYY')
                                }),
                                'leftDate': new DateObject({
                                    dateValue: moment.utc(startDate).subtract(1, 'year').valueOf()
                                }),
                                'rightDate': new DateObject({
                                    dateValue: moment.utc(startDate).add(1, 'year').valueOf()
                                }),
                                'dates': []
                            };

                            for (var i = 0; i < 12; i += 1) {
                                var monthMoment = moment.utc(startDate).add(i, 'months');
                                var dateValue = {
                                    'dateValue': monthMoment.valueOf(),
                                    'display': monthMoment.format('MMM'),
                                    'active': monthMoment.format('YYYY-MMM') === activeDate
                                };

                                result.dates.push(new DateObject(dateValue));
                            }

                            return result;
                        },

                        day: function day(unixDate) {

                            var selectedDate = moment.utc(unixDate);
                            var startOfMonth = moment.utc(selectedDate).startOf('month');
                            var previousViewDate = moment.utc(selectedDate).startOf('year');
                            var endOfMonth = moment.utc(selectedDate).endOf('month');

                            var startDate = moment.utc(startOfMonth).subtract(Math.abs(startOfMonth.weekday()), 'days');

                            var activeDate = ngModelController.$modelValue ? moment(ngModelController.$modelValue).format('YYYY-MMM-DD') : '';

                            var result = {
                                'previousView': 'month',
                                'currentView': 'day',
                                'nextView': configuration.minView === 'day' ? 'setTime' : 'hour',
                                'previousViewDate': new DateObject({
                                    dateValue: previousViewDate.valueOf(),
                                    display: startOfMonth.format('YYYY-MM')
                                }),
                                'leftDate': new DateObject({
                                    dateValue: moment.utc(startOfMonth).subtract(1, 'months').valueOf()
                                }),
                                'rightDate': new DateObject({
                                    dateValue: moment.utc(startOfMonth).add(1, 'months').valueOf()
                                }),
                                'dayNames': [],
                                'weeks': []
                            };


                            for (var dayNumber = 0; dayNumber < 7; dayNumber += 1) {
                                result.dayNames.push(moment.utc().weekday(dayNumber).format('dd'));
                            }

                            for (var i = 0; i < 6; i += 1) {
                                var week = {
                                    dates: []
                                };
                                for (var j = 0; j < 7; j += 1) {
                                    var monthMoment = moment.utc(startDate).add((i * 7) + j, 'days');
                                    var dateValue = {
                                        'dateValue': monthMoment.valueOf(),
                                        'display': monthMoment.format('D'),
                                        'active': monthMoment.format('YYYY-MMM-DD') === activeDate,
                                        'past': monthMoment.isBefore(startOfMonth),
                                        'future': monthMoment.isAfter(endOfMonth)
                                    };
                                    week.dates.push(new DateObject(dateValue));
                                }
                                result.weeks.push(week);
                            }

                            return result;
                        },

                        hour: function hour(unixDate) {
                            var selectedDate = moment.utc(unixDate).startOf('day');
                            var previousViewDate = moment.utc(selectedDate).startOf('month');

                            var activeFormat = ngModelController.$modelValue ? moment(ngModelController.$modelValue).format('YYYY-MM-DD H') : '';

                            var result = {
                                'previousView': 'day',
                                'currentView': 'hour',
                                'nextView': configuration.minView === 'hour' ? 'setTime' : 'minute',
                                'previousViewDate': new DateObject({
                                    dateValue: previousViewDate.valueOf(),
                                    display: selectedDate.format('YYYY-MM-DD')
                                }),
                                'leftDate': new DateObject({
                                    dateValue: moment.utc(selectedDate).subtract(1, 'days').valueOf()
                                }),
                                'rightDate': new DateObject({
                                    dateValue: moment.utc(selectedDate).add(1, 'days').valueOf()
                                }),
                                'dates': []
                            };

                            for (var i = 0; i < 24; i += 1) {
                                var hourMoment = moment.utc(selectedDate).add(i, 'hours');
                                var dateValue = {
                                    'dateValue': hourMoment.valueOf(),
                                    'display': hourMoment.format('HH') + ':00',
                                    'active': hourMoment.format('YYYY-MM-DD H') === activeFormat
                                };

                                result.dates.push(new DateObject(dateValue));
                            }

                            return result;
                        },

                        minute: function minute(unixDate) {
                            var selectedDate = moment.utc(unixDate).startOf('hour');
                            var previousViewDate = moment.utc(selectedDate).startOf('day');
                            var activeFormat = ngModelController.$modelValue ? moment(ngModelController.$modelValue).format('YYYY-MM-DD H:mm') : '';

                            var result = {
                                'previousView': 'hour',
                                'currentView': 'minute',
                                'nextView': 'setTime',
                                'previousViewDate': new DateObject({
                                    dateValue: previousViewDate.valueOf(),
                                    display: selectedDate.format('YYYY-MM-DD')
                                }),
                                'leftDate': new DateObject({
                                    dateValue: moment.utc(selectedDate).subtract(1, 'hours').valueOf()
                                }),
                                'rightDate': new DateObject({
                                    dateValue: moment.utc(selectedDate).add(1, 'hours').valueOf()
                                }),
                                'dates': []
                            };

                            var limit = 60 / configuration.minuteStep;

                            for (var i = 0; i < limit; i += 1) {
                                var hourMoment = moment.utc(selectedDate).add(i * configuration.minuteStep, 'minute');
                                var dateValue = {
                                    'dateValue': hourMoment.valueOf(),
                                    'display': hourMoment.format('HH:mm'),
                                    'active': hourMoment.format('YYYY-MM-DD H:mm') === activeFormat
                                };

                                result.dates.push(new DateObject(dateValue));
                            }

                            return result;
                        },

                        setTime: function setTime(unixDate) {

                            var tempDate = new Date(unixDate);
                            var newDate = new Date(tempDate.getTime() + (tempDate.getTimezoneOffset() * 60000));

                            var oldDate = ngModelController.$modelValue;

                            ngModelController.$setViewValue(newDate.format(configuration.format));
                            if (!angular.isUndefined(scope.isOpen)) {
                                scope.isOpen = !scope.isOpen;
                            };
                            scope.onSetTime({
                                newDate: newDate,
                                oldDate: oldDate
                            });

                            return dataFactory[configuration.startView](unixDate);
                        }
                    };

                    var getUTCTime = function getUTCTime(modelValue) {
                        var tempDate = (modelValue ? moment(modelValue).toDate() : new Date());
                        return tempDate.getTime() - (tempDate.getTimezoneOffset() * 60000);
                    };

                    scope.changeView = function changeView(viewName, dateObject, event) {
                        if (event) {
                            event.stopPropagation();
                            event.preventDefault();
                        }

                        if (viewName && (dateObject.dateValue > -Infinity) && dateObject.selectable && dataFactory[viewName]) {
                            var result = dataFactory[viewName](dateObject.dateValue);

                            var weekDates = [];
                            if (result.weeks) {
                                for (var i = 0; i < result.weeks.length; i += 1) {
                                    var week = result.weeks[i];
                                    for (var j = 0; j < week.dates.length; j += 1) {
                                        var weekDate = week.dates[j];
                                        weekDates.push(weekDate);
                                    }
                                }
                            }

                            scope.beforeRender({
                                $view: result.currentView,
                                $dates: result.dates || weekDates,
                                $leftDate: result.leftDate,
                                $upDate: result.previousViewDate,
                                $rightDate: result.rightDate
                            });

                            scope.data = result;
                        }
                    };

                    ngModelController.$render = function $render() {
                        scope.changeView(configuration.startView, new DateObject({
                            dateValue: getUTCTime(ngModelController.$viewValue)
                        }));
                    };
                }
            };
        }]);
}));
