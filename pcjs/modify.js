/**
 * 修改密码JS
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
var yzyzm = "";
//验证码定时器
var yzsendcode;
//计时工具
var codecount = 0;
var ecodecount = 0;
/*---------------------------------------------------------------------*/
$(function () {
    language = window.localStorage.getItem("language");
    if (language != undefined && language != null & language == 2) {
        loadPropertiesLanguge();
    }
});

$("#username").blur(function () {
    var username = $("#username").val();
    var reg = /^(0|86|17951)?(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
    var emailreg = /^([0-9A-Za-z\-_\.]+)@([0-9a-z]+\.[a-z]{2,3}(\.[a-z]{2})?)$/g;
    if (username == undefined || username == null || username == "") {
        $("#myModalLabel").html("请输入手机号或邮箱");
        $("#myModal").modal("show");
        return false;
    } else if (!reg.test(username)) {
        if (emailreg.test(username)) {
            checkUserRegister(username, 0);
        } else {
            $("#myModalLabel").html("您输入的手机号或邮箱不存在");
            $("#myModal").modal("show");
            return false;
        }

    } else {

        checkUserRegister(username, 1);
    }
});

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
                $("#myModalLabel").html("您输入的手机号或邮箱不存在");
                $("#myModal").modal("show");
                return false;
            } else if (data.code == 104) {

            } else {
                $("#myModalLabel").html("您输入的手机号或邮箱不存在");
                $("#myModal").modal("show");
                return false;
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

function updatePassword() {

}

function sendCode(phone) {
    $("#yzm").html("120s");
    yzcodecount = 120;
    clearInterval(yzsendcode);
    yzsendcode = setInterval(intervalECode, 1000);
    $.ajax({
        url: "../../usdtpc/auth/sendSmsCode",
        data: {
            "phone": phone
        },
        type: "POST",
        success: function (data) {
            if (data.code == 100) {
                yzyzm = data.smscode;

            } else if (data.code == 106) {

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

function emailSend(email) {
    $("#yzm").html("120s");
    yzcodecount = 120;
    clearInterval(yzsendcode);
    yzsendcode = setInterval(intervalECode, 1000);
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

function FaSong() {
    var username = $("#username").val();
    if (username.indexOf("@") > -1) {
        emailSend(username);
    } else {
        sendCode(username);
    }
}

function intervalECode() {
    if (yzcodecount <= 0) {
        $("#yzm").attr("disabled", false);
        $("#yzm").html("获取验证码");

        clearInterval(yzsendcode);
    } else {
        yzcodecount--;
        $("#yzm").html(yzcodecount + "s");
    }
}

function update() {
    var username = $("#username").val();
    var password = $("#password").val();
    var password2 = $("#password2").val();
    var input_yzm = $("#input_yzm").val();
    if (username == "" || username == null || typeof (username) == "undefined") {
        $("#myModalLabel").html("手机号或邮箱不能为空");
        $("#myModal").modal("show");
        return false;
    }
    if (password == "" || password == null || typeof (password) == "undefined") {
        $("#myModalLabel").html("密码不能为空");
        $("#myModal").modal("show");
        return false;
    } else if (password2 == "" || password2 == null || typeof (password2) == "undefined") {
        $("#myModalLabel").html("确认密码不能为空");
        $("#myModal").modal("show");
        return false;
    } else {
        if (password != password2) {
            $("#myModalLabel").html("密码和确认密码不一致");
            $("#myModal").modal("show");
            return false;
        }
    }
    if (input_yzm == "" || input_yzm == null || typeof (input_yzm) == "undefined") {
        $("#myModalLabel").html("验证码不能为空");
        $("#myModal").modal("show");
        return false;
    } else if (input_yzm != yzyzm) {
        $("#myModalLabel").html("验证码不正确");
        $("#myModal").modal("show");
        return false;
    }
    $.ajax({
        url: "../../usdtpc/auth/forgetPassword",
        data: {
            "phone": username,
            password: password
        },
        type: "POST",
        success: function (data) {
            if (data.code == 100) {
                window.location.href = "modifyOk.html";
            } else if (data.code == 101) {
                $("#myModalLabel").html("手机号或邮箱不存在");
                $("#myModal").modal("show");
            } else {
                $("#myModalLabel").html("修改失败");
                $("#myModal").modal("show");
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