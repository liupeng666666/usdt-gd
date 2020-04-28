/**
 * 跟随者JS
 */
/*----------------------------本页面全局变量--------------------------------*/
//用户id
var userid = null;
//token
var token;
//语言类型
var language;
//天当前页码
var dpage = 1;
//天每页展示条数
var dnumber = 10;
//天共多少页
var dtotalpage = 1;
//天总条数
var dtotal = 0;
//周当前页码
var wpage = 1;
//周每页展示条数
var wnumber = 10;
//周共多少页
var wtotalpage = 1;
//周总条数
var wtotal = 0;
//月当前页码
var mpage = 1;
//月每页展示条数
var mnumber = 10;
//月共多少页
var mtotalpage = 1;
//月总条数
var mtotal = 0;
/*---------------------------------------------------------------------*/
$(function () {
    userid = window.sessionStorage.getItem("userid");
    token = window.sessionStorage.getItem("token");
    changHead(userid);
    getFollowerEarnings("day", 1);
    getFollowerEarnings("week", 1);
    getFollowerEarnings("month", 1);
    showPage("day");
    language = window.localStorage.getItem("language");
    if (language != undefined && language != null & language == 2) {
        loadProperties();
    }
});

/**
 * 获得相对当前周AddWeekCount个周的起止日期
 * AddWeekCount为0代表当前周   为-1代表上一个周   为1代表下一个周以此类推
 * **/
function getWeekStartAndEnd(AddWeekCount) {
    //起止日期数组   
    var startStop = new Array();
    //一天的毫秒数   
    var millisecond = 1000 * 60 * 60 * 24;
    //获取当前时间   
    var currentDate = new Date();
    //相对于当前日期AddWeekCount个周的日期
    currentDate = new Date(currentDate.getTime() + (millisecond * 7 * AddWeekCount));
    //返回date是一周中的某一天
    var week = currentDate.getDay();
    //返回date是一个月中的某一天   
    var month = currentDate.getDate();
    //减去的天数   
    var minusDay = week != 0 ? week - 1 : 6;
    //获得当前周的第一天   
    var currentWeekFirstDay = new Date(currentDate.getTime() - (millisecond * minusDay));
    //获得当前周的最后一天
    var currentWeekLastDay = new Date(currentWeekFirstDay.getTime() + (millisecond * 6));
    //添加至数组   
    startStop.push(currentWeekFirstDay);
    startStop.push(currentWeekLastDay);

    return startStop;
}

/**
 * 获得相对当月AddMonthCount个月的起止日期
 * AddMonthCount为0 代表当月 为-1代表上一个月  为1代表下一个月 以此类推
 * ***/
function getMonthStartAndEnd(AddMonthCount) {
    //起止日期数组   
    var startStop = new Array();
    //获取当前时间   
    var currentDate = new Date();
    var month = currentDate.getMonth() + AddMonthCount;
    if (month < 0) {
        var n = parseInt((-month) / 12);
        month += n * 12;
        currentDate.setFullYear(currentDate.getFullYear() - n);
    }
    currentDate = new Date(currentDate.setMonth(month));
    //获得当前月份0-11   
    var currentMonth = currentDate.getMonth();
    //获得当前年份4位年   
    var currentYear = currentDate.getFullYear();
    //获得上一个月的第一天   
    var currentMonthFirstDay = new Date(currentYear, currentMonth, 1);
    //获得上一月的最后一天   
    var currentMonthLastDay = new Date(currentYear, currentMonth + 1, 0);
    //添加至数组   
    startStop.push(currentMonthFirstDay);
    startStop.push(currentMonthLastDay);
    //返回   
    return startStop;
}

function getFollowerEarnings(type, currentpage) {
    var begintime = "";
    var endtime = "";
    var currentnumber = 10;
    if (type == "day") {
        var date = new Date();
        endtime = date.Format("yyyy/MM/dd HH:mm:ss");
        date = date.setDate(date.getDate());
        var edate = new Date(date);
        begintime = edate.Format("yyyy/MM/dd HH:mm:ss");
        begintime = begintime.split(" ")[0] + " 00:00:00";
        dpage = currentpage;
        currentnumber = dnumber;
    } else if (type == "week") {
        var date = new Date();
        endtime = date.Format("yyyy/MM/dd HH:mm:ss");
        date = date.setDate(date.getDate() - 6);
        var edate = new Date(date);
        begintime = edate.Format("yyyy/MM/dd HH:mm:ss");
        begintime = begintime.split(" ")[0] + " 00:00:00";
        wpage = currentpage;
        currentnumber = wnumber;
    } else if (type == "month") {
        var date = new Date();
        endtime = date.Format("yyyy/MM/dd HH:mm:ss");
        date = date.setDate(date.getDate() - 30);
        var edate = new Date(date);
        begintime = edate.Format("yyyy/MM/dd HH:mm:ss");
        begintime = begintime.split(" ")[0] + " 00:00:00";
        mpage = currentpage;
        currentnumber = mnumber;
    }
    $.ajax({
        url: "../usdtpc/auth/getSubTraderFollowerEarnings",
        data: {
            "begintime": begintime,
            "endtime": endtime,
            "page": currentpage,
            "number": currentnumber
        },
        method: "GET",
        success: function (data) {
            if (data.code == 100) {
                var info = "<ul class=\"tableBox\"><li class=\"table\"><ul class=\"tableHeader\"><li data-locale=\"remenjiaoyi.jibenxinxi\">基本信息</li>";
                info += "<li data-locale=\"follow.gensuizhe\">跟随者</li><li data-locale=\"follow.gensuishouyi\">跟随收益</li><li data-locale=\"follow.chengyuan\">成员</li>";
                info += "<li data-locale=\"follow.yongjinshouyi\">佣金收益</li>";
                if (type == "day") {
                    info += "<li data-locale=\"jiaoyiyuan.rishouyi\">日收益</li></ul></li>";
                } else if (type == "week") {
                    info += "<li data-locale=\"jiaoyiyuan.rishouyi\">周收益</li></ul></li>";
                } else if (type == "month") {
                    info += "<li data-locale=\"jiaoyiyuan.rishouyi\">月收益</li></ul></li>";
                }
                for (var i = 0; i < data.follow.length; i++) {
                    if (language == 2) {
                        info += "<li class=\"table\"><ul class=\"tableHeader tableMain\"><li class=\"inforB\">";
                        info += "<p class=\"firstInfo\" onclick=\"jumpPerson('" + data.follow[i].pid + "');\"><img src=\"" + data.follow[i].img + "\" onerror=\"javascript:this.src='img/head.png';\"><span>" + data.follow[i].nickname + "</span>";
                        info += "</p><p><input readonly class=\"dayS\" value=\"" + data.follow[i].type + "\"";
                        info += "type=\"text\" title=\"\"></p></li><li class=\"tableBig\">" + unde(data.follow[i].fans_num, 0) + "<span></span></li>";
                        info += "<li class=\"tableBig\">" + unde(data.follow[i].c_income, 0) + "<span>$</span></li><li class=\"tableBig\">" + unde(data.follow[i].num, 0) + "<span>";
                        info += "</span></li><li class=\"tableBig\">" + unde(data.follow[i].t_income, 0) + "$</li>";
                        var allincome = (unde(data.follow[i].c_income, 0) + unde(data.follow[i].t_income, 0)).toFixed(2);
                        info += "<li class=\"tableBig orangeColor\">" + allincome + "$</li>";
                        info += "</ul></li>";
                    } else {
                        info += "<li class=\"table\"><ul class=\"tableHeader tableMain\"><li class=\"inforB\">";
                        info += "<p class=\"firstInfo\" onclick=\"jumpPerson('" + data.follow[i].pid + "');\"><img src=\"" + data.follow[i].img + "\" onerror=\"javascript:this.src='img/head.png';\"><span>" + data.follow[i].nickname + "</span>";
                        info += "</p><p><input readonly class=\"dayS\" value=\"" + unde(data.follow[i].type, 0) + "\"";
                        info += "type=\"text\" title=\"\"></p></li><li class=\"tableBig\">" + unde(data.follow[i].fans_num, 0) + "<span>人</span></li>";
                        info += "<li class=\"tableBig colorGreen\">+" + unde(data.follow[i].c_income, 0) + "$</li><li class=\"tableBig\">" + unde(data.follow[i].num, 0) + "<span>";
                        info += "人</span></li><li class=\"tableBig colorGreen\">+" + unde(data.follow[i].t_income, 0) + "$</li>";
                        var allincome = (unde(data.follow[i].c_income, 0) + unde(data.follow[i].t_income, 0)).toFixed(2);
                        info += "<li class=\"tableBig colorGreen\">+" + allincome + "$</li>";
                        info += "</ul></li>";
                    }
                }
                info += "</ul>";
                $("#" + type + "Profit").html(info);
                $(".dayS").rating({
                    min: 0,
                    max: 5,
                    step: 0.5,
                    size: "xl",
                    stars: "5",
                    showClear: false
                });
                if (language == 2) {
                    loadProperties();
                }
                if (type == "day") {
                    dtotalpage = Math.ceil(data.total / dnumber);
                    dtotal = data.total;
                    showPage(type);
                } else if (type == "week") {
                    wtotalpage = Math.ceil(data.total / wnumber);
                    wtotal = data.total;
                    //showPage(type);
                } else if (type == "month") {
                    mtotalpage = Math.ceil(data.total / mnumber);
                    mtotal = data.total;
                    //showPage(type);
                }

            } else if (data.code == 101) {

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
 * 修改分页显示
 */
function changPageShow(type) {
    showPage(type);
}

/**
 *显示分页
 */
function showPage(type) {
    var totalpage = 0;
    var page = 0;
    if (type == "day") {
        totalpage = dtotalpage;
        page = dpage;
        $(".pagination").hide();
        $("#tradeEndDynamic_page").show();
    } else if (type == "week") {
        totalpage = wtotalpage;
        page = wpage;
        $(".pagination").hide();
        $("#tradeEndDynamic_page2").show();
    } else if (type == "month") {
        totalpage = mtotalpage;
        page = mpage;
        $(".pagination").hide();
        $("#tradeEndDynamic_page3").show();
    }
    //之前需要将，上一页创建出来
    if (totalpage <= 5) {
        //总页数在0到5之间时，显示实际的页数
        for (var i = 1; i <= totalpage; i++) {
            $("#page_" + type + "_" + i).html("<a href=\"javascript:getFollowerEarnings('" + type + "'," + i + ");\">" + i + "</a>");
        }
    } else if (totalpage > 5 && page <= 5) { //总页数大于5时，只显示五页，多出的隐藏
        //判断当前页的位置
        if (page <= 3) { //当前页小于等于3时，显示1-5
            for (var i = 1; i <= 5; i++) {
                $("#page_" + type + "_" + i).html("<a href=\"javascript:getFollowerEarnings('" + type + "'," + i + ");\">" + i + "</a>");
            }
        }
    } else if (page > (totalpage - 5)) { //当前页为最后五页时
        for (var i = totalpage - 4, j = 1; i <= totalpage, j <= 5; i++, j++) {
            $("#page_" + type + "_" + i).html("<a href=\"javascript:getFollowerEarnings('" + type + "'," + i + ");\">" + i + "</a>");
        }
    } else { //当前页为中间时
        for (var i = (page - 2), j = 1; i <= (page + 2), j <= 5; i++, j++) {
            $("#page_" + type + "_" + j).html("<a href=\"javascript:getFollowerEarnings('" + type + "'," + i + ");\">" + i + "</a>");
        }
    }
    if (page <= 1) {
        if (language == 2) {
            $("#prev_" + type + "_page").html("<a href=\"javascript:getFollowerEarnings('" + type + "',1);\" aria-label=\"Previous\"><span aria-hidden=\"true\">prev</span></a>");
        } else {
            $("#prev_" + type + "_page").html("<a href=\"javascript:getFollowerEarnings('" + type + "',1);\" aria-label=\"Previous\"><span aria-hidden=\"true\">上一页</span></a>");
        }
    } else {
        if (language == 2) {
            $("#prev_" + type + "_page").html("<a href=\"javascript:getFollowerEarnings('" + type + "'," + (page - 1) + ");\" aria-label=\"Previous\"><span aria-hidden=\"true\">prev</span></a>");
        } else {
            $("#prev_" + type + "_page").html("<a href=\"javascript:getFollowerEarnings('" + type + "'," + (page - 1) + ");\" aria-label=\"Previous\"><span aria-hidden=\"true\">上一页</span></a>");
        }
    }
    if (page >= totalpage) {
        if (language == 2) {
            $("#next_" + type + "_page").html("<a href=\"javascript:getFollowerEarnings('" + type + "'," + totalpage + ");\" aria-label=\"Next\"><span aria-hidden=\"true\">next</span></a>");
        } else {
            $("#next_" + type + "_page").html("<a href=\"javascript:getFollowerEarnings('" + type + "'," + totalpage + ");\" aria-label=\"Next\"><span aria-hidden=\"true\">下一页</span></a>");
        }
    } else {
        if (language == 2) {
            $("#next_" + type + "_page").html("<a href=\"javascript:getFollowerEarnings('" + type + "'," + (page + 1) + ");\" aria-label=\"Next\"><span aria-hidden=\"true\">next</span></a>");
        } else {
            $("#next_" + type + "_page").html("<a href=\"javascript:getFollowerEarnings('" + type + "'," + (page + 1) + ");\" aria-label=\"Next\"><span aria-hidden=\"true\">下一页</span></a>");
        }
    }

}

function jumpPerson(userid) {
    window.location.href = "personalDetails.html?userid=" + userid;
}