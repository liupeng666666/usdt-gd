function weixin() {
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
        return true;
    }
}

function iphone() {
    var zweixin = weixin();
    if (weixin) {
        window.location.href = "itms-services://?action=download-manifest&url=https://www.b-currency.com/images/app/bcurrency.plist"
    }
}

function android() {
    var zweixin = weixin();
    if (zweixin) {
        window.location.href = "https://www.b-currency.com/images/app/bcurrency.apk";
    }
}
