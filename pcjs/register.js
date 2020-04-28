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
// 验证手机号是否存在
var isphone = false;
// 验证email是否存在
var isemail = false;
//验证码
var yzyzm = "123456";
//验证码定时器
var sendcode;
var esendcode;
//计时工具
var codecount = 0;
var ecodecount = 0;
/*---------------------------------------------------------------------*/
$(function () {
    textboxBlur();
    language = window.localStorage.getItem("language");
    if (language != undefined && language != null & language == 2) {
        loadPropertiesLanguge();
    }
    var referee = GetQueryString("referee");
    if (referee != null && referee != "" && typeof (referee) != "undefined") {
        $("#trade_referee_phone").val(referee);
        $("#trade_referee_email").val(referee);
    }
});

function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

var conn = new WebIM.connection({
    isMultiLoginSessions: WebIM.config.isMultiLoginSessions,
    https: typeof WebIM.config.https === 'boolean' ? WebIM.config.https : location.protocol === 'https:',
    url: WebIM.config.xmppURL,
    heartBeatWait: WebIM.config.heartBeatWait,
    autoReconnectNumMax: WebIM.config.autoReconnectNumMax,
    autoReconnectInterval: WebIM.config.autoReconnectInterval,
    apiUrl: WebIM.config.apiURL,
    isAutoLogin: true
});

function loadPropertiesLanguge() {
    $.i18n.properties({
        name: 'strings', //属性文件名     命名格式： 文件名_国家代号.properties
        path: '../js/i18n/', //注意这里路径是你属性文件的所在文件夹
        mode: 'map',
        language: "en", //这就是国家代号 name+language刚好组成属性文件名：strings+zh -> strings_zh.properties
        callback: function () {
            $("[data-locale]").each(function () {
                $(this).html($.i18n.prop($(this).data("locale")));

            });
        }
    })
}

/**
 * 用户输入信息失焦校验
 */
function textboxBlur() {
    var reg = /^(0|86|17951)?(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
    var pwdreg = /^[0-9a-zA-Z]*$/g;
    var tpwdreg = /^[0-9]{6}$/g;
    var emailreg = /^([0-9A-Za-z\-_\.]+)@([0-9a-z]+\.[a-z]{2,3}(\.[a-z]{2})?)$/g;
    $("#nickname_phone").blur(function () {
        var nickname = $("#nickname_phone").val();
        if (nickname == undefined || nickname == null || nickname == "") {
            //			alert("请输入您的昵称");
        } else if (nickname.length > 15) {
            showHint("您输入的用户昵称过长");
        }
    });
    $("#phone_phone").blur(function () {
        var phone = $("#phone_phone").val();
        if (phone == undefined || phone == null || phone == "") {
            //			alert("请输入您的手机号码");
        } else if (!reg.test(phone)) {
            showHint("您输入手机号格式不正确");
        } else {
            checkUserRegister(phone, 1);
        }
    });
    $("#password_phone").blur(function () {
        var password = $("#password_phone").val();
        var trade_password = $("#trade_password_phone").val();
        if (password == undefined || password == null || password == "") {
            //			alert("请输入您的登录密码");
        } else if (password.length < 6) {
            showHint("您输入的密码长度过短");
        } else if (!pwdreg.test(password)) {
            showHint("密码由字母和数字组成，不包含特殊符号");
        } else if (trade_password.length > 0 && trade_password == password) {
            showHint("交易密码不能和登陆密码一致");
        }
    });
    $("#trade_password_phone").blur(function () {
        var password = $("#password_phone").val();
        var trade_password = $("#trade_password_phone").val();
        if (trade_password == undefined || trade_password == null || trade_password == "") {
            //			alert("请输入您的交易密码");
        } else if (trade_password.length < 6) {
            showHint("您输入交易码长度过短");
        } else if (!tpwdreg.test(trade_password)) {
            showHint("交易密码由六位纯数字组成");
        } else if (password == trade_password) {
            showHint("交易密码不能和登陆密码一致");
        }
    });
    $("#yzm_phone").blur(function () {
        var yzm = $("#yzm_phone").val();
        if (yzm == undefined || yzm == null || yzm == "") {
            //			alert("请输入您的验证码");
        } else if (yzm != yzyzm && yzyzm != "") {
            showHint("您输入的验证码不正确");
        }
    });
    $("#nickname_email").blur(function () {
        var nickname = $("#nickname_email").val();
        if (nickname == undefined || nickname == null || nickname == "") {
            //			alert("请输入您的昵称");
        } else if (nickname.length > 15) {
            showHint("您输入的用户昵称过长");
        }
    });
    $("#email_email").blur(function () {
        var email = $("#email_email").val();
        if (email == undefined || email == null || email == "") {
            //			alert("请输入您的邮箱");
        } else if (!emailreg.test(email)) {
            showHint("您输入的邮箱格式不正确");
        } else {
            checkUserRegister(email, 0);
        }
    });
    $("#password_email").blur(function () {
        var password = $("#password_email").val();
        var trade_password = $("#trade_password_email").val();
        if (password == undefined || password == null || password == "") {
            //			alert("请输入您的登录密码");
        } else if (password.length < 6) {
            showHint("您输入的密码长度过短");
        } else if (!pwdreg.test(password)) {
            //showHint("密码至少包含一个大写字母、一个小写字母、一个数字、一个特殊符号");
        } else if (trade_password.length > 0 && trade_password == password) {
            showHint("交易密码不能和登陆密码一致");
        }
    });
    $("#trade_password_email").blur(function () {
        var password = $("#password_email").val();
        var trade_password = $("#trade_password_email").val();
        if (trade_password == undefined || trade_password == null || trade_password == "") {
            //			alert("请输入您的交易密码");
        } else if (trade_password.length < 6) {
            showHint("您输入交易密码长度过短");
        } else if (!tpwdreg.test(trade_password)) {
            showHint("交易密码由六位纯数字组成");
        } else if (password == trade_password) {
            showHint("交易密码不能和登陆密码一致");
        }
    });
    $("#yzm_email").blur(function () {
        var yzm = $("#yzm_email").val();
        if (yzm == undefined || yzm == null || yzm == "") {
            //			alert("请输入您的验证码");
        } else if (yzm != yzyzm && yzyzm != "") {
            showHint("您输入的验证码不正确");
        }
    });
    $("#trade_referee_email").blur(function () {
        var referee = $("#trade_referee_email").val();
        if (referee == undefined || referee == null || referee == "") {
            //			alert("请输入您的验证码");
        } else if (referee != null && yzyzm != "") {
            if (referee.indexOf("@") > -1) {
                checkRefereeRegister(referee, 0);
            } else if (!isNaN(referee)) {
                checkRefereeRegister(referee, 1);
            } else {
                checkRefereeRegister(referee, 2);
            }

        }
    });
    $("#trade_referee_phone").blur(function () {
        var referee = $("#trade_referee_phone").val();
        if (referee == undefined || referee == null || referee == "") {
            //			alert("请输入您的验证码");
        } else if (referee != null && yzyzm != "") {
            if (referee.indexOf("@") > -1) {
                checkRefereeRegister(referee, 0);
            } else if (!isNaN(referee)) {
                checkRefereeRegister(referee, 1);
            } else {
                checkRefereeRegister(referee, 2);
            }

        }
    });
}

/**
 *定时
 */
function intervalCode() {
    if (codecount <= 0) {
        $("#register_phone_code").attr("disabled", false);
        $("#register_phone_code").html("获取验证码");
        clearInterval(sendcode);
    } else {
        codecount--;
        $("#register_phone_code").html(codecount + "s");
    }
}

/**
 *获取手机短信验证码
 */
function sendSMCode() {
    $("#register_phone_code").attr("disabled", true);
    var reg = /^(0|86|17951)?(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
    var phone = $("#phone_phone").val();
    if (phone.length <= 0) {
        showHint("请输入您的手机号");
        $("#register_phone_code").attr("disabled", false);
    } else if (!reg.test(phone)) {
        showHint("您输入的手机号格式不正确");
        $("#register_phone_code").attr("disabled", false);
    } else if (!isphone) {
        showHint("该手机号已存在，请您重新输入！");
        $("#register_phone_code").attr("disabled", false);
    } else {
        $.ajax({
            url: "../../usdtpc/auth/sendSmsCode",
            data: {
                "phone": phone
            },
            type: "POST",
            success: function (data) {
                if (data.code == 100) {
                    yzyzm = data.smscode;
                    $("#register_phone_code").html("120s");
                    codecount = 120;
                    clearInterval(sendcode);
                    sendcode = setInterval(intervalCode, 1000);
                } else if (data.code == 106) {
                    $("register_phone_code").attr("disabled", false);
                    showHint("验证码请求过于频繁");
                } else {
                    $("register_phone_code").attr("disabled", false);
                }

            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                $("register_phone_code").attr("disabled", false);
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
}

function intervalECode() {
    if (ecodecount <= 0) {
        $("#register_email_code").attr("disabled", false);
        $("#register_email_code").html("获取验证码");
        clearInterval(esendcode);
    } else {
        ecodecount--;
        $("#register_email_code").html(ecodecount + "s");
    }
}

/*
 * 获取邮箱验证码
 */
function sendEmailCode() {
    $("#register_email_code").attr("disabled", true);
    var emailreg = /^([0-9A-Za-z\-_\.]+)@([0-9a-z]+\.[a-z]{2,3}(\.[a-z]{2})?)$/g;
    var email = $("#email_email").val();
    if (email.length <= 0) {
        showHint("请输入您的邮箱");
        $("#register_email_code").attr("disabled", false);
    } else if (!emailreg.test(email)) {
        showHint("您输入的邮箱格式不正确");
        $("#register_email_code").attr("disabled", false);
    } else if (!isemail) {
        showHint("该邮箱已存在，请您重新输入！");
        $("#register_email_code").attr("disabled", false);
    } else {
        ecodecount = 120;
        $("#register_email_code").html("120s");
        clearInterval(esendcode);
        esendcode = setInterval(intervalECode, 1000);
        $.ajax({
            url: "../../usdtpc/auth/sendEmailCode",
            data: {
                "email": email
            },
            type: "POST",
            success: function (data) {
                if (data.code == 100) {
                    yzyzm = data.emailcode;

                } else if (data.code == 106) {
                    $("#register_email_code").html("获取验证码");
                    $("#register_email_code").attr("disabled", false);
                    showHint("验证码请求过于频繁");
                } else {
                    $("#register_email_code").html("获取验证码");
                    $("register_phone_code").attr("disabled", false);
                }

            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                $("#register_email_code").html("获取验证码");
                $("#register_email_code").attr("disabled", false);
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
}

/**
 * 数据校验
 */
function verifyData(type) {
    var flag = false;
    var reg = /^(0|86|17951)?(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/g;
    var pwdreg = /^[0-9a-zA-Z]*$/g;
    var tpwdreg = /^[0-9]{6}$/g;
    var emailreg = /^([0-9A-Za-z\-_\.]+)@([0-9a-z]+\.[a-z]{2,3}(\.[a-z]{2})?)$/g;
    var nickname = "";
    var phoneemail = "";
    var password = "";
    var trade_password = "";
    var yzm = "";
    if (type == 1) {
        nickname = $("#nickname_phone").val();
        phoneemail = $("#phone_phone").val();
        password = $("#password_phone").val();
        trade_password = $("#trade_password_phone").val();
        yzm = $("#yzm_phone").val();
    } else if (type == 0) {
        nickname = $("#nickname_email").val();
        phoneemail = $("#email_email").val();
        password = $("#password_email").val();
        trade_password = $("#trade_password_email").val();
        yzm = $("#yzm_email").val();
    }
    if (nickname == undefined || nickname == null || nickname == "") {
        flag = false;
        showHint("请输入您的昵称");
    } else if (nickname.length > 15) {
        flag = false;
        showHint("您输入的用户昵称过长");
    } else if (phoneemail == undefined || phoneemail == null || phoneemail == "") {
        if (type == 1) {
            flag = false;
            showHint("请输入您的手机号码");
        } else {
            flag = false;
            showHint("请输入您的邮箱");
        }
    } else if ((!reg.test(phoneemail) && type == 1) || (!emailreg.test(phoneemail) && type == 0)) {
        if (type == 1) {
            flag = false;
            showHint("您输入的手机号不正确");
        } else {
            flag = false;
            showHint("您输入的邮箱不正确");
        }
    } else if (password == undefined || password == null || password == "") {
        flag = false;
        showHint("请输入您的登录密码");
    } else if (password.length < 6) {
        flag = false;
        showHint("您输入的密码长度过短");
    } else if (!pwdreg.test(password)) {
        flag = false;
        showHint("密码由字母和数字组成不能包含特殊符号");
    } else if (trade_password == undefined || trade_password == null || trade_password == "") {
        flag = false;
        showHint("请输入您的交易密码");
    } else if (trade_password.length < 6) {
        flag = false;
        showHint("您输入交易码长度过短");
    } else if (!tpwdreg.test(trade_password)) {
        flag = false;
        showHint("交易密码为6位纯数字");
    } else if (password == trade_password) {
        flag = false;
        showHint("交易密码不能和登陆密码一致");
    } else if (yzm == undefined || yzm == null || yzm == "") {
        flag = false;
        showHint("请输入您的验证码");
    } else if (yzm != yzyzm) {
        flag = false;
        showHint("您输入的验证码不正确");
    } else if (!isphone && type == 1) {
        flag = false;
        showHint("您输入的手机号码已存在！");
    } else if (!isemail && type == 0) {
        flag = false;
        showHint("您输入的邮箱已存在");
    } else {
        flag = true;
    }
    return flag;
}

/**
 * 验证手机号码或者email是否存在
 * @param phone
 * @param type
 */
function checkUserRegister(loginid, type) {
    $.ajax({
        url: "../../usdtpc/auth/checkUserRegister",
        data: {
            "loginid": loginid,
            "type": type
        },
        method: "POST",
        success: function (data) {
            if (data.code == 100) {
                if (type == 1) {
                    isphone = true;
                } else {
                    isemail = true;
                }
            } else if (data.code == 104) {
                if (type == 1) {
                    isphone = false;
                    showHint("您输入的手机号已注册");
                } else {
                    isemail = false;
                    showHint("您输入的邮箱已被注册");
                }
            } else {
                if (type == 1) {
                    isphone = false;
                } else {
                    isemail = false;
                }
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
 * 用户进行注册
 */
function Register(type) {
    var flag = verifyData(type);
    if (flag) {
        var nickname = "";
        var phoneemail = "";
        var password = "";
        var trade_password = "";
        var referee = "";
        var rqdata;
        if (type == 1) {
            nickname = $("#nickname_phone").val();
            phoneemail = $("#phone_phone").val();
            password = $("#password_phone").val();
            trade_password = $("#trade_password_phone").val();
            referee = $("#trade_referee_phone").val();
            rqdata = {
                "nickname": nickname,
                "phone": phoneemail,
                "password": password,
                "trade_password": trade_password,
                "referee": referee
            }
        } else if (type == 0) {
            nickname = $("#nickname_email").val();
            phoneemail = $("#email_email").val();
            password = $("#password_email").val();
            trade_password = $("#trade_password_email").val();
            referee = $("#trade_referee_email").val();
            rqdata = {
                "nickname": nickname,
                "email": phoneemail,
                "password": password,
                "trade_password": trade_password,
                "referee": referee
            }
        }
        $.ajax({
            url: "../../usdtpc/auth/register",
            method: "POST",
            data: rqdata,
            success: function (data) {
                if (data.code == 100) {
                    zhuce(data.userid, nickname, phoneemail);


                } else if (data.code == 104) {
                    showHint("该用户已注册，请登录");
                } else {
                    showHint("注册失败");
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                if (Number(XMLHttpRequest.status) != 0 && XMLHttpRequest.readyState != 0 && textStatus != "error" && errorThrown.length != 0) {
                    showHint("网络异常，请您检查网络后刷新页面！");
                } else if ("timeout" == textStatus && "timeout" == errorThrown) {
                    showHint("请求超时，请您检查网络后刷新页面！");
                } else {
                    showHint("网络异常，请您检查网络后刷新页面！");
                }
            }
        });
    }
}

function zhuce(username, nickname, phoneemail) {
    var options = {
        username: username,
        password: username,
        nickname: nickname,
        appKey: WebIM.config.appkey,
        success: function () {
            window.location.href = "registerOk.html?username=" + phoneemail;
        },
        error: function (err) {
            window.location.href = "registerOk.html?username=" + phoneemail;
        },
        apiUrl: WebIM.config.apiURL
    };
    conn.registerUser(options);
}

/*
 * 验证 推荐人是否存在
 */
function checkRefereeRegister(loginid, type) {
    $.ajax({
        url: "../../usdtpc/auth/checkUserRegister",
        data: {
            "loginid": loginid,
            "type": type
        },
        method: "POST",
        success: function (data) {
            if (data.code == 100) {
                showHint("你输入的推荐人不存在");
            } else if (data.code == 104) {

            } else {

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