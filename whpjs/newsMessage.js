/**
 * 新闻详情JS
 */

var title;
var synopsis;
var shareimg;

function news() {
    var pid = GetRequest().pid;
    $.ajax({
        url: "../../usdtpc/auth/getNewsMessage",
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
                    $("#time").html(unde(news.createtime.split("T")[0], ""));
                    $("#title").html(news.title);
                    $("#num").html(unde(news.num) + "个人访问");
                    $("#message").html(news.message);

                }
            }
        },
        error: function (err) {

        }
    })
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

function unde(value, type) {
    if (typeof (value) == "undefined") {
        return type;
    } else {
        return value;
    }

}

news();

function dakai() {
    var t = pandan();
    if (t == true) {
        if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) { //ios判断
            window.location.href = "bcurrency://?type=2&param1=" + GetRequest().pid; //通过app打开协议来打开app
            window.setTimeout(function () {
                window.location.href = "../downApp.html"; //没有弹框打开app则打开app下载地址
            }, 5000)
        } else if (/(Android)/i.test(navigator.userAgent)) { //Android判断
            window.location.href = "bcurrency://?type=2&param1=" + GetRequest().pid; //通过app打开协议来打开app
            window.setTimeout(function () {
                window.location.href = "../downApp.html"; //没有弹框打开app则打开app下载地址
            }, 5000)
//                      var state = null;
//                      try {
//                          state = window.open("bcurrency://?type=2&param1="+GetRequest().pid);
//                      } catch (e) {}
//                      if (state) {
//                          window.close();
//                      } else {
//                          window.location.href = "../downApp.html";
//                      }
        }
    }


}


function pandan() {
    var winHeight = $(window).height();

    function is_weixin() {
        var ua = navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == "micromessenger") {
            return true;
        } else {
            return false;
        }
    }

    var isWeixin = is_weixin();
    if (isWeixin) {
        $(".weixin-tip").css("height", winHeight);
        $(".weixin-tip").show();
        return false;
    } else {
        $(".weixin-tip").hide();
        return true;
    }
}
