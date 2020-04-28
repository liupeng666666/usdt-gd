var myChart;
$(function () {
    //getKling();
    $('.date_picker').date_input();
    var dom = document.getElementById("candlestick");
    myChart = echarts.init(dom);
})

var z_color = ['#FF00FF', '#00BFFF', '#FFFF00', '#FF8C00', '#00FFFF', '#FF6347'];

function getKling(data, dates, q_data, page, start, end) {

    var option = {
        backgroundColor: '#2e3237',
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                snap: true
            },

            confine: true,
            textStyle: {
                color: '#376df4',
                opacity: 0
            },
            position: function (pos, params, el, elRect, size) {
                var obj = {
                    top: 10,
                    left: 60
                };
                return obj;
            },
            formatter: function (tipData) {

                var str = '<div>';
                str += '<label style="width:120px">开盘价=<span style="color:' + tipData[0].color + '">$' + tipData[0].data[1] + '</span></label>';
                str += '<label style="width:120px">收盘价=<span style="color:' + tipData[0].color + '">$' + tipData[0].data[2] + '</span></label>';
                str += '<label style="width:120px">最高价=<span style="color:' + tipData[0].color + '">$' + tipData[0].data[4] + '</span></label>';
                str += '<label style="width:120px">最低价=<span style="color:' + tipData[0].color + '">$' + tipData[0].data[3] + '</span></label>';
                for (var i = 1; i < tipData.length; i++) {
                    str += '<label style="width:120px">' + tipData[i].seriesName + '=<span style="color:' + tipData[0].color + '">$' + tipData[i].value + '</span></label>';
                }
                str += '</div>';
                return str;
            }
            // extraCssText: 'width: 170px'
        },
        dataZoom: [{
            type: 'inside',
            start: start,
            end: end
        },
            {
                show: false,
                type: 'slider',
                y: '50%',
                start: start,
                end: end
            }

        ],
        xAxis: {
            type: 'category',
            data: dates,
            axisLine: {
                lineStyle: {
                    color: '#8392A5'
                }
            },
            axisLabel: {
                showMaxLabel: false,
                formatter: function (value, index) {
                    var date = new Date(value);
                    var texts = [date.getHours(), date.getMinutes()];
                    return texts.join(':');
                }
            },
            splitLine: {
                show: true,
                lineStyle: {
                    color: '	#6C7B8B',
                    opacity: 0.1
                }
            }
        },
        yAxis: {
            scale: true,
            axisLine: {
                lineStyle: {
                    color: '#8392A5'
                }
            },
            splitLine: {
                show: true,
                lineStyle: {
                    color: '	#6C7B8B',
                    opacity: 0.1
                }

            }
        },
        grid: {
            top: "30px",
            left: "50px",
            right: "30px",
            bottom: "40px"
        },
        animation: false,
        series: [{
            type: 'candlestick',
            name: '数据',
            data: data,
            itemStyle: {
                normal: {
                    color: '#00A600',
                    color0: '#AE0000',
                    borderColor: '#00A600',
                    borderColor0: '#AE0000'
                }
            },
            markPoint: {
                label: {
                    normal: {
                        formatter: function (param) {
                            return param != null ? Math.round(param.value) : '';
                        }
                    }
                }
            }
        }]
    };

    for (var i in q_data) {

        var json = q_data[i];
        var str = {
            name: '' + json.key + 'M',
            type: 'line',
            data: json.value,
            smooth: true,
            showSymbol: false,
            lineStyle: {
                normal: {
                    color: z_color[i],
                    opacity: 0.5
                }
            }
        };
        option.series.push(str);
    }

    if (option && typeof option === "object") {
        myChart.setOption(option, true);
    }

    myChart.on('datazoom', function (params) {
        if (params.batch[0].start == 0) {
            //top_kline(parseInt(page)+parseInt(1));
        }
    })
}
