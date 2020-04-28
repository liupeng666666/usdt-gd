/**
 * 个人详情JS
 */
/*----------------------------本页面全局变量--------------------------------*/
// 用户id
var userid = null;
//请求栏id
var urluserid = null;
// token
var token;
// 语言类型
var language;
//用户等级
var userlevl = 0;
//是否是交易员
var istrader = false;
//可跟随订单集合
var orderlist;
//接下来要查阅的订单id
var orderid;
//接下来要查阅的订单手续费
var ordersxf;
//用户余额；
var userye;
/*---------------------------------------------------------------------*/
$(function () {
    userid = window.sessionStorage.getItem("userid");
    token = window.sessionStorage.getItem("token");
    changHead(userid);
    var request = new Object();
    request = GetRequest();
    urluserid = request["userid"];
    if (urluserid == undefined || urluserid == null || urluserid == "") {
        urluserid = userid;
    }
    getUserInfoById();
    openTraderListener();
    getFollower();
    getUserEarningsTop();
    getTraderEarningsByType();
    getFollowOrder();
    getOrderByCurrency();
    getOrderByTradeSector(0);
    getRateOfReturnByTime("week");
    getIncomeAmountByTime("week");
    getNetValueBalanceById("week");
    getUserIncomeStatistics();
    language = window.localStorage.getItem("language");
    if (language != undefined && language != null & language == 2) {
        loadProperties();
    }
});

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
                    showHint("您当前等级无法开启交易员");
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

function changeUserTraderState(trader) {
    $.ajax({
        url: "../usdtpc/subuser/changUserInfoById",
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
                token = window.sessionStorage.getItem("token");
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

/**
 * 根据用户id获取用户详细信息
 */
function getUserInfoById() {
    $.ajax({
        url: "../usdtpc/auth/getUserInfoById",
        data: {
            "userid": urluserid
        },
        method: "POST",
        success: function (data) {
            if (isString(data)) {
                data = JSON.parse(data);
            }
            if (data.code == 100) {
                if (language == 2) {
                    if (data.user.real_name == 0) {
                        $("#real_name").html("<img src=\"img/certification.png\">No real name");
                    } else {
                        $("#real_name").html("<img src=\"img/certification.png\">Have real name");
                    }
                    if (data.user.sex == 0) {
                        $("#sex").html("<i class=\"iconfont icon-nan\"></i>Unknown");
                    } else if (data.user.sex == 1) {
                        $("#sex").html("<i class=\"iconfont icon-nan\"></i>male");
                    } else if (data.user.sex == 2) {
                        $("#sex").html("<i class=\"iconfont icon-nan\"></i>woman");
                    }
                    if (data.user.region == undefined || data.user.region == null || data.user.region == "") {
                        $("#region").html("<i class=\"iconfont icon-weizhi\"></i>Temporarily not set");
                    } else {
                        $("#region").html("<i class=\"iconfont icon-weizhi\"></i>" + data.user.region + "");
                    }
                    if (data.user.signature == undefined || data.user.signature == null || data.user.signature == "") {
                        $("#signature").html("<i class=\"iconfont icon-mingpian\"></i>This guy was lazy and left nothing behind");
                    } else {
                        $("#signature").html("<i class=\"iconfont icon-mingpian\"></i>" + data.user.signature + "");
                    }
                    if (data.user.trading_strategy == undefined || data.user.trading_strategy == null || data.user.trading_strategy == "") {
                        $("#trading_strategy").html("No trading strategy has been written yet");
                    } else {
                        $("#trading_strategy").html(data.user.trading_strategy);
                    }
                    $("#createtime").html("<i class=\"iconfont icon-shijian\"></i>registration date：" + data.user.createtime + "</p>");
                } else {
                    if (data.user.real_name == 0) {
                        $("#real_name").html("<img src=\"img/certification.png\">未实名");
                    } else {
                        $("#real_name").html("<img src=\"img/certification.png\">已实名");
                    }
                    if (data.user.sex == 0) {
                        $("#sex").html("<i class=\"iconfont icon-nan\"></i>未知");
                    } else if (data.user.sex == 1) {
                        $("#sex").html("<i class=\"iconfont icon-nan\"></i>男");
                    } else if (data.user.sex == 2) {
                        $("#sex").html("<i class=\"iconfont icon-nan\"></i>女");
                    }
                    if (data.user.region == undefined || data.user.region == null || data.user.region == "") {
                        $("#region").html("<i class=\"iconfont icon-weizhi\"></i>暂未设置");
                    } else {
                        $("#region").html("<i class=\"iconfont icon-weizhi\"></i>" + data.user.region + "");
                    }
                    if (data.user.signature == undefined || data.user.signature == null || data.user.signature == "") {
                        $("#signature").html("<i class=\"iconfont icon-mingpian\"></i>这个人很懒，什么都没有留下");
                    } else {
                        $("#signature").html("<i class=\"iconfont icon-mingpian\"></i>" + data.user.signature + "");
                    }
                    if (data.user.trading_strategy == undefined || data.user.trading_strategy == null || data.user.trading_strategy == "") {
                        $("#trading_strategy").html("暂未编写交易策略");
                    } else {
                        $("#trading_strategy").html(data.user.trading_strategy);
                    }
                    $("#createtime").html("<i class=\"iconfont icon-shijian\"></i>注册时间：" + data.user.createtime + "</p>");
                }
                $("#img").html("<img class=\"headerImg\" onerror=\"javascript:this.src='img/head.png';\" src=\"" + data.user.img + "\">");
                $("#nickname").html(data.user.nickname);
                userlevl = data.user.startnum;
                $("#startnum").html("<input readonly class=\"detailStar\" value=\"" + data.user.startnum + "\" type=\"text\" title=\"\">");
                $("#follow_num").html(data.user.follow_num);
                $("#fans_num").html(data.user.fans_num);
                $("#cnum").html(data.user.cnum);
                var z_jz = (parseFloat(data.user.income) + parseFloat(data.user.loss) - parseFloat(data.user.trade)).toFixed(2);
                if (z_jz < 0) {
                    $("#surplus").html("-$" + (0 - z_jz));
                    $("#tp_networth").html("-$" + (0 - z_jz));
                } else {
                    $("#surplus").html("+$" + z_jz);
                    $("#tp_networth").html("+$" + z_jz);
                }
                $("#tp_surplus").html("$" + unde(data.user.surplus, 0).toFixed(2));
                var incomeamount = data.user.income + data.user.loss;
                $("#tp_incomeamount").html("$" + unde(incomeamount, 0).toFixed(2));
                $("#tp_createtime").html(data.user.createtime);
                var total_revenue = 0;
                if (data.user.putinto != 0) {
                    total_revenue = toDecimal2((data.user.income / data.user.putinto) * 100);
                }
                var z_yl = (parseFloat(data.user.income) + parseFloat(data.user.loss)).toFixed(2);
                if (z_yl < 0) {
                    $("#total_revenue").html("-$" + (0 - z_yl));
                } else {
                    $("#total_revenue").html("+$" + z_yl);
                }
                $(".detailStar").rating({
                    min: 0,
                    max: 5,
                    step: 0.5,
                    size: "xl",
                    stars: "5",
                    showClear: false
                });
                if (userid == urluserid) {
                    $("#person_follow_div").hide();
                    if (data.user.trader == 0) {
                        document.querySelector("input.widget_switch_checkbox").checked = false;
                    } else if (data.user.trader == 1) {
                        document.querySelector("input.widget_switch_checkbox").checked = true;
                    }
                } else {
                    if (data.user.trader == 0) {
                        istrader = false;
                        document.querySelector("input.widget_switch_checkbox").checked = false;
                        $("#person_follow_div").hide();
                    } else if (data.user.trader == 1) {
                        istrader = true;
                        document.querySelector("input.widget_switch_checkbox").checked = true;
                        getFollowOrder();
                    }
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
 * 根据用户id查询关注的交易员
 */
function getFollower() {
    $.ajax({
        url: "../usdtpc/auth/getFollowerTraderById",
        data: {
            "userid": urluserid
        },
        method: "POST",
        success: function (data) {
            if (isString(data)) {
                data = JSON.parse(data);
            }
            if (data.code == 100) {
                var result = data.concern;
                var info = "";
                for (var i = 0; i < result.length; i++) {
                    if (language == 2) {
                        info += "<li onclick=\"jumpPerson('" + result[i].userid + "');\"><img onerror=\"javascript:this.src='img/head.png';\" src=\"" + result[i].img + "\"><div class=\"followNum\">";
                        info += "<input readonly class=\"Ftrader\" value=\"" + result[i].startnum + "\" type=\"text\" title=\"\">";
                        info += "<p>Follow the number：<span>" + result[i].follow_num + "人</span></p></div><div class=\"Fright\">";
                        if (result[i].putinto == 0) {
                            info += "<p class=\"greenColor\">-</p><p>Yield</p></div></li>";
                        } else {
                            var total_revenue = toDecimal2((result[i].er * 100));
                            if (total_revenue >= 0) {
                                info += "<p class=\"greenColor\">" + total_revenue + "%</p><p>Yield</p></div></li>";
                            } else {
                                info += "<p class=\"redColor\">" + total_revenue + "%</p><p>Yield</p></div></li>";
                            }

                        }
                        if (i == 4 && result.length > 4) {
                            info += "<div class=\"hidetrader\">";
                        }

                    } else {
                        info += "<li onclick=\"jumpPerson('" + result[i].userid + "');\"><img src=\"" + result[i].img + "\" onerror=\"javascript:this.src='img/head.png';\"><div class=\"followNum\">";
                        info += "<input readonly class=\"Ftrader\" value=\"" + result[i].startnum + "\" type=\"text\" title=\"\">";
                        info += "<p>关注人数：<span>" + result[i].follow_num + "人</span></p></div><div class=\"Fright\">";
                        if (result[i].putinto == 0) {
                            info += "<p class=\"greenColor\">-</p><p>收益率</p></div></li>";
                        } else {
                            var total_revenue = toDecimal2((result[i].er * 100));
                            if (total_revenue >= 0) {
                                info += "<p class=\"greenColor\">" + total_revenue + "%</p><p>收益率</p></div></li>";
                            } else {
                                info += "<p class=\"redColor\">" + total_revenue + "%</p><p>收益率</p></div></li>";
                            }
                        }
                        if (i == 4 && result.length > 4) {
                            info += "<div class=\"hidetrader\">";
                        }
                    }
                }
                if (result.length > 4) {
                    info += "</div>";
                }
                info += "<p class=\"drapdownBtn\" onclick=\"traderBtn()\"><i class=\"glyphicon glyphicon-menu-down\"></i></p>";
                $("#personal_follower").html(info);
                $(".Ftrader").rating({
                    min: 0,
                    max: 5,
                    step: 0.5,
                    size: "xl",
                    stars: "5",
                    showClear: false
                });
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

///**
// * 查询用户天、周、月排行榜排名
// */
function getUserEarningsTop() {
    $.ajax({
        url: "../usdtpc/auth/getUserEarningsTopByTime",
        data: {
            "userid": urluserid
        },
        method: "POST",
        success: function (data) {
            if (isString(data)) {
                data = JSON.parse(data);
            }
            if (data.code == 100) {
                if (data.daypurchase > 0) {

                    $("#day").html((data.dayer * 100).toFixed(2) + "%");
                } else {
                    $("#day").html("0.00%");
                }
                if (data.weekpurchase > 0) {
                    $("#week").html((data.weeker * 100).toFixed(2) + "%");
                } else {
                    $("#week").html("0.00%");
                }
                if (data.monthpurchase > 0) {
                    $("#month").html((data.monther * 100).toFixed(2) + "%");
                } else {
                    $("#month").html("0.00%");
                }
                $("#top").html(data.top);
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

///**
// * 获取用户的订单收益、佣金收益、查看收益
// */
function getTraderEarningsByType() {
    $.ajax({
        url: "../usdtpc/auth/getTraderEarningsByType",
        data: {
            "userid": urluserid
        },
        method: "POST",
        success: function (data) {
            if (isString(data)) {
                data = JSON.parse(data);
            }
            if (data.code == 100) {
                $("#order_earnings").html("$" + data.brokerage);
                $("#tp_followincome").html("$" + data.brokerage);
                $("#brokerage_earnings").html("$" + data.select);
                //				var followincome = Number(data.select) + Number(data.brokerage);
                $("#tp_liushuiyongjin").html("$" + data.select);
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

///**
// * 获取用户可跟随订单
// */
function getFollowOrder() {
    $.ajax({
        url: "../usdtpc/auth/getFollowOrder",
        data: {
            "userid": urluserid,
            "follower": userid
        },
        method: "GET",
        success: function (data) {
            if (isString(data)) {
                data = JSON.parse(data);
            }
            if (data.code == 100) {
                var info = "";
                var result = data.order;
                orderlist = result;
                userye = result[0].surplus;
                info += "<li><p><span data-locale=\"person.dingdanhao\">订单号</span><span data-locale=\"person.mairushijian\">买入/时间</span><span data-locale=\"data-locale=\"person.pinzhong\">品种</span>" +
                    "<span data-locale=\"person.mairuxianjia\">买入现价</span><span data-locale=\"person.mairuusdtliang\">买入USDT量</span>";
                info += " <span data-locale=\"person.mairuzhangdie\">买入/涨跌</span> <span data-locale=\"person.zhiyingzhisun\">止盈/止损</span>";
                info += "<span data-locale=\"person.yingsunlv\">盈损/率</span>";
                info += "<span data-locale=\"person.mairuchicang\">买入持仓</span><span></span></p></li>";
                for (var i = 0; i < result.length; i++) {
                    if (language == 2) {
                        info += "<li id=\"follow_id_" + result[i].pid + "\"><p><span>" + result[i].orderid + "</span><span style='line-height: 20px;padding-top: 4px'>" + result[i].createtime + "</span><span>" + result[i].y_name + "</span>";
                        info += "<span>" + result[i].beginprice + "$</span><span>$" + result[i].purchase + "</span>";
                        if (result[i].isgm != undefined && result[i].isgm != null && result[i].isgm != "") {
                            if (result[i].rise_fall != 1) {
                                info += "<span class=\"greenColor\">Buy up</span> <span>stop profit</span>";
                            } else {
                                info += "<span class=\"redColor\">To buy</span><span>stop loss</span>";
                            }
                            info += "<span>" + ((order.icrease) * 100).toFixed(2) + "%</span>";
                            info += "<span>have in hand </span><span class=\"grayColor\">Have to see</span></p></li>";

                        } else {
                            if (result[i].rise_fall != 1) {
                                info += "<span >*</span> <span>*</span>";
                            } else {
                                info += "<span >*</span><span>*</span>";
                            }
                            info += "<span>*</span>";
                            info += "<span>*</span><span class=\"grayColor\"><a class=\"checkTrade\" >examine</a></span></p>";
                            info += "<div class=\"payBox\"><p><span>View trade recommendations：</span><i class=\"orangeColor\">$" + result[i].charge + "</i></p>";
                            info += "<p><span>Follow the number：</span><i class=\"orangeColor\">" + result[i].num + "</i></p>";
                            if (result[i].surplus == undefined || result[i].surplus == null || result[i].surplus == "") {
                                info += "<p><span>Balance：</span><i class=\"graysColor\">0</i></p>";
                            } else {
                                info += "<p><span>Balance：</span><i class=\"graysColor\">" + result[i].surplus + "</i></p>";
                            }
                            info += "<div><button class=\"cancelBtn\" onclick=\"cancelTrade(this)\">cancel</button>";
                            info += "<button class=\"submitBtn\" type=\"button\" onclick=\"jumpOrderInfo('" + result[i].pid + "','" + result[i].charge + "')\">pay</button></div></div></li>";
                        }
                    } else {
                        info += "<li id=\"follow_id_" + result[i].pid + "\"><p><span>" + result[i].orderid + "</span><span style='line-height: 20px;padding-top: 4px'>" + result[i].createtime + "</span><span>" + result[i].y_name + "</span>";
                        info += "<span>" + result[i].beginprice + "$</span><span>$" + result[i].purchase + "</span>";
                        if (typeof (result[i].isgm) != "undefined" && result[i].isgm != null && result[i].isgm != "") {
                            if (result[i].rise_fall != 1) {
                                info += "<span class=\"greenColor\">买涨</span> <span>止盈</span>";
                            } else {
                                info += "<span class=\"redColor\">买跌</span> <span>止损</span>";
                            }
                            info += "<span>" + ((result[i].icrease) * 100).toFixed(2) + "%</span>";
                            info += "<span>进行中</span><span  class=\"grayColor\">已查看</span></p></li>";
                        } else {
                            if (result[i].rise_fall != 1) {
                                info += "<span >*</span> <span>*</span>";
                            } else {
                                info += "<span >*</span><span>*</span>";
                            }
                            info += "<span>*</span>";
                            info += "<span>*</span><span class=\"grayColor\"><a class=\"checkTrade\" >查看</a></span></p>";
                            info += "<div class=\"payBox\"><p><span>查看交易推荐：</span><i class=\"orangeColor\">$" + result[i].charge + "</i></p>";
                            info += "<p><span>跟随人数：</span><i class=\"orangeColor\">" + result[i].num + "</i></p>";
                            if (result[i].surplus == undefined || result[i].surplus == null || result[i].surplus == "") {
                                info += "<p><span>余额：</span><i class=\"graysColor\">0</i></p>";
                            } else {
                                info += "<p><span>余额：</span><i class=\"graysColor\">" + result[i].surplus + "</i></p>";
                            }
                            info += "<div><button class=\"cancelBtn\" onclick=\"cancelTrade(this)\">取消</button>";
                            info += "<button class=\"submitBtn\" type=\"button\"  onclick=\"jumpOrderInfo('" + result[i].pid + "','" + result[i].charge + "')\">支付</button></div></div></li>";
                        }
                    }
                }
                $("#followOrder").html(info);
                $('.checkTrade').hover(function () {
                    var state = $(this).parent().parent().next().css("display");
                    $(".payBox").hide();
                    if (state == "none") {
                        $(this).parent().parent().next().slideToggle();
                    }
                }, function () {
                });
                if (language == 2) {
                    loadProperties();
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

//
function hidePayDialog() {
    $("#person_pay").hide();
}

///**
// * 跳转到订单详情页
// * @param pid
// */
function jumpOrderInfo(pid, sxf) {
    if (userid == undefined || userid == null || userid == "") {
        window.location.href = "login/login.html";
    } else {
        if ((userye - Number(sxf)) >= 0) {
            for (var i = 0; i < orderlist.length; i++) {
                if (orderlist[i].pid == pid) {
                    var date = new Date();
                    nowtime = date.getTime();
                    var edate = date.setDate(date.getDate() + orderlist.end_minute);
                    var etime = new Date(edate);
                    var endtime = etime.getTime();

                    orderid = orderlist[i].orderid;
                    ordersxf = sxf;
                    $("#person_pay_content").html("确认支付" + sxf + "USDT查看TA的订单推荐？")
                    $("#person_pay").show();

                }
            }
        } else {
            showHint("您的余额不足");
        }
    }
}

//
function showConcealOrder() {
    var pid;
    $.ajax({
        url: "../usdtpc/subtraderearnings/addTradeEarnings",
        method: "POST",
        data: {
            "userid": urluserid,
            "orderid": orderid,
            "follower": userid,
            "type": 2,
            "money": ordersxf
        },
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        success: function (data) {
            if (isString(data)) {
                data = JSON.parse(data);
            }
            if (data.code == 100) {
                var info = "";
                $(".dialogBox").hide();
                for (var i = 0; i < orderlist.length; i++) {
                    if (orderlist[i].orderid == orderid) {
                        pid = orderlist[i].pid;
                        if (language == 2) {
                            info += "<p><span>" + orderlist[i].orderid + "</span><span>" + orderlist[i].createtime + "</span><span>" + orderlist[i].y_name + "</span>";
                            info += "<span>" + orderlist[i].beginprice + "$</span><span>$" + orderlist[i].purchase + "</span>";
                            if (orderlist[i].rise_fall != 1) {
                                info += "<span class=\"greenColor\">Buy up</span> <span>stop profit</span>";
                            } else {
                                info += "<span class=\"redColor\">To buy</span><span>stop loss</span>";
                            }
                            info += "<span>10%</span>";
                            info += "<span>进行中</span><span  class=\"grayColor\">已查看</span></p>";
                        } else {
                            info += "<p><span>" + orderlist[i].orderid + "</span><span>" + orderlist[i].createtime + "</span><span>" + orderlist[i].y_name + "</span>";
                            info += "<span>" + orderlist[i].beginprice + "$</span><span>$" + orderlist[i].purchase + "</span>";
                            if (orderlist[i].rise_fall != 1) {
                                info += "<span class=\"greenColor\">买涨</span> <span>止盈</span>";
                            } else {
                                info += "<span class=\"redColor\">买跌</span> <span>止损</span>";
                            }
                            info += "<span>10%</span>";
                            info += "<span>进行中</span><span class=\"grayColor\">已查看</span></p>";
                        }
                    }
                }
                $("#follow_id_" + pid).html(info);
            } else if (data.code == 401) {
                tokenLoseEfficacy();
                token = window.sessionStorage.getItem("token");
                showConcealOrder();
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

///**
// * 根据用户id查询订单币种统计
// */
function getOrderByCurrency() {
    $.ajax({
        url: "../usdtpc/auth/getOrderByCurrency",
        data: {
            "userid": urluserid
        },
        method: "GET",
        success: function (data) {
            if (isString(data)) {
                data = JSON.parse(data);
            }
            if (data.code == 100) {
                var result = data.order;

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
                    legend: {
                        type: 'scroll',
                        orient: 'vertical',
                        right: 0,
                        top: 100,
                        bottom: 20,
                        textStyle: {
                            color: '#ccc'
                        },
                        data: xarray
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    calculable: true,
                    series: [{
                        name: '币种配置',
                        type: 'pie',
                        radius: ['20%', '70%'],
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
                var dom = document.getElementById("typeSetBox");
                var myChart = echarts.init(dom);
                myChart.setOption(option, true);
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
        url: "../usdtpc/auth/getOrderByTradeSector",
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
            if (isString(data)) {
                data = JSON.parse(data);
            }
            if (data.code == 100) {
                var result = data.order;
                var info = "";
                if (style == 0) {
                    info = "<div class=\"orderList\"><ul><li class=\"strongLi\"><span data-locale=\"person.dingdanhao\">订单号</span>";
                    info += "<span data-locale=\"person.pinzhong\">品种</span><span data-locale=\"person.mairuxianjia\">买入价</span>" +
                        "<span data-locale=\"person.mairuusdtliang\">买入数量</span><span data-locale=\"person.mairuzhangdie\">买涨/买跌</span>";
                    info += "<span data-locale=\"person.yingzhi\">盈值</span><span data-locale=\"person.mshijian\">M/时间</span>" +
                        "<span data-locale=\"person.mairuchicang\">买入持仓</span><span data-locale=\"person.yinglikuisun\">盈利/亏损</span><span data-locale=\"person.jine\">金额</span></li>";
                } else {
                    info = "<div class=\"orderList\"><ul><li class=\"strongLi\"><span data-locale=\"person.dingdanhao\">订单号</span>";
                    info += "<span data-locale=\"person.pinzhong\">品种</span><span data-locale=\"person.mairuxianjia\">买入价</span>" +
                        "<span data-locale=\"person.mairuusdtliang\">买入数量</span><span data-locale=\"person.mairuzhangdie\">买涨/买跌</span>";
                    info += "<span data-locale=\"person.yingzhi\">止盈止损</span><span data-locale=\"person.mshijian\">赢损率</span>" +
                        "<span data-locale=\"person.mairuchicang\">买入持仓</span><span data-locale=\"person.yinglikuisun\">盈利/亏损</span><span data-locale=\"person.jine\">金额</span></li>";
                }
                for (var i = 0; i < result.length; i++) {
                    if (language == 2) {
                        info += "<li><span>" + result[i].orderid + "</span><span>" + result[i].y_name + "</span>";
                        info += "<span>$" + unde(result[i].beginprice, 0) + "</span><span>$" + unde(result[i].purchase, 0) + "</span>";
                        if (result[i].rise_fall == 0) {
                            info += "<span class=\"greenColor\">Buy up</span>";
                        } else if (result[i].rise_fall == 1) {
                            info += "<span class=\"redColor\">To Buy</span>";
                        }
                        if (style == 0) {
                            var total_revenue = toDecimal2((unde(result[i].income, 0) / unde(result[i].purchase, 1) * 100));
                            info += "<span>" + result[i].range + "%</span><span>M" + result[i].minute + "</span><span>Completed</span>";
                        } else {
                            info += "<span>" + unde(result[i].range, 0) + "%</span><span>" + result[i].icrease * 100 + "%</span><span>Completed</span>";
                        }
                        if (result[i].income >= 0) {
                            info += "<span>profit</span><span class=\"greenColor\">+$" + unde(result[i].income, 0) + "</span></li>";
                        } else {
                            info += "<span>loss</span><span class=\"redColor\">-$" + (0 - unde(result[i].income, 0)) + "</span></li>";
                        }
                    } else {
                        info += "<li><span>" + unde(result[i].orderid, "") + "</span><span>" + result[i].y_name + "</span>";
                        info += "<span>$" + unde(result[i].beginprice, 0) + "</span><span>$" + unde(result[i].purchase, 0) + "</span>";
                        if (result[i].rise_fall == 0) {
                            info += "<span class=\"greenColor\">买涨</span>";
                        } else if (result[i].rise_fall == 1) {
                            info += "<span class=\"redColor\">买跌</span>";
                        }
                        if (style == 0) {
                            var total_revenue = toDecimal2((unde(result[i].income, 0) / unde(result[i].purchase, 1) * 100));
                            info += "<span>" + result[i].range + "%</span><span>M" + result[i].minute + "</span><span>已完成</span>";
                        } else {
                            info += "<span>" + unde(result[i].range, 0) + "%</span><span>" + result[i].icrease * 100 + "%</span><span>已完成</span>";
                        }
                        if (result[i].income >= 0) {
                            info += "<span>盈利</span><span class=\"greenColor\">+$" + unde(result[i].income, 0) + "</span></li>";
                        } else {
                            info += "<span>亏损</span><span class=\"redColor\">-$" + (0 - unde(result[i].income, 0)) + "</span></li>";
                        }
                    }
                }
                info += "</ul></div>";
                if (style == 0) {
                    $("#AQU").html(info);
                    getOrderByTradeSector(1);
                } else if (style == 1) {
                    $("#BQU").html(info);
                }
                if (language == 2) {
                    loadProperties();
                }
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
 * 查询该用户的收益率统计
 */
function getRateOfReturnByTime(style) {
    var endtime = null;
    var begintime = null;
    if (style == "week") {
        var date = new Date();
        endtime = date.Format("yyyy/MM/dd HH:mm:ss");
        date = date.setDate(date.getDate() - 6);
        var edate = new Date(date);
        begintime = edate.Format("yyyy/MM/dd HH:mm:ss");
        begintime = begintime.split(" ")[0] + " 00:00:00";
        $("#RateOfReturn").html("近一周<span class=\"caret\"></span>");
    } else if (style == "month") {
        var date = new Date();
        endtime = date.Format("yyyy/MM/dd HH:mm:ss");
        date = date.setDate(date.getDate() - 30);
        var edate = new Date(date);
        begintime = edate.Format("yyyy/MM/dd HH:mm:ss");
        begintime = begintime.split(" ")[0] + " 00:00:00";
        $("#RateOfReturn").html("近一月<span class=\"caret\"></span>");
    } else if (style == "year") {
        var date = new Date();
        endtime = date.Format("yyyy/MM/dd HH:mm:ss");
        date = date.setDate(date.getDate() - 365);
        var edate = new Date(date);
        begintime = edate.Format("yyyy/MM/dd HH:mm:ss");
        begintime = begintime.split(" ")[0] + " 00:00:00";
        $("#RateOfReturn").html("近一年<span class=\"caret\"></span>");
    }
    $.ajax({
        url: "../usdtpc/auth/getRateOfReturnByTime",
        data: {
            "userid": urluserid,
            "begintime": begintime,
            "endtime": endtime
        },
        method: "GET",
        success: function (data) {
            if (isString(data)) {
                data = JSON.parse(data);
            }
            if (data.code == 100) {
                var result = data.order;
                var xarray = new Array();
                var s1 = new Array();
                var s2 = new Array();
                var s3 = new Array();
                if (style == "week") {
                    for (var i = 0; i < 7; i++) {
                        var date = new Date();
                        endtime = date.Format("yyyy/MM/dd HH:mm:ss");
                        date = date.setDate(date.getDate() - (6 - i));
                        var edate = new Date(date);
                        begintime = edate.Format("yyyy/MM/dd HH:mm:ss");
                        begintime = begintime.split(" ")[0];
                        xarray[i] = begintime;
                        for (var j = 0; j < result.length; j++) {
                            if (result[j].orderday == begintime) {
                                var total_revenue = toDecimal2(result[j].ysl * 100);
                                s1[i] = total_revenue;
                                s2[i] = result[j].rise;
                                s3[i] = result[j].fall;
                                break;
                            } else {
                                s1[i] = 0;
                                s2[i] = 0;
                                s3[i] = 0;
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
                        xarray[i] = begintime;
                        for (var j = 0; j < result.length; j++) {
                            if (result[j].orderday == begintime) {
                                var total_revenue = toDecimal2(result[j].ysl * 100);
                                s1[i] = total_revenue;
                                s2[i] = result[j].rise;
                                s3[i] = result[j].fall;
                                break;
                            } else {
                                s1[i] = 0;
                                s2[i] = 0;
                                s3[i] = 0;
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
                        xarray[i] = begintime;
                        for (var j = 0; j < result.length; j++) {
                            if (result[j].orderday == begintime) {
                                var total_revenue = toDecimal2(result[j].ysl * 100);
                                s1[i] = total_revenue;
                                s2[i] = result[j].rise;
                                s3[i] = result[j].fall;
                                break;
                            } else {
                                s1[i] = 0;
                                s2[i] = 0;
                                s3[i] = 0;
                            }

                        }
                    }
                }
                var option = {
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross',
                            label: {
                                backgroundColor: '#283b56'
                            }
                        }
                    },
                    legend: {
                        data: ['买涨', '买跌', '盈利率'],
                        textStyle: {
                            color: '#ccc'
                        }
                    },
                    grid: {

                        left: '6%',
                        right: '5%',
                        bottom: '7%'
                    },
                    xAxis: [{
                        type: 'category',
                        data: xarray,
                        axisLine: {
                            lineStyle: {
                                color: '#ccc'
                            }
                        }
                    }],
                    yAxis: [{
                        type: 'value',
                        //				            scale: true,
                        axisLine: {
                            lineStyle: {
                                color: '#ccc'
                            }
                        },
                        axisLabel: {
                            formatter: '{value} %'
                        }
                    },
                        {
                            type: 'value',
                            //				            scale: true,
                            axisLine: {
                                lineStyle: {
                                    color: '#ccc'
                                }
                            }
                        }
                    ],
                    series: [{
                        name: '盈利率',
                        type: 'line',
                        yAxisIndex: 0,
                        itemStyle: {
                            color: '#FF8C00'
                        },
                        data: s1
                    },
                        {
                            name: '买涨',
                            type: 'bar',
                            stack: '涨跌',
                            yAxisIndex: 1,
                            itemStyle: {
                                color: '#00FA9A'
                            },
                            data: s2
                        },
                        {
                            name: '买跌',
                            type: 'bar',
                            stack: '涨跌',
                            yAxisIndex: 1,
                            itemStyle: {
                                color: '#FF6347'
                            },
                            data: s3
                        }

                    ]
                };
                var dom = document.getElementById("tradeAbilityBox");
                var myChart = echarts.init(dom);
                myChart.setOption(option, true);
            } else if (data.code == 101) {
                $("#tradeAbilityBox").html("<p style='top:50%;left:45%;position: relative;'>暂无数据</p>");
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

function getIncomeAmountByTime(style) {
    var endtime = null;
    var begintime = null;
    if (style == "week") {
        var date = new Date();
        endtime = date.Format("yyyy/MM/dd HH:mm:ss");
        date = date.setDate(date.getDate() - 6);
        var edate = new Date(date);
        begintime = edate.Format("yyyy/MM/dd HH:mm:ss");
        begintime = begintime.split(" ")[0] + " 00:00:00";
        $("#IncomeAmount").html("近一周<span class=\"caret\"></span>");
    } else if (style == "month") {
        var date = new Date();
        endtime = date.Format("yyyy/MM/dd HH:mm:ss");
        date = date.setDate(date.getDate() - 30);
        var edate = new Date(date);
        begintime = edate.Format("yyyy/MM/dd HH:mm:ss");
        begintime = begintime.split(" ")[0] + " 00:00:00";
        $("#IncomeAmount").html("近一月<span class=\"caret\"></span>");
    } else if (style == "year") {
        var date = new Date();
        endtime = date.Format("yyyy/MM/dd HH:mm:ss");
        date = date.setDate(date.getDate() - 365);
        var edate = new Date(date);
        begintime = edate.Format("yyyy/MM/dd HH:mm:ss");
        begintime = begintime.split(" ")[0] + " 00:00:00";
        $("#IncomeAmount").html("近一年<span class=\"caret\"></span>");
    }
    $.ajax({
        url: "../usdtpc/auth/getIncomeAmountByTime",
        data: {
            "userid": urluserid,
            "begintime": begintime,
            "endtime": endtime
        },
        method: "GET",
        success: function (data) {
            if (isString(data)) {
                data = JSON.parse(data);
            }
            if (data.code == 100) {
                var result = data.order;
                var xarray = new Array();
                var s1 = new Array();
                var s2 = new Array();
                var s3 = new Array();
                if (style == "week") {
                    for (var i = 0; i < 7; i++) {
                        var date = new Date();
                        endtime = date.Format("yyyy/MM/dd HH:mm:ss");
                        date = date.setDate(date.getDate() - (6 - i));
                        var edate = new Date(date);
                        begintime = edate.Format("yyyy/MM/dd HH:mm:ss");
                        begintime = begintime.split(" ")[0];
                        xarray[i] = begintime;
                        for (var j = 0; j < result.length; j++) {
                            if (result[j].orderday == begintime) {
                                var total_revenue = toDecimal2((result[j].income / result[j].purchase * 100));
                                s1[i] = result[j].income;
                                s2[i] = result[j].aincome;
                                s3[i] = result[j].bincome;
                                break;
                            } else {
                                s1[i] = 0;
                                s2[i] = 0;
                                s3[i] = 0;
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
                        xarray[i] = begintime;
                        for (var j = 0; j < result.length; j++) {
                            if (result[j].orderday == begintime) {
                                var total_revenue = toDecimal2((result[j].income / result[j].purchase * 100));
                                s1[i] = result[j].income;
                                s2[i] = result[j].aincome;
                                s3[i] = result[j].bincome;
                                break;
                            } else {
                                s1[i] = 0;
                                s2[i] = 0;
                                s3[i] = 0;
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
                        xarray[i] = begintime;
                        for (var j = 0; j < result.length; j++) {
                            if (result[j].orderday == begintime) {
                                var total_revenue = toDecimal2((result[j].income / result[j].purchase * 100));
                                s1[i] = result[j].income;
                                s2[i] = result[j].aincome;
                                s3[i] = result[j].bincome;
                                break;
                            } else {
                                s1[i] = 0;
                                s2[i] = 0;
                                s3[i] = 0;
                            }

                        }
                    }
                }

                var option = {
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross',
                            label: {
                                backgroundColor: '#283b56'
                            }
                        }
                    },
                    legend: {
                        data: ['AQU收益', 'BQU收益', '总收益'],
                        textStyle: {
                            color: '#ccc'
                        }
                    },
                    grid: {

                        left: '6%',
                        right: '5%',
                        bottom: '7%'
                    },
                    xAxis: [{
                        type: 'category',
                        //				            boundaryGap: true,
                        data: xarray,
                        axisLine: {
                            lineStyle: {
                                color: '#ccc'
                            }
                        }
                    }],
                    yAxis: [{
                        type: 'value',
                        //				            scale: true,
                        //				            boundaryGap: [1, 0],
                        axisLine: {
                            lineStyle: {
                                color: '#ccc'
                            }
                        },
                        axisLabel: {
                            formatter: '{value} %'
                        }
                    },
                        {
                            type: 'value',
                            //				            scale: true,
                            axisLine: {
                                lineStyle: {
                                    color: '#ccc'
                                }
                            }
                            //				            boundaryGap: [1,0]
                        }
                    ],
                    series: [{
                        name: '总收益',
                        type: 'line',
                        yAxisIndex: 0,
                        itemStyle: {
                            color: '#FF8C00'
                        },
                        data: s1
                    },
                        {
                            name: 'AQU收益',
                            type: 'bar',
                            stack: '涨跌',
                            yAxisIndex: 1,
                            itemStyle: {
                                color: '#00FA9A'
                            },
                            data: s2
                        },
                        {
                            name: 'BQU收益',
                            type: 'bar',
                            stack: '涨跌',
                            yAxisIndex: 1,
                            itemStyle: {
                                color: '#FF6347'
                            },
                            data: s3
                        }

                    ]
                };
                var dom = document.getElementById("IncomeAmountAbilityBox");
                var myChart = echarts.init(dom);
                myChart.setOption(option, true);
            } else if (data.code == 101) {
                $("#IncomeAmountAbilityBox").html("<p style='top:50%;left:45%;position: relative;'>暂无数据</p>");
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
        $("#NetValueBalance").html("近一周<span class=\"caret\"></span>");
    } else if (style == "month") {
        var date = new Date();
        endtime = date.Format("yyyy/MM/dd HH:mm:ss");
        date = date.setDate(date.getDate() - 30);
        var edate = new Date(date);
        begintime = edate.Format("yyyy/MM/dd HH:mm:ss");
        begintime = begintime.split(" ")[0] + " 00:00:00";
        $("#NetValueBalance").html("近一月<span class=\"caret\"></span>");
    } else if (style == "year") {
        var date = new Date();
        endtime = date.Format("yyyy/MM/dd HH:mm:ss");
        date = date.setDate(date.getDate() - 365);
        var edate = new Date(date);
        begintime = edate.Format("yyyy/MM/dd HH:mm:ss");
        begintime = begintime.split(" ")[0] + " 00:00:00";
        $("#NetValueBalance").html("近一年<span class=\"caret\"></span>");
    }
    $.ajax({
        url: "../usdtpc/auth/getNetValueBalanceById",
        data: {
            "userid": urluserid,
            "begintime": begintime,
            "endtime": endtime
        },
        method: "GET",
        success: function (data) {
            if (isString(data)) {
                data = JSON.parse(data);
            }
            if (data.code == 100) {
                var result = data.order;
                var xarray = new Array();
                var s1 = new Array();
                var s2 = new Array();
                var s3 = new Array();
                var s4 = new Array();
                if (style == "week") {
                    for (var i = 0; i < 7; i++) {
                        var date = new Date();
                        endtime = date.Format("yyyy/MM/dd HH:mm:ss");
                        date = date.setDate(date.getDate() - (6 - i));
                        var edate = new Date(date);
                        begintime = edate.Format("yyyy/MM/dd HH:mm:ss");
                        begintime = begintime.split(" ")[0];
                        xarray[i] = begintime;
                        for (var j = 0; j < result.length; j++) {
                            if (result[j].datetime == begintime) {
                                s1[i] = result[j].income + result[j].loss - result[j].trade;
                                s2[i] = result[j].surplus;
                                s3[i] = result[j].rise;
                                s4[i] = result[j].fall;
                                break;
                            } else {
                                s1[i] = 0;
                                s2[i] = 0;
                                s3[i] = 0;
                                s4[i] = 0;
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
                        xarray[i] = begintime;
                        for (var j = 0; j < result.length; j++) {
                            if (result[j].datetime == begintime) {
                                s1[i] = result[j].income + result[j].loss - result[j].trade;
                                s2[i] = result[j].surplus;
                                s3[i] = result[j].rise;
                                s4[i] = result[j].fall;
                                break;
                            } else {
                                s1[i] = 0;
                                s2[i] = 0;
                                s3[i] = 0;
                                s4[i] = 0;
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
                        xarray[i] = begintime;
                        for (var j = 0; j < result.length; j++) {
                            if (result[j].datetime == begintime) {
                                s1[i] = result[j].income + result[j].loss - result[j].trade;
                                s2[i] = result[j].surplus;
                                s3[i] = result[j].rise;
                                s4[i] = result[j].fall;
                                break;
                            } else {
                                s1[i] = 0;
                                s2[i] = 0;
                                s3[i] = 0;
                                s4[i] = 0;
                            }

                        }
                    }
                }

                var option = {
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross',
                            label: {
                                backgroundColor: '#283b56'
                            }
                        }
                    },
                    legend: {
                        data: ['净值', '余额', '买涨', '买跌'],
                        textStyle: {
                            color: '#ccc'
                        }
                    },
                    grid: {

                        left: '5%',
                        right: '7%',
                        bottom: '7%'
                    },

                    xAxis: [{
                        type: 'category',
                        //				            boundaryGap: true,
                        data: xarray,
                        axisLine: {
                            lineStyle: {
                                color: '#ccc'
                            }
                        }
                    }],
                    yAxis: [{
                        type: 'value',
                        //				            scale: true,
                        //				            boundaryGap: [1, 0],
                        axisLine: {
                            lineStyle: {
                                color: '#ccc'
                            }
                        },
                        axisLabel: {
                            formatter: '{value} '
                        }
                    },
                        {
                            type: 'value',
                            //				            scale: true,
                            axisLine: {
                                lineStyle: {
                                    color: '#ccc'
                                }
                            }
                            //				            boundaryGap: [1,0]
                        }
                    ],
                    series: [{
                        name: '净值',
                        type: 'line',
                        yAxisIndex: 1,
                        itemStyle: {
                            color: '#FF8C00'
                        },
                        data: s1
                    },
                        {
                            name: '余额',
                            type: 'line',
                            yAxisIndex: 1,
                            itemStyle: {
                                color: '#4169E1'
                            },
                            data: s2
                        },
                        {
                            name: '买涨',
                            type: 'bar',
                            stack: '涨跌',
                            yAxisIndex: 0,
                            itemStyle: {
                                color: '#00FA9A'
                            },
                            data: s3
                        },
                        {
                            name: '买跌',
                            type: 'bar',
                            stack: '涨跌',
                            yAxisIndex: 0,
                            itemStyle: {
                                color: '#FF6347'
                            },
                            data: s4
                        }

                    ]
                };
                var dom = document.getElementById("NetValueBalanceAbilityBox");
                var myChart = echarts.init(dom);
                myChart.setOption(option, true);
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

function getUserIncomeStatistics() {
    $.ajax({
        url: "../usdtpc/auth/getUserIncomeStatistics",
        data: {
            "userid": urluserid
        },
        method: "GET",
        success: function (data) {
            if (isString(data)) {
                data = JSON.parse(data);
            }
            if (data.code == 100) {
                //$("#tp_recharge").html("$" + data.amoney);
                //$("#tp_withdraw").html("$" + data.bmoney);
                if (language == 2) {
                    $("#tp_trannumber").html(data.zongnum + "fund");
                    $("#tp_Daytrannumber").html(data.cqu + "fund");
                } else {
                    $("#tp_trannumber").html(data.zongnum + "笔");
                    $("#tp_Daytrannumber").html(data.cqu + "笔");
                }

                $("#tp_maxincome").html("$" + data.maxincome);
                $("#tp_minincome").html("$" + data.minincome);
                //				$("#tp_followincome").html("$" + data.followincome);
                $("#tp_Btrannumber").html("$" + data.bqu);
                $("#tp_Atrannumber").html("$" + data.aqu);

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

function jumpPerson(userid) {
    window.location.href = "personalDetails.html?userid=" + userid;
}