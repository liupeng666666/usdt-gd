/**
 * 首页JS
 */
/*----------------------------本页面全局变量--------------------------------*/
//用户id
var userid = null;
//token
var token;
//语言类型
var language;
/*---------------------------------------------------------------------*/
$(function () {
    userid = window.sessionStorage.getItem("userid");
    token = window.sessionStorage.getItem("token");

    changHead(userid);
    getIndexHeadImg();
    getTopTraderByTime("day");
    getFollowerByTime("fday");
    getTopTrader();
    getNewestTrading();
    getNewsClass();
    getSysNewsFlash();
    getDiscInfoByDist();
    language = window.localStorage.getItem("language");
    if (language != undefined && language != null & language == 2) {
        if (language == 2) {
            loadProperties();
        }
    }
    //	setInterval(getNewestTrading, 10000);
});

/**
 * 获取首页头部轮播图片
 */
function getIndexHeadImg() {
    $.ajax({
        url: "../usdtpc/auth/getAdByLocation",
        method: "GET",
        cache: true,
        data: {
            "location": 1
        },
        success: function (data) {
            if (data.code == 100) {
                var info = "";
                var lsinfo = "";
                var imgs = eval("(" + data.sysad[0].img + ")");
                for (var i = 0; i < imgs.length; i++) {
                    if (i == 0) {
                        lsinfo += "<li data-target=\"#carousel-example-generic\" data-slide-to=\"" + i + "\" class=\"active\"></li>";

                        info += "<div class=\"item active\">";
                        info += "<img src=\"" + imgs[i] + "\"  onerror=\"javascript:this.src='./img/Carousel1.jpg';\">";
                        info += "<div class=\"carousel-caption\">";
                        if (language == 2) {
                            info += "<button type=\"button\" onclick=\"jumpTradeHtml()\" class=\"btn btn-warning carouselBtn\">$Go Trade</button>";
                        } else {
                            info += "<button type=\"button\" onclick=\"jumpTradeHtml()\" class=\"btn btn-warning carouselBtn\">$去交易</button>";
                        }
                        info += "</div></div>";
                    } else {
                        lsinfo += "<li data-target=\"#carousel-example-generic\" data-slide-to=\"" + i + "\"></li>";

                        info += "<div class=\"item \">";
                        info += "<img src=\"" + imgs[i] + "\" onerror=\"javascript:this.src='./img/Carousel1.jpg';\"></div>";
                    }
                }
                $("#index_head_img").html(info);
                $("#index_head_li").html(lsinfo);
            } else {
                //alert("不好意思出错啦，请刷新页面！");
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

function jumpTradeHtml() {
    window.location.href = "trade/tradeAQU.html";
}

/**
 * 根据时间周期查看热门交易员排行榜
 */
function getTopTraderByTime(type) {
    var begintime = "";
    var endtime = "";
    if (type == "day") {
        var date = new Date();
        endtime = date.Format("yyyy/MM/dd HH:mm:ss");
        date = date.setDate(date.getDate());
        var edate = new Date(date);
        begintime = edate.Format("yyyy/MM/dd HH:mm:ss");
        begintime = begintime.split(" ")[0] + " 00:00:00";
        getTopTraderByTime("week");
    } else if (type == "week") {
        var date = new Date();
        endtime = date.Format("yyyy/MM/dd HH:mm:ss");
        date = date.setDate(date.getDate() - 6);
        var edate = new Date(date);
        begintime = edate.Format("yyyy/MM/dd HH:mm:ss");
        begintime = begintime.split(" ")[0] + " 00:00:00";
        getTopTraderByTime("month");
    } else if (type == "month") {
        var date = new Date();
        endtime = date.Format("yyyy/MM/dd HH:mm:ss");
        date = date.setDate(date.getDate() - 30);
        var edate = new Date(date);
        begintime = edate.Format("yyyy/MM/dd HH:mm:ss");
        begintime = begintime.split(" ")[0] + " 00:00:00";
    }

    $.ajax({
        url: "../usdtpc/auth/getProfitTop",
        data: {
            "begintime": begintime,
            "endtime": endtime,
            "userid": userid,
            "page": 1,
            "number": 3
        },
        method: "POST",
        success: function (data) {
            if (data.code == 100) {
                var info = "";
                for (var i = 0; i < data.top.length; i++) {
                    if (language == 2) {
                        info += "<li class=\"hotLi\"> ";
                        info += "<p class=\"title\" onclick=\"jumpPerson('" + data.top[i].userid + "');\"><img src=\"" + data.top[i].img + "\" onerror=\"javascript:this.src='img/head.png';\" >" + data.top[i].nickname + "</p>";
                        info += "<p class=\"start\"><input readonly class=\"dayS\" value=\"" + data.top[i].startnum + "\" type=\"text\" title=\"\"></p>";
                        info += "<p class=\"price \">" + parseFloat(unde(data.top[i].money_income, 0)).toFixed(2) + "<span>$</span></p>";
                        info += "<div class=\"priceNum\"><ul><li><p>" + unde(data.top[i].er, 0) + "%</p><span>profit margin</span></li>";
                        if (type == "day") {
                            info += "<li><p>" + unde(data.top[i].income, 0) + "$</p><span>Day income</span></li></ul></div><p id=\"toptrader_" + data.top[i].userid + "\">";
                        } else if (type == "week") {
                            info += "<li><p>" + unde(data.top[i].income, 0) + "$</p><span>Weekly income</span></li></ul></div><p id=\"toptrader_" + data.top[i].userid + "\">";
                        } else if (type == "month") {
                            info += "<li><p>" + unde(data.top[i].income, 0) + "$</p><span>Monthly income</span></li></ul></div><p id=\"toptrader_" + data.top[i].userid + "\">";
                        }
                        if (data.top[i].fansid != null && data.top[i].fansid != undefined && data.top[i].fansid != "") {
                            info += "<button class=\"btnwarningseconde orangeColor\" onclick=\"unAttention('" + data.top[i].userid + "')\">Following</button>";
                        } else {
                            info += "<button class=\"btnwarningseconde grayColor\" onclick=\"addAttention('" + data.top[i].userid + "')\">Follow</button>";
                        }
                        info += "</p><p class=\"follow\"><img src=\"img/follow.png\"><span id=\"ygz_" + data.top[i].userid + "\">" + unde(data.top[i].fans_num, 0) + "</span>Follower</p>";
                        info += "</li>";
                    } else {
                        info += "<li class=\"hotLi\"> ";
                        info += "<p class=\"title\" onclick=\"jumpPerson('" + data.top[i].userid + "');\"><img src=\"" + data.top[i].img + "\"  onerror=\"javascript:this.src='img/head.png';\">" + data.top[i].nickname + "</p>";
                        info += "<p class=\"start\"><input readonly class=\"dayS\" value=\"" + data.top[i].startnum + "\" type=\"text\" title=\"\"></p>";
                        info += "<p class=\"price \">" + parseFloat(unde(data.top[i].money_income, 0)).toFixed(2) + "<span>$</span></p>";
                        info += "<div class=\"priceNum\"><ul><li><p>" + data.top[i].er + "%</p><span>盈利率</span></li>";
                        if (type == "day") {
                            info += "<li><p>" + unde(data.top[i].income, 0) + "$</p><span>近一日收益</span></li></ul></div><p id=\"toptrader_" + data.top[i].userid + "\">";
                        } else if (type == "week") {
                            info += "<li><p>" + unde(data.top[i].income, 0) + "$</p><span>近一周收益</span></li></ul></div><p id=\"toptrader_" + data.top[i].userid + "\">";
                        } else if (type == "month") {
                            info += "<li><p>" + unde(data.top[i].income, 0) + "$</p><span>近一月收益</span></li></ul></div><p id=\"toptrader_" + data.top[i].userid + "\">";
                        }
                        if (data.top[i].fansid != null && data.top[i].fansid != undefined && data.top[i].fansid != "") {
                            info += "<button class=\"btnwarningseconde orangeColor\" onclick=\"unAttention('" + data.top[i].userid + "')\">已关注</button>";
                        } else {
                            info += "<button class=\"btnwarningseconde grayColor\" onclick=\"addAttention('" + data.top[i].userid + "')\">关注</button>";
                        }
                        info += "</p><p class=\"follow\"><img src=\"img/follow.png\"><span id=\"ygz_" + data.top[i].userid + "\">" + data.top[i].follow_num + "</span>人已关注</p>";
                        info += "</li>";
                    }
                }
                $("#index_toptrader_" + type).html(info);
                if (language == 2) {
                    loadProperties();
                }
                //				var $input = $('input.rating');
                //		        if ($input.length) {
                //		            $input.removeClass('rating-loading').addClass('rating-loading').rating();
                //		        }
                $(".dayS").rating({
                    min: 0,
                    max: 5,
                    step: 0.5,
                    size: "xl",
                    stars: "5",
                    showClear: false
                });
            } else if (data.code == 101) {
                //alert("系统中未找到匹配的记录");
            } else {
                //alert("不好意思，请求失败了请刷新页面！");
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

function jumpHotTradeCharts() {
    window.location.href = "hotTradeCharts.html?type=1";
}

/**
 * 添加关注
 */
function addAttention(sub_user_id) {
    if (userid == null || userid == undefined || userid == "") {
        alert("请您先登录");
    } else {
        $.ajax({
            url: "../usdtpc/auth/addFans",
            data: {
                "sub_user_id": sub_user_id,
                "userid": userid
            },
            method: "POST",
            success: function (data) {
                if (data.code == 100) {
                    if (language == 2) {
                        $("#toptrader_" + sub_user_id).html("<button class=\"btnwarningseconde orangeColor\" onclick=\"unAttention('" + sub_user_id + "')\">Following</button>");
                        $("#index_trader_" + sub_user_id).html("<a class=\"orangeColor\" href=\"javascript:jumpPerson('" + sub_user_id + "')\">Documentary view</a><a class=\"orangeColor\" href=\"javascript:unAttention('" + sub_user_id + "')\">Following</a>");
                    } else {
                        $("#toptrader_" + sub_user_id).html("<button class=\"btnwarningseconde orangeColor\" onclick=\"unAttention('" + sub_user_id + "')\">已关注</button>");
                        $("#index_trader_" + sub_user_id).html("<a class=\"orangeColor\" href=\"javascript:jumpPerson('" + sub_user_id + "')\">跟单查看</a><a class=\"orangeColor\" href=\"javascript:unAttention('" + sub_user_id + "')\">已关注</a>");
                    }
                    var num = $("#ygz_" + sub_user_id).text();
                    $("#ygz_" + sub_user_id).text(parseInt(num) + 1);
                } else {
                    //alert("不好意思请求失败了，请尝试再次请求！");
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
            data: {
                "sub_user_id": sub_user_id,
                "userid": userid
            },
            method: "POST",
            success: function (data) {
                if (data.code == 100) {
                    if (language == 2) {
                        $("#toptrader_" + sub_user_id).html("<button class=\"btnwarningseconde grayColor\" onclick=\"addAttention('" + sub_user_id + "')\">Follow</button>");
                        $("#index_trader_" + sub_user_id).html("<a class=\"orangeColor\" href=\"javascript:jumpPerson('" + sub_user_id + "')\">Documentary view</a><a class=\"grayColor\" href=\"javascript:addAttention('" + sub_user_id + "')\">Follow</a>");
                    } else {
                        $("#toptrader_" + sub_user_id).html("<button class=\"btnwarningseconde grayColor\" onclick=\"addAttention('" + sub_user_id + "')\">关注</button>");
                        $("#index_trader_" + sub_user_id).html("<a class=\"orangeColor\" href=\"javascript:jumpPerson('" + sub_user_id + "')\">跟单查看</a><a class=\"grayColor\" href=\"javascript:addAttention('" + sub_user_id + "')\">关注</a>");
                    }
                    var num = $("#ygz_" + sub_user_id).text();
                    $("#ygz_" + sub_user_id).text(parseInt(num) - 1);
                } else {
                    //alert("不好意思请求失败了，请尝试再次请求！");
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
}

/**
 * 查询跟随者收益
 * @param type
 */
function getFollowerByTime(type) {
    var begintime = "";
    var endtime = "";
    if (type == "fday") {
        var date = new Date();
        endtime = date.Format("yyyy/MM/dd HH:mm:ss");
        date = date.setDate(date.getDate());
        var edate = new Date(date);
        begintime = edate.Format("yyyy/MM/dd HH:mm:ss");
        begintime = begintime.split(" ")[0] + " 00:00:00";
        getFollowerByTime("fweek");
    } else if (type == "fweek") {
        var date = new Date();
        endtime = date.Format("yyyy/MM/dd HH:mm:ss");
        date = date.setDate(date.getDate() - 6);
        var edate = new Date(date);
        begintime = edate.Format("yyyy/MM/dd HH:mm:ss");
        begintime = begintime.split(" ")[0] + " 00:00:00";
        getFollowerByTime("fmonth");
    } else if (type == "fmonth") {
        var date = new Date();
        endtime = date.Format("yyyy/MM/dd HH:mm:ss");
        date = date.setDate(date.getDate() - 30);
        var edate = new Date(date);
        begintime = edate.Format("yyyy/MM/dd HH:mm:ss");
        begintime = begintime.split(" ")[0] + " 00:00:00";
    }
    $.ajax({
        url: "../usdtpc/auth/getSubTraderFollowerEarnings",
        data: {
            "begintime": begintime,
            "endtime": endtime,
            "page": 1,
            "number": 4
        },
        method: "GET",
        success: function (data) {
            if (data.code == 100) {
                var info = "<div class=\"followLIstBox\">";
                for (var i = 0; i < data.follow.length; i++) {
                    if (language == 2) {
                        info += "<div class=\"followLIst\" onclick=\"jumpPerson('" + data.follow[i].pid + "');\"> <img src=\"" + data.follow[i].img + "\" onerror=\"javascript:this.src='img/head.png';\" class=\"followLeft\">";
                        info += "<div class=\"followcenter\"> <p class=\"name\"><span class=\"namespan\">" + data.follow[i].nickname + "</span>";
                        info += "<input readonly class=\"fdayS\" value=\"" + data.follow[i].type + "\" type=\"text\" title=\"\"></p>";
                        info += "<p class=\"followP\">henchman：<span>" + unde(data.follow[i].fans_num, 0) + "</span></p>";
                        info += "</div><div class=\"followRIght\"><p class=\"price\">$" + unde(data.follow[i].income, 0) + "</p>";
                        if (type == "fday") {
                            info += "<p>Daily income</p></div><div class=\"line\"></div></div>";
                        } else if (type == "fweek") {
                            info += "<p>Week income</p></div><div class=\"line\"></div></div>";
                        } else if (type == "fmonth") {
                            info += "<p>Monthly income</p></div><div class=\"line\"></div></div>";
                        }
                    } else {
                        info += "<div class=\"followLIst\" onclick=\"jumpPerson('" + data.follow[i].pid + "');\"><img src=\"" + data.follow[i].img + "\" onerror=\"javascript:this.src='img/head.png';\" class=\"followLeft\">";
                        info += "<div class=\"followcenter\"> <p class=\"name\"><span class=\"namespan\">" + data.follow[i].nickname + "</span>";
                        info += "<input readonly class=\"fdayS\" value=\"" + data.follow[i].type + "\" type=\"text\" title=\"\"></p>";
                        info += "<p class=\"followP\">跟随者：<span>" + unde(data.follow[i].fans_num, 0) + "人</span></p>";
                        info += "</div><div class=\"followRIght\"><p class=\"price\">$" + unde(data.follow[i].income, 0) + "</p>";
                        if (type == "fday") {
                            info += "<p>近一天收益</p></div><div class=\"line\"></div></div>";
                        } else if (type == "fweek") {
                            info += "<p>近一周收益</p></div><div class=\"line\"></div></div>";
                        } else if (type == "fmonth") {
                            info += "<p>近一月收益</p></div><div class=\"line\"></div></div>";
                        }
                    }
                }
                info += "<div onclick=\"jumpMoreFollower()\" class=\"more\">更多>></div></div>";
                if (type == "fday") {
                    $("#Fday").html(info);
                } else if (type == "fweek") {
                    $("#Fweek").html(info);
                } else if (type == "fmonth") {
                    $("#Fmonth").html(info);
                }
                $(".fdayS").rating({
                    min: 0,
                    max: 5,
                    step: 0.5,
                    size: "xl",
                    stars: "5",
                    showClear: false
                });
            } else if (data.code == 101) {
                //alert("系统中未找到匹配的记录");
            } else {
                //alert("不好意思，请求失败了请刷新页面！");
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

function jumpMoreFollower() {
    window.location.href = "followProfit.html";
}

/**
 * 查看热门交易排行榜
 */
function getTopTrader() {
    var begintime = "";
    var endtime = "";
    var date = new Date();
    //	endtime = date.Format("yyyy/MM/dd HH:mm:ss");
    //	date = date.setDate(date.getDate() - 1);
    //	var edate = new Date(date);
    //	begintime = edate.Format("yyyy/MM/dd HH:mm:ss");
    $.ajax({
        url: "../usdtpc/auth/getProfitTop",
        data: {
            "begintime": begintime,
            "endtime": endtime,
            "userid": userid,
            "page": 1,
            "number": 5
        },
        method: "POST",
        success: function (data) {
            if (data.code == 100) {
                var info = "<li class=\"table\"><ul class=\"tableHeader\"><li data-locale=\"remenjiaoyi.jibenxinxi\">基本信息</li><li data-locale=\"remenjiaoyi.zongyingli\">总盈利</li>";
                info += "<li data-locale=\"remenjiaoyi.zongshouyilv\">总收益率</li><li data-locale=\"remenjiaoyi.zongjiaoyibishu\">总交易笔数</li><li data-locale=\"remenjiaoyi.qushitu\">走势图</li>";
                info += "<li data-locale=\"remenjiaoyi.gerenxiangqing\">个人详情</li></ul></li>";
                var options = new Array();
                for (var i = 0; i < data.top.length; i++) {
                    if (language == 2) {
                        info += "<li class=\"table\"><ul class=\"tableHeader tableMain\"><li class=\"inforB\">";
                        info += "<p class=\"firstInfo\" onclick=\"jumpPerson('" + data.top[i].userid + "')\"><img  src=\"" + data.top[i].img + "\" onerror=\"javascript:this.src='img/head.png';\"><span>" + data.top[i].nickname + "</span></p>";
                        info += "<p><input readonly class=\"dayS\" value=\"" + data.top[i].startnum + "\" type=\"text\" title=\"\"></p></li>";

                        if (data.top[i].er > 0) {
                            info += "<li class=\"tableBig colorGreen\">$" + parseFloat(unde(data.top[i].money_income, 0)).toFixed(2) + "</li>";
                            info += "<li class=\"tableBig colorGreen\">+" + data.top[i].er + "%</li>";
                        } else {
                            info += "<li class=\"tableBig colorRed\">$" + parseFloat(unde(data.top[i].money_income, 0)).toFixed(2) + "</li>";
                            info += "<li class=\"tableBig colorRed\">" + data.top[i].er + "%</li>";
                        }
                        info += "<li class=\"tableBig\">" + unde(data.top[i].dealnum, 0) + "<span></span></li>";
                        info += "<li><div class=\"KLine\" id=\"index_line_" + data.top[i].userid + "\"></div></li>";
                        info += "<li class=\"tableInfor\" id=\"index_trader_" + data.top[i].userid + "\">";
                        info += "<a class=\"orangeColor\" href=\"personalDetails.html?userid=" + data.top[i].userid + "\">Documentary view</a>";
                        if (data.top[i].fansid != null && data.top[i].fansid != undefined && data.top[i].fansid != "") {
                            info += "<a class=\"orangeColor\" href=\"javascript:unAttention('" + data.top[i].userid + "')\">Following</a>";
                        } else {
                            info += "<a class=\"grayColor\" href=\"javascript:addAttention('" + data.top[i].userid + "')\">Follow</a>";
                        }
                        info += "</li></ul></li>";
                    } else {
                        info += "<li class=\"table\"><ul class=\"tableHeader tableMain\"><li class=\"inforB\">";
                        info += "<p class=\"firstInfo\" onclick=\"jumpPerson('" + data.top[i].userid + "')\"><img src=\"" + data.top[i].img + "\" onerror=\"javascript:this.src='img/head.png';\"><span>" + data.top[i].nickname + "</span></p>";
                        info += "<p><input readonly class=\"dayS\" value=\"" + data.top[i].startnum + "\" type=\"text\" title=\"\"></p></li>";

                        if (data.top[i].er > 0) {
                            info += "<li class=\"tableBig colorGreen\">$" + parseFloat(unde(data.top[i].money_income, 0)).toFixed(2) + "</li>";
                            info += "<li class=\"tableBig colorGreen\">+" + data.top[i].er + "%</li>";
                        } else {
                            info += "<li class=\"tableBig colorRed\">$" + parseFloat(unde(data.top[i].money_income, 0)).toFixed(2) + "</li>";
                            info += "<li class=\"tableBig colorRed\">" + data.top[i].er + "%</li>";
                        }
                        info += "<li class=\"tableBig\">" + unde(data.top[i].dealnum, 0) + "<span>笔</span></li>";
                        info += "<li><div class=\"KLine\" id=\"index_line_" + data.top[i].userid + "\"></div></li>";
                        info += "<li class=\"tableInfor\" id=\"index_trader_" + data.top[i].userid + "\">";
                        info += "<a class=\"orangeColor\" href=\"personalDetails.html?userid=" + data.top[i].userid + "\">跟单查看</a>";
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
                                offset: 0,
                                color: '#19ab1d' // 0% 处的颜色
                            }, {
                                offset: 1,
                                color: '#343434' // 100% 处的颜色
                            }],
                            globalCoord: false // 缺省为 false
                        },
                        yAxis: {
                            type: 'value',
                            splitLine: {
                                show: false
                            }, //去除网格线
                        },
                        series: [{
                            data: echartsdata,
                            type: 'line',
                            areaStyle: {},
                            symbol: 'none',
                        }]
                    };

                }

                $("#index_hotdeal").html(info);
                $(".dayS").rating({
                    min: 0,
                    max: 5,
                    step: 0.5,
                    size: "xl",
                    stars: "5",
                    showClear: false
                });
                for (var i = 0; i < options.length; i++) {
                    var dom = document.getElementById("index_line_" + data.top[i].userid);
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
 * 查询最新的交易状态
 */
function getNewestTrading() {
    $.ajax({
        url: "../usdtpc/auth/getSubOrderSortDesc",
        data: {
            "page": 1,
            "number": 10
        },
        method: "POST",
        success: function (data) {
            if (data.code == 100) {
                var info = "";
                for (var i = 0; i < data.suborder.length; i++) {
                    if (language == 2) {
                        info += "<li><div class=\"leftTrade\"><div class=\"inforB\"><p class=\"firstInfo\" onclick=\"jumpPerson('" + data.suborder[i].userid + "')\">";
                        info += "<img src=\"" + data.suborder[i].img + "\" onerror=\"javascript:this.src='img/head.png';\"><span>" + data.suborder[i].nickname + "</span></p>";
                        info += "<p><input readonly class=\"dayS\" value=\"" + data.suborder[i].startnum + "\" type=\"text\" title=\"\"></p></div></div>";
                        info += "<div class=\"rightTrade\">";
                        if (data.suborder[i].style == 1) {
                            info += "<span>BQU</span>";
                        } else {
                            info += "<span>AQU</span>";
                        }
                        if (language == 2) {
                            info += "<span>" + unde(data.suborder[i].y_name, "") + "</span>";
                        } else {
                            info += "<span>" + unde(data.suborder[i].currencyname, "") + "</span>";
                        }
                        if (data.suborder[i].style == 1) {
                            info += "<span></span>";
                        } else {
                            info += "<span>M" + data.suborder[i].minute + "</span>";
                        }
                        if (data.suborder[i].style == 1) {
                            info += "<span>surplus stop-loss" + data.suborder[i].range + "%</span>";
                        } else {
                            info += "<span>Win loss" + data.suborder[i].range + "%</span>";
                        }

                        //						if(data.suborder[i].er>0){
                        //							info+="<span>Profit "+data.suborder[i].er+"%</span>";
                        //						}else{
                        //							info+="<span>Loss"+Math.abs(data.suborder[i].er)+"%</span>";
                        //						}
                        if (data.suborder[i].rise_fall != 1) {
                            info += "<span class=\"greenColor\">Going long</span>";
                        } else {
                            info += "<span class=\"redColor\">To buy</span>";
                        }
                        info += "<span>买入量" + unde(data.suborder[i].purchase, 0) + "/$</span>";
                        if (data.suborder[i].income >= 0) {
                            info += "<span class=\"orangeColor\">Profit</span><span class=\"greenColor\">+" + unde(data.suborder[i].income, 0) + "/$</span>";
                        } else {
                            info += "<span class=\"orangeColor\">Loss</span><span class=\"redColor\">-" + Math.abs(unde(data.suborder[i].income, 0)) + "/$</span>";
                        }
                        var date = new Date(data.suborder[i].createtime);
                        var createtime = date.Format("HH:mm:ss");
                        info += "<span>" + createtime + "</span></div></li>";
                    } else {
                        info += "<li><div class=\"leftTrade\"><div class=\"inforB\"><p class=\"firstInfo\" onclick=\"jumpPerson('" + data.suborder[i].userid + "')\">";
                        info += "<img src=\"" + data.suborder[i].img + "\" onerror=\"javascript:this.src='img/head.png';\"><span>" + data.suborder[i].nickname + "</span></p>";
                        info += "<p><input readonly class=\"dayS\" value=\"" + data.suborder[i].startnum + "\" type=\"text\" title=\"\"></p></div></div>";
                        info += "<div class=\"rightTrade\">";
                        if (data.suborder[i].style == 1) {
                            info += "<span>BQU</span>";
                        } else {
                            info += "<span>AQU</span>";
                        }
                        if (language == 2) {
                            info += "<span>" + data.suborder[i].y_name + "</span>";
                        } else {
                            info += "<span>" + data.suborder[i].currencyname + "</span>";
                        }
                        if (data.suborder[i].style == 1) {
                            info += "<span></span>";
                        } else {
                            info += "<span>M" + data.suborder[i].minute + "</span>";
                        }
                        if (data.suborder[i].style == 1) {
                            info += "<span>止盈止损" + unde(data.suborder[i].range, 0) + "%</span>";
                        } else {
                            info += "<span>赢损值" + unde(data.suborder[i].range, 0) + "%</span>";
                        }
                        //						if(data.suborder[i].er>0){
                        //							info+="<span>盈利"+data.suborder[i].er+"%</span>";
                        //						}else{
                        //							info+="<span>亏损"+Math.abs(data.suborder[i].er)+"%</span>";
                        //						}
                        if (data.suborder[i].rise_fall != 1) {
                            info += "<span class=\"greenColor\">买涨</span>";
                        } else {
                            info += "<span class=\"redColor\">买跌</span>";
                        }
                        info += "<span>买入量" + unde(data.suborder[i].purchase, 0) + "/$</span>";
                        if (data.suborder[i].income >= 0) {
                            info += "<span class=\"orangeColor\">盈利</span><span class=\"greenColor\">+" + unde(data.suborder[i].income, 0) + "/$</span>";
                        } else {
                            info += "<span class=\"orangeColor\">亏损</span><span class=\"redColor\">-" + Math.abs(unde(data.suborder[i].income, 0)) + "/$</span>";
                        }
                        var date = new Date(data.suborder[i].createtime);
                        var createtime = date.Format("HH:mm:ss");
                        info += "<span>" + createtime + "</span></div></li>";
                    }
                }
                $("#index_newesttrad").html(info);
                $(".dayS").rating({
                    min: 0,
                    max: 5,
                    step: 0.5,
                    size: "xl",
                    stars: "5",
                    showClear: false
                });
                //				var liHeight = $('#index_newesttrad li').height();
                //	            $('#index_newesttrad').lSlide({nTop:liHeight});
                $("#index_newesttrad").slideUpB();
                if (language == 2) {
                    loadProperties();
                }
            } else if (data.code == 101) {
                //alert("系统中未找到匹配的记录");
            } else {
                //alert("不好意思，请求失败了请刷新页面！");
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

function jumpNewsPage() {
    window.location.href = "newsPage.html?jumptype=1";
}

/**
 * 获取所有的新闻分类
 */
function getNewsClass() {
    $.ajax({
        url: "../usdtpc/auth/getClassByStyle",
        data: {
            "style": 0
        },
        method: "GET",
        success: function (data) {
            if (data.code == 100) {
                var info = "<ul class=\"nav nav-tabs\" role=\"tablist\">";
                for (var i = 0; i < data.sysclass.length; i++) {
                    if (i == 0) {
                        info += "<li role=\"presentation\" class=\"active\">";
                    } else {
                        info += "<li role=\"presentation\" >";
                    }
                    info += "<a href=\"#index_news_" + data.sysclass[i].pid + "\" aria-controls=\"index_news_" + data.sysclass[i].pid + "\" role=\"tab\"";
                    if (language == 2) {
                        info += " data-toggle=\"tab\">" + unde(data.sysclass[i].y_name, "") + "</a></li>";
                    } else {
                        info += " data-toggle=\"tab\">" + unde(data.sysclass[i].name, "") + "</a></li>";
                    }
                }
                if (language == 2) {
                    info += "<a href=\"newsPage.html\" class=\"more\">More>></a></ul><div class=\"tab-content\">";
                } else {
                    info += "<a href=\"newsPage.html\" class=\"more\">更多>></a></ul><div class=\"tab-content\">";
                }
                for (var i = 0; i < data.sysclass.length; i++) {
                    if (i == 0) {
                        info += "<div role=\"tabpanel\" class=\"tab-pane active\" id=\"index_news_" + data.sysclass[i].pid + "\"></div>";
                    } else {
                        info += "<div role=\"tabpanel\" class=\"tab-pane \" id=\"index_news_" + data.sysclass[i].pid + "\"></div>";
                    }
                }
                info += "</div>";
                for (var i = 0; i < data.sysclass.length; i++) {
                    getNewsByClass(data.sysclass[i].pid);
                }
                $("#index_newclass").html(info);
            } else if (data.code == 101) {
                //alert("系统中未找到匹配的记录");
            } else {
                //alert("不好意思，请求失败了请刷新页面！");
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
 * 根据分类查询新闻
 * @param classid
 */
function getNewsByClass(sys_class_id) {
    $.ajax({
        url: "../usdtpc/auth/getSysNewsByClass",
        data: {
            "sys_class_id": sys_class_id,
            "page": 1,
            "number": 3
        },
        method: "GET",
        success: function (data) {
            if (data.code == 100) {
                var info = "<ul class=\"newsList\">";
                for (var i = 0; i < data.news.length; i++) {
                    if (language == 2) {
                        info += "<li onclick=\"jumpNewsDetail('" + data.news[i].pid + "')\"><img src=\"" + data.news[i].img + "\" onerror=\"javascript:this.src='img/news.png';\"  class=\"newsImg\"><div class=\"newCenter\">";
                        info += "<p class=\"title\">" + unde(data.news[i].y_title, "") + "</p><div class=\"desc\">" + unde(data.news[i].y_synopsis, "") + "</div>";
                        info += "<p><img src=\"" + data.news[i].userimg + "\" onerror=\"javascript:this.src='img/head.png';\"><span>" + unde(data.news[i].nickname, "") + "</span></p></div></li>";
                    } else {
                        info += "<li onclick=\"jumpNewsDetail('" + data.news[i].pid + "')\"><img src=\"" + data.news[i].img + "\" onerror=\"javascript:this.src='img/news.png';\" class=\"newsImg\"><div class=\"newCenter\">";
                        info += "<p class=\"title\">" + unde(data.news[i].title, "") + "</p><div class=\"desc\">" + unde(data.news[i].synopsis, "") + "</div>";
                        info += "<p><img src=\"" + data.news[i].userimg + "\" onerror=\"javascript:this.src='img/head.png';\"><span>" + unde(data.news[i].nickname, "") + "</span></p></div></li>";
                    }
                }
                info += "</ul>";
                $("#index_news_" + sys_class_id).html(info);
            } else if (data.code == 101) {
                var info = "<ul class=\"newsList\"></ul>";
                $("#index_news_" + sys_class_id).html(info);
                //alert("系统中未找到匹配的记录");
            } else {
                var info = "<ul class=\"newsList\"></ul>";
                $("#index_news_" + sys_class_id).html(info);
                //alert("不好意思，请求失败了请刷新页面！");
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            var info = "<ul class=\"newsList\"></ul>";
            $("#index_news_" + sys_class_id).html(info);
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

function jumpNewsDetail(newsid) {
    window.location.href = "newsMessage.html?pid=" + newsid;
}

/**
 * 获取24小时快讯
 */
function getSysNewsFlash() {
    $.ajax({
        url: "../usdtpc/auth/getSysNewsFlash",
        data: {
            "page": 1,
            "number": 4
        },
        method: "GET",
        success: function (data) {
            if (data.code == 100) {
                var info = "";
                for (var i = 0; i < data.news.length; i++) {
                    if (language == 2) {
                        info += "<li><div class=\"newsBox\" onclick=\"jumpNewsDetail('" + data.news[i].pid + "')\">";
                        info += "<p class=\"title\">" + unde(data.news[i].y_title, "") + "</p><div class=\"desc\">";
                        info += unde(data.news[i].y_synopsis, "") + "</div></div></li>";
                    } else {
                        info += "<li><div class=\"newsBox\" onclick=\"jumpNewsDetail('" + data.news[i].pid + "')\">";
                        info += "<p class=\"title\">" + unde(data.news[i].title, "") + "</p><div class=\"desc\">";
                        info += unde(data.news[i].synopsis, "") + "</div></div></li>";
                    }
                }
                $("#index_NewsFlash").html(info);
                if (language == 2) {
                    loadProperties();
                }
            } else if (data.code == 101) {
                //alert("系统中未找到匹配的记录");
            } else {
                //alert("不好意思，请求失败了请刷新页面！");
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

function goTrade(state, currencyid) {
    window.location.href = "trade/tradeAQU.html?state=" + state + "&currencyid=" + currencyid;
}

/**
 * 根据交易区查询盘口信息
 */
function getDiscInfoByDist() {
    $("#index_discA").html("");
    $("#index_discB").html("");
    $("#index_discmy").html("");
    $.ajax({
        url: "../usdtpc/subUserCurrency/SubUserCurrencySelect",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        async: true,
        type: "POST",
        success: function (data) {
            if (data.code == 100) {
                for (var i in data.currency) {
                    var str = "";
                    var str1 = "";
                    var str2 = "";
                    var button_name = "去交易";
                    if (language == 2) {
                        button_name = "Go Trade";
                    }
                    var currency = data.currency[i];
                    str += "<li class=\"table\"><ul class=\"tableHeader\"><li class=\"name\"><img onerror=\"javascript:this.src='img/btc.png';\" src=\"" + currency.cimg + "\">" + currency.y_name + "</li>";
                    if (currency.bfb >= 0) {
                        str += "<li class=\"colorGreen\" id=\"ac_" + currency.pid + "\">$" + unde(currency.close, 0) + "</li><li class=\"colorGreen\" id=\"bc_" + currency.pid + "\">+" + (unde(currency.bfb, 0) * 100).toFixed(2) + "%</li>";
                    } else {
                        str += "<li class=\"colorRed\" id=\"ac_" + currency.pid + "\">$" + unde(currency.close, 0) + "</li><li class=\"colorRed\" id=\"bc_" + currency.pid + "\">" + (unde(currency.bfb, 0) * 100).toFixed(2) + "%</li>";
                    }
                    str += "<li><div class=\"KLine\" id=\"A_" + currency.pid + "\"></div></li>";
                    if (currency.num > 0) {
                        str += "<li onclick=\"sub_user_currency_insert(1,'" + currency.pid + "',this)\"><img src=\"img/12.png\"></li>";
                    } else {
                        str += "<li onclick=\"sub_user_currency_insert(0,'" + currency.pid + "',this)\"><img src=\"img/11.png\"></li>";
                    }
                    str += "<li><button type=\"button\" onclick=\"goTrade(1,'" + currency.pid + "')\" class=\"btn btn-warning\">" + button_name + "</button></li></ul></li>";

                    str1 += "<li class=\"table\"><ul class=\"tableHeader\"><li class=\"name\"><img onerror=\"javascript:this.src='img/btc.png';\" src=\"" + currency.cimg + "\">" + currency.y_name + "</li>";
                    if (currency.bfb >= 0) {
                        str1 += "<li class=\"colorGreen\" id=\"acb_" + currency.pid + "\">$" + unde(currency.close, 0) + "</li><li class=\"colorGreen\" id=\"bcb_" + currency.pid + "\">+" + (unde(currency.bfb, 0) * 100).toFixed(2) + "%</li>";
                    } else {
                        str1 += "<li class=\"colorRed\" id=\"acb_" + currency.pid + "\">$" + unde(currency.close, 0) + "</li><li class=\"colorRed\" id=\"bcb_" + currency.pid + "\">" + (unde(currency.bfb, 0) * 100).toFixed(2) + "%</li>";
                    }
                    str1 += "<li><div class=\"KLine\" id=\"B_" + currency.pid + "\"></div></li>";
                    if (currency.num > 0) {
                        str1 += "<li onclick=\"sub_user_currency_insert(1,'" + currency.pid + "',this)\"><img src=\"img/12.png\"></li>";
                    } else {
                        str1 += "<li onclick=\"sub_user_currency_insert(0,'" + currency.pid + "',this)\"><img src=\"img/11.png\"></li>";
                    }
                    str1 += "<li><button type=\"button\" onclick=\"goTrade(2,'" + currency.pid + "')\" class=\"btn btn-warning\">" + button_name + "</button></li></ul></li>";

                    if (currency.num >= 1) {
                        str2 += "<li class=\"table\"><ul class=\"tableHeader\"><li class=\"name\"><img onerror=\"javascript:this.src='img/btc.png';\" src=\"" + currency.cimg + "\">" + currency.y_name + "</li>";
                        if (parseFloat(currency.bfb) >= 0) {
                            str2 += "<li class=\"colorGreen\" id=\"acz_" + currency.pid + "\">$" + unde(currency.close, 0) + "</li><li class=\"colorGreen\" id=\"bcz_" + currency.pid + "\">+" + (unde(currency.bfb, 0) * 100).toFixed(2) + "%</li>";
                        } else {
                            str2 += "<li class=\"colorRed\" id=\"acz_" + currency.pid + "\">$" + unde(currency.close, 0) + "</li><li class=\"colorRed\" id=\"bcz_" + currency.pid + "\">" + (unde(currency.bfb, 0) * 100).toFixed(2) + "%</li>";
                        }
                        str2 += "<li><div class=\"KLine\" id=\"C_" + currency.pid + "\"></div></li>";
                        str2 += "<li onclick=\"sub_user_currency_insert(1,'" + currency.pid + "',this)\"><img src=\"img/12.png\"></li>";
                        str2 += "<li><button type=\"button\" onclick=\"goTrade(1,'" + currency.pid + "')\" class=\"btn btn-warning\">" + button_name + "</button></li></ul></li>";
                    }
                    $("#index_discA").append(str);
                    $("#index_discB").append(str1);
                    $("#index_discmy").append(str2);

                }
                if (language == 2) {
                    loadProperties();
                }

                var a_i = 0;
                var b_i = 0;
                var a_minute;
                var a_num = 2;
                var b_num = 2;
                var b_minute;
                for (var i in data.minute) {
                    if (data.minute[i].style == 0) {
                        if (a_i == 0) {
                            a_minute = data.minute[i].pid;
                            a_num = Math.ceil(parseInt(1440) / parseInt(data.minute[i].minute));
                        }
                        a_i += 1;
                    } else {
                        if (b_i == 0) {
                            b_minute = data.minute[i].pid;
                            b_num = Math.ceil(parseInt(1440) / parseInt(data.minute[i].minute));
                        }
                        b_i += 1;
                    }
                }
                for (var i in data.currency) {
                    top_kline(a_minute, data.currency[i].pid, a_num, 1);
                    top_kline(a_minute, data.currency[i].pid, b_num, 2);
                }

            } else if (data.code == 101) {
                //alert("系统中未找到匹配的记录");
            } else {
                //alert("不好意思，请求失败了请刷新页面！");
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

//收藏币种
function sub_user_currency_insert(state, currencyid, th) {
    $.ajax({
        type: "post",
        url: "../usdtpc/subUserCurrency/SubUserCurrencyInsert",
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
                    $(th).children("img").attr("src", "img/12.png");
                    $(th).attr("onclick", "sub_user_currency_insert(1,'" + currencyid + "',this)");
                } else {
                    $(th).children("img").attr("src", "img/11.png");
                    $(th).attr("onclick", "sub_user_currency_insert(0,'" + currencyid + "',this)");
                }
                //getDiscInfoByDist();
            } else {
                window.location.href = "login/login.html";
            }
        },
        error: function (err) {
            window.location.href = "login/login.html";
        }
    })
}

function top_kline(minuteid, currencyid, num, state) {
    $.ajax({
        type: "post",
        url: "../usdtpc/subdisc/SubDiscKline",
        async: true,
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        data: {
            sys_currency_id: currencyid,
            sys_minute_id: minuteid,
            num: num
        },
        success: function (data) {
            var data_value = new Array();
            if (data.code == 100) {
                for (var i in data.kline) {
                    var kline = data.kline[data.kline.length - i - 1];
                    kline = JSON.parse(kline);
                    data_value.push(kline.close);
                }
                var data_value2 = new Array();
                var data_value3 = new Array();
                for (var i in data_value) {
                    if (data_value[i] != 0) {
                        data_value3.push(data_value[i]);
                    }
                }
                var min_value = Math.min.apply(0, data_value3);
                for (var i in data_value3) {
                    data_value2.push(parseFloat(data_value3[i]) - parseFloat(min_value));
                }

                if (state == 1) {
                    echart_zx("A_" + currencyid, data_value2);
                    echart_zx("C_" + currencyid, data_value2);
                } else {
                    echart_zx("B_" + currencyid, data_value2);
                }

            }
        },
        error: function (err) {

        }
    });
}

function dinshi_bizhong() {
    $.ajax({
        url: "../usdtpc/subUserCurrency/SubUserCurrencySelect",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        async: true,
        type: "POST",
        success: function (data) {
            if (data.code == 100) {
                for (var i in data.currency) {
                    var currency = data.currency[i];
                    if (currency.bfb >= 0) {
                        $("#ac_" + currency.pid).html("$" + unde(currency.close, 0));
                        $("#ac_" + currency.pud).attr("class", "colorGreen");
                        $("#bc_" + currency.pid).html("+" + (unde(currency.bfb, 0) * 100).toFixed(2) + "%");
                        $("#bc_" + currency.pud).attr("class", "colorGreen");

                        $("#acz_" + currency.pid).html("$" + unde(currency.close, 0));
                        $("#acz_" + currency.pud).attr("class", "colorGreen");
                        $("#bcz_" + currency.pid).html("+" + (unde(currency.bfb, 0) * 100).toFixed(2) + "%");
                        $("#bcz_" + currency.pud).attr("class", "colorGreen");

                        $("#acb_" + currency.pid).html("$" + unde(currency.close, 0));
                        $("#acb_" + currency.pud).attr("class", "colorGreen");
                        $("#bcb_" + currency.pid).html("+" + (unde(currency.bfb, 0) * 100).toFixed(2) + "%");
                        $("#bcb_" + currency.pud).attr("class", "colorGreen");
                    } else {
                        $("#ac_" + currency.pid).html("$" + unde(currency.close, 0));
                        $("#ac_" + currency.pud).attr("class", "colorRed");
                        $("#bc_" + currency.pid).html((unde(currency.bfb, 0) * 100).toFixed(2) + "%");
                        $("#bc_" + currency.pud).attr("class", "colorRed");

                        $("#acz_" + currency.pid).html("$" + unde(currency.close, 0));
                        $("#acz_" + currency.pud).attr("class", "colorRed");
                        $("#bcz_" + currency.pid).html((unde(currency.bfb, 0) * 100).toFixed(2) + "%");
                        $("#bcz_" + currency.pud).attr("class", "colorRed");

                        $("#acb_" + currency.pid).html("$" + unde(currency.close, 0));
                        $("#acb_" + currency.pud).attr("class", "colorRed");
                        $("#bcb_" + currency.pid).html((unde(currency.bfb, 0) * 100).toFixed(2) + "%");
                        $("#bcb_" + currency.pud).attr("class", "colorRed");
                    }
                }
            }
        },
        error: function (err) {

        }
    })
}

setInterval("dinshi_bizhong()", 60000);