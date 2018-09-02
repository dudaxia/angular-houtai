'use strict';

angular.module('ngTicket').factory('ticketCharts', [function() {
    return {
        line: function(id, data, setConfig) {
            var unit="",dateHourRange=24;
            if(setConfig){
                unit=setConfig.unit || "";
                dateHourRange=setConfig.dateHourRange || 24;
            }
            var chartsConfig = {
                chart: {
                    defaultSeriesType: 'spline'
                },
                title: '',
                xAxis: {
                    title: '',
                    lineWidth: 1,
                    lineColor: '#EEE',
                    type: 'datetime',
                    endOnTick: false,
                    startOnTick: false,
                    dateTimeLabelFormats: {
                        second: '%H:%M:%S',
                        minute: '%H:%M',
                        hour: '%H:%M',
                        day: '%m-%e',
                        week: '%m-%e',
                        month: '%b\'%y',
                        year: '%Y'
                    }
                },
                yAxis: {
                    title: '',
                    gridLineColor: '#EEE',
                    gridLineWidth: 1,
                    min: 0,
                    labels:{
                        formatter: function() {
                            return this.value + unit;
                        }
                    },
                    endOnTick: false
                },
                tooltip: {
                    enabled: true,
                    shadow: false,
                    borderWidth: 0,
                    shared:true,
                    valueSuffix:unit,
                    xDateFormat:'%Y年%m月%d日',
                    backgroundColor: 'rgba(0,0, 0, .85)',
                    style: {
                        color: '#FFF',
                        fontSize: '12px'
                    }
                },
                series: '',
                plotOptions: {
                    spline: {
                        lineWidth: 2,
                        states: {
                            hover: {
                                lineWidth: 3
                            }
                        },
                        marker: {
                            enabled: false,
                            states: {
                                hover: {
                                    enabled: true,
                                    symbol: 'circle',
                                    radius: 5,
                                    lineWidth: 1
                                }
                            }
                        },
                        shadow: false
                    }
                },
                colors: ['#393', '#f8a31f', '#80699B', '#368ee0'],
                legend: {
                    enabled: true,
                    x: 8,
                    y: 0,
                    borderWidth: 0,
                    align: 'center',
                    verticalAlign: 'bottom',
                    symbolWidth: 20,
                    symbolPadding: 3,
                    itemStyle: {
                        color: '#333'
                    },
                    labelFormatter: function() {
                        return '<strong>' + this.name + '</strong>' + '<span style="color:#BBB">(点击隐藏)</span>';
                    }
                },
                exporting: {
                    enabled: false
                },
                credits: {
                    enabled: false
                }
            };
            Highcharts.setOptions({
                global: {
                    useUTC: false
                }
            });
            chartsConfig.chart.renderTo = id;
            chartsConfig.series = data;
            chartsConfig = $.extend(true, {}, chartsConfig, setConfig);
            if ((data[0]['data'][data[0]['data'].length - 1][0] - data[0]['data'][0][0]) >= dateHourRange * 3600 * 1000) chartsConfig.xAxis.dateTimeLabelFormats.hour = '%m - %e';
            var chart = new Highcharts.Chart(chartsConfig);
        },
        pie: function(id, data, title, setConfig) {
            if (!title) title = '';
            var chartsConfig = {
                chart: {
                    defaultSeriesType: 'pie',
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false
                },
                title: {
                    text: '',
                    verticalAlign: 'bottom',
                    y: 8,
                    style: {
                        color: '#333',
                        fontSize: '12px',
                        fontWeight: 'bold'
                    }
                },
                tooltip: {
                    enabled: true,
                    pointFormat: '{series.name}: <b>{point.percentage:.2f}%</b>'
                },
                series: '',
                legend: {
                    x: 8,
                    y: 0,
                    borderWidth: 0,
                    align: 'center',
                    verticalAlign: 'bottom',
                    symbolWidth: 20,
                    symbolPadding: 3,
                    itemStyle: {
                        color: '#333'
                    },
                    labelFormatter: function() {
                        return '<strong>' + this.name + '</strong>';
                    }
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: false,
                            color: '#000000',
                            connectorColor: '#000000',
                            format: '<b>{point.name}</b>: {point.percentage:.2f} %'
                        },
                        showInLegend: true
                    }
                },
                colors: ['#F7BA00', '#0099FF', '#00CC00', '#FF5522', '#FF70B7', '#119999'],
                //          colors : ['#E6C', '#FC3', '#6C0', '#36F', '#F30', '#BBB'],
                exporting: {
                    enabled: false
                },
                credits: {
                    enabled: false
                }
            };
            Highcharts.setOptions({
                global: {
                    useUTC: false
                }
            });
            chartsConfig.chart.renderTo = id;
            chartsConfig.title.text = title;
            chartsConfig.series = data;
            chartsConfig = $.extend(true, {}, chartsConfig, setConfig);
            var chart = new Highcharts.Chart(chartsConfig);

        }

    };
}])
