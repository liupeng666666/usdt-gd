/**
 * 用户首页JS
 */
/*----------------------------本页面全局变量--------------------------------*/
// 用户id
var userid = null;
// 语言类型
var language;
//token
var token;
//每页条数
var number = 10;
var dengji = 1;
//是否是交易员
var istrader = false;
//用户等级
var userlevl = 0;
var popup;

popup = new auiPopup();
var request = new Object();
request = GetRequest();
urluserid = request["userid"];
$(".hederInfor").attr("aui-popup-for", "");
if (urluserid == userid) {
    $("#myPages_chichangtuijian").hide();
}


//	api.setRefreshHeaderInfo({
//		bgColor : '#0F0F0F',
//		textColor : '#D9D9D9',
//		textDown : '下拉刷新...',
//		textUp : '松开刷新...'
//	}, function(ret, err) {
//		getUserInfoById();
//		getUserEarningsTop();
//		getTraderEarningsByType();
//		getUserIncomeStatistics();
//		getNetValueBalanceById();
//		getOrderByCurrency();
//		getOrderByTradeSector(0);
//		getOrderByTradeSector(1);
//		getFollower();
//		//在这里从服务器加载数据，加载完成后调用api.refreshHeaderLoadDone()方法恢复组件到默认状态
//		api.refreshHeaderLoadDone();
//
//	})

/**
 * 开启交易员按钮监听
 */
function openTraderListener() {
    document.querySelector("input.widget_switch_checkbox").addEventListener("click", function () {
        if (document.querySelector("input.widget_switch_checkbox").checked) {
            if (urluserid == userid) {
                if (userlevl == 4 || userlevl == 5) {
                    changeUserTraderState(1);
                } else {
                    document.querySelector("input.widget_switch_checkbox").checked = false;
                    if (language == 2) {
                        tishi("You cannot open a trader at your current level");
                    } else {
                        tishi("您当前等级无法开启交易员");
                    }
                }
            } else {
                document.querySelector("input.widget_switch_checkbox").checked = istrader;
            }
        } else {
            if (urluserid == userid) {
                changeUserTraderState(0);
            } else {
                document.querySelector("input.widget_switch_checkbox").checked = istrader;

            }
        }
    });
}

function aaa() {
    var slide = new auiSlide({
        container: document.getElementById("aui-slide2"), //容器
        // "width":300, //宽度
        "height": 160, //高度
        "speed": 500, //速度
        "autoPlay": false, //自动播放
        "loop": true, //是否循环
        "pageShow": true, //是否显示分页器
        "pageStyle": 'line', //分页器样式，分dot,line
        'dotPosition': 'center' //当分页器样式为dot时控制分页器位置，left,center,right
    })
}

function changeUserTraderState(trader) {
    $.ajax({
        url: "../../usdtpc/subuser/changUserInfoById",
        data: {
            "userid": userid,
            "trader": trader
        },
        method: "POST",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        success: function (data) {
            if (isString(data)) {
                data = JSON.parse(data);
            }
            if (data.code == 100) {
                if (trader == 1) {
                    document.querySelector("input.widget_switch_checkbox").checked = true;
                } else {
                    document.querySelector("input.widget_switch_checkbox").checked = false;
                }
            } else if (data.code == 401) {
                tokenLoseEfficacy();
                token = $api.getStorage("token");
                changeUserTraderState(trader);
            } else {
                if (trader == 1) {
                    document.querySelector("input.widget_switch_checkbox").checked = false;
                } else {
                    document.querySelector("input.widget_switch_checkbox").checked = true;
                }
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            if (trader == 1) {
                document.querySelector("input.widget_switch_checkbox").checked = false;
            } else {
                document.querySelector("input.widget_switch_checkbox").checked = true;
            }
            if (Number(XMLHttpRequest.status) != 0 && XMLHttpRequest.readyState != 0 && textStatus != "error" && errorThrown.length != 0) {
                //alert("网络异常，请您检查网络后刷新页面！");
            } else if ("timeout" == textStatus && "timeout" == errorThrown) {
                //alert("请求超时，请您检查网络后刷新页面！");
            } else {
                //alert("网络异常，请您检查网络后刷新页面！");
            }
        }
    });
}

function getUserInfoById() {
    $.ajax({
        url: "../../usdtpc/auth/getUserInfoById",
        data: {
            "userid": urluserid
        },
        method: "POST",
        success: function (data) {
            if (data.code == 100) {
                var user = data.user;
                //$(".hederBox").css("background-image", "url(" + data.user.bgimg + "),url(\"../img/back.png\")");
                $("#img").attr("src", user.img);
                $("#nickname").html(user.nickname);
                dengji = user.startnum;
                userlevl = user.startnum;
                $("#dengji").html(user.startnum);
                $("#fans_num").html(user.fans_num);
                $("#cnum").html(user.cnum);
                var total_revenue = 0;
                if (data.user.putinto != 0) {
                    total_revenue = parseFloat((data.user.income / data.user.putinto) * 100).toFixed(2);
                }
                var z_yl = (parseFloat(data.user.income) + parseFloat(data.user.loss)).toFixed(2);
                if (z_yl < 0) {
                    $("#total_revenue").html("-$" + (0 - z_yl));

                } else {
                    $("#total_revenue").html("$" + z_yl);

                }
                var z_jz = (parseFloat(data.user.income) + parseFloat(data.user.loss) - parseFloat(data.user.trade)).toFixed(2);
                if (z_jz < 0) {
                    $("#surplus").html("-$" + (0 - z_jz));
                    $("#tp_networth").html("-$" + (0 - z_jz));
                } else {
                    $("#surplus").html("$" + z_jz);
                    $("#tp_networth").html("$" + z_jz);
                }
                if (user.signature == undefined || user.signature == null || user.signature == "") {
                    if (language == 2) {
                        $("#signature").html("This guy was lazy and left nothing behind");
                    } else {
                        $("#signature").html("这个人很懒，什么都没有留下");
                    }

                } else {
                    $("#signature").html(user.signature);
                }
                if (user.trading_strategy == undefined || user.trading_strategy == null || user.trading_strategy == "") {
                    if (language == 2) {
                        $("#trading_strategy").html("No trading strategy has been written yet");
                    } else {
                        $("#trading_strategy").html("暂未编写交易策略");
                    }
                } else {
                    $("#trading_strategy").html(user.trading_strategy);
                }
                if (user.region == undefined || user.region == null || user.region == "") {
                    if (language == 2) {
                        $("#region").html("Temporarily not set");
                    } else {
                        $("#region").html("暂未设置</p");
                    }
                } else {
                    $("#region").html(user.region);
                }
                $("#createtime").html(user.createtime);
                $("#tp_surplus").html("$" + user.surplus);
                var incomeamount = user.income + user.loss;
                $("#tp_incomeamount").html("$" + incomeamount.toFixed(2));
                $("#tp_createtime").html(user.createtime);
                if (userid == urluserid) {
                    $("#person_follow_div").hide();
                    if (data.user.trader == 0) {
                        document.querySelector("input.widget_switch_checkbox").checked = false;
                    } else if (user.trader == 1) {
                        document.querySelector("input.widget_switch_checkbox").checked = true;
                    }
                } else {
                    if (user.trader == 0) {
                        istrader = false;
                        document.querySelector("input.widget_switch_checkbox").checked = false;
                        $("#person_follow_div").hide();
                    } else if (data.user.trader == 1) {
                        istrader = true;
                        document.querySelector("input.widget_switch_checkbox").checked = true;
                    }
                }
                getFollowOrder();
            } else if (data.code == 101) {
                //				if (language == 2) {
                //					tishi("No data");
                //				} else {
                //					tishi("暂无数据");
                //				}
            } else if (data.code == 401) {
                tokenLoseEfficacy();
                token = $api.getStorage("token");
                getUserInfoById();
            } else {
                if (language == 2) {
                    tishi("Network problems, please try again.");
                } else {
                    tishi("网络出现问题,请重试");
                }
            }
        },
        error: function (err) {
        }
    })
}

/**
 * 查询用户天、周、月排行榜排名
 */
function getUserEarningsTop() {
    $.ajax({
        url: "../../usdtpc/auth/getUserEarningsTopByTime",
        data: {
            "userid": urluserid
        },
        method: "POST",
        success: function (data) {
            if (data.code == 100) {
                if (data.daypurchase > 0) {
                    var day_total_revenue = (data.dayincome / data.daypurchase * 100).toFixed(2);
                    $("#day").html((data.dayer * 100).toFixed(2) + "%");
                } else {
                    $("#day").html("0.00%");
                }
                if (data.weekpurchase > 0) {
                    var week_total_revenue = (data.weekincome / data.weekpurchase * 100).toFixed(2);
                    $("#week").html((data.weeker * 100).toFixed(2) + "%");
                } else {
                    $("#week").html("0.00%");
                }
                if (data.monthpurchase > 0) {
                    var month_total_revenue = (data.monthincome / data.monthpurchase * 100).toFixed(2);
                    $("#month").html((data.monther * 100).toFixed(2) + "%");
                } else {
                    $("#month").html("0.00%");
                }
                $("#top").html(data.top);
            } else if (data.code == 101) {
                //				if (language == 2) {
                //					tishi("No data");
                //				} else {
                //					tishi("暂无数据");
                //				}
            } else if (data.code == 401) {
                tokenLoseEfficacy();
                token = $api.getStorage("token");
                getUserEarningsTop();
            } else {
                if (language == 2) {
                    tishi("Network problems, please try again.");
                } else {
                    tishi("网络出现问题,请重试");
                }
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            if (Number(XMLHttpRequest.status) != 0 && XMLHttpRequest.readyState != 0 && textStatus != "error" && errorThrown.length != 0) {
                //alert("网络异常，请您检查网络后刷新页面！");
            } else if ("timeout" == textStatus && "timeout" == errorThrown) {
                //alert("请求超时，请您检查网络后刷新页面！");
            } else {
                //alert("网络异常，请您检查网络后刷新页面！");
            }
        }
    });
}

/**
 * 获取用户的订单收益、佣金收益、查看收益
 */
function getTraderEarningsByType() {
    $.ajax({
        url: "../../usdtpc/auth/getTraderEarningsByType",
        data: {
            "userid": urluserid
        },
        method: "POST",
        success: function (data) {
            if (data.code == 100) {
                $("#order_earnings").html("$" + data.brokerage);
                $("#tp_followincome").html("$" + "" + unde(data.brokerage, "0"));
                $("#brokerage_earnings").html("$" + data.select);
//				var followincome = Number(data.select) + Number(data.brokerage);
                $("#tp_liushuiyongjin").html("$" + data.select);
            } else if (data.code == 101) {
                //				if (language == 2) {
                //					tishi("No data");
                //				} else {
                //					tishi("暂无数据");
                //				}
            } else if (data.code == 401) {
                tokenLoseEfficacy();
                token = $api.getStorage("token");
                getTraderEarningsByType();
            } else {
                if (language == 2) {
                    tishi("Network problems, please try again.");
                } else {
                    tishi("网络出现问题,请重试");
                }
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            if (Number(XMLHttpRequest.status) != 0 && XMLHttpRequest.readyState != 0 && textStatus != "error" && errorThrown.length != 0) {
                //alert("网络异常，请您检查网络后刷新页面！");
            } else if ("timeout" == textStatus && "timeout" == errorThrown) {
                //alert("请求超时，请您检查网络后刷新页面！");
            } else {
                //alert("网络异常，请您检查网络后刷新页面！");
            }
        }
    });
}

function getNetValueBalanceById(style) {
    var endtime = null;
    var begintime = null;
    if (style == "week") {
        var date = new Date();
        endtime = date.Format("yyyy/MM/dd HH:mm:ss");
        date = date.setDate(date.getDate() - 6);
        var edate = new Date(date);
        begintime = edate.Format("yyyy/MM/dd HH:mm:ss");
        begintime = begintime.split(" ")[0] + " 00:00:00";
    } else if (style == "month") {
        var date = new Date();
        endtime = date.Format("yyyy/MM/dd HH:mm:ss");
        date = date.setDate(date.getDate() - 30);
        var edate = new Date(date);
        begintime = edate.Format("yyyy/MM/dd HH:mm:ss");
        begintime = begintime.split(" ")[0] + " 00:00:00";
    } else if (style == "year") {
        var date = new Date();
        endtime = date.Format("yyyy/MM/dd HH:mm:ss");
        date = date.setDate(date.getDate() - 365);
        var edate = new Date(date);
        begintime = edate.Format("yyyy/MM/dd HH:mm:ss");
        begintime = begintime.split(" ")[0] + " 00:00:00";
    }
    $.ajax({
        url: "../../usdtpc/auth/getNetValueBalanceById",
        data: {
            "userid": urluserid,
            "begintime": begintime,
            "endtime": endtime
        },
        method: "GET",
        success: function (data) {
            if (data.code == 100 || data.code == 101) {
                var date = new Array();
                var value = new Array();
                var value2 = new Array();

                if (style == "week") {
                    for (var i = 0; i < 7; i++) {
                        var date = new Date();
                        endtime = date.Format("yyyy/MM/dd HH:mm:ss");
                        date = date.setDate(date.getDate() - (6 - i));
                        var edate = new Date(date);
                        begintime = edate.Format("yyyy/MM/dd HH:mm:ss");
                        begintime = begintime.split(" ")[0];
                        date[i] = begintime;

                        for (var j in data.order) {
                            var order = data.order[j];
                            if (order.datetime == begintime) {

                                value.push(order.income + order.loss);
                                value2.push(order.income + order.loss - order.trade);
                                break;
                            } else {
                                value.push(0);
                                value2.push(0);
                            }

                        }
                    }

                } else if (style == "month") {
                    for (var i = 0; i < 30; i++) {
                        var date = new Date();
                        endtime = date.Format("yyyy/MM/dd HH:mm:ss");
                        date = date.setDate(date.getDate() - (29 - i));
                        var edate = new Date(date);
                        begintime = edate.Format("yyyy/MM/dd HH:mm:ss");
                        begintime = begintime.split(" ")[0];
                        date[i] = begintime;
                        for (var j in data.order) {
                            var order = data.order[j];
                            if (order.datetime == begintime) {
                                value.push(order.income + order.loss);
                                value2.push(order.income + order.loss - order.trade);
                                break;
                            } else {
                                value.push(0);
                                value2.push(0);
                            }

                        }
                    }

                } else if (style == "year") {
                    for (var i = 0; i < 365; i++) {
                        var date = new Date();
                        endtime = date.Format("yyyy/MM/dd HH:mm:ss");
                        date = date.setDate(date.getDate() - (364 - i));
                        var edate = new Date(date);
                        begintime = edate.Format("yyyy/MM/dd HH:mm:ss");
                        begintime = begintime.split(" ")[0];
                        date[i] = begintime;
                        for (var j in data.order) {
                            var order = data.order[j];
                            if (order.datetime == begintime) {
                                value.push(order.income + order.loss);
                                value2.push(order.income + order.loss - order.trade);
                                break;
                            } else {
                                value.push(0);
                                value2.push(0);
                            }

                        }
                    }

                }

                echart_zx(date, value, value2);
            } else if (data.code == 401) {
                tokenLoseEfficacy();
                token = $api.getStorage("token");
                getNetValueBalanceById(style);
            } else {
                if (language == 2) {
                    tishi("Network problems, please try again.");
                } else {
                    tishi("网络出现问题,请重试");
                }
            }

        },
        error: function (err) {
        }
    })
}

function echart_zx(date, value, value2) {
    var dom = document.getElementById("allProfit");
    var myChart = echarts.init(dom);
    var app = {};
    option = null;
    var zongshouyi = "总收益";
    var jingzhi = "净值";
    if (language == 2) {
        zongshouyi = "Total income";
        jingzhi = "net worth";
    }
    option = {
        title: {
            text: zongshouyi + '/' + jingzhi,
            textStyle: {
                color: '#fff',
                fontSize: '12'
            }
        },
        tooltip: {
            trigger: 'axis'
        },
        color: ["#2f688d", "#38bd73"],
        legend: {
            show: true,
            y: 'bottom',
            data: [{
                name: zongshouyi,
                textStyle: {
                    color: '#fff'
                },
                icon: 'stack'
            }, {
                name: jingzhi,
                textStyle: {
                    color: '#fff'
                },
                icon: 'pie'
            }]
        },
        grid: {
            top: '15%',
            left: '3%',
            right: '6%',
            bottom: '15%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            axisLine: {
                lineStyle: {
                    color: '#cdc9c9'
                }
            },
            data: date
        },
        yAxis: {
            type: 'value',
            axisLine: {
                lineStyle: {
                    color: '#cdc9c9'
                }
            },
            splitLine: {
                lineStyle: {
                    // 使用深浅的间隔色
                    color: ['#777676']
                }
            },
        },
        series: [{
            symbol: "none",
            name: zongshouyi,
            type: 'line',
            stack: '总量',
            itemStyle: {
                normal: {
                    lineStyle: {
                        color: '#2f688d'
                    }
                }
            },
            data: value
        }, {
            symbol: "none",
            name: jingzhi,
            type: 'line',
            stack: '总量',
            itemStyle: {
                normal: {
                    lineStyle: {
                        color: '#38bd73'
                    }
                }
            },
            data: value2
        }]
    };
    ;
    if (option && typeof option === "object") {
        myChart.setOption(option, true);
    }
}

/**
 * 根据用户id查询订单币种统计
 */
function getOrderByCurrency() {
    $.ajax({
        url: "../../usdtpc/auth/getOrderByCurrency",
        data: {
            "userid": urluserid
        },
        method: "GET",
        success: function (data) {
            if (data.code == 100) {

                getTradeType(data.order);
            } else if (data.code == 101) {
                //				if (language == 2) {
                //					tishi("No data");
                //				} else {
                //					tishi("暂无数据");
                //				}
            } else if (data.code == 401) {
                tokenLoseEfficacy();
                token = $api.getStorage("token");
                getOrderByCurrency();
            } else {
                if (language == 2) {
                    tishi("Network problems, please try again.");
                } else {
                    tishi("网络出现问题,请重试");
                }
            }
        },
        error: function (err) {
        }
    })
}

function getTradeType(result) {
    var dom = document.getElementById("typeSetBox");
    var myChart = echarts.init(dom);
    var app = {};
    var title = "币种配置";
    if (language == 2) {
        title = "Currency configuration";
    }
    option = null;
    var xarray = new Array();
    var yarray = new Array();
    var zongcount = 0;
    for (var i = 0; i < result.length; i++) {
        zongcount = zongcount + result[i].scnum;
    }
    for (var i = 0; i < result.length; i++) {
        if (result[i].scnum > 0) {
            var zb = ((result[i].scnum / zongcount) * 100).toFixed(2);
            var showname = result[i].y_name + " " + zb + "%";
            xarray[i] = showname;
            var sdata = {
                value: result[i].scnum,
                name: showname
            };
            yarray[i] = sdata;
        }
    }
    var option = {
        //		legend : {
        //			type : 'scroll',
        //			orient : 'vertical',
        //			right : 0,
        //			bottom : 20,
        //			textStyle : {
        //				color : '#ccc'
        //			},
        //			data : xarray
        //		},
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        calculable: true,
        series: [{
            name: '币种配置',
            type: 'pie',
            radius: ['20%', '60%'],
            avoidLabelOverlap: false,
            itemStyle: {
                emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                },

            },
            data: yarray
        }],
        color: ['#000080', '#8B6508', '#C71585', '#778899', '#C1FFC1', '#8B2500', '#BF3EFF', '#B3EE3A', '#CD3333', '#FFE4B5', '#8EE5EE']

    };
    myChart.setOption(option, true);
}

function getUserIncomeStatistics() {
    $.ajax({
        url: "../../usdtpc/auth/getUserIncomeStatistics",
        data: {
            "userid": urluserid
        },
        method: "GET",
        success: function (data) {

            if (data.code == 100) {
                $("#tp_recharge").html("$" + "" + unde(data.amoney, "0"));

                $("#tp_withdraw").html("$" + "" + unde(data.bmoney, "0"));
                $("#tp_trannumber").html(unde(data.zongnum, "0") + "" + "笔");
                $("#tp_maxincome").html("$" + "" + unde(data.maxincome, "0"));
                $("#tp_minincome").html("$" + "" + unde(data.minincome, "0"));

                $("#tp_Btrannumber").html("$" + "" + unde(data.bqu, "0"));
                $("#tp_Atrannumber").html("$" + "" + unde(data.aqu, "0"));
                $("#tp_Daytrannumber").html(unde(data.cqu, "0") + "" + "笔");
                aaa();
            } else {

            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            if (Number(XMLHttpRequest.status) != 0 && XMLHttpRequest.readyState != 0 && textStatus != "error" && errorThrown.length != 0) {
                //alert("网络异常，请您检查网络后刷新页面！");
            } else if ("timeout" == textStatus && "timeout" == errorThrown) {
                //alert("请求超时，请您检查网络后刷新页面！");
            } else {
                //alert("网络异常，请您检查网络后刷新页面！");
            }
        }
    });
}

/**
 * 根据用户id分区查询最近订单
 * @param style
 */
function getOrderByTradeSector(style) {
    $.ajax({
        url: "../../usdtpc/auth/getOrderByTradeSector",
        data: {
            "userid": urluserid,
            "style": style,
            "begintime": null,
            "endtime": null,
            page: 1,
            number: 5
        },
        method: "GET",
        success: function (data) {

            if (data.code == 100) {
                var str = "";
                var str1 = "";
                for (var i in data.order) {
                    var order = data.order[i];
                    if (i == 0) {
                        str += "<li class=\"activeLi\">";
                        str1 += "<li class=\"activeLi\">";
                    } else {
                        str += "<li>";
                        str1 += "<li>";
                    }
                    var total_revenue = (unde(order.income, 0) / unde(order.purchase, 1) * 100).toFixed(2);
                    str += "<i class=\"iconfont icon-xiala2-01\" onclick=\"shrinkBtn(this)\"></i>";
                    str += "<p>订单号";
                    str += " <span class=\"rightFont\">" + order.orderid + "</span>";
                    str += "</p>";
                    str += "<p>品种";
                    str += " <span class=\"rightFont\">" + order.y_name + "</span>";
                    str += "</p>";
                    str += "<div class=\"shrinkDiv\">";
                    str += " <p>买入价";
                    str += " <span class=\"rightFont\">" + order.beginprice + "</span>";
                    str += "</p>";
                    str += "<p>买入数量";
                    str += "<span class=\"rightFont\">" + order.purchase + "</span>";
                    str += "</p>";
                    str += "<p>买入/涨跌";
                    if (order.rise_fall != 1) {
                        str += "  <span class=\"rightFont\">买涨</span>";
                    } else {
                        str += "  <span class=\"rightFont\">买跌</span>";
                    }
                    str += " </p>";
                    str += "<p>盈值";
                    if (total_revenue >= 0) {
                        str += " <span class=\"greenColor rightFont\">" + total_revenue + "%</span>";
                    } else {
                        str += " <span class=\"redColor rightFont\">" + total_revenue + "%</span>";
                    }
                    str += "</p>";
                    str += " <p>M/时间";
                    str += " <span class=\"rightFont\">M" + order.minute + "</span>";
                    str += "</p>";
                    str += " <p>买入持仓";
                    if (order.style == 0) {
                        str += "  <span class=\"rightFont\">进行中</span>";
                    } else {
                        str += "  <span class=\"rightFont\">已完成</span>";
                    }
                    str += " </p>";
                    str += "<p>盈利/亏损";
                    if (order.income < 0) {
                        str += " <span class=\"redColor rightFont\">亏损</span>";
                    } else {
                        str += " <span class=\"greenColor rightFont\">盈利</span>";
                    }

                    str += " </p>";
                    str += "<p>金额";
                    if (order.income >= 0) {
                        str += "  <span class=\"greenColor rightFont\">" + order.income + "</span>";
                    } else {
                        str += "  <span class=\"redColor rightFont\">" + order.income + "</span>";
                    }

                    str += " </p>";
                    str += "</div>";
                    str += " </li>";
                    /*
                     *
                     *
                     *
                     * */
                    str1 += " <i class=\"iconfont icon-xiala2-01\" onclick=\"shrinkBtn(this)\"></i>";
                    str1 += "<p>订单号";
                    str1 += "  <span class=\"rightFont\">" + order.orderid + "</span>";
                    str1 += "</p>";
                    str1 += "<p>品种";
                    str1 += " <span class=\"rightFont\">" + order.y_name + "</span>";
                    str1 += "</p>";
                    str1 += "<div class=\"shrinkDiv\">";
                    str1 += "  <p>买入价";
                    str1 += "   <span class=\"rightFont\">" + order.beginprice + "</span>";
                    str1 += " </p>";
                    str1 += " <p>买入/USDT量";
                    str1 += "   <span class=\"rightFont\">" + order.purchase + "</span>";
                    str1 += "</p>";
                    str1 += "<p>买入/涨跌";
                    if (order.rise_fall != 1) {
                        str1 += "  <span class=\"rightFont\">买涨</span>";
                    } else {
                        str1 += "  <span class=\"rightFont\">买跌</span>";
                    }

                    str1 += " </p>";
                    str1 += "<p>止盈止损";
                    str1 += " <span class=\"rightFont\">" + order.range + "%</span>";
                    str1 += "</p>";
                    str1 += " <p>盈损率";
                    var ysz = (parseFloat(order.icrease) * 100).toFixed(2);
                    if (ysz >= 0) {
                        str1 += "  <span class=\"greenColor rightFont\">" + (parseFloat(order.icrease) * 100).toFixed(2) + "%</span>";
                    } else {
                        str1 += "  <span class=\"redColor rightFont\">" + (parseFloat(order.icrease) * 100).toFixed(2) + "%</span>";
                    }
                    str1 += "</p>";
                    str1 += " <p>买入时间";
                    str1 += "  <span class=\"rightFont\">" + order.createtime + "</span>";
                    str1 += "</p>";
                    str1 += "<p>买入持仓";
                    if (order.style == 0) {
                        str1 += "  <span class=\"rightFont\">进行中</span>";
                    } else {
                        str1 += "  <span class=\"rightFont\">已完成</span>";
                    }

                    str1 += " </p>";
                    str1 += "<p>盈利/亏损";
                    if (order.income >= 0) {
                        str1 += " <span class=\"greenColor rightFont\">盈利</span>";
                    } else {
                        str1 += " <span class=\"redColor rightFont\">亏损</span>";
                    }

                    str1 += "</p>";
                    str1 += "<p>金额";
                    if (order.income >= 0) {
                        str1 += "  <span class=\"greenColor rightFont\">" + order.income + "</span>";
                    } else {
                        str1 += "  <span class=\"redColor rightFont\">" + order.income + "</span>";
                    }
                    str1 += " </p>";
                    str1 += "</div>";
                    str1 += " </li>";

                }
                if (style == 0) {
                    $("#AQUTable").html(str);
                } else {
                    $("#BQUTable").html(str1);
                }

            } else if (data.code == 101) {
                //				if (language == 2) {
                //					tishi("No data");
                //				} else {
                //					tishi("暂无数据");
                //				}
            } else if (data.code == 401) {
                tokenLoseEfficacy();
                token = $api.getStorage("token");
                getOrderByTradeSector(style);
            } else {
                if (language == 2) {
                    tishi("Network problems, please try again.");
                } else {
                    tishi("网络出现问题,请重试");
                }
            }
        },
        error: function (err) {

        }
    })
}

/**
 * 根据用户id查询关注的交易员
 */
function getFollower() {
    $.ajax({
        url: "../../usdtpc/auth/getFollowerTraderById",
        data: {
            "userid": urluserid
        },
        method: "POST",
        success: function (data) {
            if (data.code == 100) {
                var str = "";
                for (var i in data.concern) {
                    var concern = data.concern[i];
                    str += "<li name='" + concern.userid + "'  style='background-color: #1b1e23'>";
                    str += "<img onclick=\"openWinReload('个人主页','myPages.html?userid=" + concern.userid + "')\" src=\"" + concern.img + "\">";
                    str += "<div class=\"rightBox\">";
                    str += "<div>";
                    str += concern.nickname;
                    if (userid == urluserid) {
                        str += " <a onclick='unAttention(\"" + concern.userid + "\")'>取消关注</a>";
                    }
                    str += " </div>";
                    str += "<p>关注";
                    str += "<span>" + concern.follow_num + "</span>粉丝";
                    str += "<span>" + concern.fans_num + "</span>";
                    str += "</p>";
                    str += "<div>个人简介:" + unde(concern.signature, "这人很懒，什么都没有留下") + "</div>";
                    str += "<i>关注时间：" + concern.createtime + "</i>";
                    str += "</div>";
                    str += "</li>";
                }
                $("#GuanZhu").html(str);
            } else if (data.code == 101) {
                //				if (language == 2) {
                //					tishi("No data");
                //				} else {
                //					tishi("暂无数据");
                //				}
            } else if (data.code == 401) {
                tokenLoseEfficacy();
                token = $api.getStorage("token");
                getFollower();
            } else {
                if (language == 2) {
                    tishi("Network problems, please try again.");
                } else {
                    tishi("网络出现问题,请重试");
                }
            }
        },
        error: function (err) {
        }
    })
}

/*
 *查看持仓推荐
 *
 */

function getFollowOrder() {
    if (dengji > 3) {

        $.ajax({
            url: "../../usdtpc/auth/getFollowOrder",
            data: {
                "userid": urluserid,
                "follower": userid
            },
            method: "GET",
            success: function (data) {
                var str = "";
                if (data.code == 100) {
                    for (var i in data.order) {
                        var order = data.order[i];
                        if (typeof (order.isgm) == 'undefined' || order.isgm == null || order.isgm == '') {
                            if (userid != urluserid) {
                                str += "<li onclick=\"showDialog('" + order.orderid + "','" + unde(order.fans_num, 0) + "','" + order.surplus + "','" + order.charge + "')\">";
                            } else {
                                str += "<li class=\"activePageLi\">";
                            }
                        } else {
                            str += "<li class=\"activePageLi\">";
                            if (userid != urluserid) {
                                str += "<a class=\"RightFlot\">已付费</a>";
                            }
                        }

                        str += "<div class=\"topBox\">";
                        str += " <div>";
                        str += " <span>订单号</span>";
                        str += "<span>" + order.orderid + "</span>";
                        str += "</div>";
                        str += "<div class=\"smailBox\">";
                        str += " <span>品种</span>";
                        str += " <span>" + order.y_name + "</span>";
                        str += " </div>";
                        str += "<div>";
                        str += " <span>买入现价</span>";
                        str += "<span>$" + order.beginprice + "</span>";
                        str += "</div>";
                        str += " <div>";
                        str += " <span>买入时间</span>";
                        str += "  <span>" + order.createtime.substring(0, 10) + "";
                        str += " </span>";
                        str += " </div>";
                        str += " </div>";
                        str += " <div class=\"bottomBox\">";
                        str += " <p>";
                        if (order.rise_fall != 1) {
                            str += " <a>买涨</a>";
                            str += " <a>止盈</a>";
                        } else {
                            str += " <a>买跌</a>";
                            str += " <a>止损</a>";
                        }

                        str += " </p>";
                        str += "<span class=\"firstSpan\">盈损率";
                        str += "   <i>" + ((order.icrease) * 100).toFixed(2) + "%</i>";
                        str += " </span>";
                        str += " <span>买入USDT量";
                        str += "  <i>" + order.purchase + "$</i>";
                        str += " </span>";
                        str += " <span>";
                        if (order.style == 0) {
                            str += "  <i>进行中</i>";
                        } else {
                            str += "  <i>已结束</i>";
                        }
                        str += " </span>";
                        str += "</div>";
                        str += " </li>";
                    }
                    $("#ChiCangTuiJian").html(str);
                } else if (data.code == 101) {
                    //					if (language == 2) {
                    //						tishi("No data");
                    //					} else {
                    //						tishi("暂无数据");
                    //					}
                } else if (data.code == 401) {
                    tokenLoseEfficacy();
                    token = $api.getStorage("token");
                    getFollowOrder();
                } else {
                    if (language == 2) {
                        tishi("Network problems, please try again.");
                    } else {
                        tishi("网络出现问题,请重试");
                    }
                }
            },
            error: function (err) {
            }
        })
    } else {

    }
}

function showDialog(orderid, fans_num, surplus, charge) {

}


function qx() {
    popup.hide();
}


Date.prototype.Format = function (formatStr) {
    var str = formatStr;
    var Week = ['日', '一', '二', '三', '四', '五', '六'];

    str = str.replace(/yyyy|YYYY/, this.getFullYear());
    str = str.replace(/yy|YY/, (this.getYear() % 100) > 9 ? (this.getYear() % 100).toString() : '0' + (this.getYear() % 100));

    str = str.replace(/MM/, this.getMonth() > 8 ? (this.getMonth() + 1).toString() : '0' + (this.getMonth() + 1));
    str = str.replace(/M/g, this.getMonth() + 1);

    str = str.replace(/w|W/g, Week[this.getDay()]);

    str = str.replace(/dd|DD/, this.getDate() > 9 ? this.getDate().toString() : '0' + this.getDate());
    str = str.replace(/d|D/g, this.getDate());

    str = str.replace(/hh|HH/, this.getHours() > 9 ? this.getHours().toString() : '0' + this.getHours());
    str = str.replace(/h|H/g, this.getHours());
    str = str.replace(/mm/, this.getMinutes() > 9 ? this.getMinutes().toString() : '0' + this.getMinutes());
    str = str.replace(/m/g, this.getMinutes());

    str = str.replace(/ss|SS/, this.getSeconds() > 9 ? this.getSeconds().toString() : '0' + this.getSeconds());
    str = str.replace(/s|S/g, this.getSeconds());

    return str;
}

function unde(key, value) {
    if (typeof (key) == "undefined") {
        return value;
    } else {
        return key;
    }

}

/**
 * 获取url 地址栏请求参数数据
 */
function GetRequest() {
    var url = location.search;
    // 获取url中"?"符后的字串
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
        }
    }
    return theRequest;
}

$(function () {
    getUserInfoById();
    getUserEarningsTop();
    getTraderEarningsByType();
    getUserIncomeStatistics();
    getNetValueBalanceById("week");
    getOrderByCurrency();
    getOrderByTradeSector(0);
    getOrderByTradeSector(1);
    getFollower();
    openTraderListener();
})