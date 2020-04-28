/**
 * 分享推荐JS
 */
/*----------------------------本页面全局变量--------------------------------*/
//用户id
var userid = null;
//token
var token;
//语言类型
var language;
var nickname;
/*---------------------------------------------------------------------*/
$(function () {
    userid = window.sessionStorage.getItem("userid");
    token = window.sessionStorage.getItem("token");
    nickname = window.sessionStorage.getItem("nickname");
    changHead(userid);
    language = window.localStorage.getItem("language");
    if (language != undefined && language != null & language == 2) {
        if (language == 2) {
            loadProperties();
        }
    }
    getInviteFriendsCode();
});

/**
 * 获取邀请码
 */
function getInviteFriendsCode() {
    $.ajax({
        url: "../usdtpc/subuser/getInviteFriendsCode",
        data: {
            "userid": userid
        },
        method: "POST",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        success: function (data) {
            if (isString(data)) {
                data = JSON.parse(data);
            }
            if (data.code == 100) {
                $("#exampleInputAmount_code").val(data.uuid);
                $("#exampleInputAmount_url").val("https://www.b-currency.com/login/register.html?referee=" + data.uuid);
                getInviteFriendsQRCode(data.uuid);
            } else if (data.code == 401) {
                tokenLoseEfficacy();
                token = window.sessionStorage.getItem("token");
                getInviteFriendsCode();
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
 * 展示邀请二维码
 */
var zuuid;

function getInviteFriendsQRCode(uuid) {
    zuuid = uuid;
    var url = $("#exampleInputAmount_url").val();
    //url=url.replace("http://","");
    $("#invite_img").attr("src", "../usdtpc/auth/getGoogleImg?content=" + url);
}

function copyCode(th) {
    var clipboard = new ClipboardJS("#" + th);
    clipboard.on('success', function (e) {
        alert("复制成功");
    });
    clipboard.on('error', function (e) {
        alert("复制失败，请重新复制");
    });
}

function copyUrl(th) {
    var clipboard = new ClipboardJS('#' + th);
    clipboard.on('success', function (e) {
        alert("复制成功");
    });
    clipboard.on('error', function (e) {
        alert("复制失败，请重新复制");
    });
}

function shareTo(stype) {
    var ftit = nickname + '邀请你加入币元网';
    var flink = '';
    var lk = '';
    //获取文章标题
    lk = 'https://www.b-currency.com/img/logo_y.jpg';

    var url = $("#exampleInputAmount_url").val();
    var param = $("#exampleInputAmount_code").val();
    //url = url + "?referee=" + param;
    //qq空间接口的传参
    if (stype == 'qzone') {
        window.open('https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=' + url + '&sharesource=qzone&title=' + ftit + '&pics=' + lk + '&summary=跟随我立即开户做交易，不一样的交易，资深交易员指导，新手也能 操作，提升您的数字资产盈利率，让资产更有价值。');
    }
    //新浪微博接口的传参
    if (stype == 'sina') {
        window.open('http://service.weibo.com/share/share.php?url=' + url + '&sharesource=weibo&title=' + ftit + '&pic=' + lk + '&appkey=2706825840');
    }
    //qq好友接口的传参
    if (stype == 'qq') {
        window.open('http://connect.qq.com/widget/shareqq/index.html?url=' + url + '&sharesource=qzone&title=' + ftit + '&pics=' + lk + '&summary=跟随我立即开户做交易，不一样的交易，资深交易员指导，新手也能 操作，提升您的数字资产盈利率，让资产更有价值。');
    }
    if (stype == 'wechat') {
        $("#myModalLabel").html("<img src='' id='wechat_img' width='300px'/>");

        $("#wechat_img").attr("src", $("#invite_img").attr("src"));
        $("#myModal").modal("show");
    }
    if (stype == 'facebook') {
        window.open('http://www.facebook.com/sharer.php?u=' + encodeURIComponent(url) + '&t=' + encodeURIComponent(ftit), '_blank', 'toolbar=yes, location=yes, directories=no, status=no, menubar=yes, scrollbars=yes, resizable=no, copyhistory=yes, width=600, height=450,top=100,left=350')
    }
    //    //生成二维码给微信扫描分享
    //    if(stype == 'wechat'){
    //        window.open('inc/qrcode_img.php?url=http://zixuephp.net/article-1.html');
    //    }
}