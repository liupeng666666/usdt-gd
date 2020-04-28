function GetRequest() {
    var url = location.search; // 获取url中"?"符后的字串
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

var level = GetRequest().level;

function zhanshi() {
    $("#privacyPolicy").removeClass("active");
    $("#termsService").removeClass("active");
    $("#disclaimer").removeClass("active");
    $("#codeCommunity").removeClass("active");
    $("#" + level).addClass("active");
    $("#z_" + level).parent().find('li').removeClass("active");
    $("#z_" + level).addClass("active");
}

zhanshi();
var userid;
var token;
var language;
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
})