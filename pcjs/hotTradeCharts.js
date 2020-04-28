/**
 * 热门交易JS
 */
/*----------------------------本页面全局变量--------------------------------*/
//用户id
var userid = null;
//token
var token;
//语言类型
var language;
//热门交易员当前页码
var tpage = 1;
//每页展示条数
var tnumber = 10;
//共多少页
var ttotalpage = 1;
//总条数
var ttotal = 0;
//热门交易排行当前页面
var cpage = 1;
//每页展示条数
var cnumber = 10;
//共多少页
var ctotalpage = 1;
//总条数
var ctotal = 0;
/*---------------------------------------------------------------------*/
$(function () {
    userid = window.sessionStorage.getItem("userid");
    token = window.sessionStorage.getItem("token");
    changHead(userid);
    getTopTraderByTime(1);
    getHotCharts(1);
    language = window.localStorage.getItem("language");
    if (language != undefined && language != null & language == 2) {
        loadProperties();
    }
    var request = new Object();
    request = GetRequest();
    var htctype = request["type"];
    if (htctype == 1) {
        $("#hotCharts_title_btn").click();
    }
});

/**
 * 根据时间周期查询热门交易员
 * @param currentpage
 */
function getTopTraderByTime(currentpage) {
    tpage = currentpage;
    var type = $("#hot_trader_time").val();
    var begintime = "";
    var endtime = "";
    if (type == "oneday") {
        var date = new Date();
        endtime = date.Format("yyyy/MM/dd HH:mm:ss");
        date = date.setDate(date.getDate());
        var edate = new Date(date);
        begintime = edate.Format("yyyy/MM/dd HH:mm:ss");
        begintime = begintime.split(" ")[0] + " 00:00:00";
    } else if (type == "twodays") {
        var date = new Date();
        endtime = date.Format("yyyy/MM/dd HH:mm:ss");
        date = date.setDate(date.getDate() - 1);
        var edate = new Date(date);
        begintime = edate.Format("yyyy/MM/dd HH:mm:ss");
        begintime = begintime.split(" ")[0] + " 00:00:00";
    } else if (type == "threedays") {
        var date = new Date();
        endtime = date.Format("yyyy/MM/dd HH:mm:ss");
        date = date.setDate(date.getDate() - 2);
        var edate = new Date(date);
        begintime = edate.Format("yyyy/MM/dd HH:mm:ss");
        begintime = begintime.split(" ")[0] + " 00:00:00";
    } else if (type == "week") {
        var date = new Date();
        endtime = date.Format("yyyy/MM/dd HH:mm:ss");
        date = date.setDate(date.getDate() - 6);
        var edate = new Date(date);
        begintime = edate.Format("yyyy/MM/dd HH:mm:ss");
        begintime = begintime.split(" ")[0] + " 00:00:00";
    } else if (type = "month") {
        var date = new Date();
        endtime = date.Format("yyyy/MM/dd HH:mm:ss");
        date = date.setDate(date.getDate() - 30);
        var edate = new Date(date);
        begintime = edate.Format("yyyy/MM/dd HH:mm:ss");
        begintime = begintime.split(" ")[0] + " 00:00:00";
    }
    $.ajax({
        url: "../usdtpc/auth/getProfitTop",
        data: {"begintime": begintime, "endtime": endtime, "userid": userid, "page": tpage, "number": tnumber},
        method: "POST",
        success: function (data) {
            if (data.code == 100) {
                var options = new Array();
                var info = "";
                if (type == "oneday") {
                    info = "<ul class=\"tableBox\" ><li class=\"table\"><ul class=\"tableHeader\"><li data-locale=\"remenjiaoyi.jibenxinxi\">基本信息</li><li data-locale=\"remenjiaoyi.zongyingli\">近一天盈利</li>";
                    info += "<li data-locale=\"remenjiaoyi.zongshouyilv\">收益率</li><li data-locale=\"remenjiaoyi.zongjiaoyibishu\">交易笔数</li><li data-locale=\"remenjiaoyi.qushitu\">走势图</li>";
                    info += "<li data-locale=\"remenjiaoyi.gerenxiangqing\">个人详情</li></ul></li>";
                } else if (type == "twodays") {
                    info = "<ul class=\"tableBox\" ><li class=\"table\"><ul class=\"tableHeader\"><li data-locale=\"remenjiaoyi.jibenxinxi\">基本信息</li><li data-locale=\"remenjiaoyi.zongyingli\">近两天盈利</li>";
                    info += "<li data-locale=\"remenjiaoyi.zongshouyilv\">收益率</li><li data-locale=\"remenjiaoyi.zongjiaoyibishu\">交易笔数</li><li data-locale=\"remenjiaoyi.qushitu\">走势图</li>";
                    info += "<li data-locale=\"remenjiaoyi.gerenxiangqing\">个人详情</li></ul></li>";
                } else if (type == "threedays") {
                    info = "<ul class=\"tableBox\" ><li class=\"table\"><ul class=\"tableHeader\"><li data-locale=\"remenjiaoyi.jibenxinxi\">基本信息</li><li data-locale=\"remenjiaoyi.zongyingli\">近三天盈利</li>";
                    info += "<li data-locale=\"remenjiaoyi.zongshouyilv\">收益率</li><li data-locale=\"remenjiaoyi.zongjiaoyibishu\">交易笔数</li><li data-locale=\"remenjiaoyi.qushitu\">走势图</li>";
                    info += "<li data-locale=\"remenjiaoyi.gerenxiangqing\">个人详情</li></ul></li>";
                } else if (type == "week") {
                    info = "<ul class=\"tableBox\" ><li class=\"table\"><ul class=\"tableHeader\"><li data-locale=\"remenjiaoyi.jibenxinxi\">基本信息</li><li data-locale=\"remenjiaoyi.zongyingli\">近一周盈利</li>";
                    info += "<li data-locale=\"remenjiaoyi.zongshouyilv\">收益率</li><li data-locale=\"remenjiaoyi.zongjiaoyibishu\">交易笔数</li><li data-locale=\"remenjiaoyi.qushitu\">走势图</li>";
                    info += "<li data-locale=\"remenjiaoyi.gerenxiangqing\">个人详情</li></ul></li>";
                } else if (type = "month") {
                    info = "<ul class=\"tableBox\" ><li class=\"table\"><ul class=\"tableHeader\"><li data-locale=\"remenjiaoyi.jibenxinxi\">基本信息</li><li data-locale=\"remenjiaoyi.zongyingli\">近一月盈利</li>";
                    info += "<li data-locale=\"remenjiaoyi.zongshouyilv\">收益率</li><li data-locale=\"remenjiaoyi.zongjiaoyibishu\">交易笔数</li><li data-locale=\"remenjiaoyi.qushitu\">走势图</li>";
                    info += "<li data-locale=\"remenjiaoyi.gerenxiangqing\">个人详情</li></ul></li>";
                }
                for (var i = 0; i < data.top.length; i++) {
                    if (language == 2) {
                        info += "<li class=\"table\"><ul class=\"tableHeader tableMain\"><li class=\"inforB\"><p class=\"firstInfo\" onclick=\"jumpPerson('" + data.top[i].userid + "');\">";
                        info += "<img src=\"" + data.top[i].img + "\" onerror=\"javascript:this.src='img/head.png';\"><span>" + data.top[i].nickname + "</span></p>";
                        info += "<p><input readonly class=\"dayS\" value=\"" + data.top[i].startnum + "\" type=\"text\" title=\"\"></p></li>";

                        if (data.top[i].er > 0) {
                            info += "<li class=\"tableBig colorGreen\">$" + unde(data.top[i].income, "") + "</li>";
                            info += "<li class=\"tableBig colorGreen\">+" + unde(data.top[i].er, 0) + "%</li>";
                        } else {
                            info += "<li class=\"tableBig colorRed\">$" + unde(data.top[i].income, "") + "</li>";
                            info += "<li class=\"tableBig colorRed\">" + unde(data.top[i].er, 0) + "%</li>";
                        }
                        info += "<li class=\"tableBig\">" + unde(data.top[i].dealnum, 0) + "<span></span></li>";
                        info += "<li><div class=\"KLine\" id=\"hotTrader_Kline_" + data.top[i].userid + "\"></div></li>";
                        info += "<li class=\"tableInfor\" id=\"hotTrader_Attention_" + data.top[i].userid + "\">";
                        info += "<a class=\"orangeColor\" href=\"personalDetails.html?userid=" + data.top[i].userid + "\">View details </a>";
                        if (data.top[i].fansid != null && data.top[i].fansid != undefined && data.top[i].fansid != "") {
                            info += "<a class=\"orangeColor\" href=\"javascript:unAttention('" + data.top[i].userid + "')\">Following</a>";
                        } else {
                            info += "<a class=\"grayColor\" href=\"javascript:addAttention('" + data.top[i].userid + "')\">Follow</a>";
                        }
                        info += "</li></ul></li>";
                    } else {
                        info += "<li class=\"table\"><ul class=\"tableHeader tableMain\"><li class=\"inforB\"><p class=\"firstInfo\" onclick=\"jumpPerson('" + data.top[i].userid + "');\">";
                        info += "<img src=\"" + data.top[i].img + "\" onerror=\"javascript:this.src='img/head.png';\"><span>" + data.top[i].nickname + "</span></p>";
                        info += "<p><input readonly class=\"dayS\" value=\"" + data.top[i].startnum + "\" type=\"text\" title=\"\"></p></li>";
                        if (data.top[i].er > 0) {
                            info += "<li class=\"tableBig colorGreen\">$" + unde(data.top[i].income, 0) + "</li>";
                            info += "<li class=\"tableBig colorGreen\">+" + unde(data.top[i].er, 0) + "%</li>";
                        } else {
                            info += "<li class=\"tableBig colorRed\">$" + unde(data.top[i].income, 0) + "</li>";
                            info += "<li class=\"tableBig colorRed\">" + unde(data.top[i].er, 0) + "%</li>";
                        }
                        info += "<li class=\"tableBig\">" + unde(data.top[i].dealnum, 0) + "<span>笔</span></li>";
                        info += "<li><div class=\"KLine\" id=\"hotTrader_Kline_" + data.top[i].userid + "\"></div></li>";
                        info += "<li class=\"tableInfor\" id=\"hotTrader_Attention_" + data.top[i].userid + "\">";
                        info += "<a class=\"orangeColor\" href=\"personalDetails.html?userid=" + data.top[i].userid + "\">查看详情</a>";
                        if (data.top[i].fansid != null && data.top[i].fansid != undefined && data.top[i].fansid != "") {
                            info += "<a class=\"orangeColor\" href=\"javascript:unAttention('" + data.top[i].userid + "')\">已关注</a>";
                        } else {
                            info += "<a class=\"grayColor\" href=\"javascript:addAttention('" + data.top[i].userid + "')\">关注</a>";
                        }
                        info += "</li></ul></li>";
                    }
                    var echartsdate = data.top[i].intime.split(',');
                    var echartsdata = data.top[i].incomels.split(',');
                    options[i] = {
                        xAxis: {
                            type: 'category',
                            boundaryGap: false,
                            data: echartsdate
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
                                offset: 1, color: '#343434' // 100% 处的颜色
                            }],
                            globalCoord: false // 缺省为 false
                        },
                        yAxis: {
                            type: 'value',
                            splitLine: {show: false},//去除网格线
                        },
                        series: [{
                            data: echartsdata,
                            type: 'line',
                            areaStyle: {},
                            symbol: 'none',
                        }]
                    };
                }

                info += "</ul>";
                $("#hotTrader").html(info);
                $(".dayS").rating({
                    min: 0, max: 5, step: 0.5, size: "xl", stars: "5", showClear: false
                });
                ttotalpage = Math.ceil(data.total / tnumber);
                ttotal = data.total;
                showPage(1);
                for (var i = 0; i < options.length; i++) {
                    var dom = document.getElementById("hotTrader_Kline_" + data.top[i].userid);
                    echarts.init(dom).setOption(options[i], true);
                }
                if (language == 2) {
                    loadProperties();
                }
            } else if (data.code == 101) {
                //alert("系统中未找到匹配的记录");
            } else {
                //alert("不好意思，请求失败了请刷新页面！");
            }
        }, error: function (XMLHttpRequest, textStatus, errorThrown) {
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
 * 获取热门交易排行榜
 */
function getHotCharts(currentpage) {
    cpage = currentpage;
    $.ajax({
        url: "../usdtpc/auth/getProfitTop",
        data: {"begintime": "", "endtime": "", "userid": userid, "page": tpage, "number": tnumber},
        method: "POST",
        success: function (data) {
            if (data.code == 100) {
                var options = new Array();
                var info = "<ul class=\"tableBox\" ><li class=\"table\"><ul class=\"tableHeader\"><li data-locale=\"remenjiaoyi.jibenxinxi\">基本信息</li><li data-locale=\"remenjiaoyi.zongyingli\">总盈利</li>";
                info += "<li data-locale=\"remenjiaoyi.zongshouyilv\">总收益率</li><li data-locale=\"remenjiaoyi.zongjiaoyibishu\">总交易笔数</li><li data-locale=\"remenjiaoyi.qushitu\">走势图</li>";
                info += "<li data-locale=\"remenjiaoyi.gerenxiangqing\">个人详情</li></ul></li>";
                for (var i = 0; i < data.top.length; i++) {
                    if (language == 2) {
                        info += "<li class=\"table\"><ul class=\"tableHeader tableMain\"><li class=\"inforB\"><p class=\"firstInfo\" onclick=\"jumpPerson('" + data.top[i].userid + "');\">";
                        info += "<img src=\"" + data.top[i].img + "\" onerror=\"javascript:this.src='img/head.png';\"><span>" + data.top[i].nickname + "</span></p>";
                        info += "<p><input readonly class=\"dayS\" value=\"4\" type=\"text\" title=\"\"></p></li>";

                        if (data.top[i].er > 0) {
                            info += "<li class=\"tableBig colorGreen\">$" + parseFloat(unde(data.top[i].money_income, 0)).toFixed(2) + "</li>";
                            info += "<li class=\"tableBig colorGreen\">+" + unde(data.top[i].er, 0) + "%</li>";
                        } else {
                            info += "<li class=\"tableBig colorRed\">$" + parseFloat(unde(data.top[i].money_income, 0)).toFixed(2) + "</li>";
                            info += "<li class=\"tableBig colorRed\">" + unde(data.top[i].er, 0) + "%</li>";
                        }
                        info += "<li class=\"tableBig\">" + unde(data.top[i].dealnum, 0) + "<span></span></li>";
                        info += "<li><div class=\"KLine\" id=\"hotCharts_Kline_" + data.top[i].userid + "\"></div></li>";
                        info += "<li class=\"tableInfor\" id=\"hotCharts_Attention_" + data.top[i].userid + "\">";
                        info += "<a class=\"orangeColor\" href=\"personalDetails.html?userid=" + data.top[i].userid + "\">View details </a>";
                        if (data.top[i].fansid != null && data.top[i].fansid != undefined && data.top[i].fansid != "") {
                            info += "<a class=\"orangeColor\" href=\"javascript:unAttention('" + data.top[i].userid + "')\">Followings</a>";
                        } else {
                            info += "<a class=\"grayColor\" href=\"javascript:addAttention('" + data.top[i].userid + "')\">Follow</a>";
                        }
                        info += "</li></ul></li>";
                    } else {
                        info += "<li class=\"table\"><ul class=\"tableHeader tableMain\"><li class=\"inforB\"><p class=\"firstInfo\" onclick=\"jumpPerson('" + data.top[i].userid + "');\">";
                        info += "<img src=\"" + data.top[i].img + "\" onerror=\"javascript:this.src='img/head.png';\"><span>" + data.top[i].nickname + "</span></p>";
                        info += "<p><input readonly class=\"dayS\" value=\"4\" type=\"text\" title=\"\"></p></li>";
                        if (data.top[i].er > 0) {
                            info += "<li class=\"tableBig colorGreen\">$" + parseFloat(unde(data.top[i].money_income, 0)).toFixed(2) + "</li>";
                            info += "<li class=\"tableBig colorGreen\">+" + data.top[i].er + "%</li>";
                        } else {
                            info += "<li class=\"tableBig colorRed\">$" + parseFloat(unde(data.top[i].money_income, 0)).toFixed(2) + "</li>";
                            info += "<li class=\"tableBig colorRed\">" + data.top[i].er + "%</li>";
                        }
                        info += "<li class=\"tableBig\">" + unde(data.top[i].dealnum, 0) + "<span>笔</span></li>";
                        info += "<li><div class=\"KLine\" id=\"hotCharts_Kline_" + data.top[i].userid + "\"></div></li>";
                        info += "<li class=\"tableInfor\" id=\"hotCharts_Attention_" + data.top[i].userid + "\">";
                        info += "<a class=\"orangeColor\" href=\"personalDetails.html?userid=" + data.top[i].userid + "\">查看详情</a>";
                        if (data.top[i].fansid != null && data.top[i].fansid != undefined && data.top[i].fansid != "") {
                            info += "<a class=\"orangeColor\" href=\"javascript:unAttention('" + data.top[i].userid + "')\">已关注</a>";
                        } else {
                            info += "<a class=\"grayColor\" href=\"javascript:addAttention('" + data.top[i].userid + "')\">关注</a>";
                        }
                        info += "</li></ul></li>";
                    }
                    var echartsdate = data.top[i].intime.split(',');
                    var echartsdata = data.top[i].incomels.split(',');
                    options[i] = {
                        xAxis: {
                            type: 'category',
                            boundaryGap: false,
                            data: echartsdate
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
                                offset: 1, color: '#343434' // 100% 处的颜色
                            }],
                            globalCoord: false // 缺省为 false
                        },
                        yAxis: {
                            type: 'value',
                            splitLine: {show: false},//去除网格线
                        },
                        series: [{
                            data: echartsdata,
                            type: 'line',
                            areaStyle: {},
                            symbol: 'none',
                        }]
                    };
                }

                info += "</ul>";
                $("#hotCharts").html(info);
                $(".dayS").rating({
                    min: 0, max: 5, step: 0.5, size: "xl", stars: "5", showClear: false
                });
                ctotalpage = Math.ceil(data.total / cnumber);
                ctotal = data.total;
                showPage(0);
                for (var i = 0; i < options.length; i++) {
                    var dom = document.getElementById("hotCharts_Kline_" + data.top[i].userid);
                    echarts.init(dom).setOption(options[i], true);
                }
                if (language == 2) {
                    loadProperties();
                }
            } else if (data.code == 101) {
                //alert("系统中未找到匹配的记录");
            } else {
                //alert("不好意思，请求失败了请刷新页面！");
            }
        }, error: function (XMLHttpRequest, textStatus, errorThrown) {
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
 * 修改分页显示
 */
function changPageShow(num) {
    if (num) {
        $('.serchbox').show();
        showPage(1);

    } else {
        $('.serchbox').hide();
        showPage(0);
    }
}

/**
 * 添加关注
 */
function addAttention(sub_user_id) {
    if (userid == null || userid == undefined || userid == "") {
        //alert("请您先登录");
    } else {
        $.ajax({
            url: "../usdtpc/auth/addFans",
            data: {"sub_user_id": sub_user_id, "userid": userid},
            method: "POST",
            success: function (data) {
                if (data.code == 100) {
                    if (language == 2) {
                        $("#hotCharts_Attention_" + sub_user_id).html("<a class=\"orangeColor\" href=\"personalDetails.html?userid=" + sub_user_id + "\">View details</a><a class=\"orangeColor\" href=\"javascript:unAttention('" + sub_user_id + "')\">Following</a>");
                        $("#hotTrader_Attention_" + sub_user_id).html("<a class=\"orangeColor\" href=\"personalDetails.html?userid=" + sub_user_id + "\">View details</a><a class=\"orangeColor\" href=\"javascript:unAttention('" + sub_user_id + "')\">Following</a>");
                    } else {
                        $("#hotCharts_Attention_" + sub_user_id).html("<a class=\"orangeColor\" href=\"personalDetails.html?userid=" + sub_user_id + "\">查看详情</a><a class=\"orangeColor\" href=\"javascript:unAttention('" + sub_user_id + "')\">已关注</a>");
                        $("#hotTrader_Attention_" + sub_user_id).html("<a class=\"orangeColor\" href=\"personalDetails.html?userid=" + sub_user_id + "\">查看详情</a><a class=\"orangeColor\" href=\"javascript:unAttention('" + sub_user_id + "')\">已关注</a>");
                    }
                } else {
                    //alert("不好意思请求失败了，请尝试再次请求！");
                }
            }, error: function (XMLHttpRequest, textStatus, errorThrown) {
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
}

/**
 * 用户取消关注
 * @param userid
 */
function unAttention(sub_user_id) {
    if (userid == null || userid == undefined || userid == "") {
        //alert("请您先登录");
    } else {
        $.ajax({
            url: "../usdtpc/auth/delFans",
            data: {"sub_user_id": sub_user_id, "userid": userid},
            method: "POST",
            success: function (data) {
                if (data.code == 100) {
                    if (language == 2) {
                        $("#hotCharts_Attention_" + sub_user_id).html("<a class=\"orangeColor\" href=\"personalDetails.html?userid=" + sub_user_id + "\">View details</a><a class=\"grayColor\" href=\"javascript:addAttention('" + sub_user_id + "')\">Follow</a>");
                        $("#hotTrader_Attention_" + sub_user_id).html("<a class=\"orangeColor\" href=\"personalDetails.html?userid=" + sub_user_id + "\">View details</a><a class=\"grayColor\" href=\"javascript:addAttention('" + sub_user_id + "')\">Follow</a>");
                    } else {
                        $("#hotCharts_Attention_" + sub_user_id).html("<a class=\"orangeColor\" href=\"personalDetails.html?userid=" + sub_user_id + "\">查看详情</a><a class=\"grayColor\" href=\"javascript:addAttention('" + sub_user_id + "')\">关注</a>");
                        $("#hotTrader_Attention_" + sub_user_id).html("<a class=\"orangeColor\" href=\"personalDetails.html?userid=" + sub_user_id + "\">查看详情</a><a class=\"grayColor\" href=\"javascript:addAttention('" + sub_user_id + "')\">关注</a>");
                    }
                } else {
                    //alert("不好意思请求失败了，请尝试再次请求！");
                }
            }, error: function (XMLHttpRequest, textStatus, errorThrown) {
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
}

/**
 *显示分页
 */
function showPage(num) {
    if (num == 1) {
        //之前需要将，上一页创建出来
        if (ttotalpage <= 5) {
            //总页数在0到5之间时，显示实际的页数
            for (var i = 1; i <= ttotalpage; i++) {
                $("#page_" + i).html("<a href=\"javascript:getTopTraderByTime(" + i + ");\">" + i + "</a>");
            }
        } else if (ttotalpage > 5 && tpage <= 5) {//总页数大于5时，只显示五页，多出的隐藏
            //判断当前页的位置
            if (tpage <= 3) {//当前页小于等于3时，显示1-5
                for (var i = 1; i <= 5; i++) {
                    $("#page_" + i).html("<a href=\"javascript:getTopTraderByTime(" + i + ");\">" + i + "</a>");
                }
            }
        } else if (tpage > (ttotalpage - 5)) {//当前页为最后五页时
            for (var i = ttotalpage - 4, j = 1; i <= ttotalpage, j <= 5; i++, j++) {
                $("#page_" + j).html("<a href=\"javascript:getTopTraderByTime(" + i + ");\">" + i + "</a>");
            }
        } else {//当前页为中间时
            for (var i = (tpage - 2), j = 1; i <= (tpage + 2), j <= 5; i++, j++) {
                $("#page_" + j).html("<a href=\"javascript:getTopTraderByTime(" + i + ");\">" + i + "</a>");
            }
        }
        if (language == 2) {
            if (tpage <= 1) {
                $("#prev_page").html("<a href=\"javascript:getTopTraderByTime(1);\" aria-label=\"Previous\"><span aria-hidden=\"true\">Prev</span></a>");
            } else {
                $("#prev_page").html("<a href=\"javascript:getTopTraderByTime(" + (tpage - 1) + ");\" aria-label=\"Previous\"><span aria-hidden=\"true\">Prev</span></a>");
            }
            if (tpage >= ttotalpage) {
                $("#next_page").html("<a href=\"javascript:getTopTraderByTime(" + ttotalpage + ");\" aria-label=\"Next\"><span aria-hidden=\"true\">Next</span></a>");
            } else {
                $("#next_page").html("<a href=\"javascript:getTopTraderByTime(" + (tpage + 1) + ");\" aria-label=\"Next\"><span aria-hidden=\"true\">Next</span></a>");
            }
        } else {
            if (tpage <= 1) {
                $("#prev_page").html("<a href=\"javascript:getTopTraderByTime(1);\" aria-label=\"Previous\"><span aria-hidden=\"true\">上一页</span></a>");
            } else {
                $("#prev_page").html("<a href=\"javascript:getTopTraderByTime(" + (tpage - 1) + ");\" aria-label=\"Previous\"><span aria-hidden=\"true\">上一页</span></a>");
            }
            if (tpage >= ttotalpage) {
                $("#next_page").html("<a href=\"javascript:getTopTraderByTime(" + ttotalpage + ");\" aria-label=\"Next\"><span aria-hidden=\"true\">下一页</span></a>");
            } else {
                $("#next_page").html("<a href=\"javascript:getTopTraderByTime(" + (tpage + 1) + ");\" aria-label=\"Next\"><span aria-hidden=\"true\">下一页</span></a>");
            }
        }
    } else {
        //之前需要将，上一页创建出来
        if (ctotalpage <= 5) {
            //总页数在0到5之间时，显示实际的页数
            for (var i = 1; i <= ctotalpage; i++) {
                $("#page_" + i).html("<a href=\"javascript:getHotCharts(" + i + ");\">" + i + "</a>");
            }
        } else if (ctotalpage > 5 && cpage <= 5) {//总页数大于5时，只显示五页，多出的隐藏
            //判断当前页的位置
            if (cpage <= 3) {//当前页小于等于3时，显示1-5
                for (var i = 1; i <= 5; i++) {
                    $("#page_" + i).html("<a href=\"javascript:getHotCharts(" + i + ");\">" + i + "</a>");
                }
            }
        } else if (cpage > (ctotalpage - 5)) {//当前页为最后五页时
            for (var i = ctotalpage - 4, j = 1; i <= ctotalpage, j <= 5; i++, j++) {
                $("#page_" + j).html("<a href=\"javascript:getHotCharts(" + i + ");\">" + i + "</a>");
            }
        } else {//当前页为中间时
            for (var i = (cpage - 2), j = 1; i <= (cpage + 2), j <= 5; i++, j++) {
                $("#page_" + j).html("<a href=\"javascript:getHotCharts(" + i + ");\">" + i + "</a>");
            }
        }
        if (cpage <= 1) {
            if (language == 2) {
                $("#prev_page").html("<a href=\"javascript:getHotCharts(1);\" aria-label=\"Previous\"><span aria-hidden=\"true\">Prev</span></a>");
            } else {
                $("#prev_page").html("<a href=\"javascript:getHotCharts(1);\" aria-label=\"Previous\"><span aria-hidden=\"true\">上一页</span></a>");
            }
        } else {
            if (language == 2) {
                $("#prev_page").html("<a href=\"javascript:getHotCharts(" + (cpage - 1) + ");\" aria-label=\"Previous\"><span aria-hidden=\"true\">Prev</span></a>");
            } else {
                $("#prev_page").html("<a href=\"javascript:getHotCharts(" + (cpage - 1) + ");\" aria-label=\"Previous\"><span aria-hidden=\"true\">上一页</span></a>");
            }
        }
        if (cpage >= ctotalpage) {
            if (language == 2) {
                $("#next_page").html("<a href=\"javascript:getHotCharts(" + ctotalpage + ");\" aria-label=\"Next\"><span aria-hidden=\"true\">Next</span></a>");
            } else {
                $("#next_page").html("<a href=\"javascript:getHotCharts(" + ctotalpage + ");\" aria-label=\"Next\"><span aria-hidden=\"true\">下一页</span></a>");
            }
        } else {
            if (language == 2) {
                $("#next_page").html("<a href=\"javascript:getHotCharts(" + (cpage + 1) + ");\" aria-label=\"Next\"><span aria-hidden=\"true\">Next</span></a>");
            } else {
                $("#next_page").html("<a href=\"javascript:getHotCharts(" + (cpage + 1) + ");\" aria-label=\"Next\"><span aria-hidden=\"true\">下一页</span></a>");
            }
        }
    }
}

function jumpPerson(userid) {
    window.location.href = "personalDetails.html?userid=" + userid;
}