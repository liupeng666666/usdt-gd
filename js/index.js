$(document).ready(function () {
    $(".dayS").rating({
        min: 0, max: 6, step: 0.5, size: "xl", stars: "6", showClear: false
    });
    $(".fdayS").rating({
        min: 0, max: 2, step: 0.5, size: "xl", stars: "5", showClear: false
    });
});

function hideserch(num) {
    if (num) {
        $('.serchbox').show();
    } else {
        $('.serchbox').hide();
    }

}

function echart_zx(id, data_value) {

    var dom = document.getElementById(id);
    if (dom == null) {
        return false;
    }
    var myChart = echarts.init(dom);
    var app = {};
    option = null;
    option = {
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
                offset: 0, color: '#19ab1d' // 0% 处的颜色
            }, {
                offset: 1, color: '#19ab1d' // 100% 处的颜色343434
            }],
            globalCoord: false // 缺省为 false
        },
        yAxis: {
            type: 'value',

            splitLine: {show: false},//去除网格线
        },
        series: [{
            data: data_value,
            type: 'line',
            areaStyle: {},
            symbol: 'none',
        }]
    };
    if (option && typeof option === "object") {
        myChart.setOption(option, true);

    }
}