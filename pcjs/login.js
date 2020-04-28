/**
 * 注册JS
 */
/*----------------------------本页面全局变量--------------------------------*/
// 用户id
var userid = null;
// token
var token;
// 语言类型
var language;
var scanid;
var scanitv;
/*---------------------------------------------------------------------*/
$(function () {
    language = window.localStorage.getItem("language");
    if (language != undefined && language != null & language == 2) {
        loadPropertiesLanguge();
        $(".circleBtn").html("English<span class=\"caret\"></span>");
    }
    loadScanImg();
    scanitv = setInterval(getScanLoginUserInfo, 1000);
});

function loadPropertiesLanguge() {
    $.i18n.properties({
        name: 'strings',    //属性文件名     命名格式： 文件名_国家代号.properties
        path: '../js/i18n/',   //注意这里路径是你属性文件的所在文件夹
        mode: 'map',
        language: "en",     //这就是国家代号 name+language刚好组成属性文件名：strings+zh -> strings_zh.properties
        callback: function () {
//        	console.info($("[data-locale]"));
            $("[data-locale]").each(function () {
//           	console.info($(this));
//           	console.log("===="+$(this).data("locale"));
                $(this).html($.i18n.prop($(this).data("locale")));

            });
        }
    })
}

function reloadYzmImg() {
    $("#login_yzm_img").attr("src", "../../usdtpc/auth/SubYanZhengMa?timestamp=" + (new Date()).valueOf());
}

/**
 * 用户登录
 */
function login() {
    var username = $("#username").val();
    var password = $("#password").val();
    var yzm = $("#yzm").val();
    yzm = yzm.toLowerCase();
    var reg = /^(0|86|17951)?(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
    var type = 0;
    if (reg.test(username)) {
        type = 2;
    } else {
        type = 3;
    }
    var uid = uuid();
    $.ajax({
        url: "../../usdtpc/auth/login",
        data: {
            "username": username,
            "password": password,
            "code": yzm,
            "type": type,
            "uuid": uid
        },
        method: "POST",
        success: function (data) {
            if (data.code == 100) {
                window.sessionStorage.setItem("user_rg", uid);

                window.sessionStorage.setItem("userimg", data.users.img);
                window.sessionStorage.setItem("userid", data.users.pid);
                window.sessionStorage.setItem("nickname", data.users.nickname);
                window.sessionStorage.setItem("token", data.token);
                if (data.users.email != undefined && data.users.email != null && data.users.email != "") {
                    window.sessionStorage.setItem("email", data.users.email);
                }
                window.sessionStorage.setItem("isgoogle", data.users.isgoogle);
                if (data.users.google_secret != undefined && data.users.google_secret != null && data.users.google_secret != "") {
                    window.sessionStorage.setItem("google_secret", data.users.google_secret);
                    window.sessionStorage.setItem("google_renzhen", 0);
                } else {
                    window.sessionStorage.setItem("google_secret", "");
                    window.sessionStorage.setItem("google_renzhen", 1);
                }
                window.sessionStorage.setItem("style", data.users.type);
                window.sessionStorage.setItem("real_name", data.users.real_name);
                window.sessionStorage.setItem("trader", data.users.trader);
                window.sessionStorage.setItem("realname", data.users.realname);
                window.sessionStorage.setItem("phone", data.users.phone);
                window.sessionStorage.setItem("loginid", username);
                window.sessionStorage.setItem("loginpwd", password);
                window.sessionStorage.setItem("logintype", type);
                var date = new Date();
                date = date.setDate(date.getDate() + 1);
                var edate = new Date(date);
                endtime = edate.getTime();
                window.sessionStorage.setItem("timetofailure", endtime);
                if (data.users.google_secret != undefined && data.users.google_secret != null && data.users.google_secret != "") {
                    window.location.href = "googleLogin.html";
                } else {
                    window.location.href = "../index.html";
                }
            } else if (data.code == 101) {
                alert("用户名或密码不对");
            } else if (data.code == 107) {
                alert("您输入的验证码不对");
            }
        }, error: function (XMLHttpRequest, textStatus, errorThrown) {
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

function loadScanImg() {
    scanid = uuid();
    $("#scanLogin_img").attr("src", "../../usdtpc/auth/getUserLoginQrCode?content=" + scanid);
}

function getScanLoginUserInfo() {
    $.ajax({
        url: "../../usdtpc/auth/getScanLoginUserInfo",
        data: {
            "uuid": scanid
        },
        method: "POST",
        success: function (data) {
            if (data.code == 100) {
                window.clearInterval(scanitv);
                window.sessionStorage.setItem("userid", data.users.pid);
                var date = new Date();
                date = date.setDate(date.getDate() + 1);
                var edate = new Date(date);
                endtime = edate.getTime();
                window.sessionStorage.setItem("timetofailure", endtime);
                scanLogin(data.users.username, data.users.password);
            } else if (data.code == 101) {
            } else if (data.code == 107) {
            }
        }, error: function (XMLHttpRequest, textStatus, errorThrown) {
        }
    });
}


function scanLogin(username, password) {
    var reg = /^(0|86|17951)?(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
    var type = 0;
    if (reg.test(username)) {
        type = 2;
    } else {
        type = 3;
    }
    var uid = uuid();
    $.ajax({
        url: "../../usdtpc/auth/scanLogin",
        data: {
            "username": username,
            "password": password,
            "type": type,
            "uuid": uid
        },
        method: "POST",
        success: function (data) {
            if (data.code == 100) {
                window.sessionStorage.setItem("user_rg", uid);

                window.sessionStorage.setItem("userimg", data.users.img);
                window.sessionStorage.setItem("nickname", data.users.nickname);
                if (data.users.email != undefined && data.users.email != null && data.users.email != "") {
                    window.sessionStorage.setItem("email", data.users.email);
                }
                window.sessionStorage.setItem("isgoogle", data.users.isgoogle);
                if (data.users.google_secret != undefined && data.users.google_secret != null && data.users.google_secret != "") {
                    window.sessionStorage.setItem("google_secret", data.users.google_secret);
                    window.sessionStorage.setItem("google_renzhen", 1);
                } else {
                    window.sessionStorage.setItem("google_secret", "");
                    window.sessionStorage.setItem("google_renzhen", 1);
                }
                window.sessionStorage.setItem("style", data.users.type);
                window.sessionStorage.setItem("real_name", data.users.real_name);
                window.sessionStorage.setItem("trader", data.users.trader);
                window.sessionStorage.setItem("realname", data.users.realname);
                window.sessionStorage.setItem("phone", data.users.phone);
                window.sessionStorage.setItem("loginid", data.users.username);
                window.sessionStorage.setItem("loginpwd", data.users.password);
                window.sessionStorage.setItem("token", data.token);
                window.location.href = "../index.html";
            } else if (data.code == 101) {
                scanitv = setInterval(getScanLoginUserInfo, 1000);
//				alert("用户名或密码不对");
            } else if (data.code == 107) {
                scanitv = setInterval(getScanLoginUserInfo, 1000);
//				alert("您输入的验证码不对");
            }
        }, error: function (XMLHttpRequest, textStatus, errorThrown) {
            scanitv = setInterval(getScanLoginUserInfo, 1000);
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