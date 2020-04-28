/**
 * 新闻列表JS
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
    language = window.localStorage.getItem("language");
    if (language != undefined && language != null & language == 2) {
        loadProperties();
    }
    news();
});

function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

function news() {
    var pid = GetQueryString("pid");
    $.ajax({
        url: "../usdtpc/auth/getNewsMessage",
        data: {
            pid: pid
        },
        method: "POST",
        success: function (data) {
            if (data.code == 100) {
                if (data.news != null) {
                    var news = data.news;
                    $("#img").attr("src", news.simg);
                    $("#nickname").html(news.nickname);
                    $("#time").html(format(news.createtime, "yyyy/mm/dd"));
                    if (language == 2) {
                        $("#title").html(news.y_title);
                        $("#num").html(unde(news.amount, 0) + " people visit");
                        $("#message").html(news.y_message);
                    } else {
                        $("#title").html(news.title);
                        $("#num").html(unde(news.amount, 0) + "个人访问");
                        $("#message").html(news.message);
                    }
                }
            }
        },
        error: function (err) {

        }
    })
}