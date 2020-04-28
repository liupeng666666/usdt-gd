var lsuserid;
var sys_pid;
var sys_nickname;
var sys_img;
var ws;
var itvcul;

function hideHint() {
    $("#register_hint").hide();
}

function showHint(content) {
    $("#hint_content").html(content);
    $("#register_hint").show();
}

function update_hint(content) {
    $("#tishi_content").html(content);
    $("#update_hint").show();
}

function update_hint_hide() {
    $("#update_hint").hide();
}

function choiseOnline() {
    if ($(".customService").is(':visible')) {
        $('.onlinec').css('background-color', ' #343434');
        $('.customService').slideUp();
    } else {
        $('.choiseApp').slideUp();
        $('.navBox ul li').css('background-color', ' #343434');
        $('.onlinec').css('background-color', ' #f98c04');
        $('.customService').slideToggle();
    }
}

function hidecustomService() {
    $('.onlinec').css('background-color', ' #343434');
    $('.customService').slideUp();
}

function choiseApp() {
    if ($(".choiseApp").is(':visible')) {
        $('.choiseAppH').css('background-color', ' #343434');
        $('.choiseApp').slideUp();
    } else {
        $('.customService').slideUp();
        $('.navBox ul li').css('background-color', ' #343434');
        $('.choiseAppH').css('background-color', ' #f98c04');
        $('.choiseApp').slideToggle();
    }
}

function getUrl() {
    return 'http://127.0.0.1:8090';
}

/**
 * 乘法函数
 *
 * @param arg1
 * @param arg2
 * @returns {Number}
 */
function accMul(arg1, arg2) {
    var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
    try {
        m += s1.split(".")[1].length
    } catch (e) {
    }
    try {
        m += s2.split(".")[1].length
    } catch (e) {
    }
    return Number(s1.replace(".", "")) * Number(s2.replace(".", ""))
        / Math.pow(10, m)
}

/**
 * 修改所有页面头部
 *
 * @param subuserid
 */
function changHead(subuserid) {
    var endtime = window.sessionStorage.getItem("timetofailure");
    if (endtime != undefined && endtime != null && endtime != "") {
        var date = new Date();
        var ntime = date.getTime();
        if (ntime >= endtime) {
            window.sessionStorage.clear();
        }
        var google_renzhen = window.sessionStorage.getItem("google_renzhen");
        if (google_renzhen == 0) {
            window.sessionStorage.clear();
        }
    }

    var nickname = window.sessionStorage.getItem("nickname");
    var img = window.sessionStorage.getItem("userimg");
    var zhoren = window.localStorage.getItem("language");
    if (subuserid != undefined && subuserid != null && subuserid != ""
        && nickname != undefined && nickname != null && nickname != "") {
        var info = "<li class=\"dropdown personInf\"><a href=\"hotTradeCharts.html\" class=\"dropdown-toggle\" ";
        info += "data-toggle=\"dropdown\" role=\"button\" aria-haspopup=\"true\" aria-expanded=\"false\">";
        info += " <img id=\"head_img_url\" onerror=\"javascript:this.src='img/head.png';\" src=\""
            + img + "?timestamp=" + (new Date()).valueOf() + "\"> " + nickname;
        info += "<span class=\"caret\"></span></a> <ul class=\"dropdown-menu\"><li>";
        if (zhoren == 1 || zhoren == undefined || zhoren == null
            || zhoren == "") {
            info += "<a href=\"inforPage.html?type=account\"><i class=\"iconfont icon-careful\"></i>我的账户</a></li>";
            info += "<li><a href=\"inforPage.html?type=perfectUserInfo\"><i class=\"iconfont icon-user\"></i>个人信息设置</a></li>";
            info += "<li><a href=\"inforPage.html?type=certification\"><i class=\"iconfont icon-shimingrenzheng\"></i>实名认证</a></li>";
            info += "<li><a href=\"personalDetails.html\"><i class=\"iconfont icon-careful\"></i>个人详情</a></li>";
            info += "<li><a href=\"inviting.html\"><i class=\"iconfont icon-careful\"></i>邀请好友</a></li>";
            info += "<li role=\"separator\" class=\"divider\"></li>";
            info += "<li><a href=\"javascript:loginOut()\"><i class=\"iconfont icon-qiehuanzuhu\"></i>退出账户</a></li></ul></li>";
        } else {
            info += "<a href=\"inforPage.html\"><i class=\"iconfont icon-careful\"></i>My account</a></li>";
            info += "<li><a href=\"inforPage.html?type=perfectUserInfo\"><i class=\"iconfont icon-user\"></i>Personal settings</a></li>";
            info += "<li><a href=\"inforPage.html?type=certification\"><i class=\"iconfont icon-shimingrenzheng\"></i>Verified</a></li>";
            info += "<li><a href=\"personalDetails.html\"><i class=\"iconfont icon-careful\"></i>Personal details</a></li>";
            info += "<li><a href=\"inviting.html\"><i class=\"iconfont icon-careful\"></i>invite friends</a></li>";
            info += "<li role=\"separator\" class=\"divider\"></li>";
            info += "<li><a href=\"javascript:loginOut()\"><i class=\"iconfont icon-qiehuanzuhu\"></i>LoginOut</a></li></ul></li>";
        }
        info += "<li class=\"dropdown\"><a href=\"#\" class=\"dropdown-toggle\" ";
        info += "data-toggle=\"dropdown\" role=\"button\" aria-haspopup=\"true\" aria-expanded=\"false\">";
        if (zhoren == 1 || zhoren == undefined || zhoren == null
            || zhoren == "") {
            info += "<spab class=\"circleBtn\">中文<span class=\"caret\"></span></spab></a>";
        } else if (zhoren == 2) {
            info += "<spab class=\"circleBtn\">English<span class=\"caret\"></span></spab></a>";
        }
        info += " <ul class=\"dropdown-menu language\"><li><a href=\"javascript:chooselanguage(1)\">中文</a></li>";
        info += "<li><a href=\"javascript:chooselanguage(2)\">English</a></li></ul></li>";
        $(".top_yc").remove();
        $("#sub_user_info").append(info);
    } else {
        if (zhoren == 1 || zhoren == undefined || zhoren == null
            || zhoren == "") {
            $(".circleBtn").html("中文<span class=\"caret\"></span>");
        } else if (zhoren == 2) {
            $(".circleBtn").html("English<span class=\"caret\"></span>");
        }
    }
    var utoken = window.sessionStorage.getItem("token");
    if (utoken != null && utoken != "" && typeof (utoken) != undefined) {
        itvcul = setInterval(checkUserOtherLogin, 10000);
        var info = "<div class=\"dialogBox\" id=\"userOtherLogin_dialog\" style=\"display: none;\">";
        info += "<div class=\"mask\"></div>";
        info += "<div class=\"paymentBox\">";
        info += "<h3>下线通知</h3>";
        info += "<p >您的账号在另一台电脑登录。如非本人操作，则密码可能已泄露，建议尽快修改密码。</p>";
        info += " <div>";
        info += "<a onclick=\"Tuichu()\">退出</a>";
        info += "<a  onclick=\"offlineLogin()\">登录</a>";
        info += "</div>";
        info += "</div>";
        info += "</div>";
        $("body").append(info);

    }
}

function startCheckUserOtherLoginItv() {
    var utoken = window.sessionStorage.getItem("token");
    if (utoken != null && utoken != "" && typeof (utoken) != undefined) {
        itvcul = setInterval(checkUserOtherLogin, 10000);
        var info = "<div class=\"dialogBox\" id=\"userOtherLogin_dialog\" style=\"display: none;\">";
        info += "<div class=\"mask\"></div>";
        info += "<div class=\"paymentBox\">";
        info += "<h3>下线通知</h3>";
        info += "<p >您的账号在另一台电脑登录。如非本人操作，则密码可能已泄露，建议尽快修改密码。</p>";
        info += " <div>";
        info += "<a onclick=\"Tuichu()\">退出</a>";
        info += "<a  onclick=\"offlineLogin()\">登录</a>";
        info += "</div>";
        info += "</div>";
        info += "</div>";
        $("body").append(info);
    }

}

function Tuichu() {
    $("#userOtherLogin_dialog").hide();
    var dqurl = location.href;
    var inum1 = dqurl.indexOf(".com");
    var inum2 = dqurl.indexOf(".html");
    var dqurl2 = dqurl.substring(inum1, inum2);
    var inumlng = (dqurl2.match(/\//g) || []).length;
    var inum3 = dqurl.indexOf("trade");
    var language = window.localStorage.getItem("language");
    if (inum3 > 0) {
        window.location.href = "../login/login.html";
    } else {
        var info = "";
        var ad = "";
        if (inumlng <= 1) {
            ad += "../";
        }
        if (language == 1) {
            info += "<li><a href=\"" + ad + "login/login.html\" data-locale=\"daohanglan.denglu\">登录</a></li>";
        } else {
            info += "<li><a href=\"" + ad + "login/login.html\" data-locale=\"daohanglan.denglu\">Login</a></li>";
        }
        info += "<li><a href=\"#\">|</a></li>";
        if (language == 1) {
            info += "<li><a href=\"" + ad + "login/register.html\"data-locale=\"daohanglan.zhuce\">注册</a></li>";
        } else {
            info += "<li><a href=\"" + ad + "login/register.html\"data-locale=\"daohanglan.zhuce\">Register</a></li>";
        }
        info += "<li class=\"dropdown\">";
        info += "<a href=\"#\" class=\"dropdown-toggle\" data-toggle=\"dropdown\" role=\"button\" aria-haspopup=\"true\" aria-expanded=\"false\">";
        if (language == 1) {
            info += "<span class=\"circleBtn\">中文<span class=\"caret\"></span></span></a>";
        } else {
            info += "<span class=\"circleBtn\">English<span class=\"caret\"></span></span></a>";
        }
        info += "<ul class=\"dropdown-menu language\">";
        info += "<li><a href=\"javascript:chooselanguage(1)\">中文</a></li>";
        info += "<li><a href=\"javascript:chooselanguage(2)\">English</a></li></ul></li>";
        $("#sub_user_info").html(info);
    }
}

/**
 * 跳转到登录页
 */
function offlineLogin() {
    $("#userOtherLogin_dialog").hide();
    var dqurl = location.href;
    var inum1 = dqurl.indexOf(".com");
    var inum2 = dqurl.indexOf(".html");
    var dqurl2 = dqurl.substring(inum1, inum2);
    var inumlng = (dqurl2.match(/\//g) || []).length;
    if (inumlng <= 1) {
        window.location.href = "login/login.html";
    } else {
        window.location.href = "../login/login.html";
    }
}

function checkUserOtherLogin() {
    var dqurl = location.href;
    var inum1 = dqurl.indexOf(".com");
    var inum2 = dqurl.indexOf(".html");
    var dqurl2 = dqurl.substring(inum1, inum2);
    var inumlng = (dqurl2.match(/\//g) || []).length;

    var userrg = window.sessionStorage.getItem("user_rg");
    var userid = window.sessionStorage.getItem("userid");
    var utoken = window.sessionStorage.getItem("token");
    var httpurl = "../usdtpc/subuser/getLoginPlatformInfo";
    if (inumlng > 1) {
        httpurl = "../../usdtpc/subuser/getLoginPlatformInfo";
    }
    $.ajax({
        url: httpurl,
        data: {
            "userid": userid,
            "type": 1,
            "uuid": userrg
        },
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', utoken);
        },
        method: "POST",
        success: function (data) {
            if (data.code == 100) {
                clearInterval(itvcul);
                window.sessionStorage.clear();
                $("#userOtherLogin_dialog").show();
            } else if (data.code == 101) {
            } else if (data.code == 401) {
                tokenLoseEfficacy();
                token = window.sessionStorage.getItem("token");
                checkUserOtherLogin();
            } else {
            }

        },
        error: function (err) {
        }
    })
}

function loginOut() {
    window.sessionStorage.clear();
    window.location.reload();
}

function chooselanguage(zhen) {
    if (zhen == 1) {
        window.localStorage.setItem("language", 1);
        window.location.reload();
    } else {
        window.localStorage.setItem("language", 2);
        window.location.reload();
    }
}

function unde(value, type) {
    if (typeof (value) == "undefined") {
        return type;
    } else {
        return value;
    }

}

// 制保留2位小数，如：2，会在2后面补上00.即2.00
function toDecimal2(x) {
    var f = parseFloat(x);
    if (isNaN(f)) {
        return false;
    }
    var f = Math.round(x * 100) / 100;
    var s = f.toString();
    var rs = s.indexOf('.');
    if (rs < 0) {
        rs = s.length;
        s += '.';
    }
    while (s.length <= rs + 2) {
        s += '0';
    }
    return s;
}

function isString(str) {
    return (typeof str == 'string') && str.constructor == String;
}

function tokenLoseEfficacy() {
    var username = window.sessionStorage.getItem("loginid");
    var password = window.sessionStorage.getItem("loginpwd");
    var type = window.sessionStorage.getItem("logintype");
    type = Number(type);
    if (username == undefined || username == null || password == undefined
        || password == null) {
        window.location.href = "login/login.html";
    } else {
        $
            .ajax({
                url: "../usdtpc/auth/tokenLoseEfficacy",
                data: {
                    "username": username,
                    "password": password,
                    "type": type
                },
                method: "POST",
                success: function (data) {
                    if (data.code == 100) {
                        window.sessionStorage.setItem("userimg",
                            data.users.img);
                        window.sessionStorage.setItem("userid",
                            data.users.pid);
                        window.sessionStorage.setItem("nickname",
                            data.users.nickname);
                        window.sessionStorage.setItem("token", data.token);
                        if (data.users.email != undefined
                            && data.users.email != null
                            && data.users.email != "") {
                            window.sessionStorage.setItem("email",
                                data.users.email);
                        }
                        window.sessionStorage.setItem("isgoogle",
                            data.users.isgoogle);
                        if (data.users.google_secret != undefined
                            && data.users.google_secret != null
                            && data.users.google_secret != "") {
                            window.sessionStorage.setItem("google_secret",
                                data.users.google_secret);
                        } else {
                            window.sessionStorage.setItem("google_secret",
                                "");
                        }
                        window.sessionStorage.setItem("phone",
                            data.users.phone);
                        window.sessionStorage.setItem("loginid", username);
                        window.sessionStorage.setItem("loginpwd", password);
                        window.sessionStorage.setItem("logintype", type);
                    } else if (data.code == 101) {
                        // alert("用户名或密码不对");
                        window.location.href = "login/login.html";
                    } else {
                        window.location.href = "login/login.html";
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    window.location.href = "login/login.html";
                    if (Number(XMLHttpRequest.status) != 0
                        && XMLHttpRequest.readyState != 0
                        && textStatus != "error"
                        && errorThrown.length != 0) {
                        // alert("网络异常，请您检查网络后刷新页面！");
                    } else if ("timeout" == textStatus
                        && "timeout" == errorThrown) {
                        // alert("请求超时，请您检查网络后刷新页面！");
                    } else {
                        // alert("网络异常，请您检查网络后刷新页面！");
                    }
                }
            });
    }
}

function tokenLoseEfficacy_two() {
    var username = window.sessionStorage.getItem("loginid");
    var password = window.sessionStorage.getItem("loginpwd");
    var type = window.sessionStorage.getItem("logintype");
    type = Number(type);
    if (username == undefined || username == null || password == undefined
        || password == null) {
        window.location.href = "../login/login.html";
    } else {
        $
            .ajax({
                url: "../usdtpc/auth/tokenLoseEfficacy",
                data: {
                    "username": username,
                    "password": password,
                    "type": type
                },
                method: "POST",
                success: function (data) {
                    if (data.code == 100) {
                        window.sessionStorage.setItem("userimg",
                            data.users.img);
                        window.sessionStorage.setItem("userid",
                            data.users.pid);
                        window.sessionStorage.setItem("nickname",
                            data.users.nickname);
                        window.sessionStorage.setItem("token", data.token);
                        if (data.users.email != undefined
                            && data.users.email != null
                            && data.users.email != "") {
                            window.sessionStorage.setItem("email",
                                data.users.email);
                        }
                        window.sessionStorage.setItem("isgoogle",
                            data.users.isgoogle);
                        if (data.users.google_secret != undefined
                            && data.users.google_secret != null
                            && data.users.google_secret != "") {
                            window.sessionStorage.setItem("google_secret",
                                data.users.google_secret);
                        } else {
                            window.sessionStorage.setItem("google_secret",
                                "");
                        }
                        window.sessionStorage.setItem("phone",
                            data.users.phone);
                        window.sessionStorage.setItem("loginid", username);
                        window.sessionStorage.setItem("loginpwd", password);
                        window.sessionStorage.setItem("logintype", type);
                    } else if (data.code == 101) {
                        // alert("用户名或密码不对");
                        window.location.href = "../login/login.html";
                    } else {
                        window.location.href = "../login/login.html";
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    window.location.href = "login/login.html";
                    if (Number(XMLHttpRequest.status) != 0
                        && XMLHttpRequest.readyState != 0
                        && textStatus != "error"
                        && errorThrown.length != 0) {
                        // alert("网络异常，请您检查网络后刷新页面！");
                    } else if ("timeout" == textStatus
                        && "timeout" == errorThrown) {
                        // alert("请求超时，请您检查网络后刷新页面！");
                    } else {
                        // alert("网络异常，请您检查网络后刷新页面！");
                    }
                }
            });
    }
}

/**
 * 获取url 地址栏请求参数数据
 */
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

function loadProperties() {
    $.i18n.properties({
        name: 'strings', // 属性文件名 命名格式： 文件名_国家代号.properties
        path: 'js/i18n/', // 注意这里路径是你属性文件的所在文件夹
        mode: 'map',
        language: "en", // 这就是国家代号 name+language刚好组成属性文件名：strings+zh ->
        // strings_zh.properties
        callback: function () {
            $("[data-locale]").each(function () {
                $(this).html($.i18n.prop($(this).data("locale")));

            });
        }
    });
}

/**
 * uuid生成
 */
function uuid() {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4";
    // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
    // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "";
    // s[8] = s[13] = s[18] = s[23] = "-";

    var uuid = s.join("");
    return uuid;
}

/**
 * websocket链接
 */
function websocketConnection() {
    if (ws == null) {
        var nickname = window.sessionStorage.getItem("nickname");
        lsuserid = window.sessionStorage.getItem("userid");
        var img = window.sessionStorage.getItem("userimg");
        if (lsuserid == undefined || lsuserid == null || lsuserid == "") {
            lsuserid = uuid();
            nickname = "临时用户";
            img = "https://gl.b-currency.com/IMG/image/icon60faadb6-6e73-4891-b574-c283b1af7dc1.png";
        }
        // if(ws!=null){
        // ws.close(1000,'close');
        // }
        // ws=new
        // ReconnectingWebSocket('ws://47.94.246.78:8099/usdt/WebSocket/ID=A.'+lsuserid);
        ws = new ReconnectingWebSocket(
            'wss://socket.b-currency.com/usdt_socket/WebSocket/ID=A.'
            + lsuserid);
        // websocket的打开事件
        ws.onopen = function (event) {
            var strobj = {
                "state": 1,
                "id": lsuserid,
                "img": img,
                "nickname": nickname,
                "message": "您好，我要询问。"
            };
            sendMessage(strobj);
        };
        // websocket的关闭事件
        ws.onclose = function () {
            // setTimeout(login, 5000);
        };
        // websocket的出错事件
        ws.onerror = function (event) {
            // setTimeout(login, 5000);
        };
        // websocket返回事件
        ws.onmessage = function (e) {
            var obj = JSON.parse(e.data);
            if (("message" in obj)) {
                parseMessage(obj);
            }
        };
    }
}

document.onkeydown = function (e) {
    if (!e)
        e = window.event;
    if ((e.keyCode || e.which) == 13) {
        sendKefuMessage();
    }
}

function sendKefuMessage() {
    var message = $("#kefu_sendmessage").val();

    if (typeof (message) != 'undefined' && message.length > 0) {
        var nickname = window.sessionStorage.getItem("nickname");
        var img = window.sessionStorage.getItem("userimg");
        if (nickname == undefined || nickname == null || nickname == "") {
            nickname = "临时用户";
            img = "https://gl.b-currency.com/IMG/image/icon60faadb6-6e73-4891-b574-c283b1af7dc1.png";
        }
        var strobj;
        if (sys_pid != undefined && sys_pid != null && sys_pid != "") {
            strobj = {
                "state": 1,
                "id": lsuserid,
                "img": img,
                "nickname": nickname,
                "message": message,
                "sys_pid": sys_pid,
                "sys_nickname": sys_nickname,
                "sys_img": sys_img
            };
        } else {
            strobj = {
                "state": 1,
                "id": lsuserid,
                "img": img,
                "nickname": nickname,
                "message": message
            };
        }
        sendMessage(strobj);
    }
}

/**
 * websocket发送信息
 */
function sendMessage(cmdobj) {
    var str = JSON.stringify(cmdobj);
    ws.send(str);
    var date = new Date();
    now = date.Format("HH:mm:ss");
    var info = "<div class=\"messageBox guestmessage\">";
    info += " <p>" + cmdobj.nickname + "" + now + "</p>";
    info += " <div>" + cmdobj.message + "</div>";
    info += "</div>";

    $("#kefu_message").append(info);
    $("#kefu_sendmessage").val("");
    $('#kefu_message').scrollTop($('#kefu_message')[0].scrollHeight);
}

/**
 * 解析websocket数据
 *
 * @param message
 */
function parseMessage(result) {
    var date = new Date();
    now = date.Format("HH:mm:ss");
    var info = " <div class=\"messageBox\">";
    info += " <p>" + result.sys_nickname + "" + now + "</p>";
    info += " <div>" + result.message + "</div>";
    info += "</div>";
    $("#kefu_message").append(info);
    sys_pid = result.sys_pid;
    sys_nickname = result.sys_nickname;
    sys_img = result.img;
    $('#kefu_message').scrollTop($('#kefu_message')[0].scrollHeight);
}

function emailTanChu() {
    var reason = window.prompt("请联系客服邮箱：", "currency@b-currency.com");
}
