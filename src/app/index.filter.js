'use strict';

angular.module('ngTicket')
    .filter('srefif', function() {
        return function(input, b) {
            return b ? input : "javascript:;";
        };
    }).filter("apiUrlPrefix", function($config) {
        return function(apiurl) {
            return $config.host.apifix + apiurl;
        };
    }).filter("textBrace", function() {
        return function(val) {
            return val ? "[" + val + "]" : "";
        };
    }).filter('propsFilter', function() {
        //多个 属性搜索
        return function(items, props) {
            var out = [];

            if (angular.isArray(items)) {
                items.forEach(function(item) {
                    var itemMatches = false;

                    var keys = Object.keys(props);
                    for (var i = 0; i < keys.length; i++) {
                        var prop = keys[i];
                        var text = props[prop].toLowerCase();
                        if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                            itemMatches = true;
                            break;
                        }
                    }

                    if (itemMatches) {
                        out.push(item);
                    }
                });
            } else {
                // Let the output be the input untouched
                out = items;
            }

            return out;
        };
    }).filter('formatDate', ['$filter', '$locale',
        function($filter, $locale) {
            return function(date, full) {
                var o = Date.now() - new Date(date),
                    dateFilter = $filter('date');
                if (full) {
                    return dateFilter(date, $locale.DATETIME.fullD);
                } else if (o > 259200000) {
                    return dateFilter(date, $locale.DATETIME.shortD);
                } else if (o > 86400000) {
                    return Math.floor(o / 86400000) + $locale.DATETIME.dayAgo;
                } else if (o > 3600000) {
                    return Math.floor(o / 3600000) + $locale.DATETIME.hourAgo;
                } else if (o > 60000) {
                    return Math.floor(o / 60000) + $locale.DATETIME.minuteAgo;
                } else {
                    return $locale.DATETIME.secondAgo;
                }
            };
        }
    ])
    .filter('formatTime', ['formatTimefun',
        function(formatTimefun) {
            return formatTimefun;
        }
    ]).filter('msDateFormat', ['$filter', function($filter) {
        return function(input, formatStr) {

            try {
                if (String.IsNullOrEmpty(input))
                    return "-";
                var format = formatStr || 'LLLL';
                var dto = moment(new Date(input));

                var ret = dto.format(format);
      
                return ret;
            } catch (err) {
                return input;
            }

        };
    }]).filter('greaterDate', function() {
        return function(d) { //大于当前时间
            return Date.now() < new Date(d);
        }
    })
    .filter('jsonParse', function() {
        return function(jsonString) {

           return JSON.parse(jsonString);
        }
    })
    .filter('parseTime', function() {
        return function(timeString) {
            return new Date(timeString)
        }
    })
    .filter('formatBytes', ['$locale',
        function($locale) {
            return function(bytes) {
                bytes = bytes > 0 ? bytes : 0;
                if (!bytes) {
                    return '-';
                } else if (bytes < 1024) {
                    return bytes + 'B';
                } else if (bytes < 1048576) {
                    return (bytes / 1024).toFixed(3) + ' KiB';
                } else if (bytes < 1073741824) {
                    return (bytes / 1048576).toFixed(3) + ' MiB';
                } else {
                    return (bytes / 1073741824).toFixed(3) + ' GiB';
                }
            };
        }
    ])
    .filter("chineseLen", function () {
        return function (val, bitLen) {
            if (!val) return 0;

            if (!bitLen) bitLen = 1;
            return parseInt(val.replace(/[^\x00-\xff]/g, "**").length / bitLen);
        };
    }).filter('taskStatus',function(){
        return function(status){
            if(status == 0){
                status = '未分配';
            }else if(status == 1){
                status = '已分配';
            }else if(status == 2){
                status = '测试中';
            }else if(status == 3){
                status = '测试通过';
            }else if(status == 4){
                status = '暂停';
            }else if(status == 5){
                status = '不通过';
            }else if(status == 6){
                status = '延期';
            }else if(status == 7){
                status = '打回';
            }else if(status == 8){
                status = '待上线';
            }else if(status == 9){
                status = '待发布';
            }else if(status == 10){
                status = '已上线';
            }
            return status;
        }
    }).filter('taskType',function(){
        return function(status){
            if(status == 0){
                status = '常规任务';
            }else if(status == 1){
                status = '免测';
            }
            return status;
        }
    }).filter('environment',function(){
        return function(status){
            if(status == 1){
                status = 'DEV';
            }else if(status == 2){
                status = 'QA';
            }else if(status == 3){
                status = 'PL';
            }else if(status == 4){
                status = 'Online';
            }
            return status;
        }
    }).filter('delayed',function(){
        return function(status){
            if(status == 0){
                status = '否';
            }else if(status == 1){
                status = '是';
            }
            return status;
        }
    }).filter('ProStatus',function(){
        return function(status){
            if(status == 0){
                status = '待发布';
            }else if(status == 1){
                status = '发布中';
            }else if(status == 2){
                status = '测试中';
            }else if(status == 3){
                status = '测试通过';
            }
            return status;
        }
    }).filter('OnlineProStatus',function(){
        return function(status){
            if(status == 3){
                status = '待申请';
            }else if(status == 4){
                status = '待审核';
            }else if(status == 0){
                status = '待发布';
            }else if(status == 5){
                status = '已上线';
            }
            return status;
        }
    }).filter('appstatus',function(){
        return function(status){
            if(status == 0){
                status = '未提测';
            }else if(status == 1){
                status = '未发布';
            }else if(status == 2){
                status = '已发布';
            }
            return status;
        }
    }).filter('reviewStatus',function(){
        return function(status){
            if(status == 0){
                status = '未审核';
            }else if(status == 1){
                status = '未通过';
            }else if(status == 2){
                status = '通过';
            }
            return status;
        }
    }).filter('weights',function(){
        return function(status){
            if(status == 1){
                status = '权重1';
            }else if(status == 2){
                status = '权重2';
            }else if(status == 3){
                status = '权重3';
            }
            return status;
        }
    }).filter('appPool',function(){
        return function(status){
            if(status == 0){
                status = '无效';
            }else if(status == 1){
                status = '有效';
            }
            return status;
        }
    }).filter('moduleStatus',function(){
        return function(status,test){
            if(test>0){
               if(status>=0 && status<100){
                    status = '测试中';
                }else if(status==100){
                    status = '已完成';
                }  
            }else{
                if(status==0){
                    status = '未开始';
                }else if(status>0 && status<100){
                    status = '测试中';
                }else if(status==100){
                    status = '已完成';
                } 
            }
            return status;
        }
    }).filter('enable',function(){
        return function(status){
            if(status == 0){
                status = false;
            }else if(status == 1){
                status = true;
            }else{
                status = false;
            }
            return status;
        }
    });
