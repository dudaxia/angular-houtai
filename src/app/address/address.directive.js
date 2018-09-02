;(function(){
angular.module('ngTicket').directive('address', ['$addressData', '$timeout', function($addressData, $timeout) {
    return {
        restrict: 'AE',
        scope: {
            value: '=ngModel',
        },
        templateUrl: '/app/address/address.tpl.html',
        link: function(scope, iElement, iAttrs, ngModelCtrl) {
            var $input=$("input.address-input",iElement);
            if (scope.value) { 
               scope.address=scope.value;
            };
            scope.selectType=1;
            scope.province =$addressData['0'];
            if(scope.address.province){
                scope.citylist =$addressData['0,'+scope.address.province];
                scope.selectType=2;
            }
            if(scope.address.city){
               scope.districtlist =$addressData['0,'+scope.address.province+","+scope.address.city];
               scope.selectType=3;
            }
            scope.clickDropdown=function(evnet){
                 if (event) {
                    event.stopPropagation();
                    event.preventDefault();
                }
            }
            scope.provinceChange = function(province,evnet){
                scope.citylist={};
                scope.districtlist={};
                scope.citylist =$addressData['0,'+province];
                scope.address.province = province;
                scope.address.city = null;
                scope.address.district = null;
                scope.selectType=2;
            }
            scope.selectChange=function(type,evnet){
                scope.selectType=type;
            }
            scope.cityChange = function(city,evnet){
                scope.districtlist={};
                scope.districtlist =$addressData['0,'+scope.address.province+","+city];
                scope.address.city = city;
                scope.address.district = null;
                scope.selectType=3;
            }
            scope.districtChange = function(district,evnet){
                $input.focus();
                scope.address.district = district;
                scope.selectType=3;
                scope.dropdownStatusOpen=false;
                $input.blur();
            }
           scope.$watch("address.province", function(province) {
                if (province) {
                    var ctiyId = "0,{0}".format(province);
                    scope.city = $addressData[ctiyId];
                    // scope.address.city = null;
                }else{
                    scope.city = null;
                }
                if (scope.address&&province) {
                    scope.address.string = find();
                    $timeout(function() {
                        scope.value = scope.address;
                    }) 
                };
            })
            scope.$watch("address.city", function(city) {
                if (city) {
                    var districtId = "0,{0},{1}".format(scope.address.province, city);
                    scope.district = $addressData[districtId];
                } else {
                    scope.district = null;
                }
                if (scope.address&&city) {
                    scope.address.string = find();
                    $timeout(function() {
                        scope.value = scope.address;
                    }) 
                };
            });
            var find = function() {
                var string=null;
                if(scope.address.province){
                    string=$addressData["0"][scope.address.province];
                }
                if(scope.address.city){
                    string=string+"/"+$addressData["0,{0}".format(scope.address.province)][scope.address.city];
                }
                if(scope.address.district){
                    if($addressData["0,{0},{1}".format(scope.address.province, scope.address.city)][scope.address.district]!=undefined){
                        string=string+"/"+$addressData["0,{0},{1}".format(scope.address.province, scope.address.city)][scope.address.district];
                    }
                }
                return string;
            }
            scope.$watch("address.district", function(district) {
                if (scope.address&&district) {
                    scope.address.string = find();
                    $timeout(function() {
                        scope.value = scope.address;
                    }) 
                };
            })
        }
    };
}]).directive('address1', ['$addressData', '$timeout','$httpApi','$config', function($addressData, $timeout,$httpApi,$config) {
    return {
        restrict: 'AE',
        scope: {
            value: '=ngModel',
        },
        templateUrl: '/app/address/address-4.tpl.html',
        link: function(scope, iElement, iAttrs, ngModelCtrl) {
            var $input=$("input.address-input",iElement);
            if (scope.value) { 
               scope.address=scope.value;
            };
            scope.selectType=1;
            scope.province =$addressData['0'];
            if(scope.address.province){
                scope.citylist =$addressData['0,'+scope.address.province];
                scope.selectType=2;
            }
            if(scope.address.city){
               scope.districtlist =$addressData['0,'+scope.address.province+","+scope.address.city];
               scope.selectType=3;
            }
            if(scope.address.street){
                var params={
                    areaCode:scope.address.district
                }
               
               $httpApi.postJSON($config.api3Area.areaListByParentId,{areaCode:params.areaCode}, {}, "apiUrlPrefixArea").then(function(res){
                  scope.streetlist = res.data;
                })
               scope.selectType=4;
            }
            scope.clickDropdown=function(evnet){
                 if (event) {
                    event.stopPropagation();
                    event.preventDefault();
                }
            }
            scope.provinceChange = function(province,evnet){
                scope.citylist={};
                scope.districtlist={};
                scope.citylist =$addressData['0,'+province];
                scope.address.province = province;
                scope.address.city = null;
                scope.address.district = null;
                scope.address.street = null;
                scope.selectType=2;
            }
            
            scope.cityChange = function(city,evnet){
                scope.districtlist={};
                scope.districtlist =$addressData['0,'+scope.address.province+","+city];
                scope.address.city = city;
                scope.address.district = null;
                scope.address.street = null;
                scope.selectType=3;
            }
            scope.districtChange = function(district,evnet){
                scope.address.district = district;
                $httpApi.postJSON($config.api3Area.areaListByParentId,{areaCode:district}, {}, "apiUrlPrefixArea").then(function(res){
                  scope.streetlist = res.data;
                })
                scope.address.street = null;
                scope.selectType=4;
            }
            scope.streetChange = function(street,evnet){
                $input.focus();
                scope.address.street = street;
               // scope.address.streetcode = street.areaCode;
                scope.selectType=4;
                scope.dropdownStatusOpen=false;
                $input.blur();
            }
            scope.selectChange=function(type,evnet){
                scope.selectType=type;
            }
            var find = function() {
                var string='';
                if(scope.address.province){
                    string=$addressData["0"][scope.address.province];
                }
                if(scope.address.city){
                    string=string+"/"+$addressData["0,{0}".format(scope.address.province)][scope.address.city];
                }
                if(scope.address.district){
                    string=string+"/"+$addressData["0,{0},{1}".format(scope.address.province, scope.address.city)][scope.address.district];
                }
                if(scope.address.street){
                    string=string+"/"+scope.address.street.areaName;
                }
                return string;
            }
           scope.$watch("address.province", function(province) {
                if (province) {
                    var ctiyId = "0,{0}".format(province);
                    scope.city = $addressData[ctiyId];
                    // scope.address.city = null;
                }else{
                    scope.city = null;
                }
                if (scope.address&&province) {
                    scope.address.string = find();
                    $timeout(function() {
                        scope.value = scope.address;
                    }) 
                };
            })
            scope.$watch("address.city", function(city) {
                if (city) {
                    var districtId = "0,{0},{1}".format(scope.address.province, city);
                    scope.district = $addressData[districtId];
                } else {
                    scope.district = null;
                }
                if (scope.address&&city) {
                    scope.address.string = find();
                    $timeout(function() {
                        scope.value = scope.address;
                    }) 
                };
            });
            
            scope.$watch("address.district", function(district) {
                if (scope.address&&district) {
                    scope.address.string = find();
                    $timeout(function() {
                        scope.value = scope.address;
                    }) 
                };
            });
            scope.$watch("address.street", function(street) {
                if (scope.address&&street) {
                    scope.address.string = find();
                    $timeout(function() {
                        scope.value = scope.address;
                    })
                };
            })
        }
    };
}]);
})();