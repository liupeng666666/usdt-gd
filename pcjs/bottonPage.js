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
var less = GetRequest().less;

function zshowP2() {
    $('.leftsidebar_box').hide();
    $('.' + level).show();
    $('.commonClass').hide();
    $('.' + less).show();
    $("#" + level).parent().find('li').removeClass("activeP1");
    $("#" + level).addClass("activeP1");
    window.scrollTo(0, 0);
}

function zshowP3() {
    $('.' + less).slideDown().siblings(".commonClass").slideUp();
    $("#" + less).parent().find('dl').removeClass("Inforactive");
    $("#" + less).addClass("Inforactive");
    window.scrollTo(0, 0);
}

zshowP2();
zshowP3();
