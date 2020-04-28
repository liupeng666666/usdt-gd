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
//验证码
var yzyzm = "";
var emailyzm = "";
//验证码定时器
var sendcode;
var esendcode;
var yzsendcode;
var ggsendcode;
//计时工具
var codecount = 0;
var ecodecount = 0;
var yzcodecount = 0;
var ggcodecount = 0;
//验证交易密码是否正确
var istradepassword = false;
//谷歌验证密码是否正确
var isgoogleauth = false;

//系统钱包地址
var sys_wallet = null;
//下单当前页码
var pdpage = 1;
//下单每页展示条数
var pdnumber = 10;
//下单共多少页
var pdtotalpage = 1;
//下单总条数
var pdtotal = 0;
//盈亏当前页码
var plpage = 1;
//盈亏每页展示条数
var plnumber = 10;
//盈亏共多少页
var pltotalpage = 1;
//盈亏总条数
var pltotal = 0;
//付费当前页码
var ppage = 1;
//付费每页展示条数
var pnumber = 10;
//付费共多少页
var ptotalpage = 1;
//付费总条数
var ptotal = 0;
//佣金记录当前页码
var bpage = 1;
//佣金记录每页展示条数
var bnumber = 10;
//佣金记录共多少页
var btotalpage = 1;
//佣金记录总条数
var btotal = 0;
//佣金收入当前页码
var bspage = 1;
//佣金收入每页展示条数
var bsnumber = 10;
//佣金收入共多少页
var bstotalpage = 1;
//佣金收入总条数
var bstotal = 0;
//密码是否正确
var ispassword = false;
//手机号是否注册
var isphone = false;
//邮箱是否注册
var isemail = false;
//最小提现值
var minmoney = 0;
//最大提现值
var maxmoney = 0;
//账户余额
var useryue = 0;
var reportNum = 10;

var sys_trans;
var report_team_money = 0;
/*---------------------------------------------------------------------*/
$(function () {
    userid = window.sessionStorage.getItem("userid");
    token = window.sessionStorage.getItem("token");
    if (userid == undefined || userid == null || userid == "") {
        window.location.href = "login/login.html";
    } else {
        var request = new Object();
        request = GetRequest();
        var showtype = request["type"];
        showPage(showtype);
        changHead(userid);
        getSysWallet();
        getSysWithdrawParam();
        getRechargeUsdt();
        getWithdrawDepositUsdt();
        getPlaceOrder(1);
        getProfitLoss(1);
        getUserPayRecordByType(1);
        getTradeEarningsByUserIdType(1);
        getTradeEarningsByUserId(1);
        getUserInfoById();
        infoOnblur();
        getGoogleQrCode();
        report_top();
        report_user(1);
        report_extract(1);
        report_trans();
        report_bur_money(1);
        language = window.localStorage.getItem("language");
        if (language != undefined && language != null & language == 2) {
            loadProperties();
        }
    }
    setInterval(function () {
        report_top();
    }, 30000);
});

function infoOnblur() {
    $("#oldpassword").blur(function () {
        var password = $("#oldpassword").val();
        if (password.length > 0) {
            checkUserTradePassword(password, 1);
        }
    });
    $("#oldtradepassword").blur(function () {
        var password = $("#oldtradepassword").val();
        if (password.length > 0) {
            checkUserTradePassword(password, 2);
        }
    });
    $("#google_tradepassword").blur(function () {
        var password = $("#google_tradepassword").val();
        if (password.length > 0) {
            checkUserTradePassword(password, 2);
        }
    });
    $("#newphone").blur(function () {
        var phone = $("#newphone").val();
        var reg = /^(0|86|17951)?(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
        if (phone == undefined || phone == null || phone == "") {
            //			alert("请输入您的手机号码");
        } else if (!reg.test(phone)) {
            $("#newphone_text").html("您输入手机号格式不正确");
        } else {
            $("#newphone_text").html("");
            checkUserRegister(phone, 1);
        }
    });
    $("#newemail").blur(function () {
        var email = $("#newemail").val();
        var emailreg = /^([0-9A-Za-z\-_\.]+)@([0-9a-z]+\.[a-z]{2,3}(\.[a-z]{2})?)$/g;
        if (email == undefined || email == null || email == "") {
            //			alert("请输入您的邮箱");
        } else if (!emailreg.test(email)) {
            $("#newemail_text").html("您输入的邮箱格式不正确");
        } else {
            $("#newemail_text").html("");
            checkUserRegister(email, 0);
        }
    });
    $("#sub_wd_googlecode").blur(function () {
        var code = $("#sub_wd_googlecode").val();
        if (code.length > 0) {
            isGoogleCheckCode();
        }
    });

}

function hideChangeDialog(a) {
    $(a).hide();
    $("#modify_dialogbox").hide();
}

/**
 * 验证交易密码是否正确
 * @param phone
 * @param type
 */
function checkUserTradePassword(tradepassword, type) {
    $.ajax({
        url: "../usdtpc/subuser/checkUserTradePassword",
        data: {
            "userid": userid,
            "password": tradepassword,
            "type": type
        },
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        method: "POST",
        success: function (data) {

            if (isString(data)) {
                data = JSON.parse(data);
            }
            if (data.code == 100) {
                if (type == 1) {
                    ispassword = true;
                    $("#oldpassword_text").html("");
                } else if (type == 2) {
                    $("#oldtradepassword_text").html("");
                    istradepassword = true;
                }
            } else if (data.code == 101) {
                if (type == 1) {
                    ispassword = false;
                    $("#oldpassword_text").html("您输入的旧密码不正确");
                } else if (type == 2) {
                    istradepassword = false;
                    $("#oldtradepassword_text").html("您输入的旧密码不正确");
                }
            } else if (data.code == 401) {
                tokenLoseEfficacy();
                token = window.sessionStorage.getItem("token");
                checkUserTradePassword(tradepassword, type);
            } else {
                if (type == 1) {
                    ispassword = false;
                    $("#oldpassword_text").html("您输入的旧密码不正确");
                } else if (type == 2) {
                    istradepassword = false;
                    $("#oldtradepassword_text").html("您输入的旧密码不正确");
                }
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            if (type == 1) {
                ispassword = false;
                $("#oldpassword_text").html("您输入的旧密码不正确");
            } else if (type == 2) {
                istradepassword = false;
                $("#oldtradepassword_text").html("您输入的旧密码不正确");
            }
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
 * 验证手机号码或者email是否存在
 * @param phone
 * @param type
 */
function checkUserRegister(loginid, type) {
    $.ajax({
        url: "../usdtpc/auth/checkUserRegister",
        data: {
            "loginid": loginid,
            "type": type
        },
        method: "POST",
        success: function (data) {

            if (data.code == 100) {
                if (type == 1) {
                    isphone = true;
                    $("#newphone_text").html("");
                } else {
                    isemail = true;
                    $("#newemail_text").html("");
                }
            } else if (data.code == 104) {
                if (type == 1) {
                    isphone = false;
                    $("#newphone_text").html("您输入的手机号已注册");
                } else {
                    isemail = false;
                    $("#newemail_text").html("您输入的邮箱已被注册");
                }
            } else {
                if (type == 1) {
                    isphone = false;
                    $("#newphone_text").html("您输入的手机号已注册");
                } else {
                    isemail = false;
                    $("#newemail_text").html("您输入的邮箱已被注册");
                }
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            if (type == 1) {
                isphone = false;
                $("#newphone_text").html("您输入的手机号已注册");
            } else {
                isemail = false;
                $("#newemail_text").html("您输入的邮箱已被注册");
            }
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
 * 获取系统钱包
 */
function getSysWallet() {
    $.ajax({
        url: "../usdtpc/subwallet/getUserRechargeUrl",
        method: "POST",
        data: {
            "userid": userid
        },
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        success: function (data) {

            if (isString(data)) {
                data = JSON.parse(data);
            }
            if (data.code == 100) {
                $("#cm_sys_wallet").val(data.wallet);
                $("#cbaddress").attr("src", "../usdtpc/auth/getGoogleImg?content=" + data.wallet);
                sys_wallet = data.wallet;
            } else if (data.code == 401) {
                tokenLoseEfficacy();
                token = window.sessionStorage.getItem("token");
                getSysWallet();
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
 * 获取系统钱包
 */
function getSysWithdrawParam() {
    $.ajax({
        url: "../usdtpc/subwallet/getSysWithdrawParam",
        method: "GET",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        success: function (data) {

            if (isString(data)) {
                data = JSON.parse(data);
            }
            if (data.code == 100) {
                $("#sub_wd_trade").val(data.param.commission);
                minmoney = data.param.minmoney;
                maxmoney = data.param.maxmoney;
                $("user_withdrawal_limit").html("最少" + minmoney + "USDT,一次最多" + maxmoney + "USDT");
                sys_wallet = data.wallet;
            } else if (data.code == 401) {
                tokenLoseEfficacy();
                token = window.sessionStorage.getItem("token");
                getSysWithdrawParam();
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
 * 复制充值地址
 */
function copy() {
    var clipboard = new ClipboardJS('#cm_sys_wallet_copy');
    clipboard.on('success', function (e) {
        update_hint("复制成功");
    });
    clipboard.on('error', function (e) {
        update_hint("复制失败，请重新复制");
    });
}

/**
 * 拉取充值记录
 */
function getRechargeUsdt() {
    $.ajax({
        url: "../usdtpc/subusdt/getSubUsdtByIdStyle",
        data: {
            "userid": userid,
            "style": "1",
            page: 1,
            number: 0
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
                var info = "";
                if (language == 2) {
                    info = "<li class=\"logList\"><span>Time</span><span style='width:30%'>address</span><span>QUANTITY</span><span>State</span></li>";
                    var result = data.usdt;
                    for (var i = 0; i < result.length; i++) {
                        info += "<li><span>" + result[i].usdttime + "</span><span style='width:30%'>" + unde(result[i].zr_wallet) + "</span>";
                        info += "<span>" + unde(result[i].money, 0) + "</span>";
                        if (result[i].examine == 0) {
                            info += "<span>in verification</span></li>";
                        } else if (result[i].examine == 2) {
                            info += "<span>Top-up failure</span></li>";
                        } else if (result[i].examine == 1) {
                            info += "<span>be recharged successfully</span></li>";
                        }
                    }
                } else {
                    info = "<li class=\"logList\"><span>时间</span><span style='width:30%'>地址</span><span>数量</span><span>状态</span></li>";
                    var result = data.usdt;
                    for (var i = 0; i < result.length; i++) {
                        info += "<li><span>" + result[i].usdttime + "</span><span style='width:30%'>" + unde(result[i].zr_wallet) + "</span>";
                        info += "<span>" + unde(result[i].money, 0) + "</span>";
                        if (result[i].examine == 0) {
                            info += "<span>正在审核</span></li>";
                        } else if (result[i].examine == 2) {
                            info += "<span>充值失败</span></li>";
                        } else if (result[i].examine == 1) {
                            info += "<span>充值成功</span></li>";
                        }
                    }
                }
                $("#recharge_usdt").html(info);
            } else if (data.code == 401) {
                tokenLoseEfficacy();
                token = window.sessionStorage.getItem("token");

                getRechargeUsdt();
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
 *定时
 */
function intervalTXCode() {
    if (yzcodecount <= 0) {
        $("#tixian_phone_code").attr("disabled", false);
        $("#tixian_phone_code").html("获取验证码");
        clearInterval(yzsendcode);
    } else {
        yzcodecount--;
        $("#tixian_phone_code").html(yzcodecount + "s");
    }
}

function intervalGGCode() {
    if (ggcodecount <= 0) {
        $("#google_phone_code").attr("disabled", false);
        $("#google_phone_code").html("获取验证码");
        clearInterval(ggsendcode);
    } else {
        ggcodecount--;
        $("#google_phone_code").html(ggcodecount + "s");
    }
}

/**
 *获取手机短信验证码
 */
function sendYZSMCode(type) {
    if (type == 1) {
        $("#tixian_phone_code").attr("disabled", true);
    } else {
        $("#google_phone_code").attr("disabled", true);
    }
    var phone = window.sessionStorage.getItem("phone");
    if (phone == undefined || phone == null || phone == "") {
        update_hint("请您先绑定手机号");
    } else {
        $.ajax({
            url: "../usdtpc/auth/sendSmsCode",
            data: {
                "phone": phone
            },
            type: "POST",
            success: function (data) {
                if (data.code == 100) {
                    yzyzm = data.smscode;
                    if (type == 1) {
                        $("#tixian_phone_code").html("120s");
                        yzcodecount = 120;
                        clearInterval(yzsendcode);
                        yzsendcode = setInterval(intervalTXCode, 1000);
                    } else {
                        $("#google_phone_code").html("120s");
                        ggcodecount = 120;
                        clearInterval(ggsendcode);
                        ggsendcode = setInterval(intervalGGCode, 1000);
                    }
                } else if (data.code == 106) {
                    $("tixian_phone_code").attr("disabled", false);
                    $("#google_phone_code").attr("disabled", true);
                    update_hint("验证码请求过于频繁");
                } else {
                    $("tixian_phone_code").attr("disabled", false);
                    $("#google_phone_code").attr("disabled", true);
                }

            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                $("tixian_phone_code").attr("disabled", false);
                $("#google_phone_code").attr("disabled", true);
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
 * 用户提现
 */
function withdrawDeposit() {
    var sub_wallet_id = $("#sub_wallet_id").val();
    var sub_wd_money = $("#sub_wd_money").val();
    var trade = $("#sub_wd_trade").val();
    var tradepassword = $("#sub_wd_tradepassword").val();
    var sub_wd_smcode = $("#sub_wd_smcode").val();
    var sub_wd_googlecode = $("#sub_wd_googlecode").val();
    var phone = window.sessionStorage.getItem("phone");
    var isgoogle = window.sessionStorage.getItem("isgoogle");
    if (phone == undefined || phone == null || phone == "") {
        update_hint("请您先进行手机号码绑定");
    } else if (isgoogle == undefined || isgoogle == null || isgoogle == 0) {
        update_hint("请您先进行谷歌验证器的绑定");
    } else if (sub_wallet_id == undefined || sub_wallet_id == null || sub_wallet_id.length <= 0) {
        update_hint("请输入提现地址");
    } else if (sub_wd_money == undefined || sub_wd_money == null || sub_wd_money.length <= 0) {
        update_hint("请输入提现金额");
    } else if (sub_wd_money <= minmoney || sub_wd_money > maxmoney) {
        update_hint("您输入的提现金额过大或过小");
    } else if (tradepassword == undefined || tradepassword == null || tradepassword.length <= 0) {
        update_hint("请输入您的提现密码");
    } else if (!tradepassword) {
        update_hint("您输入的提现密码不正确");
    } else if (sub_wd_smcode == undefined || sub_wd_smcode == null || sub_wd_smcode.length <= 0) {
        update_hint("请输入您的验证码");
    } else if (sub_wd_smcode != yzyzm) {
        update_hint("您输入的短信验证码不正确");
    } else if (sub_wd_googlecode == undefined || sub_wd_googlecode == null || sub_wd_googlecode.length <= 0) {
        update_hint("请输入您的谷歌验证码");
    } else if (!isgoogleauth) {
        update_hint("您的谷歌验证码错误");
    } else if ((useryue - sub_wd_money - trade) < 0) {
        update_hint("您的余额不足");
    } else {
        //		var money = sub_wd_money - trade;
        $.ajax({
            url: "../usdtpc/subusdt/addSubUsdt",
            data: {
                "userid": userid,
                "style": "2",
                "sub_wallet_id": sub_wallet_id,
                "sys_wallet_id": sys_wallet,
                "money": sub_wd_money,
                "trade": trade
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
                    update_hint("已提交提现审核");
                } else if (data.code == 401) {
                    tokenLoseEfficacy();
                    token = window.sessionStorage.getItem("token");
                    withdrawDeposit();
                } else {
                    update_hint("提现失败");
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
}

function isGoogleCheckCode() {
    var code = $("#sub_wd_googlecode").val();
    var google_secret = window.sessionStorage.getItem("google_secret");
    $.ajax({
        url: "../usdtpc/subuser/checkGoogleCodeYanZheng",
        data: {
            "code": code,
            "secret": google_secret
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
                isgoogleauth = true;
            } else if (data.code == 401) {
                tokenLoseEfficacy();
                token = window.sessionStorage.getItem("token");
                isGoogleCheckCode();
            } else {
                isgoogleauth = false;
                update_hint("谷歌验证码不正确");
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            isgoogleauth = false;
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
 * 拉取提现记录
 */
function getWithdrawDepositUsdt() {
    $.ajax({
        url: "../usdtpc/subusdt/getSubUsdtByIdStyle",
        data: {
            "userid": userid,
            "style": "2",
            page: 1,
            number: 0
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
                var info = "";
                if (language == 2) {
                    info = "<li class=\"logList\"><span>Time</span><span style='width:30%'>address</span><span>QUANTITY</span><span>State</span></li>";
                    var result = data.usdt;
                    for (var i = 0; i < result.length; i++) {
                        info += "<li><span>" + result[i].usdttime + "</span><span style='width:30%'>" + unde(result[i].sub_wallet_id) + "</span>";
                        info += "<span>" + result[i].money + "USDT</span>";
                        if (result[i].examine == 0) {
                            info += "<span>in verification</span></li>";
                        } else if (result[i].examine == 2) {
                            info += "<span>Withdrawal of failure</span></li>";
                        } else if (result[i].examine == 1) {
                            info += "<span>Withdrawal success</span></li>";
                        }
                    }
                } else {
                    info = "<li class=\"logList\"><span>时间</span><span style='width:30%'>地址</span><span>数量</span><span>状态</span></li>";
                    var result = data.usdt;
                    for (var i = 0; i < result.length; i++) {
                        info += "<li><span>" + unde(result[i].usdttime, "") + "</span><span style='width:30%'>" + unde(result[i].sub_wallet_id) + "</span>";
                        info += "<span>" + unde(result[i].money, 0) + "USDT</span>";
                        if (result[i].examine == 0) {
                            info += "<span>正在审核</span></li>";
                        } else if (result[i].examine == 2) {
                            info += "<span>提现失败</span></li>";
                        } else if (result[i].examine == 1) {
                            info += "<span>提现成功</span></li>";
                        }
                    }
                }
                $("#withdraw_deposit_li").html(info);
            } else if (data.code == 401) {
                tokenLoseEfficacy();
                token = window.sessionStorage.getItem("token");
                getWithdrawDepositUsdt();
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
 * 获取用户下单记录
 */
function getPlaceOrder(currentpage) {
    pdpage = currentpage;
    $.ajax({
        url: "../usdtpc/suborder/getSubOrderByUserPage",
        data: {
            "userid": userid,
            page: pdpage,
            number: pdnumber
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
                var info = "";
                var result = data.suborder;
                for (var i = 0; i < result.length; i++) {
                    if (language == 2) {
                        info += "<li><span class=\"smallSpan\">" + result[i].order_id + "</span>";
                        if (result[i].style == 0) {
                            info += "<span class=\"smallSpan\">AQU</span>";
                        } else {
                            info += "<span class=\"smallSpan\">BQU</span>";
                        }
                        if (result[i].rise_fall != 1) {
                            info += "<span class=\"smallSpan\">Buy up</span>";
                        } else {
                            info += "<span class=\"smallSpan\">To buy</span>";
                        }
                        info += "<span class=\"smallSpan\">" + unde(result[i].y_name, "") + "</span>";
                        if (result[i].style == 0) {
                            info += "<span>Win or loss<i>" + result[i].range + "%</i></span>";
                        } else {
                            info += "<span>Win or loss<i>" + result[i].icrease * 100 + "%</i></span>";
                        }
                        var ye = unde(result[i].purchase, 0);
                        info += "<span>money<i>-$" + ye + "</i></span>";
                        info += "<span>commission-<i>-$" + unde(result[i].trade, 0) + "</i></span>";
                        info += "<span>balance<i>$" + unde(result[i].q_surplus, 0) + "</i></span>";
                        info += "<span class=\"smallSpan dataFont\">" + result[i].orderday + "</span></li>";
                    } else {
                        info += "<li><span class=\"smallSpan\">" + result[i].order_id + "</span>";
                        if (result[i].style == 0) {
                            info += "<span class=\"smallSpan\">AQU</span>";
                        } else {
                            info += "<span class=\"smallSpan\">BQU</span>";
                        }
                        if (result[i].rise_fall != 1) {
                            info += "<span class=\"smallSpan\">买涨</span>";
                        } else {
                            info += "<span class=\"smallSpan\">买跌</span>";
                        }
                        info += "<span class=\"smallSpan\">" + unde(result[i].y_name, "") + "</span>";
                        if (result[i].style == 0) {
                            info += "<span>赢损值<i>" + result[i].range + "%</i></span>";
                        } else {
                            info += "<span>赢损值<i>" + result[i].icrease * 100 + "%</i></span>";
                        }
                        var ye = unde(result[i].purchase, 0);
                        info += "<span>金额<i>-$" + ye + "</i></span>";
                        info += "<span>手续费<i>-$" + unde(result[i].trade, 0) + "</i></span>";
                        info += "<span>余额<i>$" + unde(result[i].q_surplus, 0) + "</i></span>";
                        info += "<span class=\"smallSpan dataFont\">" + result[i].orderday + "</span></li>";
                    }
                }
                $("#place_order_li").html(info);
                pdtotalpage = Math.ceil(data.total / pdnumber);
                pdtotalnumber = data.total;
                showInforPage("pd");
            } else if (data.code == 401) {
                tokenLoseEfficacy();
                token = window.sessionStorage.getItem("token");
                getPlaceOrder(currentpage);
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
 * 获取用户盈亏结算记录
 */
function getProfitLoss(currentpage) {
    plpage = currentpage;
    $.ajax({
        url: "../usdtpc/suborder/getSubOrderByUserPage",
        data: {
            "userid": userid,
            page: plpage,
            number: plnumber,
            style: 1
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
                var info = "";
                var result = data.suborder;
                for (var i = 0; i < result.length; i++) {
                    if (language == 2) {
                        info += "<li><span class=\"smallSpan\">" + result[i].order_id + "</span>";
                        if (result[i].style == 0) {
                            info += "<span class=\"smallSpan\">AQU</span>";
                        } else {
                            info += "<span class=\"smallSpan\">BQU</span>";
                        }
                        if (result[i].rise_fall != 1) {
                            info += "<span class=\"smallSpan\">Buy up</span>";
                        } else {
                            info += "<span class=\"smallSpan\">To buy</span>";
                        }
                        info += "<span class=\"smallSpan\">" + result[i].y_name + "</span>";
                        if (unde(result[i].income, 0) >= 0) {
                            info += "<span>rise<i>+$" + unde(result[i].income, 0) + "</i></span>";
                        } else {
                            info += "<span>fall<i>-$" + (0 - unde(result[i].income, 0)) + "</i></span>";
                        }

                        if (result[i].income >= 0) {
                            info += "<span>rollback<i>+$" + unde(result[i].purchase, 0) + "</i></span>";
                        } else {
                            var ye = unde(result[i].income, 0) + unde(result[i].purchase, 0);
                            info += "<span>rollback<i>+$" + ye + "</i></span>";
                        }
                        var js = unde(result[i].income, 0) + unde(result[i].purchase, 0);
                        info += "<span>Settlement<i>$" + js + "</i></span>";
                        info += "<span>balance<i>$" + unde(result[i].surplus, 0).toFixed(2) + "</i></span>";
                        info += "<span class=\"smallSpan dataFont\">" + result[i].orderday + "</span></li>";
                    } else {
                        info += "<li><span class=\"smallSpan\">" + unde(result[i].order_id, "") + "</span>";
                        if (result[i].style == 0) {
                            info += "<span class=\"smallSpan\">AQU</span>";
                        } else {
                            info += "<span class=\"smallSpan\">BQU</span>";
                        }
                        if (result[i].rise_fall != 1) {
                            info += "<span class=\"smallSpan\">买涨</span>";
                        } else {
                            info += "<span class=\"smallSpan\">买跌</span>";
                        }
                        info += "<span class=\"smallSpan\">" + unde(result[i].y_name, "") + "</span>";
                        if (unde(result[i].income, 0) >= 0) {
                            info += "<span>盈利<i>+$" + unde(result[i].income, 0) + "</i></span>";
                        } else {
                            info += "<span>亏损<i>-$" + (0 - unde(result[i].income, 0)) + "</i></span>";
                        }

                        if (result[i].income >= 0) {
                            info += "<span>回退<i>+$" + unde(result[i].purchase, 0) + "</i></span>";
                        } else {
                            var ye = unde(result[i].income, 0) + unde(result[i].purchase, 0);
                            info += "<span>回退<i>+$" + ye + "</i></span>";
                        }
                        var js = unde(result[i].income, 0) + unde(result[i].purchase, 0);
                        info += "<span>结算<i>$" + js + "</i></span>";
                        info += "<span>余额<i>$" + unde(result[i].surplus, 0).toFixed(2) + "</i></span>";
                        info += "<span class=\"smallSpan dataFont\">" + result[i].orderday + "</span></li>";
                    }
                }
                $("#profit_loss_li").html(info);
                pltotalpage = Math.ceil(data.total / plnumber);
                pltotalnumber = data.total;
                showInforPage("pl");
            } else if (data.code == 401) {
                tokenLoseEfficacy();
                token = window.sessionStorage.getItem("token");
                getProfitLoss(currentpage);
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
 * 获取付费记录
 * @param currentpage
 */
function getUserPayRecordByType(currentpage) {
    ppage = currentpage;
    $.ajax({
        url: "../usdtpc/subtraderearnings/SubDetailedShou",
        data: {
            "userid": userid,
            "page": ppage,
            "num": pnumber
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
                var info = "";
                var result = data.detailed;
                for (var i = 0; i < result.length; i++) {
                    if (language == 2) {
                        info += "<li><span>" + result[i].date + " " + result[i].time + "</span>";
                        info += "<span>view order " + unde(result[i].orderid, "-") + "</span>";
                        if (result[i].pay_userid == userid) {
                            if (result[i].state == 3) {
                                info += "<span>Pay follow <i>-$" + result[i].income + "</i></span>";
                            } else if (result[i].state == 9) {
                                info += "<span>Group pay <i>-$" + result[i].income + "</i></span>";
                            }
                            info += "<span>surplus</span><span><i>$" + unde(result[i].pay_surplus, 0) + "</i></span></li>";
                        } else {
                            if (result[i].state == 3) {
                                info += "<span>Toll following <i>$" + result[i].income + "</i></span>";
                            } else if (result[i].state == 9) {
                                info += "<span>Community charges<i>$" + result[i].income + "</i></span>";
                            } else if (result[i].state == 7) {
                                info += "<span>Create community <i>-$" + result[i].loss + "</i></span>";
                            }
                            info += "<span>surplus</span><span><i>$" + unde(result[i].surplus, 0) + "</i></span></li>";
                        }

                    } else {
                        info += "<li><span>" + result[i].date + " " + result[i].time + "</span>";
                        info += "<span>查看订单  " + unde(result[i].orderid, "-") + "</span>";
                        if (result[i].pay_userid == userid) {
                            if (result[i].state == 3) {
                                info += "<span>付费跟随 <i>-$" + result[i].income + "</i></span>";
                            } else if (result[i].state == 9) {
                                info += "<span>加群付费 <i>-$" + result[i].income + "</i></span>";
                            }
                            info += "<span>余额</span><span><i>$" + unde(result[i].pay_surplus, 0) + "</i></span></li>";
                        } else {
                            if (result[i].state == 3) {
                                info += "<span>收费跟随 <i>$" + result[i].income + "</i></span>";
                            } else if (result[i].state == 9) {
                                info += "<span>社群收费 <i>$" + result[i].income + "</i></span>";
                            } else if (result[i].state == 7) {
                                info += "<span>开创社群 <i>-$" + result[i].loss + "</i></span>";
                            }
                            info += "<span>余额</span><span><i>$" + unde(result[i].surplus, 0) + "</i></span></li>";
                        }

                    }
                }
                $("#pay_li").html(info);
                ptotalpage = Math.ceil(data.total / pnumber);
                ptotalnumber = data.total;
                showInforPage("p");
                if (language == 2) {
                    loadProperties();
                }
            } else if (data.code == 401) {
                tokenLoseEfficacy();
                token = window.sessionStorage.getItem("token");
                getUserPayRecordByType(currentpage);
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
 * 拉取佣金记录
 * @param currentpage
 */
function getTradeEarningsByUserIdType(currentpage) {
    bpage = currentpage;
    $.ajax({
        url: "../usdtpc/subtraderearnings/getUserPayRecordByType",
        data: {
            "userid": userid,
            "type": 2,
            "page": bpage,
            "number": bnumber
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
                var info = "";
                var result = data.pay;
                for (var i = 0; i < result.length; i++) {
                    if (language == 2) {
                        info += "<li><span class=\"smallSpan\">" + result[i].orderid + "</span>";
                        if (result[i].rise_fall != 1) {
                            info += "<span class=\"smallSpan\">Buy up</span>";
                        } else {
                            info += "<span class=\"smallSpan\">To buy</span>";
                        }
                        info += "<span style='width:20%' >Nickname：" + result[i].pay_nickname + "</span>";
                        info += "<span  style='width:20%' >Buy：<i>$" + unde(result[i].purchase, 0) + "</i></span>";
                        info += "<span  style='width:20%' >commission：<i>$" + unde(result[i].income, 0) + "</i></span>";
                        info += "<span  style='width:20%' ><i>$" + unde(result[i].createtime, 0) + "</i></span></li>";

                    } else {
                        info += "<li><span class=\"smallSpan\">" + unde(result[i].orderid, "") + "</span>";
                        if (result[i].rise_fall != 1) {
                            info += "<span class=\"smallSpan\">买涨</span>";
                        } else {
                            info += "<span class=\"smallSpan\">买跌</span>";
                        }
                        info += "<span style='width:20%' >昵称：" + result[i].pay_nickname + "</span>";
                        info += "<span style='width:20%' >买入：<i>$" + unde(result[i].purchase, 0) + "</i></span>";
                        info += "<span style='width:20%' >佣金：<i>+$" + unde(result[i].income, 0) + "</i></span>";
                        info += "<span  style='width:20%' >" + unde(result[i].createtime, 0) + "</span></li>";

                    }
                }
                $("#brokerage_li").html(info);
                btotalpage = Math.ceil(data.total / bnumber);
                btotalnumber = data.total;
                showInforPage("b");
            } else if (data.code == 401) {
                tokenLoseEfficacy();
                token = window.sessionStorage.getItem("token");
                getTradeEarningsByUserIdType(currentpage);
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
 * 拉取佣金收入
 * @param currentpage
 */
function getTradeEarningsByUserId(currentpage) {
    bspage = currentpage;
    $.ajax({
        url: "../usdtpc/subtraderearnings/getUserPayRecordByType",
        data: {
            "userid": userid,
            "type": '3',
            "page": bpage,
            "number": bnumber
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
                var info = "";
                var result = data.pay;
                for (var i = 0; i < result.length; i++) {
                    if (language == 2) {
                        info += "<li><span >" + result[i].orderid + "</span>";
                        if (result[i].state == 2) {
                            info += "<span >Order</span>";
                        } else {
                            info += "<span >see about</span>";
                        }
                        info += "<span>charge</span>";
                        if (result[i].state == 2) {
                            info += "<span >Trading commissions</span>";
                        } else {
                            info += "<span >Check the commission</span>";
                        }
                        info += "<span><i>+$" + unde(result[i].income, 0) + "</i></span>";
                    } else {
                        info += "<li><span >" + unde(result[i].orderid, "") + "</span>";
                        if (result[i].state == 2) {
                            info += "<span >订单</span>";
                        } else {
                            info += "<span >查看</span>";
                        }
                        info += "<span>收费</span>";
                        if (result[i].state == 2) {
                            info += "<span >交易佣金</span>";
                        } else {
                            info += "<span >查看佣金</span>";
                        }
                        info += "<span><i>+$" + unde(result[i].income, 0) + "</i></span>";
                    }
                }
                $("#brokerage_save_li").html(info);
                bstotalpage = Math.ceil(data.total / bsnumber);
                bstotalnumber = data.total;
                showInforPage("bs");
            } else if (data.code == 401) {
                tokenLoseEfficacy();
                token = window.sessionStorage.getItem("token");
                getTradeEarningsByUserId(currentpage);
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
 *显示分页
 */
function showInforPage(type) {
    var totalpage = 0;
    var page = 0;
    if (type == "pd") {
        totalpage = pdtotalpage;
        page = pdpage;
        //之前需要将，上一页创建出来
        if (totalpage <= 5) {
            //总页数在0到5之间时，显示实际的页数
            for (var i = 1; i <= totalpage; i++) {
                $("#" + type + "_page_" + i).html("<a href=\"javascript:getPlaceOrder(" + i + ");\">" + i + "</a>");
            }
        } else if (totalpage > 5 && page <= 5) { //总页数大于5时，只显示五页，多出的隐藏
            //判断当前页的位置
            if (page <= 3) { //当前页小于等于3时，显示1-5
                for (var i = 1; i <= 5; i++) {
                    $("#" + type + "_page_" + i).html("<a href=\"javascript:getPlaceOrder(" + i + ");\">" + i + "</a>");
                }
            }
        } else if (page > (totalpage - 5)) { //当前页为最后五页时
            for (var i = totalpage - 4, j = 1; i <= totalpage, j <= 5; i++, j++) {
                $("#" + type + "_page_" + j).html("<a href=\"javascript:getPlaceOrder(" + i + ");\">" + i + "</a>");
            }
        } else { //当前页为中间时
            for (var i = (page - 2), j = 1; i <= (page + 2), j <= 5; i++, j++) {
                $("#" + type + "_page_" + j).html("<a href=\"javascript:getPlaceOrder(" + i + ");\">" + i + "</a>");
            }
        }
        if (language == 2) {
            if (page <= 1) {
                $("#" + type + "_prev_page").html("<a href=\"javascript:getPlaceOrder(1);\" aria-label=\"Previous\"><span aria-hidden=\"true\">Prev</span></a>");
            } else {
                $("#" + type + "_prev_page").html("<a href=\"javascript:getPlaceOrder(" + (page - 1) + ");\" aria-label=\"Previous\"><span aria-hidden=\"true\">Prev</span></a>");
            }
            if (page >= totalpage) {
                $("#" + type + "_next_page").html("<a href=\"javascript:getPlaceOrder(" + totalpage + ");\" aria-label=\"Next\"><span aria-hidden=\"true\">Next</span></a>");
            } else {
                $("#" + type + "_next_page").html("<a href=\"javascript:getPlaceOrder(" + (page + 1) + ");\" aria-label=\"Next\"><span aria-hidden=\"true\">Next</span></a>");
            }

        } else {
            if (page <= 1) {
                $("#" + type + "_prev_page").html("<a href=\"javascript:getPlaceOrder(1);\" aria-label=\"Previous\"><span aria-hidden=\"true\">上一页</span></a>");
            } else {
                $("#" + type + "_prev_page").html("<a href=\"javascript:getPlaceOrder(" + (page - 1) + ");\" aria-label=\"Previous\"><span aria-hidden=\"true\">上一页</span></a>");
            }
            if (page >= totalpage) {
                $("#" + type + "_next_page").html("<a href=\"javascript:getPlaceOrder(" + totalpage + ");\" aria-label=\"Next\"><span aria-hidden=\"true\">下一页</span></a>");
            } else {
                $("#" + type + "_next_page").html("<a href=\"javascript:getPlaceOrder(" + (page + 1) + ");\" aria-label=\"Next\"><span aria-hidden=\"true\">下一页</span></a>");
            }
        }
    } else if (type == "pl") {
        totalpage = pltotalpage;
        page = plpage;
        //之前需要将，上一页创建出来
        if (totalpage <= 5) {
            //总页数在0到5之间时，显示实际的页数
            for (var i = 1; i <= totalpage; i++) {
                $("#" + type + "_page_" + i).html("<a href=\"javascript:getProfitLoss(" + i + ");\">" + i + "</a>");
            }
        } else if (totalpage > 5 && page <= 5) { //总页数大于5时，只显示五页，多出的隐藏
            //判断当前页的位置
            if (page <= 3) { //当前页小于等于3时，显示1-5
                for (var i = 1; i <= 5; i++) {
                    $("#" + type + "_page_" + i).html("<a href=\"javascript:getProfitLoss(" + i + ");\">" + i + "</a>");
                }
            }
        } else if (page > (totalpage - 5)) { //当前页为最后五页时
            for (var i = totalpage - 4, j = 1; i <= totalpage, j <= 5; i++, j++) {
                $("#" + type + "_page_" + j).html("<a href=\"javascript:getProfitLoss(" + i + ");\">" + i + "</a>");
            }
        } else { //当前页为中间时
            for (var i = (page - 2), j = 1; i <= (page + 2), j <= 5; i++, j++) {
                $("#" + type + "_page_" + j).html("<a href=\"javascript:getProfitLoss(" + i + ");\">" + i + "</a>");
            }
        }
        if (language == 2) {
            if (page <= 1) {
                $("#" + type + "_prev_page").html("<a href=\"javascript:getProfitLoss(1);\" aria-label=\"Previous\"><span aria-hidden=\"true\">Prev</span></a>");
            } else {
                $("#" + type + "_prev_page").html("<a href=\"javascript:getProfitLoss(" + (page - 1) + ");\" aria-label=\"Previous\"><span aria-hidden=\"true\">Prev</span></a>");
            }
            if (page >= totalpage) {
                $("#" + type + "_next_page").html("<a href=\"javascript:getProfitLoss(" + totalpage + ");\" aria-label=\"Next\"><span aria-hidden=\"true\">Next</span></a>");
            } else {
                $("#" + type + "_next_page").html("<a href=\"javascript:getProfitLoss(" + (page + 1) + ");\" aria-label=\"Next\"><span aria-hidden=\"true\">Next</span></a>");
            }
        } else {
            if (page <= 1) {
                $("#" + type + "_prev_page").html("<a href=\"javascript:getProfitLoss(1);\" aria-label=\"Previous\"><span aria-hidden=\"true\">上一页</span></a>");
            } else {
                $("#" + type + "_prev_page").html("<a href=\"javascript:getProfitLoss(" + (page - 1) + ");\" aria-label=\"Previous\"><span aria-hidden=\"true\">上一页</span></a>");
            }
            if (page >= totalpage) {
                $("#" + type + "_next_page").html("<a href=\"javascript:getProfitLoss(" + totalpage + ");\" aria-label=\"Next\"><span aria-hidden=\"true\">下一页</span></a>");
            } else {
                $("#" + type + "_next_page").html("<a href=\"javascript:getProfitLoss(" + (page + 1) + ");\" aria-label=\"Next\"><span aria-hidden=\"true\">下一页</span></a>");
            }
        }
    } else if (type == "p") {
        totalpage = ptotalpage;
        page = ppage;
        //之前需要将，上一页创建出来
        if (totalpage <= 5) {
            //总页数在0到5之间时，显示实际的页数
            for (var i = 1; i <= totalpage; i++) {
                $("#" + type + "_page_" + i).html("<a href=\"javascript:getUserPayRecordByType(" + i + ");\">" + i + "</a>");
            }
        } else if (totalpage > 5 && page <= 5) { //总页数大于5时，只显示五页，多出的隐藏
            //判断当前页的位置
            if (page <= 3) { //当前页小于等于3时，显示1-5
                for (var i = 1; i <= 5; i++) {
                    $("#" + type + "_page_" + i).html("<a href=\"javascript:getUserPayRecordByType(" + i + ");\">" + i + "</a>");
                }
            }
        } else if (page > (totalpage - 5)) { //当前页为最后五页时
            for (var i = totalpage - 4, j = 1; i <= totalpage, j <= 5; i++, j++) {
                $("#" + type + "_page_" + j).html("<a href=\"javascript:getUserPayRecordByType(" + i + ");\">" + i + "</a>");
            }
        } else { //当前页为中间时
            for (var i = (page - 2), j = 1; i <= (page + 2), j <= 5; i++, j++) {
                $("#" + type + "_page_" + j).html("<a href=\"javascript:getUserPayRecordByType(" + i + ");\">" + i + "</a>");
            }
        }
        if (language == 2) {
            if (page <= 1) {
                $("#" + type + "_prev_page").html("<a href=\"javascript:getUserPayRecordByType(1);\" aria-label=\"Previous\"><span aria-hidden=\"true\">Prev</span></a>");
            } else {
                $("#" + type + "_prev_page").html("<a href=\"javascript:getUserPayRecordByType(" + (page - 1) + ");\" aria-label=\"Previous\"><span aria-hidden=\"true\">Prev</span></a>");
            }
            if (page >= totalpage) {
                $("#" + type + "_next_page").html("<a href=\"javascript:getUserPayRecordByType(" + totalpage + ");\" aria-label=\"Next\"><span aria-hidden=\"true\">Next</span></a>");
            } else {
                $("#" + type + "_next_page").html("<a href=\"javascript:getUserPayRecordByType(" + (page + 1) + ");\" aria-label=\"Next\"><span aria-hidden=\"true\">Next</span></a>");
            }

        } else {
            if (page <= 1) {
                $("#" + type + "_prev_page").html("<a href=\"javascript:getUserPayRecordByType(1);\" aria-label=\"Previous\"><span aria-hidden=\"true\">上一页</span></a>");
            } else {
                $("#" + type + "_prev_page").html("<a href=\"javascript:getUserPayRecordByType(" + (page - 1) + ");\" aria-label=\"Previous\"><span aria-hidden=\"true\">上一页</span></a>");
            }
            if (page >= totalpage) {
                $("#" + type + "_next_page").html("<a href=\"javascript:getUserPayRecordByType(" + totalpage + ");\" aria-label=\"Next\"><span aria-hidden=\"true\">下一页</span></a>");
            } else {
                $("#" + type + "_next_page").html("<a href=\"javascript:getUserPayRecordByType(" + (page + 1) + ");\" aria-label=\"Next\"><span aria-hidden=\"true\">下一页</span></a>");
            }
        }
    } else if (type == "b") {
        totalpage = btotalpage;
        page = bpage;
        //之前需要将，上一页创建出来
        if (totalpage <= 5) {
            //总页数在0到5之间时，显示实际的页数
            for (var i = 1; i <= totalpage; i++) {
                $("#" + type + "_page_" + i).html("<a href=\"javascript:getTradeEarningsByUserIdType(" + i + ");\">" + i + "</a>");
            }
        } else if (totalpage > 5 && page <= 5) { //总页数大于5时，只显示五页，多出的隐藏
            //判断当前页的位置
            if (page <= 3) { //当前页小于等于3时，显示1-5
                for (var i = 1; i <= 5; i++) {
                    $("#" + type + "_page_" + i).html("<a href=\"javascript:getTradeEarningsByUserIdType(" + i + ");\">" + i + "</a>");
                }
            }
        } else if (page > (totalpage - 5)) { //当前页为最后五页时
            for (var i = totalpage - 4, j = 1; i <= totalpage, j <= 5; i++, j++) {
                $("#" + type + "_page_" + j).html("<a href=\"javascript:getTradeEarningsByUserIdType(" + i + ");\">" + i + "</a>");
            }
        } else { //当前页为中间时
            for (var i = (page - 2), j = 1; i <= (page + 2), j <= 5; i++, j++) {
                $("#" + type + "_page_" + j).html("<a href=\"javascript:getTradeEarningsByUserIdType(" + i + ");\">" + i + "</a>");
            }
        }
        if (language == 2) {
            if (page <= 1) {
                $("#" + type + "_prev_page").html("<a href=\"javascript:getTradeEarningsByUserIdType(1);\" aria-label=\"Previous\"><span aria-hidden=\"true\">Prev</span></a>");
            } else {
                $("#" + type + "_prev_page").html("<a href=\"javascript:getTradeEarningsByUserIdType(" + (page - 1) + ");\" aria-label=\"Previous\"><span aria-hidden=\"true\">Prev</span></a>");
            }
            if (page >= totalpage) {
                $("#" + type + "_next_page").html("<a href=\"javascript:getTradeEarningsByUserIdType(" + totalpage + ");\" aria-label=\"Next\"><span aria-hidden=\"true\">Next</span></a>");
            } else {
                $("#" + type + "_next_page").html("<a href=\"javascript:getTradeEarningsByUserIdType(" + (page + 1) + ");\" aria-label=\"Next\"><span aria-hidden=\"true\">Next</span></a>");
            }

        } else {
            if (page <= 1) {
                $("#" + type + "_prev_page").html("<a href=\"javascript:getTradeEarningsByUserIdType(1);\" aria-label=\"Previous\"><span aria-hidden=\"true\">上一页</span></a>");
            } else {
                $("#" + type + "_prev_page").html("<a href=\"javascript:getTradeEarningsByUserIdType(" + (page - 1) + ");\" aria-label=\"Previous\"><span aria-hidden=\"true\">上一页</span></a>");
            }
            if (page >= totalpage) {
                $("#" + type + "_next_page").html("<a href=\"javascript:getTradeEarningsByUserIdType(" + totalpage + ");\" aria-label=\"Next\"><span aria-hidden=\"true\">下一页</span></a>");
            } else {
                $("#" + type + "_next_page").html("<a href=\"javascript:getTradeEarningsByUserIdType(" + (page + 1) + ");\" aria-label=\"Next\"><span aria-hidden=\"true\">下一页</span></a>");
            }
        }
    } else if (type == "bs") {
        totalpage = bstotalpage;
        page = bspage;
        //之前需要将，上一页创建出来
        if (totalpage <= 5) {
            //总页数在0到5之间时，显示实际的页数
            for (var i = 1; i <= totalpage; i++) {
                $("#" + type + "_page_" + i).html("<a href=\"javascript:getTradeEarningsByUserId(" + i + ");\">" + i + "</a>");
            }
        } else if (totalpage > 5 && page <= 5) { //总页数大于5时，只显示五页，多出的隐藏
            //判断当前页的位置
            if (page <= 3) { //当前页小于等于3时，显示1-5
                for (var i = 1; i <= 5; i++) {
                    $("#" + type + "_page_" + i).html("<a href=\"javascript:getTradeEarningsByUserId(" + i + ");\">" + i + "</a>");
                }
            }
        } else if (page > (totalpage - 5)) { //当前页为最后五页时
            for (var i = totalpage - 4, j = 1; i <= totalpage, j <= 5; i++, j++) {
                $("#" + type + "_page_" + j).html("<a href=\"javascript:getTradeEarningsByUserId(" + i + ");\">" + i + "</a>");
            }
        } else { //当前页为中间时
            for (var i = (page - 2), j = 1; i <= (page + 2), j <= 5; i++, j++) {
                $("#" + type + "_page_" + j).html("<a href=\"javascript:getTradeEarningsByUserId(" + i + ");\">" + i + "</a>");
            }
        }
        if (language == 2) {
            if (page <= 1) {
                $("#" + type + "_prev_page").html("<a href=\"javascript:getTradeEarningsByUserId(1);\" aria-label=\"Previous\"><span aria-hidden=\"true\">Prev</span></a>");
            } else {
                $("#" + type + "_prev_page").html("<a href=\"javascript:getTradeEarningsByUserId(" + (page - 1) + ");\" aria-label=\"Previous\"><span aria-hidden=\"true\">Prev</span></a>");
            }
            if (page >= totalpage) {
                $("#" + type + "_next_page").html("<a href=\"javascript:getTradeEarningsByUserId(" + totalpage + ");\" aria-label=\"Next\"><span aria-hidden=\"true\">Next</span></a>");
            } else {
                $("#" + type + "_next_page").html("<a href=\"javascript:getTradeEarningsByUserId(" + (page + 1) + ");\" aria-label=\"Next\"><span aria-hidden=\"true\">Next</span></a>");
            }

        } else {
            if (page <= 1) {
                $("#" + type + "_prev_page").html("<a href=\"javascript:getTradeEarningsByUserId(1);\" aria-label=\"Previous\"><span aria-hidden=\"true\">上一页</span></a>");
            } else {
                $("#" + type + "_prev_page").html("<a href=\"javascript:getTradeEarningsByUserId(" + (page - 1) + ");\" aria-label=\"Previous\"><span aria-hidden=\"true\">上一页</span></a>");
            }
            if (page >= totalpage) {
                $("#" + type + "_next_page").html("<a href=\"javascript:getTradeEarningsByUserId(" + totalpage + ");\" aria-label=\"Next\"><span aria-hidden=\"true\">下一页</span></a>");
            } else {
                $("#" + type + "_next_page").html("<a href=\"javascript:getTradeEarningsByUserId(" + (page + 1) + ");\" aria-label=\"Next\"><span aria-hidden=\"true\">下一页</span></a>");
            }
        }
    }
}

/**
 * 根据用户id获取用户详细信息
 */
function getUserInfoById() {
    $.ajax({
        url: "../usdtpc/auth/getUserInfoById",
        data: {
            "userid": userid
        },
        method: "POST",
        success: function (data) {
            if (isString(data)) {
                data = JSON.parse(data);
            }
            if (data.code == 100) {
                if (data.user.regtype == 0) {
                    var info = "<span data-locale=\"infor.shoujihao\">手机号：</span>";
                    info += "<div class=\"inforcenter\">";
                    info += "<input type=\"text\" readonly=\"readonly\" id=\"info_phone\" value=\"" + data.user.phone + "\"></div>";
                    info += "<a id=\"info_phone_change_btn\" href=\"javascript:showDialog('.modifyPhone')\" data-locale=\"infor.xiugai\"></a>";
                    $("#info_first_register").html(info);
                    var info2 = "<span data-locale=\"infor.bangdingyouxiang\">绑定邮箱：</span>";
                    info2 += "<div class=\"inforcenter\">";
                    info2 += "<input id=\"info_email\" readonly=\"readonly\" type=\"text\" value=\"未绑定\"> </div>";
                    info2 += "<a id=\"info_email_change_btn\" href=\"javascript:showDialog('.modifyemail');\" data-locale=\"infor.xiugai\">绑定</a>";
                    $("#info_other_bind").html(info2);
                } else {
                    var info = "<span data-locale=\"infor.shoujihao\">手机号：</span>";
                    info += "<div class=\"inforcenter\">";
                    info += "<input type=\"text\" readonly=\"readonly\" id=\"info_phone\" value=\"\"></div>";
                    info += "<a id=\"info_phone_change_btn\" href=\"javascript:showDialog('.modifyPhone')\" data-locale=\"infor.xiugai\">绑定</a>";
                    $("#info_other_bind").html(info);
                    var info2 = "<span data-locale=\"infor.bangdingyouxiang\">绑定邮箱：</span>";
                    info2 += "<div class=\"inforcenter\">";
                    info2 += "<input id=\"info_email\" readonly=\"readonly\" type=\"text\" value=\"" + $("#info_email").val(data.user.email);
                    +"\"> </div>";
                    info2 += "<a id=\"info_email_change_btn\" href=\"javascript:showDialog('.modifyemail');\" data-locale=\"infor.xiugai\"></a>";
                    $("#info_first_register").html(info2);
                }

                $("#info_img_show").html("<img onerror=\"javascript:this.src='img/head.png';\" src=\"" + data.user.img + "\">");
                if (data.user.username != undefined && data.user.username != null && data.user.username != "") {
                    $("#info_username").val(data.user.username);
                } else {
                    $("#info_username").val("无登录账号");
                }
                $("#info_nickname").val(data.user.nickname);
                if (data.user.phone != undefined && data.user.phone != null && data.user.phone != "") {
                    $("#info_phone").val(data.user.phone);
                    //					$("#oldphone").val(data.user.phone);
                    $("#info_phone_change_btn").html("");
                } else {
                    $("#info_phone").val("未填写");
                }
                if (data.user.hobby != undefined && data.user.hobby != null && data.user.hobby != "") {
                    $("#info_hobby").val(data.user.hobby);
                } else {
                    $("#info_hobby").val("未填写");
                }
                if (data.user.dabble_time != undefined && data.user.dabble_time != null && data.user.dabble_time != "") {
                    $("#info_dabble_time").val(data.user.dabble_time);
                } else {
                    $("#info_dabble_time").val("未填写");
                }
                $("#info_createtime").val(data.user.createtime);
                if (data.user.email != undefined && data.user.email != null && data.user.email != "") {
                    $("#info_email").val(data.user.email);
                    $("#oldemail").val(data.user.email);
                    $("#info_email_change_btn").html("");
                } else {
                    $("#info_email").val("未填写");
                }
                if (data.user.sex == 0) {
                    $("input[name='demo-radio']:eq(2)").attr("checked", 'checked');
                } else if (data.user.sex == 1) {
                    $("input[name='demo-radio']:eq(0)").attr("checked", 'checked');
                } else if (data.user.sex == 2) {
                    $("input[name='demo-radio']:eq(1)").attr("checked", 'checked');
                }
                if (data.user.region != undefined && data.user.region != null && data.user.region != '') {
                    $("#info_region").val(data.user.region);
                } else {
                    $("#info_region").val("未填写");
                }
                if (data.user.real_name == 0) {
                    $("#info_pass_certification").hide();
                    $("#info_real_authentication_jiben").show();
                    $("#info_real_authentication_zhengjian").show();
                    $("#info_real_authentication_cuowu").hide();
                    $("#info_real_authentication_tishi").hide();
                } else if (data.user.real_name == 2) {
                    $("#info_pass_certification").hide();
                    $("#info_real_authentication_jiben").show();
                    $("#info_real_authentication_zhengjian").show();
                    $("#info_real_authentication_cuowu").show();
                    $("#info_real_authentication_memo").text(data.user.memo);
                    $("#info_real_authentication_tishi").hide();
                } else if (data.user.real_name == 3) {
                    $("#info_pass_certification").hide();
                    $("#info_real_authentication_jiben").hide();
                    $("#info_real_authentication_zhengjian").hide();
                    $("#info_real_authentication_tishi").show();
                } else {
                    $("#info_real_authentication_cuowu").hide();
                    $("#info_real_authentication_tishi").hide();
                    $("#info_real_authentication_jiben").hide();
                    $("#info_real_authentication_zhengjian").hide();
                    $("#info_pass_certification").show();
                    $("#info_renzhen_tijiao").hide();
                    $("#info_nationality").val(data.user.nationality);
                    $("#info_realname").val(data.user.realname);
                    $("#info_idcard").val(data.user.sid);
                }
                var z_yl = (parseFloat(data.user.income) + parseFloat(data.user.loss));
                if (z_yl < 0) {
                    $("#info_title_zongshouyi").html("-$" + (0 - z_yl).toFixed(2));

                } else {
                    $("#info_title_zongshouyi").html("+$" + z_yl.toFixed(2));

                }
                $("#info_title_zongrujin").html("$" + data.user.usdt_money.toFixed(2));
                $("#info_title_yue").html("$" + data.user.surplus.toFixed(2));
                useryue = data.user.surplus;
                if (data.user.isgoogle == 1) {
                    $("#infor_is_google_auth").val(data.user.google_secret);
                    $("#infor_is_google_auth_a").html("已开启");
                    $("#infor_is_google_auth_a").removeAttr('href');
                }
                if (data.user.trading_strategy != undefined && data.user.trading_strategy != null && data.user.trading_strategy != '') {
                    $("#info_trading_strategy").val(data.user.trading_strategy);
                } else {
                    $("#info_trading_strategy").val("未填写");
                }
                if (data.user.signature != undefined && data.user.signature != null && data.user.signature != '') {
                    $("#info_signature").val(data.user.signature);
                } else {
                    $("#info_signature").val("未填写");
                }
                getFreezeMoney();
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

function showDialog(info) {
    $("#modify_dialogbox").show();
    $("" + info).show();
}

/**
 * 修改用户信息
 */
function changeUserInfo(type) {
    var datainfo = {};
    if (type == 1) {
        var nickname = $("#info_nickname").val();
        datainfo = {
            "userid": userid,
            "nickname": nickname
        };
    } else if (type == 2) {
        var sex = $("input[name='demo-radio']:checked").val();
        datainfo = {
            "userid": userid,
            "sex": sex
        };
    } else if (type == 3) {
        var region = $("#info_region").val();
        datainfo = {
            "userid": userid,
            "region": region
        };
    } else if (type == 4) {
        var hobby = $("#info_hobby").val();
        datainfo = {
            "userid": userid,
            "hobby": hobby
        };
    } else if (type == 5) {
        var dabble_time = $("#info_dabble_time").val();
        datainfo = {
            "userid": userid,
            "dabble_time": dabble_time
        };
    } else if (type == 6) {
        var password = $("#newpassword").val();
        datainfo = {
            "userid": userid,
            "password": password
        };
    } else if (type == 7) {
        var trade_password = $("#newtradepassword").val();
        datainfo = {
            "userid": userid,
            "trade_password": trade_password
        };
    } else if (type == 8) {
        var phone = $("#newphone").val();
        datainfo = {
            "userid": userid,
            "phone": phone
        };
    } else if (type == 9) {
        var email = $("#newemail").val();
        datainfo = {
            "userid": userid,
            "email": email
        };
    } else if (type == 10) {
        var google_secret = window.sessionStorage.getItem("google_secret");
        datainfo = {
            "userid": userid,
            "isgoogle": 1,
            "google_secret": google_secret
        };
    } else if (type == 11) {
        var info_trading_strategy = $("#info_trading_strategy").val();
        datainfo = {
            "userid": userid,
            "trading_strategy": info_trading_strategy
        };
    } else if (type == 12) {
        var info_signature = $("#info_signature").val();
        datainfo = {
            "userid": userid,
            "signature": info_signature
        };
    }
    $.ajax({
        url: "../usdtpc/subuser/changUserInfoById",
        data: datainfo,
        method: "POST",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        success: function (data) {
            if (isString(data)) {
                data = JSON.parse(data);
            }
            if (data.code == 100) {
                update_hint("修改成功");
                if (type == 6) {
                    $(".dialogBox").hide();
                    $(".modifyPassword").hide();
                    window.sessionStorage.clear();
                    window.location.href = "login/login.html";
                } else if (type == 7) {
                    $(".dialogBox").hide();
                    $("#modifyTradePassword").hide();
                    window.sessionStorage.clear();
                    window.location.href = "login/login.html";
                } else if (type == 8) {
                    $(".dialogBox").hide();
                    $(".modifyPhone").hide();
                    $("#info_phone").val(datainfo.phone);
                    $("#info_phone_change_btn").html("");
                    //					$("#oldphone").val(datainfo.phone);
                    tokenLoseEfficacy();
                    getUserInfoById();
                } else if (type == 9) {
                    $(".dialogBox").hide();
                    $(".band_email").hide();
                    $(".modifyemail").hide();
                    $("#info_email").val(datainfo.email);
                    $("#oldemail").val(datainfo.email);
                    $("#info_email_change_btn").html("");
                    tokenLoseEfficacy();
                    getUserInfoById();

                } else if (type == 10) {
                    var google_secret = window.sessionStorage.getItem("google_secret");
                    $("#infor_is_google_auth").val(google_secret);
                    $("#infor_is_google_auth_a").html("已开启");
                    $("#infor_is_google_auth_a").removeAttr('href');
                    showPage('securitySettings');
                }
            } else if (data.code == 401) {
                tokenLoseEfficacy();
                token = window.sessionStorage.getItem("token");
                changeUserInfo(type);
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
    var phone = $("#newphone").val();
    if (phone.length <= 0) {
        $("#newphone_text").html("请输入您的手机号");
        $("#register_phone_code").attr("disabled", false);
    } else if (!reg.test(phone)) {
        $("#newphone_text").html("您输入的手机号格式不正确");
        $("#register_phone_code").attr("disabled", false);
    } else if (!isphone) {
        $("#newphone_text").html("该手机号已存在，请您重新输入！");
        $("#register_phone_code").attr("disabled", false);
    } else {
        $("#newphone_text").html("");
        $.ajax({
            url: "../usdtpc/auth/sendSmsCode",
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
                    $("#newphone_text").html("验证码请求过于频繁");
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
    var email = $("#newemail").val();
    if (email.length <= 0) {
        $("#newemail_text").html("请输入您的邮箱");
        $("#register_email_code").attr("disabled", false);
    } else if (!emailreg.test(email)) {
        $("#newemail_text").html("您输入的邮箱格式不正确");
        $("#register_email_code").attr("disabled", false);
    } else if (!isemail) {
        $("#newemail_text").html("该邮箱已存在，请您重新输入！");
        $("#register_email_code").attr("disabled", false);
    } else {
        $("#newemail_text").html("");
        $("#register_email_code").html("120s");
        ecodecount = 120;
        clearInterval(esendcode);
        esendcode = setInterval(intervalECode, 1000);
        $.ajax({
            url: "../usdtpc/auth/sendEmailCode",
            data: {
                "email": email
            },
            type: "POST",
            success: function (data) {
                if (data.code == 100) {
                    emailyzm = data.emailcode;
                    //					$("#register_email_code").html("120");
                    //					ecodecount = 120;
                    //					clearInterval(esendcode);
                    //esendcode = setInterval(intervalECode, 1000);
                } else if (data.code == 106) {
                    $("#register_email_code").html("验证码");
                    $("#register_email_code").attr("disabled", false);
                    update_hint("验证码请求过于频繁");
                } else {
                    $("#register_email_code").html("验证码");
                    $("register_phone_code").attr("disabled", false);
                }

            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                $("#register_email_code").html("验证码");
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
 * 修改用户密码
 */
function changPassword() {
    var newpassword = $("#newpassword").val();
    var retpassword = $("#retpassword").val();
    var pwdreg = /^[0-9a-zA-Z]*$/g;
    if (!ispassword) {
        $("#oldpassword_text").html("您的旧密码输入不正确");
    } else if (newpassword.length <= 0) {
        $("#oldpassword_text").html("");
        $("#newpassword_text").html("");
        $("#newpassword_text").html("请输入新密码");
    } else if (retpassword.length <= 0) {
        $("#oldpassword_text").html("");
        $("#newpassword_text").html("");
        $("#retpassword_text").html("请再次输入密码");
    } else if (!pwdreg.test(newpassword)) {
        $("#oldpassword_text").html("");
        $("#retpassword_text").html("");
        $("#newpassword_text").html("密码由字母和数字组成，不包含特殊符号");
    } else if (newpassword != retpassword) {
        $("#oldpassword_text").html("");
        $("#newpassword_text").html("");
        $("#retpassword_text").html("两次输入的密码不一致");
    } else {
        $("#oldpassword_text").html("");
        $("#newpassword_text").html("");
        $("#retpassword_text").html("");
        changeUserInfo(6);
    }
}

/**
 * 修改交易密码
 */
function changTradePassword() {
    var newpassword = $("#newtradepassword").val();
    var retpassword = $("#rettradepassword").val();
    var tpwdreg = /^[0-9]{6}$/g;
    if (!istradepassword) {
        $("#oldtradepassword_text").html("您的旧密码输入不正确");
    } else if (newpassword.length <= 0) {
        $("#oldtradepassword_text").html("");
        $("#rettradepassword_text").html("");
        $("#newtradepassword_text").html("请输入新密码");
    } else if (retpassword.length <= 0) {
        $("#oldtradepassword_text").html("");
        $("#newtradepassword_text").html("");
        $("#rettradepassword_text").html("请再次输入密码");
    } else if (!tpwdreg.test(newpassword)) {
        $("#oldtradepassword_text").html("");
        $("#rettradepassword_text").html("");
        $("#newtradepassword_text").html("交易密码由六位纯数字组成");
    } else if (newpassword != retpassword) {
        $("#oldtradepassword_text").html("");
        $("#newtradepassword_text").html("");
        $("#rettradepassword_text").html("两次输入的密码不一致");
    } else {
        $("#oldtradepassword_text").html("");
        $("#newtradepassword_text").html("");
        $("#rettradepassword_text").html("");
        changeUserInfo(7);
    }
}

/**
 * 修改手机号码
 */
function changePhone() {
    var newphone = $("#newphone").val();
    var smcode = $("#smcode").val();
    var reg = /^(0|86|17951)?(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
    if (newphone.length <= 0) {
        $("#smcode_text").html("");
        $("#newphone_text").html("请输入要绑定的手机号码");
    } else if (!reg.test(newphone)) {
        $("#smcode_text").html("");
        $("#newphone_text").html("您输入的手机号码格式不正确");
    } else if (!isphone) {
        $("#smcode_text").html("");
        $("#newphone_text").html("该手机号已被注册");
    } else if (smcode.length <= 0) {
        $("#smcode_text").html("请输入您的短信验证码");
        $("#newphone_text").html("");
    } else if (smcode != yzyzm) {
        $("#smcode_text").html("您输入的短信验证码不正确");
        $("#newphone_text").html("");
    } else {
        $("#smcode_text").html("");
        $("#newphone_text").html("");
        changeUserInfo(8);
    }
}

/**
 * 修改用户邮箱
 */
function changeEmail() {
    var newemail = $("#newemail").val();
    var emailcode = $("#emailcode").val();
    var emailreg = /^([0-9A-Za-z\-_\.]+)@([0-9a-z]+\.[a-z]{2,3}(\.[a-z]{2})?)$/g;
    if (newemail.length <= 0) {
        $("#smcode_text").html("");
        $("#newphone_text").html("请输入要绑定的邮箱号码");
    } else if (!emailreg.test(newemail)) {
        $("#smcode_text").html("");
        $("#newphone_text").html("您输入的邮箱格式不正确");
    } else if (!isemail) {
        $("#smcode_text").html("");
        $("#newphone_text").html("该邮箱已被注册");
    } else if (emailyzm.length <= 0) {
        $("#newphone_text").html("");
        $("#smcode_text").html("请输入您的邮箱验证码");
    } else if (emailcode != emailyzm) {
        $("#newphone_text").html("");
        $("#smcode_text").html("您输入的邮箱验证码不正确");
    } else {
        $("#newphone_text").html("");
        $("#smcode_text").html("");
        changeUserInfo(9);
    }
}

/**
 * 修改用户头像
 */
function changeUserImg() {
    var formData = new FormData();
    var img_file = document.getElementById("imgfile");
    var img = img_file.files[0];
    formData.append("img", img);
    formData.append("userid", userid);
    $.ajax({
        url: "../usdtpc/subuser/UserImgUpload",
        data: formData,
        method: "POST",
        contentType: false,
        processData: false,
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        success: function (data) {
            if (isString(data)) {
                data = JSON.parse(data);
            }
            if (data.code == 100) {
                flag = true;
                $(".modifyhederImg").hide();
                $("#modify_dialogbox").hide();
                window.sessionStorage.setItem("userimg", data.url);
                $("#info_img_show").html("<img src=\"" + data.url + "?timestamp=" + (new Date()).valueOf() + "\">");
                $("#head_img_url").attr("src", data.url + "?timestamp=" + (new Date()).valueOf());
            } else if (data.code == 401) {
                flag = false;
                tokenLoseEfficacy();
                token = window.sessionStorage.getItem("token");
                changeUserImg(type);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            flag = false;
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

function chooseFile() {
    $("#imgfile").click();
}

function cutImg() {
    var src = URL.createObjectURL($("#imgfile")[0].files[0]);
    $("#info_img").attr("src", src);
}

function hideBandEmail() {
    $("#band_email").hide();
}

function getGoogleQrCode() {
    var email = window.sessionStorage.getItem("email");
    var isgoogle = window.sessionStorage.getItem("isgoogle");
    if (isgoogle != 1) {
        isgoogle = 0;
    }
    var google_secret = window.sessionStorage.getItem("google_secret");
    if (email == undefined || email == null || email == "") {
        $("#band_email").show();
    } else {
        $.ajax({
            url: "../usdtpc/subuser/getGoogleQrCode",
            data: {
                "userid": userid,
                "email": email,
                "secretkey": google_secret,
                "isgoogle": isgoogle
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
                    window.sessionStorage.setItem("google_secret", data.secret);
                    window.sessionStorage.setItem("isgoogle", 1);
                    $("#google_text").html(data.content);
                    $("#google_img").attr("src", "../usdtpc/auth/getGoogleImg?content=" + data.content);
                } else if (data.code == 401) {
                    tokenLoseEfficacy();
                    token = window.sessionStorage.getItem("token");
                    getGoogleQrCode();
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                flag = false;
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
 * 启用谷歌验证器
 */
function changeGoogle() {
    var code = $("#google_code").val();
    var trade_password = $("#google_tradepassword").val();
    var yzm = $("#google_smcode").val();
    var google_secret = window.sessionStorage.getItem("google_secret");
    if (code.length <= 0) {
        update_hint("请输入谷歌验证码");
    } else if (trade_password.length <= 0) {
        update_hint("请输入交易密码");
    } else if (yzm != yzyzm) {
        update_hint("验证码不对");
    } else {
        $.ajax({
            url: "../usdtpc/subuser/checkGoogleCode",
            data: {
                "code": code,
                "secret": google_secret,
                trade_password: trade_password
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
                    changeUserInfo(10);
                } else if (data.code == 401) {
                    tokenLoseEfficacy();
                    token = window.sessionStorage.getItem("token");
                    changeGoogle();
                } else if (data.code == 101) {
                    update_hint("谷歌验证码不正确");
                } else {
                    update_hint("支付密码不正确");
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                flag = false;
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

function chooseIdcardImg() {
    $("#idcard_imgfile").click();
}

function cutIdcardImg() {
    var src = URL.createObjectURL($("#idcard_imgfile")[0].files[0]);
    $("#idcard_img").attr("src", src);
}

/**
 * 提交实名审核
 */
function submitAudit() {
    var realname = $("#realname_info").val();
    var idcard_info = $("#idcard_info").val();
    var img_file = document.getElementById("idcard_imgfile");
    var img = img_file.files[0];
    var size = $("#idcard_imgfile")[0].files[0].size;
    var max = 30 * 1024 * 1024;
    if (realname == undefined || realname == null || realname == "" || realname.length <= 0) {
        update_hint("请输入您的真实姓名");
    } else if (idcard_info == undefined || idcard_info == null || idcard_info == "" || idcard_info.length <= 0) {
        update_hint("请输入你的身份证号码");
    } else if (img == undefined || img == null || img == "") {
        update_hint("请上传手持身份证图片");
    } else if (size > max) {
        update_hint("您上传的图片文件过大");
    } else {
        var formData = new FormData();
        formData.append("img", img);
        $.ajax({
            url: "../usdtpc/subuser/UserIdCardUpload",
            data: formData,
            method: "POST",
            contentType: false,
            processData: false,
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', token);
            },
            success: function (data) {
                if (isString(data)) {
                    data = JSON.parse(data);
                }
                if (data.code == 100) {
                    submitRealnameAuthentication(data.url);
                } else if (data.code == 401) {
                    tokenLoseEfficacy();
                    token = window.sessionStorage.getItem("token");
                    submitAudit();
                } else {
                    update_hint("提交失败");
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
}

function submitRealnameAuthentication(url) {
    var realname = $("#realname_info").val();
    var idcard = $("#idcard_info").val();
    $.ajax({
        url: "../usdtpc/subuser/addRealnameAudit",
        data: {
            "userid": userid,
            "realname": realname,
            "idcard": idcard,
            "img": url
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
                update_hint("已提交审核");
            } else if (data.code == 401) {
                tokenLoseEfficacy();
                token = window.sessionStorage.getItem("token");
                submitRealnameAuthentication(url);
            } else {
                update_hint("谷歌验证码不正确");
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            flag = false;
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

function openGoogleVi() {
    var email = window.sessionStorage.getItem("email");
    if (email == undefined || email == null || email == "") {
        $("#band_email").show();
        return false;
    }
    getGoogleQrCode();
    $('.safeSetting').slideDown().siblings(".commonClass").slideUp();
}

/**
 * 拉取用户余额 冻结信息
 * @param lssurplus
 */
function getFreezeMoney() {

    $.ajax({
        url: "../usdtpc/subusdt/getFreezeUsdt",
        data: {
            "userid": userid
        },
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        method: "POST",
        success: function (data) {
            if (data.code == 100) {
                var freeze = (unde(data.freeze.freeze, 0) + (data.freeze.trade, 0)).toFixed(2);
                $("#infor_page_money_dongjie").html("$" + freeze);
                var lstotalamount = (useryue + unde(data.freeze.freeze, 0) + unde(data.freeze.trade, 0)).toFixed(2);
                $("#infor_page_money_zonge").html("$" + lstotalamount);
                $("#infor_page_money_yue").html("$" + useryue);
            } else if (data.code == 101) {
                $("#infor_page_money_yue").html("$" + useryue);
                $("#infor_page_money_dongjie").html("$0");
                $("#infor_page_money_zonge").html("$" + useryue);
            } else if (data.code == 401) {
                tokenLoseEfficacy();
                token = window.sessionStorage.getItem("token");
                getFreezeMoney();
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

/**
 *
 * 新加功能
 */

function report_top() {
    $.ajax({
        url: "../usdtpc/Report/SubMoneySelect",
        data: {
            "pid": userid
        },
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        method: "POST",
        success: function (data) {
            if (data.code == 100) {
                $("#report_money_zonge").text("" + data.money.bur_money);
                $("#report_money_yue").text("" + data.money.bur_money);
                $("#team_level").text(data.money.referee_num);
                $("#team_team").text(data.money.team_num);
                $("#team_level_money").text("$" + (data.money.team_level_money + data.money.extract_money));
                $("#team_td_money").text("$" + data.money.team_money);
                $("#reprot_money").text("$" + data.money.team_money);
                $("#team_team_money").text("$" + unde(data.money.water_money, "0"));
                report_team_money = data.money.team_money;
            }
        },
        error: function (err) {

        }
    })
}

function report_user(reportUserPage) {
    $.ajax({
        url: "../usdtpc/Report/SubTeamSelect",
        data: {
            "pid": userid,
            page: reportUserPage,
            num: reportNum
        },
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        method: "POST",
        success: function (data) {
            if (data.code == 100) {
                var str = "";
                str += "<li class=\"logList\">";
                str += "<span style=\"width: 10%;\">头像</span>";
                str += "<span style=\"width: 10%;\">用户昵称</span>";
                str += "<span style=\"width: 20%;\">邮箱</span>";
                str += "<span style=\"width: 15%;\">手机号</span>";
                str += "<span style=\"width: 10%;\">实名</span>";
                str += "<span style=\"width: 10%;\">级别</span>";
                str += "<span style=\"width: 7%;\">成员</span>";
                str += "<span style=\"width: 7%;\">团队</span>";
                str += "<span style=\"width: 10%;\">操作</span>";
                str += "</li>";
                for (var i in data.team) {
                    var team = data.team[i];
                    str += "<li class=\"logInfor\" style=\"line-height: 90px;\">";
                    str += "<span style=\"width: 10%;\"><img src=\"" + team.img + "\" style=\"width: 54px;border-radius: 50%;\" onclick=\"jumpPerson('" + data.team[i].userid + "');\"></span>";
                    str += "<span style=\"width: 10%;\">" + unde(team.nickname, "-") + "</span>";
                    str += "<span style=\"width: 20%;\">" + unde(team.email, "未绑定") + "</span>";
                    str += "<span style=\"width: 15%;\">" + unde(team.phone, "未绑定") + "</span>";
                    if (team.real_name == 1) {
                        str += "<span style=\"width: 10%;color:#19ab1d\">已实名</span>";
                    } else {
                        str += "<span style=\"width: 10%;\">未实名</span>";
                    }

                    str += "<span style=\"width: 10%;\">" + team.name + "</span>";
                    str += "<span style=\"width: 7%;\">" + team.referee_num + "人</span>";
                    str += "<span style=\"width: 7%;\">" + team.team_num + "人</span>";
                    str += "<span style=\"width: 10%;\">";
                    str += "<div style=\"line-height: 30px;\"><a class=\"recharge\">加ta好友</a></div>";
                    str += "<div style=\"line-height: 30px;\" onclick=\"jumpPerson('" + data.team[i].userid + "');\"><a class=\"recharge\">ta的主页</a></div>";
                    str += " <div style=\"line-height: 30px;\"><a class=\"recharge\">ta的微博</a></div>";
                    str += "</span>";
                    str += "</li>";
                }

                $("#team_user_list").html(str);
                fenye(reportUserPage, data.total, "report_user", "report_user_fy");
            }
        },
        error: function (err) {

        }
    })
}

function fenye(page, total, ff, id) {
    var count = Math.ceil(parseInt(total) / parseInt(reportNum));
    page = parseInt(page);
    var shang = 1;
    var xia = 1;
    if (page > 1) {
        shang = page - 1;
    }
    if (count > page) {
        xia = page + 1;
    } else if (count == page) {
        xia = page;
    }
    var str = "<li>";
    str += "<a href=\"javascript:void(0)\" onclick=\"" + ff + "(" + shang + ")\" aria-label=\"Previous\">";
    str += "<span aria-hidden=\"true\">上一页</span>";
    str += "</a>";
    str += "</li>";
    if (page <= 3) {
        if (count < 5) {
            for (var i = 1; i <= count; i++) {
                str += "<li>";
                str += "<a href=\"javascript:void(0)\" onclick=\"" + ff + "(" + i + ")\">" + i + "</a>";
                str += "</li>";
            }
        } else {
            for (var i = 1; i < 6; i++) {
                str += "<li>";
                str += "<a href=\"javascript:void(0)\" onclick=\"" + ff + "(" + i + ")\">" + i + "</a>";
                str += "</li>";
            }
        }
    } else {

        if (page + 2 > count) {
            var z = count - page;
            if (z == 0) {
                z = 1;
            }
            for (var i = z; i <= count; i++) {
                str += "<li>";
                str += "<a href=\"javascript:void(0)\" onclick=\"" + ff + "(" + i + ")\">" + i + "</a>";
                str += "</li>";
            }
        } else {
            for (var i = page - 2; i <= page + 2; i++) {
                str += "<li>";
                str += "<a href=\"javascript:void(0)\" onclick=\"" + ff + "(" + i + ")\">" + i + "</a>";
                str += "</li>";
            }
        }
    }

    str += "<li>";
    str += "<a href=\"javascript:void(0)\" onclick=\"" + ff + "(" + xia + ")\" aria-label=\"Next\">";
    str += "<span aria-hidden=\"true\">下一页</span>";
    str += "</a>";
    str += "</li>";

    $("#" + id).html(str);
}

function report_qiehuan(id, th) {

    $(".Report-href-active").attr("class", "Report-href");
    $(th).attr("class", "Report-href-active");
    $(".report").hide();
    $("#" + id).show();
}

function report_extract(reportUserPage) {
    $.ajax({
        url: "../usdtpc/Report/SubExtractSelect",
        data: {
            "pid": userid,
            page: reportUserPage,
            num: reportNum
        },
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        method: "POST",
        success: function (data) {
            if (data.code == 100) {
                var str = "";
                str += "<li class=\"logList\">";
                str += "<span style=\"width: 25%;\">日期时间</span>";
                str += "<span style=\"width: 25%;\">团队总流水</span>";
                str += "<span style=\"width: 25%;\">结算佣金</span>";
                str += "<span style=\"width: 25%;\">总佣金余额</span>";
                str += "</li>";
                for (var i in data.extract) {
                    var team = data.extract[i];
                    str += "<li class=\"logInfor\">";
                    str += "<span style=\"width: 25%;\">" + team.date + "</span>";
                    str += "<span style=\"width: 25%;\">团队流水" + unde(team.team_money, "-") + "$</span>";
                    str += "<span style=\"width: 25%;\">佣金结算" + unde(team.team_extract, "-") + "$</span>";
                    str += "<span style=\"width: 25%;color:#f98d1f\">" + unde(team.user_extract, "-") + "$</span>";

                    str += "</li>";
                }

                $("#team_extract_list").html(str);
                fenye(reportUserPage, data.total, "report_extract", "report_extract_fy");
            }
        },
        error: function (err) {

        }
    })
}

function report_tanchuang() {

    $("#myModal").modal("show");
}

function report_trans() {
    $.ajax({
        url: "../usdtpc/Report/SysTransSelect",

        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        method: "POST",
        success: function (data) {
            if (data.code == 100) {
                var str = "";
                sys_trans = data.trans;
                for (var i in data.trans) {
                    var trans = data.trans[i];
                    str += "<option value='" + trans.type + "'>" + trans.name + "</option>";
                    if (i == 0) {
                        $("#report_tishi").text("按1比" + trans.bl + "转换成" + trans.name);
                    }
                }

                $("#report_select").html(str);

            }
        },
        error: function (err) {

        }
    })
}

function reprot_xuanze(type) {
    for (var i in sys_trans) {
        var trans = sys_trans[i];
        if (trans.type == type) {
            $("#report_tishi").text("按1比" + trans.bl + "转换成" + trans.name);
        }
    }
}

function report_qd() {
    var money = $("#reprot_input").val();
    if (parseFloat(report_team_money) < parseFloat(money)) {
        alert("输入金额不能大于佣金总和");
        return false;
    }
    var type = $("#report_select").val();
    if (typeof (type) == "undefined") {
        alert("请选择转换币种");
        return false;
    }

    $.ajax({
        url: "../usdtpc/Report/SubTeamMoneyInsert",
        data: {
            money: money,
            type: type,
            userid: userid
        },
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        method: "POST",
        success: function (data) {
            if (data.code == 100) {
                report_top();
                report_bur_money(1);
                $("#myModal").modal("hide");

            } else if (data.code == 102) {
                alert("系统未设定");
            } else if (data.code == 103) {
                alert("交易失败");
            } else if (data.code == 104) {
                alert("金额不足");
            }
        },
        error: function (err) {

        }
    })
}

function report_bur_money(reportUserPage) {
    $.ajax({
        url: "../usdtpc/Report/SubTeamMoneySelect",
        data: {
            "userid": userid,
            page: reportUserPage,
            num: reportNum
        },
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        method: "POST",
        success: function (data) {
            if (data.code == 100) {
                var str = "";
                str += "<li class=\"logList\">";
                str += "<span style=\"width: 25%;\">日期时间</span>";
                str += "<span style=\"width: 25%;\">类型</span>";
                str += "<span style=\"width: 25%;\">划转金额</span>";
                str += "<span style=\"width: 25%;\">转账账户/到账金额</span>";
                str += "</li>";
                for (var i in data.team_money) {
                    var team = data.team_money[i];
                    str += "<li class=\"logInfor\">";
                    str += "<span style=\"width: 25%;\">" + team.createtime + "</span>";

                    str += "<span style=\"width: 25%;\">转化到" + unde(team.trans_name, "-") + "钱包</span>";
                    str += "<span style=\"width: 25%;color:#f98d1f\">" + unde(team.money, "0") + "$</span>";
                    str += "<span style=\"width: 25%;\">" + unde(team.trans_name, "-") + "钱包到账" + unde(team.d_money, "0") + "" + unde(team.trans_name, "-") + "</span>";

                    str += "</li>";
                }

                $("#team_bur_list").html(str);
                fenye(reportUserPage, data.total, "report_bur_money", "report_bur_fy");
            }
        },
        error: function (err) {

        }
    })
}

function jumpPerson(userid) {
    window.location.href = "personalDetails.html?userid=" + userid;
}

