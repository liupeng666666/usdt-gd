function sj() {
    var type = GetRequest().type;
    var leixing = 2;
    if (type == 'android') {
        leixing = 1;
    }
    $.ajax({
        url: "../../usdtpc/auth/ShengJi",
        method: "POST",
        data: {
            type: leixing
        },
        success: function (data) {
            if (data.code == 100) {
                var sj = data.sj;
                var messages = sj.memo.split(";");
                var str = "";
                for (var i in messages) {
                    str += "<p>" + messages[i] + "</p>";
                }
                $("#message").html(str);
                if (type == "android") {
                    $("#version").text(sj.android.version);
                } else {
                    $("#version").text(sj.ios.version);
                }
                $("#time").text(sj.time);

            }
        },
        error: function (err) {
        }
    })
}

sj();

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