$(document).ready(function () {
    $('.checkTrade').hover(function () {
        $(".payBox").hide();
        $(this).parent().parent().next().slideToggle();
    }, function () {
        $(".payBox").hide();
    });
    document.querySelector("input.widget_switch_checkbox").addEventListener("click", function () {
        if (document.querySelector("input.widget_switch_checkbox").checked) {
            console.log("选中状态");
        }
    });
    getTradeType();
    getlineCanvers();
    $(".detailStar").rating({
        min: 0, max: 4, step: 0.5, size: "xl", stars: "4", showClear: false
    });
    $(".Ftrader").rating({
        min: 0, max: 5, step: 0.5, size: "xl", stars: "5", showClear: false
    });

})

function traderBtn() {
    if ($('.hidetrader').is(':hidden')) {
        $('.hidetrader').slideToggle();
        $('.drapdownBtn i').css('transform', 'rotate(180deg)')
    } else {
        $('.hidetrader').slideUp();
        $('.drapdownBtn i').css('transform', 'rotate(360deg)')
    }

}

function getlineCanvers() {
//let dom = document.getElementsByClassName("tradeAbilityBox");
//// let myChart = echarts.init(dom);
//let app = {};
//option = null;
//option = {
//
//  xAxis: {
//    type: 'category',
//    boundaryGap: false,
//    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
//    axisLine: {
//      lineStyle: {
//        color: '#fff'
//      }
//    }
//  },
//  color: {
//    type: 'linear',
//    x: 0,
//    y: 0,
//    x2: 0,
//    y2: 1,
//    colorStops: [{
//      offset: 0, color: '#244975' // 0% 处的颜色
//    }, {
//      offset: 1, color: '#343434' // 100% 处的颜色
//    }],
//    // globalCoord: false // 缺省为 false
//  },
//  yAxis: {
//    type: 'value',
//    axisLine: {
//      lineStyle: {
//        color: '#fff'
//      }
//    }
//  },
//  series: [{
//    data: [820, 932, 901, 934, 1290, 1330, 1320],
//    type: 'line',
//    areaStyle: {},
//    symbol: 'none',
//  }]
//};
//;
//
//if (option && typeof option === "object") {
//  // myChart.setOption(option, true);
//  for (i in dom) {
//    echarts.init(dom[i]).setOption(option, true);
//  }
//}
}

function getTradeType() {
//let dom = document.getElementById("typeSetBox");
//let myChart = echarts.init(dom);
//let app = {};
//option = null;
//option = {
//  tooltip: {
//    trigger: 'item',
//    formatter: "{a} <br/>{b} : {c} ({d}%)"
//  },
//  calculable: true,
//  series: [
//    {
//      name: '币种配置',
//      type: 'pie',
//      radius: [30, 210],
//      center: ['center', '50%'],
//      roseType: 'area',
//      label: {
//        normal: {
//          position: 'inner'
//        }
//      },
//      data: [
//        { value: 40, name: '40%' },
//        { value: 15, name: '15%' },
//        { value: 10, name: '10%' },
//        { value: 20, name: '20%' },
//        { value: 5, name: '5%' },
//        { value: 10, name: '10%' },
//        { value: 28, name: '28%' },
//        { value: 30, name: '30%' }
//      ]
//    }
//  ]
//};
//;
//if (option && typeof option === "object") {
//  myChart.setOption(option, true);
//}
}

function cancelTrade(thiss) {
    $(thiss).parent().parent().slideUp();
}

function payBtn(thiss) {
    $(thiss).parent().parent().hide();
    $('.dialogBox').show();
}

function hideDialog() {
    $('.dialogBox').hide();
}