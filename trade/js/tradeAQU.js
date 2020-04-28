var userid;
var token;
var real_name;
//盘口信息
var Sys_Minute;
var sys_currency_id;
var sys_currency_order_id;
var sys_disc_id;
var sys_system;
var kline_num = 0;
var language;
var trade_quanbu;
var trade_maizhang;
var trade_maidie;
var trade_quanbu;
var trade_maizhang;
var trade_maidie;
var trade_dingdan;
var trade_pinzhong;
var trade_mairujia;
var trade_mairushuliang;
var trade_maizhangmaidie;
var trade_yingsunzhi;
var trade_mshi;
var trade_shijian;
var trade_mairuchicang;
var trade_yinglikuisun;
var trade_jine;
var trade_jinxingzhong;
var trade_yijieshu;
var trade_yingli;
var trade_kuisun;
var system_rise_fall;
var trade_zhiyingzhisun;
var trade_jiaoyishijian;
var trade_tuijian;
var trade_tuijiandingdan;
var trade_yituijian;
var surplus = 0;
var trader;
var xj_num = 0;
var isStatus = true;
var ds_time = 0;
var ds_time_end = 0;
var ds_sys_minute = 0;
var ds_sys_minute_end = 0;

$(function () {
    sys_currency_id = GetQueryString("currencyid");
    userid = window.sessionStorage.getItem("userid");
    token = window.sessionStorage.getItem("token");
    var nickname = window.sessionStorage.getItem("nickname");
    var img = window.sessionStorage.getItem("userimg");
    real_name = window.sessionStorage.getItem("real_name");
    trader = window.sessionStorage.getItem("trader");
    var state = GetQueryString("state");
    if (state != null) {
        if (state == 1) {
            $("#radio_AQU").attr("checked", "checked");
            pankou_yangshi(0);
        } else {
            $("#radio_BQU").attr("checked", "checked");
            pankou_yangshi(1);
        }
    }
    if (img != null) {
        $("#denglu").html("<img src='" + img + "' onerror='imgExists(this,2)'> " + nickname + " <span class=\"caret\"></span>");
    } else {
        $("#denglu").html("<img src='../../img/head.png' onerror='imgExists(this,2)'> " + nickname + " <span class=\"caret\"></span>");
    }
    language = window.localStorage.getItem("language");
    trade_quanbu = "全部";
    trade_maizhang = "买涨";
    trade_maidie = "买跌";
    trade_dingdan = "订单号";
    trade_pinzhong = "品种";
    trade_mairujia = "买入价";
    trade_mairushuliang = "买入数量";
    trade_maizhangmaidie = "买入/涨跌";
    trade_yingsunzhi = "盈损值";
    trade_mshi = "M/时间";
    trade_shijian = "时间";
    trade_mairuchicang = "买入持仓";
    trade_yinglikuisun = "盈利/亏损";
    trade_jine = "金额";
    trade_jinxingzhong = "进行中";
    trade_yijieshu = "已结束";
    trade_yingli = "盈利";
    trade_kuisun = "亏损";
    trade_zhiyingzhisun = "止盈止损";
    trade_jiaoyishijian = "持仓时间";
    trade_tuijian = "推荐";
    trade_tuijiandingdan = "交易推荐";
    trade_yituijian = "已推荐";
    if (language != undefined && language != null & language == 2) {
        if (language == 2) {
            loadProperties_trade();
            $("#trade_guojihua").html("English<span class=\"caret\"></span>");
            trade_quanbu = "whole";
            trade_maizhang = "Buy rise";
            trade_maidie = "Buy fall";
            trade_dingdan = "Order number";
            trade_pinzhong = "currency";
            trade_mairujia = "Buy price";
            trade_mairushuliang = "Buying quantity";
            trade_maizhangmaidie = "rise&fall";
            trade_yingsunzhi = "Win&loss";
            trade_mshi = "M/hour";
            trade_shijian = "time";
            trade_mairuchicang = "Buy/warehouse";
            trade_yinglikuisun = "Win&loss";
            trade_jine = "money";
            trade_jinxingzhong = "Have&hand";
            trade_yijieshu = "Finished";
            trade_yingli = "profit";
            trade_kuisun = "loss";
            trade_zhiyingzhisun = "Stop loss and stop loss";
            trade_jiaoyishijian = "Holding time";
            trade_tuijian = "Recommend";
            trade_tuijiandingdan = "Recommended order";
            trade_yituijian = "Recommended";
            $("input[name='input_lz']").attr("placeholder", "Buy volume");
            $("input[name='input_yk']").attr("placeholder", "Percentage of profit and loss of B disk");
        }
    }
    $(".date_picker").val(now_date());
    left_currency(1);
    getUserInfoById();
    startCheckUserOtherLoginItv();
    var tInterval = setInterval(function () {
        left_currency(2);

    }, 60000);

    var oInterval = setInterval(function () {
        sub_order();
        sub_order_user();
    }, 5000);
})

/**
 * 根据用户id获取用户详细信息
 */
function getUserInfoById() {
    $.ajax({
        url: "../../usdtpc/auth/getUserInfoById",
        data: {
            "userid": userid
        },
        method: "POST",
        success: function (data) {
            if (data.code == 100) {
                real_name = data.user.real_name;
                trader = data.user.trader;
            }
        },
        error: function (err) {

        }
    })
}

function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

//获取币种信息
function left_currency(type) {
    $.ajax({
        type: "post",
        url: "../../usdtpc/subUserCurrency/SubUserCurrencySelect",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        async: true,
        success: function (data) {
            var str = "";
            var currency_str = "<li><a onclick=\"buttom_currency('','" + trade_quanbu + "')\">" + trade_quanbu + "</a></li>";
            if (data.code == 100) {
                for (var i in data.currency) {
                    var currency = data.currency[i];
                    if (i == 0) {
                        if (typeof (sys_currency_id) == "undefined" || sys_currency_id == null) {
                            sys_currency_id = currency.pid;
                        }
                    }
                    if (sys_currency_id == currency.pid) {
                        str += " <li style='background-color:#007979' id='" + currency.pid + "' name='currency_name'>";
                        $("#maizhang").html(currency.y_name + trade_maizhang);
                        $("#maidie").html(currency.y_name + trade_maidie);
                    } else {
                        str += " <li id='" + currency.pid + "' name='currency_name'>";

                    }

                    str += " <span onclick='sys_currency_update(\"" + currency.pid + "\",\"" + currency.y_name + "\")'>" + currency.y_name + "</span>";
                    str += " <span  onclick='sys_currency_update(\"" + currency.pid + "\",\"" + currency.y_name + "\")'>$" + unde(currency.close, "0") + "</span>";
                    if (currency.bfb < 0) {
                        str += " <span class=\"redColor\"  onclick='sys_currency_update(\"" + currency.pid + "\",\"" + currency.y_name + "\")'>" + (currency.bfb * 100).toFixed(2) + "%</span>";
                    } else {
                        str += " <span class=\"greenColor\"  onclick='sys_currency_update(\"" + currency.pid + "\",\"" + currency.y_name + "\")'>+" + (currency.bfb * 100).toFixed(2) + "%</span>";
                    }

                    str += " <span>";
                    if (currency.num > 0) {
                        str += " <i class=\"icon-star-full daiyanse\" onclick=\"sub_user_currency_insert(1,'" + currency.pid + "',this)\"></i>";
                    } else {
                        str += " <i class=\"icon-star-full budaiyanse\" onclick=\"sub_user_currency_insert(0,'" + currency.pid + "',this)\"></i>";
                    }

                    str += "  </span>";
                    str += "  </li>";
                    currency_str += "<li><a onclick=\"buttom_currency('" + currency.pid + "','" + currency.y_name + "')\">" + currency.y_name + "</a></li>";

                }
                $("#left_currency").html(str);
                $("#buttom_currency").html(currency_str);
                if (type == 1) {
                    Sys_Minute = data.minute;
                    var style = $("input[name='radio']:checked").val();
                    var str1 = "";
                    var z_num = 0;
                    var sys_minute_top_id;
                    var sys_minute_top_name;
                    for (var i in Sys_Minute) {
                        var minute = Sys_Minute[i];
                        if (minute.style == style) {
                            if (z_num == 0) {
                                if (language == 2) {
                                    $("#top_minute_top").html(minute.y_name);
                                    $("input[name='input_minute']").val(minute.y_name);
                                    sys_minute_top_name = minute.y_name;
                                } else {
                                    $("#top_minute_top").html(minute.name);
                                    $("input[name='input_minute']").val(minute.name);
                                    sys_minute_top_name = minute.name;
                                }
                                sys_minute_top_id = minute.pid;
                                $("#top_minute").val(minute.pid);
                                z_num = 1;
                                ds_sys_minute = minute.minute;
                                ds_sys_minute_end = minute.end_minute;
                            }
                            if (language == 2) {
                                str1 += "<li onclick='pubic_fangfa(\"" + minute.pid + "\",\"" + minute.y_name + "\")'>" + minute.y_name + "</li>";

                            } else {
                                str1 += "<li onclick='pubic_fangfa(\"" + minute.pid + "\",\"" + minute.name + "\")'>" + minute.name + "</li>";

                            }

                        }
                    }
                    $("#top_minute_ul").html(str1);
                    pubic_fangfa(sys_minute_top_id, sys_minute_top_name);
                }
            } else {
            }
        },
        error: function (err) {
        }
    });
}

//上一期状态
function top_disc() {
    var sys_minute_id = $("#top_minute").val();
    if (sys_minute_id == '' || sys_minute_id == null) {
        var style = $("input[name='radio']:checked").text();
        $("#myModalLabel").html("暂无" + style + "盘口");
        $("#myModal").modal("show");
        return false;
    }
    var style_id = $("input[name='radio']:checked").val();
    $.ajax({
        type: "post",
        url: "../../usdtpc/subdisc/SubDiscOrder",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        data: {
            sys_currency_id: sys_currency_id,
            sys_minute_id: sys_minute_id,
            style: style_id
        },
        async: true,
        success: function (data) {
            if (data.code == 100) {
                var disc = data.disc;
                $("#top_cjl").html(disc.purchase);
                var range = (disc.range * 100).toFixed(2);
                if (disc.rise_fall != 1) {
                    $("#top_dzl").attr("class", "greenColor");
                    $("#top_dzl").html("+" + range + "%");
                } else {
                    $("#top_dzl").attr("class", "redColor");
                    $("#top_dzl").html("-" + range + "%");
                }

                $("#top_kpj").html("$" + disc.open.toFixed(2));
                $("#top_spj").html("$" + disc.close.toFixed(2));
                $("input[name='input_close']").val(disc.close);
                $("#top_zgj").html("$" + disc.high.toFixed(2));
                $("#top_zdj").html("$" + disc.low.toFixed(2));
            } else if (data.code == 401) {
                tokenLoseEfficacy_two();
                token = window.sessionStorage.getItem("token");
                top_disc();
            } else {
                $("#myModalLabel").html("暂无" + style + "盘口");
                $("#myModal").modal("show");
                return false;
            }
        },
        error: function (err) {
            //window.location.href = "../login/login.html";
        }
    });
}

//k线图
function top_kline(page, state) {
    var end = parseInt(page) * parseInt(500);
    if (page == 1) {
        if (state == 1) {
            $('#candlestick_hide').shCircleLoader({
                color: '#8600FF'
            });
            //$("#candlestick").hide();
            $("#candlestick_hide").show();
        }
    }
    var sys_minute_id = $("#top_minute").val();
    $.ajax({
        type: "post",
        url: "../../usdtpc/subdisc/SubDiscKline",
        async: true,
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        data: {
            sys_currency_id: sys_currency_id,
            sys_minute_id: sys_minute_id,
            num: end,
            state: 1,
            start: 0
        },
        success: function (data) {
            if (data.code == 100) {
                var data_values = new Array();
                var dates = new Array();
                var end_date;
                for (var i in data.kline) {
                    var kline = data.kline[data.kline.length - i - 1];
                    kline = JSON.parse(kline);
                    var endtime = kline.endtime;
                    if (!isNaN(endtime)) {
                        endtime = new Date(endtime);
                        endtime = endtime.Format("yyyy/MM/dd hh:mm:ss");
                    } else {
                        if (endtime != null && endtime != '' && typeof (endtime) != "undefined") {
                            endtime = endtime.replace(/-/g, '/').replace(/T|Z/g, ' ').trim();
                        }

                    }
                    dates.push(endtime);
                    end_date = endtime;
                    var data_value = new Array();
                    data_value.push(kline.open);
                    data_value.push(kline.close);
                    data_value.push(kline.low);
                    data_value.push(kline.high);
                    data_values.push(data_value);

                }
                var kline_q = data.kline_q;
                if (page == 1) {
                    var start = 0;
                    var end = 100;
                    if (data.kline.length > 60) {
                        var bfb = parseFloat(60 / data.kline.length);
                        start = (parseFloat(1) - bfb) * 100;
                    }
                    var minute_time = 5;
                    for (var i in Sys_Minute) {
                        var minute = Sys_Minute[i];
                        if (minute.pid == sys_minute_id) {
                            minute_time = minute.minute;
                        }

                    }
                    for (var i = 0; i < 2; i++) {
                        end_date = zengjia_date(end_date, minute_time);
                        dates.push(end_date);
                        var data_value = new Array();
                        data_value.push("-");
                        data_value.push("-");
                        data_value.push("-");
                        data_value.push("-");
                        data_values.push(data_value);
                    }

                    getKling(data_values, dates, kline_q, page, start, end);
                    $("#candlestick_hide").hide();
                    $("#candlestick").show();
                } else {
                    getKling(data_values, dates, kline_q, page, 0, 30);
                }
            } else if (data.code == 401) {
                tokenLoseEfficacy_two();
                token = window.sessionStorage.getItem("token");
                top_kline(page, state);
            }
        },
        error: function (err) {
        }
    });
}

//现价交易 信息
function center_disc() {
    if (isStatus == false) {
        return false;
    }
    isStatus = false;
    var sys_minute_id = $("#top_minute").val();
    $.ajax({
        type: "post",
        url: "../../usdtpc/subdisc/SubDiscIsStart",
        async: true,
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        data: {
            sys_currency_id: sys_currency_id,
            sys_minute_id: sys_minute_id
        },
        success: function (data) {
            if (data.code == 100) {
                if (data.disc == null || data.disc == "" || typeof (data.disc) == "undefined") {
                    if (num > 5) {
                        $("#myModalLabel").html("下一期数据暂无，请联系客服");
                        $("#myModal").modal("show");
                        return false;
                    } else {
                        num += 1;
                        center_disc();
                        return false;
                    }
                }
                num = 0;
                sys_system = data.system;
                surplus = data.surplus;
                $("[name='trade_yue']").html(surplus);
                for (var i in Sys_Minute) {
                    var minute = Sys_Minute[i];
                    if (minute.pid == sys_minute_id) {
                        sys_disc_id = data.disc.pid;
                        var time = parseInt(((new Date(data.disc.createtime).getTime() + (parseInt(minute.minute) * 60 * 1000)) - new Date(data.datetime).getTime()) / 1000);
                        var time_end = parseInt(((new Date(data.disc.createtime).getTime() + (parseInt(minute.end_minute) * 60 * 1000)) - new Date(data.datetime).getTime()) / 1000);
                        if (time > 1) {
                            ds_sys_minute = minute.minute;
                            ds_sys_minute_end = minute.end_minute;
                            ds_time = time;
                            ds_time_end = time_end;
                            ds_kaiqi_zt();
                            sub_order();
                        } else {
                            isStatus = true;
                            jc_ds();
                        }
                    }
                }

            } else if (data.code == 401) {
                tokenLoseEfficacy_two();
                token = window.sessionStorage.getItem("token");
                center_disc();
            } else {
                $("#myModalLabel").html("下一期数据暂无，请联系客服");
                $("#myModal").modal("show");
                return false;
            }
            isStatus = true;
        },
        error: function (err) {
            //window.location.href = "../login/login.html";
        }
    })

}

var disc_num = 0;

//定时器
function jc_ds() {
    disc_num += 1;
    if (disc_num > 10) {
        //disc_num = 0;
    } else {
        if (disc_num < 5) {
            setTimeout(function () {
                top_disc();
                center_disc();
                top_kline(1, 2);
            }, 1000);
        } else {
            setTimeout(function () {
                top_disc();
                center_disc();
                top_kline(1, 2);
            }, 5000);
        }

    }
}

//投注比
function SysRange() {
    var sys_minute_id = $("#top_minute").val();
    $.ajax({
        type: "post",
        url: "../../usdtpc/sysrange/SysRangeSelect",
        async: true,
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        data: {
            sys_minute_id: sys_minute_id
        },
        success: function (data) {
            var str = "";
            var str1 = "";
            if (data.code == 100) {
                system_rise_fall = data.risefall;
                var tou_y = 0;
                var tou_k = 0;
                var tou_y_id;
                var tou_k_id;
                for (var i in data.range) {
                    var range = data.range[i];
                    if (range.style == 0) {
                        if (tou_y == 0) {
                            tou_y_id = range.pid;
                            tou_y = 1;
                        } else {
                            tou_y = 1;
                        }
                        str += "<option value=\"" + range.range + "\" data=\"" + range.pid + "\">" + range.range + "%</option>";

                    } else {
                        if (tou_k == 0) {
                            tou_k_id = range.pid;
                            tou_k = 1;
                        } else {
                            tou_k = 1;
                        }
                        str1 += "<option value=\"" + range.range + "\" data=\"" + range.pid + "\">" + range.range + "%</option>";

                    }
                }
                $("#range_yz").html(str);
                $("#range_ks").html(str1);
                var strd = "";
                var strdk = "";
                for (var i in data.risefall) {
                    var rise = data.risefall[i];
                    if (tou_y_id == rise.sys_range_id) {
                        strd += "<option value=\"" + rise.range + "\">" + rise.range + "%</option>";
                    }
                    if (tou_k_id == rise.sys_range_id) {
                        strdk += "<option value=\"" + rise.range + "\">" + rise.range + "%</option>";
                    }
                }
                $("#input_yk_ks").html(strdk);
                $("#input_yk_yz").html(strd);
            } else if (data.code == 401) {
                tokenLoseEfficacy_two();
                token = window.sessionStorage.getItem("token");
                SysRange();
            }
        },
        error: function (err) {
            //window.location.href = "../login/login.html";
        }
    })
}

//个人订单详情
function sub_order_user() {
    var datetime = $(".date_picker").val();
    var rise_fall = $("input[name='rise_radio']:checked").val();
    var radio = $("input[name='radio']:checked").val();
    if (radio == 1) {
        $("#buttom_order").attr("class", "personOrderTable bqupersonOrderTable");
    } else {
        $("#buttom_order").attr("class", "personOrderTable");
    }
    $.ajax({
        type: "post",
        url: "../../usdtpc/BusSubOrder/BusSubOrderSelect",
        async: true,
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        data: {
            type: 0,
            datetime: datetime,
            rise_fall: rise_fall,
            sys_currency_id: sys_currency_order_id,
            minute_style: radio
        },
        success: function (data) {
            var str = "<li><span>" + trade_dingdan + "</span><span>" + trade_pinzhong + "</span><span>" + trade_mairujia + "</span><span>" + trade_mairushuliang + "</span><span>" + trade_maizhangmaidie + "</span>";
            if (radio == 1) {
                str += "<span>" + trade_zhiyingzhisun + "</span>";
            }
            str += "<span>" + trade_yingsunzhi + "</span>";
            if (radio == 1) {
                str += "<span>" + trade_shijian + "</span><span>" + trade_mairuchicang + "</span><span>" + trade_jiaoyishijian + "</span>";

            } else {
                str += "<span>" + trade_mshi + "</span><span>" + trade_shijian + "</span><span>" + trade_mairuchicang + "</span>";

            }
            str += "<span>" + trade_yinglikuisun + "</span><span>" + trade_jine + "</span>";
            if (radio == 1) {
                str += "<span>" + trade_tuijiandingdan + "</span>";
            }
            str += "</li>";
            if (data.code == 100) {
                for (var i in data.order) {
                    var order = data.order[i];
                    str += " <li>";
                    str += " <span>" + buwei(order.orderid) + "</span>";
                    str += " <span>" + unde(order.currency, " ") + "</span>";
                    str += " <span>$" + order.beginprice + "</span>";
                    str += " <span>$" + order.purchase + "</span>";
                    if (order.rise_fall != 1) {
                        str += " <span  class=\"greenColor \">" + trade_maizhang + "</span>";
                    } else {
                        str += " <span  class=\"redColor \">" + trade_maidie + "</span>";
                    }
                    str += " <span>" + order.range + "%</span>";
                    if (radio == 1) {
                        str += " <span>" + order.icrease * 100 + "%</span>";
                        str += " <span>" + format(order.createtime, "yy/MM/dd") + "</span>";
                        if (order.style == 0) {
                            str += " <span>" + trade_jinxingzhong + "</span>";
                            str += "<span>" + chicangzhouqi(order.createtime) + "</span>";
                        } else {
                            str += " <span>" + trade_yijieshu + "</span>";
                            str += " <span>" + format(order.updatetime, "yy/MM/dd") + "</span>";
                        }
                    } else {
                        str += " <span>" + unde(order.minute, " ") + "</span>";
                        str += " <span>" + format(order.createtime, "yy/MM/dd") + "</span>";
                        if (order.style == 0) {
                            str += " <span>" + trade_jinxingzhong + "</span>";
                        } else {
                            str += " <span>" + trade_yijieshu + "</span>";
                        }

                    }

                    if (order.style == 0) {

                        str += " <span>**</span>";
                        str += " <span>**</span>";
                    } else {

                        if (order.income >= 0) {
                            str += " <span>" + trade_yingli + "</span>";
                            str += " <span class=\"greenColor\">+$" + order.income + "</span>";
                        } else {
                            str += " <span>" + trade_kuisun + "</span>";
                            str += " <span class=\"redColor\">-$" + (0 - order.income) + "</span>";
                        }
                    }
                    if (radio == 1) {
                        if (order.isfollow == 1) {
                            str += " <span class=\"recommendT\" onclick=\"recommendBtn('" + order.pid + "','" + order.purchase + "')\"><a>" + trade_tuijian + "</a></span>";
                        } else {
                            str += " <span><a>" + trade_yituijian + "</a></span>";
                        }

                    }
                    str += " </li>";
                }
                $("#buttom_order").html(str);
            } else if (data.code == 401) {
                tokenLoseEfficacy_two();
                token = window.sessionStorage.getItem("token");
                sub_order_user();

            } else {
                $("#myModalLabel").html("暂无数据");
                $("#myModal").modal("show");
                return false;
            }

        },
        error: function (err) {
            //window.location.href = "../login/login.html";
        }
    });
}

function buwei(num) {
    if (num.length < 8) {
        var name = "";
        for (var i = 0; i < 8 - num.length; i++) {
            name += "0";
        }
        num = name + num;
    }
    return num;
}

function buttom_date(value) {
    sub_order_user();
}

function buttom_currency(value, name) {
    sys_currency_order_id = value;
    $("#buttom_currency_name").html(name);
    sub_order_user();
}

//购买流水记录
function sub_order() {
    var radio = $("input[name='radio']:checked").val();
    if (radio == 0) {
        $("#shijian").show();
        if (language == 2) {
            $("#yingsunzhi").html("Win loss value");
        } else {
            $("#yingsunzhi").html("赢损值");
        }
    } else {
        $("#shijian").hide();
        if (language == 2) {
            $("#yingsunzhi").html("Stop loss and stop loss");
        } else {
            $("#yingsunzhi").html("止盈止损");
        }

    }
    $.ajax({
        type: "post",
        url: "../../usdtpc/BusSubOrder/BusSubOrderSelect",
        async: true,
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        data: {
            type: 0,
            sys_disc_id: sys_disc_id,
            isstart: 0
        },
        success: function (data) {
            var str = "";
            var str1 = "";
            if (data.code == 100) {
                for (var i in data.order) {
                    var order = data.order[i];
                    if (order.rise_fall != 1) {
                        str += " <li>";
                        str += " <span class=\"greenColor\">" + trade_maizhang + "</span>";
                        str += " <span>$" + order.beginprice + "</span>";
                        str += " <span>$" + order.purchase + "</span>";
                        if (radio != 1) {
                            str += " <span>" + unde(order.minute, " ") + "</span>";
                        }
                        str += " <span class=\"greenColor\">" + order.range + "%</span>";
                        str += " </li>";
                    } else {
                        str1 += " <li>";
                        str1 += " <span class=\"redColor\">" + trade_maidie + "</span>";
                        str1 += " <span>$" + order.beginprice + "</span>";
                        str1 += " <span>$" + order.purchase + "</span>";
                        if (radio != 1) {
                            str1 += " <span>" + unde(order.minute, " ") + "</span>";
                        }
                        str1 += " <span class=\"redColor\">" + order.range + "%</span>";
                        str1 += " </li>";
                    }
                }

                $("#right_mz").html(str);
                $("#right_md").html(str1);
            } else if (data.code == 401) {
                tokenLoseEfficacy_two();
                token = window.sessionStorage.getItem("token");
                sub_order();
            } else {
                $("#myModalLabel").html("暂无数据");
                $("#myModal").modal("show");
                return false;
            }
        },
        error: function (err) {
            //window.location.href = "../login/login.html";
        }
    })
}

//购买事件
function order_add(state) {
    if (real_name != 1) {
        $("#myModalLabel").html("请先实名审核，否则无法购买");
        $("#myModal").modal("show");
        return false;
    }
    var mm = $("#minute_endtime_s").html();
    if (mm <= 0) {
        $("#myModalLabel").html("购买时间已结束,请等下一期");
        $("#myModal").modal("show");
        return false;
    }

    var purchase;
    var range;
    var icrease;
    if (state == 0) {
        purchase = $("#input_lz_yz").val();
        range = $("#range_yz").val();
        icrease = $("#input_yk_yz").val();
    } else {
        purchase = $("#input_ks_yz").val();
        range = $("#range_ks").val();
        icrease = $("#input_yk_ks").val();
    }
    if (purchase == null || purchase == "") {
        $("#myModalLabel").html("量值不能为空");
        $("#myModal").modal("show");
        return false;
    }

    var style = $("input[name='radio']:checked").val();
    if (style == 1) {
        if (icrease == null || icrease == "") {
            $("#myModalLabel").html("b盘买入比例不能为空");
            $("#myModal").modal("show");
            return false;

        }
        icrease = parseFloat(icrease / 100);
        if (range == null || range == "") {
            $("#myModalLabel").html("止盈止损不能为空");
            $("#myModal").modal("show");
            return false;
        }
    } else {
        if (range == null || range == "") {
            $("#myModalLabel").html("投注比不能为空");
            $("#myModal").modal("show");
            return false;
        }
        icrease = null;
    }
    if (purchase > surplus) {
        $("#myModalLabel").html("量值不能高于当前余额");
        $("#myModal").modal("show");
        return false;
    }
    if (sys_system != null) {
        if (sys_system.istime == 0) {
            if (sys_system.starttime != "" && sys_system.starttime != null && sys_system.endtime != "" && sys_system.endtime != null) {
                if (!bjtime(sys_system.starttime, sys_system.endtime)) {
                    $("#myModalLabel").html("系统设定该时" + sys_system.starttime + "至" + sys_system.endtime + "间段不可交易");
                    $("#myModal").modal("show");
                    return false;
                }
            }
        }
        if (purchase < sys_system.lowmoney) {
            $("#myModalLabel").html("量值不能低于" + sys_system.lowmoney);
            $("#myModal").modal("show");
            return false;
        }
    }

    var beginprice = $("input[name='input_close']").val();
    $.ajax({
        type: "post",
        url: "../../usdtpc/BusSubOrder/BusSubOrderAdd",
        async: true,
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        data: {
            sys_disc_id: sys_disc_id,
            rise_fall: state,
            range: range,
            purchase: purchase,
            beginprice: beginprice,
            icrease: icrease
        },
        success: function (data) {
            if (data.code == 100) {
                center_disc();
                sub_order_user();
                left_order_user();
            } else if (data.code == 201) {
                $("#myModalLabel").html("用户不存在");
                $("#myModal").modal("show");
            } else if (data.code == 202) {
                $("#myModalLabel").html("量值不能高于当前余额");
                $("#myModal").modal("show");
            } else if (data.code == 401) {
                tokenLoseEfficacy_two();
                token = window.sessionStorage.getItem("token");
                order_add(state);
            }
        },
        error: function (err) {
            //window.location.href = "../login/login.html";
        }
    })

}

//更改盘口事件
function pankou(value) {
    var str1 = "";
    var num = 0;
    var sys_minute_top_id;
    var sys_minute_top_name;
    for (var i in Sys_Minute) {
        var minute = Sys_Minute[i];
        if (minute.style == value) {
            str1 += "<li onclick='pubic_fangfa(\"" + minute.pid + "\",\"" + minute.name + "\")'>" + minute.name + "</li>";
            if (num == 0) {
                $("input[name='input_minute']").val(minute.name);
                $("#top_minute_top").html(minute.name);
                $("#top_minute").val(minute.pid);
                sys_minute_top_id = minute.pid;
                sys_minute_top_name = minute.name;
            }
            num += 1;
        }
    }
    if (num == 0) {
        var style = $("input[name='radio']:checked").text();
        $("#myModalLabel").html("暂无" + style + "盘口");
        $("#myModal").modal("show");
        return false;
    }
    pankou_yangshi(value);
    $("#top_minute").html(str1);
    xiugai_url();
    pubic_fangfa(sys_minute_top_id, sys_minute_top_name);
}

function pankou_yangshi(value) {
    if (value == 0) {
        $("div[name='input_b']").hide();
        $(".progressMain").show();
        $("div[name='tzb_A']").show();
        $("div[name='tzb_B']").hide();
        $("div[name='input_M']").show();
        $("#right_mz").attr("class", "rcontent");
        $("#right_md").attr("class", "rcontent");
        $("#order_ul").attr("class", "title");
        $("#pankou_top").show();

        $("#BQU_order").hide();
        $("#left_currency").css("min-height", "780px");
        B_kline(2);
    } else {
        $("div[name='input_b']").show();
        $(".progressMain").hide();
        $("div[name='tzb_B']").show();
        $("div[name='tzb_A']").hide();
        $("div[name='input_M']").hide();
        $("#right_mz").attr("class", "rcontent bqurcontent");
        $("#right_md").attr("class", "rcontent bqurcontent");
        $("#order_ul").attr("class", "title bqurcontenttitle");
        $("#pankou_top").hide();
        $("#BQU_order").show();
        $("#left_currency").css("min-height", "260px");
        left_order_user();
        B_kline(1);
    }

}

//调用方法
function pubic_fangfa(pid, name) {
    kline_num = 0;
    for (var i in Sys_Minute) {
        var minute = Sys_Minute[i];
        if (minute.pid == pid) {
            $("input[name='input_minute']").val(minute.name);
        }
    }
    $("#top_minute_top").html(name);
    $("#top_minute").val(pid);
    top_disc();
    center_disc();
    top_kline(1, 1);
    SysRange();
    sub_order_user();
}

//收藏币种
function sub_user_currency_insert(state, currencyid, th) {
    $.ajax({
        type: "post",
        url: "../../usdtpc/subUserCurrency/SubUserCurrencyInsert",
        async: true,
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        data: {
            state: state,
            currencyid: currencyid
        },
        success: function (data) {
            if (data.code == 100) {
                if (state == 0) {
                    $(th).attr("class", "icon-star-full daiyanse");
                    $(th).attr("onclick", "sub_user_currency_insert(1,'" + currencyid + "',this)");
                } else {
                    $(th).attr("class", "icon-star-full budaiyanse");
                    $(th).attr("onclick", "sub_user_currency_insert(0,'" + currencyid + "',this)");
                }
            } else if (data.code == 401) {
                tokenLoseEfficacy_two();
                token = window.sessionStorage.getItem("token");
                sub_user_currency_insert(state, currencyid, th);
            }
        },
        error: function (err) {
            //window.location.href = "../login/login.html";
        }
    })
}

//币种点击事件
function sys_currency_update(pid, name) {
    sys_currency_id = pid;
    $("li[name='currency_name']").css("background-color", "");
    $("#" + pid).css("background-color", "#007979");
    $("#maizhang").html(name + trade_maizhang);
    $("#maidie").html(name + trade_maidie);
    xiugai_url();
    pubic_fangfa($("#top_minute").val(), $("#top_minute_top").html());
}

var sub_obder_id;
var sub_order_money;

function recommendBtn(pid, money) {
    if (trader != 1) {
        $("#myModalLabel").html("您不是交易员，请先成为交易员");
        $("#myModal").modal("show");
        return false;
    }
    sub_obder_id = pid;
    sub_order_money = money;
    $('#trade_show_hide').show();
}

function canselDialog() {
    $('#trade_show_hide').hide();
}

function update_charge() {

    var charge = $("#charge").val();
    if (charge == null || charge == '') {
        $("#myModalLabel").html("推荐跟单费用不能为空");
        $("#myModal").modal("show");
        return false;
    }
    if (charge > 10) {
        $("#myModalLabel").html("推荐不能大于10USDT");
        $("#myModal").modal("show");
        return false;
    }
    if (charge > (parseInt(sub_order_money) / parseInt(10))) {
        $("#myModalLabel").html("推荐不能大于购买量10%");
        $("#myModal").modal("show");
        return false;
    }

    $.ajax({
        type: "post",
        url: "../../usdtpc/BusSubOrder/BusSubOrderUpdate",
        async: true,
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        data: {
            charge: charge,
            pid: sub_obder_id
        },
        success: function (data) {
            if (data.code == 100) {
                sub_order_user();
                canselDialog();
            } else if (data.code == 401) {
                tokenLoseEfficacy_two();
                token = window.sessionStorage.getItem("token");
                update_charge();
            } else {
                $("#myModalLabel").html("添加跟单收费失败");
                $("#myModal").modal("show");
                return false;
            }

        },
        error: function (err) {

        }
    });
}

function update_rise_fall(id, state) {
    var pid = $("#" + id + " option:selected").attr("data");
    var str = "";
    for (var i in system_rise_fall) {
        var rise = system_rise_fall[i];
        if (pid == rise.sys_range_id) {
            str += "<option value=\"" + rise.range + "\">" + rise.range + "%</option>";
        }
    }
    if (state == 0) {
        $("#input_yk_yz").html(str);
    } else {
        $("#input_yk_ks").html(str);
    }
}

var b_kline_dsq;

function B_kline(state) {
    var style = $("input[name='radio']:checked").val();
    if (style == 1) {
        if (state == 1) {
            b_kline_dsq = setInterval(function () {
                top_disc();
                left_order_user();
            }, 60000);
        } else {
            clearInterval(b_kline_dsq);
        }
    }
}

function xiugai_url() {
    var style = $("input[name='radio']:checked").val();
    style = parseInt(style) + 1;
    var url = "tradeAQU.html?state=" + style + "&currencyid=" + sys_currency_id;
    history.pushState({}, "fortex", url);
}

function left_order_user() {
    $.ajax({
        type: "post",
        url: "../../usdtpc/BusSubOrder/SubOrderBQUSelect",
        async: true,
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        success: function (data) {
            if (data.code == 100) {
                var str = "";
                for (var i in data.order) {
                    var order = data.order[i];
                    str += "<li>";
                    str += "<span>" + order.orderid + "</span>";
                    str += "<span>" + order.y_name + "</span>";
                    str += "<span>" + order.beginprice + "$</span>";
                    if (order.close == 0) {
                        str += "<span class=\"greenColor\">+0.00%</span>";
                    } else {
                        var bfb = ((parseFloat(order.beginprice) / parseFloat(order.close) - 1) * 100).toFixed(2);
                        if (bfb >= 0) {
                            str += "<span class=\"greenColor\">+" + bfb + "%</span>";
                        } else {
                            str += "<span class=\"redColor\">" + bfb + "%</span>";
                        }
                    }

                    str += "</li>";
                }
                $("#BQU_order_ul").html(str);
            } else if (data.code == 401) {
                tokenLoseEfficacy_two();
                token = window.sessionStorage.getItem("token");
                left_order_user();
            } else {
                $("#myModalLabel").html("暂无数据");
                $("#myModal").modal("show");
                return false;
            }

        },
        error: function (err) {

        }
    });
}

var kaiqi_num = 1;

function ds_kaiqi_zt() {
    if (kaiqi_num == 1) {
        ds_kaiqi();
        kaiqi_num += 1;
    }
}

function ds_kaiqi() {
    ds_fangfa_A();
    ds_fangfa_B();
    $('body').everyTime('1s', ds_kaiqi);
}

function ds_fangfa_A() {
    if (ds_time_end > 0) {
        var bfb = (1 - (ds_time_end / (parseInt(ds_sys_minute_end) * 60)).toFixed(2)) * 100;
        $("#minute_endtime_s").html(ds_time_end);
        $("#minute_endtime_z").css("left", bfb + "%");
        $("#minute_endtime").css("width", bfb + "%");
        $("#minute_endtime").attr("aria-valuenow", bfb);
    } else {
        $("#minute_endtime_s").html(0);
        $("#minute_endtime_z").css("left", "100%");
        $("#minute_endtime").css("width", "100%");
        $("#minute_endtime").attr("aria-valuenow", 100);
    }
    ds_time_end -= 1;
}

function ds_fangfa_B() {
    if (ds_time > 0) {
        disc_num = 0;
        var bfb = (1 - (ds_time / (parseInt(ds_sys_minute) * 60)).toFixed(2)) * 100;
        $("#minute_time_s").html(ds_time);
        $("#minute_time_z").css("left", bfb + "%");
        $("#minute_time").css("width", bfb + "%");
        $("#minute_time").attr("aria-valuenow", bfb);
        if (ds_time % 60 == 0) {
            jc_ds();
        }

    } else {
        ds_time = parseInt(ds_sys_minute) * 60;
        ds_time_end = parseInt(ds_sys_minute_end) * 60 - 1;
        jc_ds();
    }
    ds_time -= 1;
}