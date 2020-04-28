//用户id
var userid = null;
//token
var token;
//用户列表+用户消息;
var user_map = new Map();
var user_map_message = new Map();
//群组列表+群组消息;
var group_map = new Map();
var group_map_message = new Map();
//打开聊天的id
var left_html;
//打开聊天窗口类型
var webim_state = 1;
//语言包
var language;
var im_haoyou;
var im_wuming;
var im_ren;
var user_nickname;
var user_img;
var trader;
$(function () {
    userid = window.sessionStorage.getItem("userid");
    token = window.sessionStorage.getItem("token");
    language = window.localStorage.getItem("language");
    user_nickname = window.sessionStorage.getItem("nickname");
    user_img = window.sessionStorage.getItem("userimg");
    trader = window.sessionStorage.getItem("style");
    if (language != undefined && language != null & language == 2) {
        if (language == 2) {
            loadProperties();
        }
    }
    im_haoyou = "好友";
    im_wuming = "无名";
    im_ren = "人";
    if (language == 2) {
        im_haoyou = "Friends";
        im_wuming = "No nickname";
        im_ren = "people";
    }

    changHead(userid);
    huoqugongkaiqun();
    huoqutuijianqun();
    login(userid, userid);
    chaxunhaoyouliebiaoAPI(userid);
    chaxunqunzuxinxiAPI(new Array());
});

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

conn.listen({
    onOpened: function (message) {
        // 如果isAutoLogin设置为false，那么必须手动设置上线，否则无法收消息
        // 手动上线指的是调用conn.setPresence(); 如果conn初始化时已将isAutoLogin设置为true
        // 则无需调用conn.setPresence();  
        chaxunhaoyouliebiao();
        huoquyonghuqunzu();
    },
    onClosed: function (message) {
    }, //连接关闭回调
    onTextMessage: function (message) {
        console.info(message);
        message.state = 1;
        if (message.type == "chat") {
            user_message(message);
        } else {
            group_message(message);
        }
    }, //收到文本消息
    onEmojiMessage: function (message) {
    }, //收到表情消息
    onPictureMessage: function (message) {
    }, //收到图片消息
    onCmdMessage: function (message) {

    }, //收到命令消息
    onAudioMessage: function (message) {
    }, //收到音频消息
    onLocationMessage: function (message) {
    }, //收到位置消息
    onFileMessage: function (message) {
    }, //收到文件消息
    onVideoMessage: function (message) {
        var node = document.getElementById('privateVideo');
        var option = {
            url: message.url,
            headers: {
                'Accept': 'audio/mp4'
            },
            onFileDownloadComplete: function (response) {
                var objectURL = WebIM.utils.parseDownloadResponse.call(conn, response);
                node.src = objectURL;
            },
            onFileDownloadError: function () {
            }
        };
        WebIM.utils.download.call(conn, option);
    }, //收到视频消息
    onPresence: function (message) {
    }, //处理“广播”或“发布-订阅”消息，如联系人订阅请求、处理群组、聊天室被踢解散等消息
    onRoster: function (message) {
    }, //处理好友申请
    onInviteMessage: function (message) {
    }, //处理群组邀请
    onOnline: function () {
    }, //本机网络连接成功
    onOffline: function () {
    }, //本机网络掉线
    onError: function (message) {
    }, //失败回调
    onBlacklistUpdate: function (list) { //黑名单变动
        // 查询黑名单，将好友拉黑，将好友从黑名单移除都会回调这个函数，list则是黑名单现有的所有好友信息
    },
    onReceivedMessage: function (message) {
    }, //收到消息送达服务器回执
    onDeliveredMessage: function (message) {
    }, //收到消息送达客户端回执
    onReadMessage: function (message) {
    }, //收到消息已读回执
    onCreateGroup: function (message) {
    }, //创建群组成功回执（需调用createGroupNew）
    onMutedMessage: function (message) {
    } //如果用户在A群组被禁言，在A群发消息会走这个回调并且消息不会传递给群其它成员
});

function ceshi() {
    login(userid, userid);
}

function ceshi1() {
    zhuce(userid, "nick");
}

function zhuce(username, nickname) {
    var options = {
        username: username,
        password: username,
        nickname: nickname,
        appKey: WebIM.config.appkey,
        success: function () {
        },
        error: function () {
        },
        apiUrl: WebIM.config.apiURL
    };
    conn.registerUser(options);
}

function login(username, password) {
    var tokens = WebIM.utils.getCookie("webim");
    var token;
    for (var i in tokens) {
        if (i == "webim_" + username) {
            token = tokens[i];
        }
    }
    if (typeof (token) == "undefined" || token == null) {
        var options = {
            apiUrl: WebIM.config.apiURL,
            user: username,
            pwd: password,
            appKey: WebIM.config.appkey,
            success: function (token) {
                var ftoken = token.access_token;
                WebIM.utils.setCookie('webim_' + username, ftoken, 1);
            },
            error: function (err) {
            }
        };
        conn.open(options);
    } else {
        var options = {
            apiUrl: WebIM.config.apiURL,
            user: username,
            accessToken: token,
            appKey: WebIM.config.appkey
        };
        conn.open(options);
    }

}

function danliaofaxiaoxi(message, username) {
    // 单聊发送文本消息
    var id = conn.getUniqueId(); // 生成本地消息id
    var msg = new WebIM.message('txt', id); // 创建文本消息
    msg.set({
        msg: message, // 消息内容
        to: username, // 接收消息对象（用户id）
        roomType: false,
        success: function (id, serverMsgId) {

        },
        fail: function (e) {

        }
    });
    msg.body.chatType = 'singleChat';
    var json = JSON.parse("{}");
    json.state = 2;
    json.data = message;
    json.from = userid;
    json.to = username;
    user_message(json);
    conn.send(msg.body);

}

function fasongqunxiaoxi(message, group_id) {
    // 群组发送文本消息
    var id = conn.getUniqueId(); // 生成本地消息id
    var msg = new WebIM.message('txt', id); // 创建文本消息
    var option = {
        msg: message, // 消息内容
        to: group_id, // 接收消息对象(群组id)
        roomType: false,
        chatType: 'chatRoom',
        success: function () {
        },
        fail: function () {

        }
    };
    msg.set(option);
    msg.setGroup('groupchat');
    var json = JSON.parse("{}");
    json.state = 2;
    json.data = message;
    json.from = userid;
    json.to = group_id;
    group_message(json);
    conn.send(msg.body);

}

function chaxunhaoyouliebiao() {

    var hy_list = new Array();
    conn.getRoster({
        success: function (roster) {
            for (var i = 0, l = roster.length; i < l; i++) {
                var ros = roster[i];
                //ros.subscription值为both/to为要显示的联系人，此处与APP需保持一致，才能保证两个客户端登录后的好友列表一致
                if (ros.subscription === 'both' || ros.subscription === 'to') {
                    hy_list.push(ros.name);
                }
            }
            if (roster.length != 0) {
                haoyouzhanshi(hy_list);
            }
        },
    });
}

function tianjiahaoyou(username, message) {
    // 添加好友
    conn.subscribe({
        to: username,
        // Demo里面接收方没有展现出来这个message，在status字段里面
        message: message
    });
}

function huoquyonghuqunzu() {
    // 列出当前登录用户加入的所有群组
    var options = {
        success: function (resp) {
            var data = new Array();
            if (resp.count > 0) {
                for (var i in resp.data) {
                    data.push(resp.data[i].groupid);
                }
                chaxunqunzuxinxiAPI(data);
            }
        },
        error: function (e) {

        }
    };
    conn.getGroup(options);

}

var joinRoom = function (pid) {
    // 加入聊天室
    conn.joinChatRoom({
        roomId: pid,// 聊天室id
        error: function (e) {
            console.info(e);
        }
    });
};

function huoququnzuxinxi(group_id) {
    var options = {
        groupId: group_id,
        success: function (resp) {
        },
        error: function () {
        }
    };
    conn.getGroupInfo(options);
}

function qunzutianjiahaoyou(group_id, list) {
    // 加好友入群
    var option = {
        list: list,
        roomId: group_id
    };
    conn.addGroupMembers(option);

}

/**
 * @param {Object} groupname
 * @param {Object} desc
 * @param {Object} member
 * @param {Object} approval
 * @param {Object} pub
 * @param {Object} allowInvites
 */
function chuangjianqun(groupname, desc, member, approval, pub, allowInvites) {
    var options = {
        data: {
            groupname: groupname,
            desc: desc,
            members: member,
            public: pub,
            approval: approval,
            allowinvites: allowInvites
        },
        success: function (respData) {
        },
        error: function (err) {

        }
    };
    conn.createGroupNew(options);
}

function ceshi2() {
    //var list=new Array();
    //chuangjianqun("中文","什么都没有",list,true,true);
    huoquyonghuqunzu();
}

function user_message(json) {
    if (json.state == 1) {
        var message = user_map_message.get(json.from);
        if (typeof (message) != 'undefined') {
            message.push(json);
            user_map_message.set(json.from, message);
        } else {
            var array = new Array();
            array.push(json);
            user_map_message.set(json.from, array);
        }
        if (json.from == left_html || json.from == userid) {
            append_zhanshi(json);
        }
    } else {
        var message = user_map_message.get(json.to);
        if (typeof (message) != 'undefined') {
            message.push(json);
            user_map_message.set(json.to, message);
        } else {
            var array = new Array();
            array.push(json);
            user_map_message.set(json.to, array);
        }
        if (json.to == left_html) {
            append_zhanshi(json);
        }
    }

}

function group_message(json) {
    if (json.errorCode != "406") {
        var user = user_map.get(json.to);
        if (typeof (user) == "undefined") {
            chaxunhaoyouliebiaoAPI(json.from);
        }
        if (json.state == 1) {
            var message = group_map_message.get(json.to);
            if (typeof (message) != 'undefined') {
                message.push(json);
                group_map_message.set(json.to, message);
            } else {
                var array = new Array();
                array.push(json);
                group_map_message.set(json.to, array);
            }

            if (json.to == left_html) {
                append_zhanshi(json);
            }
        } else {
            var message = group_map_message.get(json.to);
            if (typeof (message) != 'undefined') {
                message.push(json);
                group_map_message.set(json.to, message);
            } else {
                var array = new Array();
                array.push(json);
                group_map_message.set(json.to, array);
            }
            if (json.to == left_html) {
                append_zhanshi(json);
            }
        }
    }
}

function chaxunhaoyouliebiaoAPI(userid) {
    if (typeof (token) != "undefined" && token != null) {
        $.ajax({
            url: "../usdtpc/subfriend/SubFriendSelect",
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', token);
            },
            data: {
                userid: userid
            },
            method: "POST",
            success: function (data) {
                if (data.code == 100) {
                    for (var i in data.friend) {
                        user_map.set(data.friend[i].sub_user_id, data.friend[i]);
                    }
                    chaxunhaoyouliebiao();
                } else {
                    window.location.href = "login/login.html";
                }
            },
            error: function (err) {
                window.location.href = "login/login.html";
            }
        });
    }
}

function chaxunqunzuxinxiAPI(array) {
    if (typeof (token) != "undefined" && token != null) {
        $.ajax({
            url: "../usdtpc/subgroup/SubGroupSelect",
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', token);
            },
            data: {
                pid: array,
                userid: userid
            },
            method: "POST",
            success: function (data) {
                if (data.code == 100) {
                    var array2 = new Array();
                    for (var i in data.group) {
                        array2.push(data.group[i].pid);
                        group_map.set(data.group[i].pid, data.group[i]);
                    }
                    qunzuzhanshi(array2);
                } else {
                    window.location.href = "login/login.html";
                }
            },
            error: function (err) {
                window.location.href = "login/login.html";
            }
        });
    }
}

function haoyouzhanshi(list) {
    var str = "";
    for (var i in list) {
        var json = user_map.get(list[i]);
        str += "<li  onclick='zhanshiliaotian(\"" + list[i] + "\",1)'>";
        str += "<div class=\"friendLIst\">";
        if (typeof (json) != "undefined") {
            var img = json.img;
            if (typeof (img) == "undefined") {
                img = "img/head.png";
            }
            str += "<img src=\"" + img + "?timestamp=" + (new Date()).valueOf() + "\" onerror='imgExists(this,0)'>";
        } else {
            str += "<img src=\"img/head.png\">";
        }

        str += "<div>";
        if (typeof (json) != "undefined") {
            str += "<p>" + json.nickname + "</p>";
        } else {
            str += "<p>" + im_wuming + "</p>";
        }
        str += "<span></span>";
        str += "</div>";
        str += "</div>";
        str += "</li>";
    }
    $("#right_haoyou_list").html(str);
}

function qunzuzhanshi(list) {
    var str = "";
    for (var i in list) {
        var json = group_map.get(list[i]);
        str += "<li onclick='zhanshiliaotian(\"" + list[i] + "\",2)'>";
        str += "<div class=\"friendLIst\">";
        if (typeof (json) != "undefined") {
            var img = json.img;
            if (typeof (img) == "undefined") {
                img = "img/head.png";
            }
            str += "<img src=\"" + img + "?timestamp=" + (new Date()).valueOf() + "\" onerror='imgExists(this,0)'>";
        } else {
            str += "<img src=\"img/head.png\">";
        }

        str += "<div>";
        if (typeof (json) != "undefined") {
            str += "<p>" + json.name + "</p>";
        } else {
            str += "<p>" + im_wuming + "</p>";
        }
        str += "<span></span>";
        str += "</div>";
        str += "</div>";
        str += "</li>";
    }
    $("#right_qunzu_list").html(str);
}

function zhanshiliaotian(pid, state) {
    $("#qd").attr("disabled", false);
    left_html = pid;
    webim_state = state;
    $("#left_liaotian_list").html("");
    if (state == 1) {
        var token = user_map.get(pid);
        if (typeof (token) != "undefined" && token != null) {
            $("#nickname").text(token.nickname);
            $("#user_num").text(im_haoyou);
        } else {
            $("#nickname").text(im_wuming);
            $("#user_num").text(im_haoyou);
        }
        var json = user_map_message.get(pid);
        var str = "";
        if (typeof (json) != "undefined") {
            if (json.length > 0) {
                for (var i in json) {
                    var user;
                    if (json[i].state == 1) {

                        if (json[i].from != userid) {
                            str += "<div class=\"chatList\">";
                            user = user_map.get(json[i].from);
                        } else {

                            str += "<div class=\"chatList rightChant\">";

                            user = {
                                "nickname": user_nickname,
                                "img": user_img
                            };
                        }
                    } else {
                        str += "<div class=\"chatList rightChant\">";
                        user = {
                            "nickname": user_nickname,
                            "img": user_img
                        };
                    }
                    console.info(user);
                    if (typeof (user) != "undefined") {
                        str += "<img src=\"" + user.img + "?timestamp=" + (new Date()).valueOf() + "\" onerror='imgExists(this,0)'>";
                        str += "<div class=\"chantBox\">";
                        str += "<p class=\"name\">" + user.nickname + "</p>";
                    } else {
                        str += "<img src=\"img/head.png\">";
                        str += "<div class=\"chantBox\">";
                        str += "<p class=\"name\">" + im_wuming + "</p>";
                    }

                    str += "<div class=\"chantFont\">" + json[i].data + "</div>";
                    str += "</div>";
                    str += "</div>";
                }
                $("#left_liaotian_list").html(str);
                $('#left_liaotian_list').scrollTop($('#left_liaotian_list')[0].scrollHeight);
            }
        }

    } else {
        chaxunhaoyouliebiaoAPI(pid);
        var token = group_map.get(pid);
        console.log("1:" + token);
        if (typeof (token) != "undefined" && token != null) {
            $("#nickname").text(token.name);
            $("#user_num").text(token.num + im_ren);
        } else {
            console.log("2:");
            var t = 0;
            for (var i in tuijianqun) {
                if (tuijianqun[i].pid == pid) {
                    console.log("2:" + pid);
                    $("#nickname").text(tuijianqun[i].name);
                    $("#user_num").text(tuijianqun[i].num + im_ren);
                    t += 1;
                    break;
                }
            }
            for (var i in gongkaiqun) {
                if (gongkaiqun[i].pid == pid) {
                    console.log("3:" + pid);
                    $("#nickname").text(gongkaiqun[i].name);
                    $("#user_num").text(gongkaiqun[i].num + im_ren);
                    t += 1;
                    break;
                }
            }
            if (t == 0) {
                $("#nickname").text(im_wuming);
                $("#user_num").text("1" + im_ren);
            }

        }
        var json = group_map_message.get(pid);
        var str = "";
        if (typeof (json) != "undefined") {
            if (json.length > 0) {
                for (var i in json) {
                    if (json[i].state == 1) {
                        if (json[i].from != userid) {
                            str += "<div class=\"chatList\">";
                        } else {
                            str += "<div class=\"chatList rightChant\">";
                        }
                    } else {
                        str += "<div class=\"chatList rightChant\">";
                    }
                    var user = user_map.get(json[i].from);
                    console.info(json[i].from);
                    if (typeof (user) != "undefined") {
                        str += "<img src=\"" + user.img + "?timestamp=" + (new Date()).valueOf() + "\"  onerror='imgExists(this,0)'>";
                        str += "<div class=\"chantBox\">";
                        str += "<p class=\"name\">" + user.nickname + "</p>";
                    } else {
                        str += "<img src=\"img/head.png\">";
                        str += "<div class=\"chantBox\">";
                        str += "<p class=\"name\">" + im_wuming + "</p>";
                    }

                    str += "<div class=\"chantFont\">" + json[i].data + "</div>";
                    str += "</div>";
                    str += "</div>";
                }
                $("#left_liaotian_list").html(str);
                $('#left_liaotian_list').scrollTop($('#left_liaotian_list')[0].scrollHeight);
            }
        }
    }
}

function append_zhanshi(json) {
    var str = "";
    var user;
    if (json.state == 1) {
        if (json.from != userid) {
            str += "<div class=\"chatList\">";
            user = user_map.get(json.from);
        } else {
            str += "<div class=\"chatList rightChant\">";
            user = {
                "nickname": user_nickname,
                "img": user_img
            };
        }

    } else {
        str += "<div class=\"chatList rightChant\">";
        user = {
            "nickname": user_nickname,
            "img": user_img
        };
    }

    if (typeof (user) != "undefined") {
        str += "<img src=\"" + user.img + "?timestamp=" + (new Date()).valueOf() + "\"  onerror='imgExists(this,0)'>";
        str += "<div class=\"chantBox\">";
        str += "<p class=\"name\">" + user.nickname + "</p>";
    } else {
        str += "<img src=\"img/head.png\">";
        str += "<div class=\"chantBox\">";
        str += "<p class=\"name\">" + im_wuming + "</p>";
    }

    str += "<div class=\"chantFont\">" + json.data + "</div>";
    str += "</div>";
    str += "</div>";

    $("#left_liaotian_list").append(str);
    $('#left_liaotian_list').scrollTop($('#left_liaotian_list')[0].scrollHeight);
}

//发送消息
function fsxl() {
    var message = $("#message").val();
    if (message == null || message == '') {

    } else {
        if (webim_state == 1) {
            danliaofaxiaoxi(message, left_html);
        } else {
            if (group_map.get(left_html) != null && group_map.get(left_html) != '' && group_map.get(left_html) != "undefind") {
                if (group_map.get(left_html).state == "0") {
                    fasongqunxiaoxi(message, left_html);
                } else {
                    if (trader > 3) {
                        fasongqunxiaoxi(message, left_html);
                    } else {
                        $("#xg_qd").hide();
                        $("#myModalLabel").html("V4等级以上才可发送消息");
                        $("#myModal").modal("show");
                    }
                }
            } else {
                if (trader > 3) {
                    fasongqunxiaoxi(message, left_html);
                } else {
                    $("#xg_qd").hide();
                    $("#myModalLabel").html("V4等级以上才可发送消息");
                    $("#myModal").modal("show");
                }
            }
        }
    }
    $("#message").val("");
}

var gongkaiqun;

function huoqugongkaiqun() {
    $.ajax({
        url: "../usdtpc/subgroup/SubGroupTop",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        method: "POST",
        data: {
            top: 1,
            state: 1
        },
        success: function (data) {
            var str = "";
            if (data.code == 100) {
                gongkaiqun = data.group;
                for (var i in data.group) {
                    var group = data.group[i];
                    var img = group.img;
                    if (typeof (img) == "undefined" || img == null || img == "") {
                        img = "img/head.png";
                    }
                    str += "<div class=\"swiper-slide\" style=\"background:url('" + img + "'); background-repeat:no-repeat; background-size:100% 100%;-moz-background-size:100% 100%;\" onclick='add_group(\"" + group.pid + "\")'><span></span></div>";

                }
                $("#webImTop").html(str);
                xuanzhuan();
            } else {
                window.location.href = "login/login.html";
            }
        },
        error: function (err) {
            window.location.href = "login/login.html";
        }
    });

}

var tuijianqun;

function huoqutuijianqun() {
    $.ajax({
        url: "../usdtpc/subgroup/SubGroupTop",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        method: "POST",
        data: {
            state: 0,
            top: 1
        },
        success: function (data) {
            var str = "";
            if (data.code == 100) {
                tuijianqun = data.group;
                for (var i in data.group) {
                    var group = data.group[i];
                    var img = group.img;
                    if (typeof (img) == "undefined" || img == null || img == "") {
                        img = "img/head.png";
                    }
                    str += "<div class=\"swiper-slide\"onclick=\"group_tianjia('" + group.pid + "','" + group.money + "','" + group.userid + "','" + group.name + "')\">";
                    str += "<div class=\"slideBox\">";
                    str += "<img src=\"" + img + "\" onerror='imgExists(this,0)'>";
                    str += "<div class=\"slidetest\">";
                    str += "<p>" + group.name;
                    str += "<span>";
                    str += " <i></i>" + group.num + "</span>";
                    str += "</p>";
                    var memo = group.intro;
                    if (typeof (memo) == "undefined" || memo == null) {
                        memo = "";
                    }
                    str += "<span class=\"slideCon\">" + memo + "</span>";
                    str += "</div>";
                    str += "</div>";
                    str += "</div>";
                }
                $("#webImState").html(str);
                xuanzhuan();
            } else {
                window.location.href = "login/login.html";
            }
        },
        error: function (err) {
            window.location.href = "login/login.html";
        }
    });
}

function add_group(pid) {
    console.info(group_map.get(pid) != undefined);
    if (typeof (group_map.get(pid)) != "undefined") {
        yonghujialiaotianshi(pid);
        zhanshiliaotian(pid, 2);
    } else {
        //加群
        yonghujialiaotianshi(pid);
        sub_friend(pid, 1);
        var list = new Array();
        list.push(pid);
        chaxunqunzuxinxiAPI(list);
        huoquyonghuqunzu();
        zhanshiliaotian(pid, 2);
    }
}

function sub_friend(sub_user_id, state) {
    $.ajax({
        url: "../usdtpc/subfriend/SubFriendInsert",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        method: "POST",
        data: {
            state: state,
            userid: sub_user_id,
            sub_user_id: userid
        },
        success: function (data) {

        },
        error: function (err) {

        }
    })
}

var dj_group_pid;
var dj_group_money;
var dj_group_userid;

function group_tianjia(pid, money, userid, group_name) {
    dj_group_pid = pid;
    dj_group_money = money;
    dj_group_userid = userid;
    var options = {
        success: function (resp) {
            var state = false;
            for (var i in resp.data) {
                var group = resp.data[i];
                if (pid == group.groupid) {
                    state = true;
                }
            }

            if (state) {
                zhanshiliaotian(pid, 2);
            } else {

                getUserInfoById(group_name, money);
            }

        },
        error: function (e) {
            console.info(e);
        }
    };
    conn.getGroup(options);

}

function yonghujiaqun() {
    $("#xg_qd").hide();
    $.ajax({
        url: "../usdtpc/HuanXin/QunZu",
        data: {
            "group": dj_group_pid,
            "userid": userid
        },
        method: "GET",
        success: function (data) {
            if (data.code == 100) {
                charu();
            } else {
                $("#myModalLabel").html("添加失败");
                $("#myModal").modal("show");
            }
        }

    })
}

function yonghujialiaotianshi(group_pid) {
    $("#xg_qd").hide();
    $.ajax({
        url: "../usdtpc/HuanXin/LiaoTianShi",
        data: {
            "group": group_pid,
            "userid": userid
        },
        method: "GET",
        success: function (data) {
            if (data.code == 100) {

            } else {
                $("#myModalLabel").html("添加失败");
                $("#myModal").modal("show");
            }
        }

    })
}

function xuanzhuan() {
    var swiper = new Swiper('.swiper-container', {
        slidesPerView: 2,
        autoplay: true,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
    });
    var swiper = new Swiper('.swiper-container2', {
        slidesPerView: 4,
        // autoplay: true,
        spaceBetween: 15,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
    });
}

function getUserInfoById(group_name, money) {
    $.ajax({
        url: "../usdtpc/auth/getUserInfoById",
        data: {
            "userid": userid
        },
        method: "POST",
        success: function (data) {
            if (data.code == 100) {
                if (data.user.surplus < money) {
                    $("#myModalLabel").html("余额不足");
                    $("#myModal").modal("show");
                } else {
                    $("#xg_qd").show();
                    $("#myModalLabel").html("<p>确定要向群：" + group_name + " 发送入群申请？</p><p>需要支付费用：$" + money + ",当前余额：$" + data.user.surplus + "</p>");
                    $("#myModal").modal("show");
                }
            }
        }
    })
}

function charu() {
    $.ajax({
        url: "../usdtpc/friendrequest/addFriendRequest",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        data: {
            "userid": dj_group_pid,
            "proposer": userid,
            "type": "1",
            "paymoney": dj_group_money,
            "owner": dj_group_userid
        },
        method: "POST",
        success: function (data) {
            if (data.code == 100) {
                $("#myModalLabel").html("添加成功");
                zhanshiliaotian(dj_group_pid, 2);
            }
        }
    })
}

$(function () {
    $("textarea").keydown(function (event) {
        if (event.keyCode == "13") {
            fsxl();
        }
    });
});