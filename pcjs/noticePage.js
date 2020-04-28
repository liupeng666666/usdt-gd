var userid;
var token;
var language;
var number = 10;
var sys_class_id;
$(function () {
    userid = window.sessionStorage.getItem("userid");
    token = window.sessionStorage.getItem("token");
    changHead(userid);
    language = window.localStorage.getItem("language");
    if (language != undefined && language != null & language == 2) {
        if (language == 2) {
            loadProperties();
        }
    }
    getGongGaoClass();

})

function getGongGaoClass() {
    $.ajax({
        url: "../usdtpc/auth/getClassByStyle",
        data: {
            "style": 1
        },
        method: "GET",
        success: function (data) {
            if (data.code == 100) {
                if (data.sysclass.length > 0) {
                    sys_class_id = data.sysclass[0].pid;
                    getNewsByClass(data.sysclass[0].pid, 1);
                }
            }
        },
        error: function (err) {
        }
    })
}

/**
 * 根据分类查询新闻
 * @param classid
 */
function getNewsByClass(sys_class_id, page) {

    $.ajax({
        url: "../usdtpc/auth/getSysNewsByClass",
        data: {
            "sys_class_id": sys_class_id,
            "page": page,
            "number": number
        },
        method: "GET",
        success: function (data) {
            if (data.code == 100) {
                var info = "";
                if (language == 2) {
                    info = "<li style='font-size:20px'>Notice</li>";
                } else {
                    info = "<li style='font-size:20px'>公告</li>";
                }
                for (var i in data.news) {

                    var news = data.news[i];
                    if (language == 2) {
                        info += "<li onclick='tiaozhuan(\"" + news.pid + "\")'>" + news.y_title + "<span style='float:right'>" + news.createtime + "</span></li>";
                    } else {
                        info += "<li onclick='tiaozhuan(\"" + news.pid + "\")'>" + news.title + "<span style='float:right;padding-right:20px'>" + news.createtime + "</span></li>";
                    }

                }
                $("#html_ul").html(info);
                fenye(page, data.count);
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

function fenye(page, count) {
    var str = "<li>";
    if (page > 1) {
        str += " <a href=\"#\" aria-label=\"Previous\" onclick='getNewsByClass(\"" + sys_class_id + "\", \"" + (page - 1) + "\")'>";
    } else {
        str += " <a href=\"#\" aria-label=\"Previous\">";
    }
    str += " <span aria-hidden=\"true\">上一页</span>";
    str += " </a>";
    str += " </li>";

    var num = Math.ceil(count / number);
    if (num > 5) {
        for (var i = 0; i < 4; i++) {
            str += "       <li><a href=\"#\" onclick='getNewsByClass(\"" + sys_class_id + "\", \"" + i + "\")'>1</a></li>";

        }
        for (var i = num - 2; i <= num; i++) {
            str += "       <li><a href=\"#\" onclick='getNewsByClass(\"" + sys_class_id + "\", \"" + i + "\")'>1</a></li>";

        }

    } else {
        for (var i = 1; i <= num; i++) {
            str += "       <li><a href=\"#\" onclick='getNewsByClass(\"" + sys_class_id + "\", \"" + i + "\")'>1</a></li>";
        }
    }
    str += "<li>";
    if (page < num) {
        str += " <a href=\"#\" aria-label=\"Next\" onclick='getNewsByClass(\"" + sys_class_id + "\", \"" + (page + 1) + "\")'>";
    } else {
        str += " <a href=\"#\" aria-label=\"Next\">";
    }
    str += " <span aria-hidden=\"true\">下一页</span>";
    str += " </a>";
    str += " </li>";
    $("#html_fenye").html(str);
}

function tiaozhuan(pid) {
    window.location.href = "newsMessage.html?pid=" + pid;
}
