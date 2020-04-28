/**
 *聊天好友列表js
 */
/*----------------------------本页面全局变量--------------------------------*/
//用户id
var userid;
//用户token
var token;
var language;
var groupid;
var myyue = 0;
var paymoney = 0;
var owner;
var isincome = false;
var urltype = 1;
/*---------------------------------------------------------------------*/

$(function () {
    var request = new Object();
    request = GetRequest();
    urltype = request["type"];
    groupid = request["param1"];

    getGroupInfo();
    getGroupMember();
})

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

$(window).on("load", function () {
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
    } else {
        $(".weixin-tip").hide();
    }
})


var group_head = "";

/**
 *查询群详情
 */
function getGroupInfo() {
    $.ajax({
        url: "../usdtpc/subgroup/getGroupById",
        data: {
            "groupid": groupid
        },
        type: "POST",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        success: function (data) {
            if (data.code == 100) {
                group_head = data.group.groupimg;
                $("#group_head").attr("src", data.group.groupimg);
                $("#group_name").html(data.group.groupname);
                $("#group_id").html(data.group.groupid);
                $("#group_intro").html(data.group.groupintro);
                $("#group_money").html("支付$" + data.group.money + "申请入群");
                owner = data.group.owner;
                paymoney = data.group.money;
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
 *查询群成员
 */
function getGroupMember() {
    $.ajax({
        url: "../usdtpc/subgroup/getGroupUserInfo",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        data: {
            "groupid": groupid
        },
        method: "POST",
        success: function (data) {
            if (data.code == 100) {
                var result = data.group;
                grouparray = result;
                var info = "";
                var glength = 5;
                if (result.length <= 5) {
                    glength = result.length;
                }
                for (var i = 0; i < glength; i++) {
                    info += "<span> <img onerror=\"javascript:this.src='img/head.png';\" src=\"" + result[i].img + "\">";
                    info += "<p>" + result[i].nickname + "</p>"
                    info += "</span>";
                }
                for (var i = 0; i < result.length; i++) {
                    if (userid == result[i].userid) {
                        isincome = true;
                    }
                }
                $("#group_li").html(info);
            } else if (data.code == 101) {
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

function getAllMember() {
//	if (language == 2) {
//		alert("Join the group to view all group members！");
//	} else {
//	}
    alert("加入群后才能查看全部群成员哦！");
}

function jumpAppOrDown() {
    if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) { //ios判断
        window.location.href = "bcurrency://?type=" + urltype + "&param1=" + groupid; //通过app打开协议来打开app
        window.setTimeout(function () {
            window.location.href = "downApp.html"; //没有弹框打开app则打开app下载地址
        }, 5000)
    } else if (/(Android)/i.test(navigator.userAgent)) { //Android判断
        window.location.href = "bcurrency://?type=" + urltype + "&param1=" + groupid; //通过app打开协议来打开app
        window.setTimeout(function () {
            window.location.href = "downApp.html"; //没有弹框打开app则打开app下载地址
        }, 5000)
    }
}