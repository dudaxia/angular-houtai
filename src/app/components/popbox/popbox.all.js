 'use strict';

 angular.module('ngTicket').provider('$Popbox', function() {

         var $PopboxProvider = {
             options: {
                 keyboard: true
             },
             $get: ["$window", "$document", '$injector', '$rootScope', '$q', '$http', '$templateCache', '$controller', '$position', '$compile', '$timeout',
                 function($window, $document, $injector, $rootScope, $q, $http, $templateCache, $controller, $position, $compile, $timeout) {


                     function popboxxFactory(modalOptions) {
                         var $Popbox = {};
                         var openedPopup = null;
                         var padding = 10;
                         var template = '<div class="popover fade {{placement}}" ><div class="arrow"></div> <div class="popover-inner">{0}</div></div>';

                         function getTemplatePromise(options) {
                             return options.template ? $q.when(options.template) :
                                 $http.get(angular.isFunction(options.templateUrl) ? (options.templateUrl)() : options.templateUrl, {
                                     cache: $templateCache
                                 }).then(function(result) {
                                     return result.data;
                                 });
                         }

                         function getResolvePromises(resolves) {
                             var promisesArr = [];
                             angular.forEach(resolves, function(value) {
                                 if (angular.isFunction(value) || angular.isArray(value)) {
                                     promisesArr.push($q.when($injector.invoke(value)));
                                 }
                             });
                             return promisesArr;
                         }

                         function loseFocus(e) {

                             if (openedPopup && !$.contains(openedPopup.el[0], e.target)) {
                                 hidePopup();
                             }
                         }

                         function hidePopup(result) {
                             if (!openedPopup) {
                                 return;
                             }

                             var popup = openedPopup;
                             openedPopup = null;
                             $timeout(function() {
                                 popup.el.hide().remove();
                                 popup.resultDeferred.resolve(result || false);
                                 popup.options.scope.isOpen = false;
                                 $document.off('click', loseFocus);

                             });
                         }

                         function getStyle(el, cssprop) {
                             if (el.currentStyle) { //IE
                                 return el.currentStyle[cssprop];
                             } else if ($window.getComputedStyle) {
                                 return $window.getComputedStyle(el)[cssprop];
                             }
                             // finally try and get inline style
                             return el.style[cssprop];
                         }

                         function isStaticPositioned(element) {
                             return (getStyle(element, 'position') || 'static') === 'static';
                         }

                         function parentOffsetEl(element) {
                             var docDomEl = $document[0];
                             var offsetParent = element.offsetParent || docDomEl;
                             while (offsetParent && offsetParent !== docDomEl && isStaticPositioned(offsetParent)) {
                                 offsetParent = offsetParent.offsetParent;
                             }
                             return offsetParent || docDomEl;
                         }

                         function position(element) {
                             var elBCR = offset(element);
                             var offsetParentBCR = {
                                 top: 0,
                                 left: 0
                             };
                             var offsetParentEl = parentOffsetEl(element[0]);
                             if (offsetParentEl != $document[0]) {
                                 offsetParentBCR = offset(angular.element(offsetParentEl));
                                 offsetParentBCR.top += offsetParentEl.clientTop - offsetParentEl.scrollTop;
                                 offsetParentBCR.left += offsetParentEl.clientLeft - offsetParentEl.scrollLeft;
                             }

                             var boundingClientRect = element[0].getBoundingClientRect();
                             return {
                                 width: boundingClientRect.width || element.prop('offsetWidth'),
                                 height: boundingClientRect.height || element.prop('offsetHeight'),
                                 top: elBCR.top - offsetParentBCR.top,
                                 left: elBCR.left - offsetParentBCR.left
                             };
                         }

                         function offset(el) {
                             var rect = el[0].getBoundingClientRect();
                             return {
                                 width: rect.width || el.prop('offsetWidth'),
                                 height: rect.height || el.prop('offsetHeight'),
                                 top: rect.top + ($window.pageYOffset || $document[0].documentElement.scrollTop),
                                 left: rect.left + ($window.pageXOffset || $document[0].documentElement.scrollLeft)
                             };
                         }

                         function fixPosition(anchor, element, placement, appendToBody) {
                             var popupPosition = null;
                             var arrowPosition = null;
                             var anchorPoint = null;

                             var anchorGeom = appendToBody ? offset(anchor) : position(anchor);
                             var targetElWidth = element.prop('offsetWidth');
                             var targetElHeight = element.prop('offsetHeight');


                             var maxHeight = $window.innerHeight - 2 * padding;

                             var overlap = 5;

                             if (placement === 'right') {
                                 anchorPoint = {
                                     top: anchorGeom.top + anchorGeom.height / 2,
                                     left: anchorGeom.left + anchorGeom.width - overlap
                                 };

                                 popupPosition = {
                                     top: anchorPoint.top - element.height() / 2,
                                     left: anchorPoint.left
                                 };


                                 // Clamp for edge of screen
                                 if (appendToBody) {
                                     popupPosition.top = Math.max(padding, popupPosition.top);
                                     maxHeight -= popupPosition.top;
                                 };


                                 arrowPosition = {
                                     top: anchorPoint.top - popupPosition.top
                                 };
                             } else if (placement === 'left') {
                                 anchorPoint = {
                                     top: anchorGeom.top + anchorGeom.height / 2,
                                     left: anchorGeom.left + overlap - 10
                                 };

                                 popupPosition = {
                                     top: anchorPoint.top - element.height() / 2,
                                     right: $window.innerWidth - anchorPoint.left
                                 };

                                 // Clamp for edge of screen
                                 if (appendToBody) {
                                     popupPosition.top = Math.max(padding, popupPosition.top);
                                     maxHeight -= popupPosition.top;
                                 };

                                 arrowPosition = {
                                     top: anchorPoint.top - popupPosition.top
                                 };
                             } else if (placement === 'bottom') {
                                 anchorPoint = {
                                     top: anchorGeom.top + anchorGeom.height,
                                     left: anchorGeom.left + anchorGeom.width / 2
                                 };

                                 popupPosition = {
                                     top: anchorPoint.top - overlap,
                                     left: anchorPoint.left - element.width() / 2
                                 };

                                 // Clamp for edge of screen
                                 if (appendToBody) {
                                     popupPosition.top = Math.max(padding, popupPosition.top);
                                     maxHeight -= popupPosition.top;
                                 };


                                 arrowPosition = {
                                     left: anchorPoint.left - popupPosition.left
                                 };
                             } else if (placement === 'bottom-left') {
                                 anchorPoint = {
                                     top: anchorGeom.top + anchorGeom.height,
                                     left: anchorGeom.left + element.width() / 2
                                 };

                                 popupPosition = {
                                     top: anchorPoint.top - overlap,
                                     left: anchorPoint.left - element.width() / 2
                                 };

                                 // Clamp for edge of screen
                                 if (appendToBody) {
                                     popupPosition.top = Math.max(padding, popupPosition.top);
                                     maxHeight -= popupPosition.top;
                                 };

                                 // Update placement so we get the class name
                                 placement = 'bottom';

                                 arrowPosition = {
                                     left: anchorPoint.left - popupPosition.left
                                 };
                             } else if (placement === 'top') {
                                 anchorPoint = {
                                     top: anchorGeom.top - element.outerHeight(),
                                     left: anchorGeom.left + anchorGeom.width / 2
                                 };

                                 popupPosition = {
                                     top: anchorPoint.top + overlap,
                                     left: anchorPoint.left - element.width() / 2
                                 };

                                 // Clamp for edge of screen
                                 if (appendToBody) {
                                     popupPosition.top = Math.max(padding, popupPosition.top);
                                     maxHeight -= popupPosition.top;
                                 };

                                 arrowPosition = {
                                     left: anchorPoint.left - popupPosition.left
                                 };
                             } else {
                                 throw new Error('Unsupported placement ' + placement);
                             }

                             element.removeClass('left right bottom top');
                             element.addClass(placement);
                             element.css({
                                 top: popupPosition.top !== undefined ? popupPosition.top + 'px' : 'initial',
                                 left: popupPosition.left !== undefined ? popupPosition.left + 'px' : 'initial',
                                 right: popupPosition.right !== undefined ? popupPosition.right + 'px' : 'initial',
                                 display: 'block',
                                 maxHeight: maxHeight
                             });

                             // var header = element.find('.popover-title');
                             // var content = element.find('.popover-content');
                             // var footer = element.find('.popover-footer');
                             // content.css({
                             //     // Need to figure out where this 4 comes from.
                             //     maxHeight: maxHeight - footer.outerHeight() - header.outerHeight() - 4,
                             //     overflow: 'auto'
                             // });

                             if (arrowPosition) {
                                 $(".arrow", element).css(arrowPosition);
                             }
                         }

                         $Popbox.show = function() {

                             var modalResultDeferred = $q.defer();
                             var modalOpenedDeferred = $q.defer();


                             var modalInstance = {
                                 result: modalResultDeferred.promise,
                                 opened: modalOpenedDeferred.promise,
                                 hide: hidePopup
                             };

                             //merge and clean up options
                             modalOptions = angular.extend({}, $PopboxProvider.options, modalOptions);
                             modalOptions.resolve = modalOptions.resolve || {};

                             //verify options 
                             if (!modalOptions.template && !modalOptions.templateUrl) {
                                 throw new Error('One of template or templateUrl options is required.');
                             }

                             var templateAndResolvePromise =
                                 $q.all([getTemplatePromise(modalOptions)].concat(getResolvePromises(modalOptions.resolve)));


                             templateAndResolvePromise.then(function resolveSuccess(tplAndVars) {

                                 var modalScope = (modalOptions.scope || $rootScope).$new();
                                 modalScope.$hide = modalInstance.hide;

                                 var ctrlInstance, ctrlLocals = {};
                                 var resolveIter = 1;
                                 var appendToBody = angular.isDefined(modalOptions.appendToBody) ? modalOptions.appendToBody : false;

                                 //controllers
                                 if (modalOptions.controller) {
                                     ctrlLocals.$scope = modalScope;
                                     ctrlLocals.$popboxInstance = modalInstance;
                                     angular.forEach(modalOptions.resolve, function(value, key) {
                                         ctrlLocals[key] = tplAndVars[resolveIter++];
                                     });

                                     ctrlInstance = $controller(modalOptions.controller, ctrlLocals);
                                     if (modalOptions.controllerAs) {
                                         modalScope[modalOptions.controllerAs] = ctrlInstance;
                                     }
                                 }
                                 var positionPopbox = function() {

                                     // var ttPosition = $position.positionElements(modalOptions.target, templatedomel, modalOptions.placement, appendToBody);
                                     // ttPosition.top += 'px';
                                     // ttPosition.left += 'px';

                                     // templatedomel.css(ttPosition);
                                     fixPosition(modalOptions.target, templatedomel, modalOptions.placement, appendToBody)
                                     templatedomel.addClass('in')
                                 }

                                 var body = $document.find('body');
                                 modalScope.placement = modalOptions.placement || "right";
                                 var templatedomel = $compile(angular.element(template.format(tplAndVars[0])))(modalScope);
                                 templatedomel.css({
                                     top: 0,
                                     left: 0,
                                     display: 'block'
                                 });
                                 //阻止关闭；
                                 templatedomel.on("click", function(e) {
                                     e.stopPropagation(); //, e.preventDefault()
                                 })
                                 if (appendToBody) {
                                     body.append(templatedomel)
                                 } else {
                                     modalOptions.target.closest('a,button,label,input').length ? modalOptions.target.closest('a,button,label,input').after(templatedomel) : modalOptions.target.after(templatedomel)
                                 }
                                 $timeout(function() {
                                     positionPopbox()
                                     modalOptions.scope.isOpen = true;
                                     openedPopup = {
                                         el: templatedomel,
                                         options: modalOptions,
                                         resultDeferred: modalResultDeferred
                                     };
                                     $document.on('click', loseFocus);
                                 })


                             }, function resolveError(reason) {
                                 modalResultDeferred.reject(reason);
                             });

                             templateAndResolvePromise.then(function() {
                                 modalOpenedDeferred.resolve(true);
                             }, function() {
                                 modalOpenedDeferred.reject(false);
                             });
                             return modalInstance;
                         };
                         $Popbox.hide = hidePopup;
                         $Popbox.toggle = function() {
                             if (modalOptions.scope.isOpen) {
                                 hidePopup()
                             } else {
                                 return $Popbox.show(modalOptions);
                             }
                         }


                         return $Popbox;
                     }
                     return popboxxFactory;

                 }
             ]
         };

         return $PopboxProvider;
     }).directive('popupBox', ["$Popbox", "$timeout", function($Popbox, $timeout) {
         return {
             restrict: 'A',
             scope: {
                 popupIf: '=?',
                 popupTemplateUrl: '@',
                 popupTitle: '@',
                 popupBody: '@',
                 popupQrcode:'=?',
                 popupPlacement: '@'
             },
             link: function(scope, element, attrs) {
                 element.bind("click", function() {
                     $timeout(function() {
                         scope.popupIf = angular.isUndefined(scope.popupIf) ? true : scope.popupIf;
                         if (scope.popupIf) {
                             $Popbox({
                                 target: element,
                                 templateUrl:scope.popupTemplateUrl|| "/app/components/popbox/popbox.html",
                                 placement: scope.popupPlacement||'left',
                                 appendToBody: true,
                                 scope: scope
                             }).toggle()
                         };

                     })
                 })

             }
         };
     }])
     .directive('popupConfirm', ["$Popbox", "$timeout", function($Popbox, $timeout) {
         return {
             restrict: 'A',
             scope: {
                 popupIf: '=?',
                 popupConfirmCallback: '&',
                 popupTitle: '@',
                 popupBody: '@',
                 popupConfirmButton: '@',
                 popupClearButton: '@'
             },
             link: function(scope, element, attrs) {
                 element.bind("click", function() {
                     $timeout(function() {
                         scope.popupIf = angular.isUndefined(scope.popupIf) ? true : scope.popupIf;
                         scope.popupIf && $Popbox({
                             target: element,
                             templateUrl: "/app/components/popbox/popbox.confirm.html",
                             placement: 'left',
                             appendToBody: true,
                             scope: scope
                         }).toggle()

                     })
                 })

             }
         };
     }]).directive('popupMenu', ["$Popbox", "$timeout", function($Popbox, $timeout) {
         return {
             restrict: 'A',
             scope: {
                 popupIf: '=?',
                 popupTitle: '@',
                 popupData: '&', //通过fun 返回
                 popupList: '=?' //直接返回数据
             },
             link: function(scope, element, attrs) {
                 element.bind("click", function(e) {
                     scope.$el = e;

                     if (angular.isUndefined(scope.popupList)) {
                         scope.popupList = scope.popupData();
                     };

                     $timeout(function() {
                         scope.popupIf = angular.isUndefined(scope.popupIf) ? true : scope.popupIf;
                         scope.popupIf && $Popbox({
                             target: element,
                             templateUrl: "/app/components/popbox/popbox.menu.html",
                             placement: 'left',
                             appendToBody: true,
                             scope: scope
                         }).toggle()

                     })
                 })

             }
         };
     }])
     .directive('popupStep', ["$Popbox", "$timeout", function($Popbox, $timeout) {
         return {
             restrict: 'A',
             scope: {
                 popupIf: '=?',
                 popupData: '=?',
                 popupController:'@'
             },
             link: function(scope, element, attrs) {
                 scope.step = 0;
                 scope.prestep = 0;

                 scope.$step = function(val) {
                     scope.prestep = scope.step;
                     scope.step = val;
                 };
                 scope.$back = function() {
                     scope.$step(scope.prestep);
                 };
                 element.bind("click", function(e) {
                     $timeout(function() {
                         scope.popupIf = angular.isUndefined(scope.popupIf) ? true : scope.popupIf;
                         scope.popupIf && $Popbox({
                             target: element,
                             templateUrl: "/app/article/menu.step.html",
                             placement: 'left',
                             appendToBody: true,
                             scope: scope,
                             controller: scope.popupController
                         }).toggle()

                     })
                 })

             }
         };
     }]);
