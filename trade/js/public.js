function format(value, str) {
    if (value == null || value == "" || typeof (value) == "undefined") {
        return "";
    }
    var date = new Date(value);
    var mat = {};
    mat.M = date.getMonth() + 1; //月份记得加1
    mat.H = date.getHours();
    mat.s = date.getSeconds();
    mat.m = date.getMinutes();
    mat.Y = date.getFullYear();
    mat.D = date.getDate();
    mat.d = date.getDay(); //星期几
    mat.d = check_date(mat.d);
    mat.H = check_date(mat.H);
    mat.M = check_date(mat.M);
    mat.D = check_date(mat.D);
    mat.s = check_date(mat.s);
    mat.m = check_date(mat.m);
    if (str.indexOf("/") > -1 && str.indexOf(":") <= -1) {
        return mat.Y + "/" + mat.M + "/" + mat.D;
    }
    if (str.indexOf(":") > -1) {
        mat.Y = mat.Y.toString().substr(2, 2);
        return mat.Y + "/" + mat.M + "/" + mat.D + " " + mat.H + ":" + mat.m + ":" + mat.s;
    }
    if (str.indexOf("/") > -1) {
        return mat.Y + "/" + mat.M + "/" + mat.D + " " + mat.H + "/" + mat.m + "/" + mat.s;
    }
    if (str.indexOf("-") > -1) {
        return mat.Y + "-" + mat.M + "-" + mat.D + " " + mat.H + "-" + mat.m + "-" + mat.s;
    }
}

//检查是不是两位数字，不足补全
function check_date(str) {
    str = str.toString();
    if (str.length < 2) {
        str = '0' + str;
    }
    return str;
}

function now_date() {
    var date = new Date();
    var mat = {};
    mat.M = date.getMonth() + 1; //月份记得加1
    mat.H = date.getHours();
    mat.s = date.getSeconds();
    mat.m = date.getMinutes();
    mat.Y = date.getFullYear();
    mat.D = date.getDate();
    mat.d = date.getDay(); //星期几
    mat.d = check_date(mat.d);
    mat.H = check_date(mat.H);
    mat.M = check_date(mat.M);
    mat.D = check_date(mat.D);
    mat.s = check_date(mat.s);
    mat.m = check_date(mat.m);
    return mat.Y + "/" + mat.M + "/" + mat.D;
}

function public_time(datetime) {
    var date = new Date(datetime);
    var s = check_date(date.getHours());
    var m = check_date(date.getMinutes());
    return s + ":" + m;
}

function imgExists(e, state) {
    //默认图片
    var imgUrl = "";
    if (state == 0) {
        imgUrl = "img/head.png";
    } else if (state == 1) {
        imgUrl = "img/timg.jpg";
    } else if (state == 2) {
        imgUrl = "../img/head.png";
    }
    var img = new Image();
    img.src = imgUrl;
    //判断图片大小是否大于0 或者 图片高度与宽度都大于0
    if (img.filesize > 0 || (img.width > 0 && img.height > 0)) {
        e.src = imgUrl;
    } else {
        //默认图片也不存在的时候
    }
}

function bjtime(starttime, endtime) {
    var date = new Date();
    var datetime = date.getTime();
    if (time_to_sec(endtime) >= time_to_sec(starttime)) {
        var startDate = new Date(daysJian(0) + " " + starttime).getTime();
        var endDate = new Date(daysJian(0) + " " + endtime).getTime();
        if (startDate <= datetime && datetime <= endDate) {
            return true;
        } else {
            return false;
        }
    } else {
        var yz_endDate = new Date(daysJian(0) + " " + endtime).getTime();
        if (yz_endDate > datetime) {
            var startDate = new Date(daysJian(-1) + " " + starttime).getTime();
            var endDate = new Date(daysJian(0) + " " + endtime).getTime();
            if (startDate <= datetime && datetime <= endDate) {
                return true;
            } else {
                return false;
            }
        } else {
            var startDate = new Date(daysJian(0) + " " + starttime).getTime();
            var endDate = new Date(daysJian(1) + " " + endtime).getTime();
            if (startDate <= datetime && datetime <= endDate) {
                return true;
            } else {
                return false;
            }
        }
    }
    return false;
}

var time_to_sec = function (time) {
    var s = '';

    var hour = time.split(':')[0];
    var min = time.split(':')[1];
    var sec = time.split(':')[2];

    s = Number(hour * 3600) + Number(min * 60) + Number(sec);

    return s;
};

function daysJian(d) {
    var date = new Date(); //获取当前时间
    date.setDate(date.getDate() + d); //设置天数 +n 天
    var time = date.Format("yyyy/MM/dd");
    return time;
}

Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

function zengjia_date(datetime, minute) {
    var date = new Date(datetime); //获取当前时间
    date.setMinutes(date.getMinutes() + minute);
    var time = date.Format("yyyy/MM/dd hh:mm:ss");
    return time;
}

function chicangzhouqi(createtime) {
    var date = new Date();
    var createtimes = new Date(createtime);
    var time = (date.getTime() - createtimes.getTime()) / 1000;
    var day = Math.floor(time / (60 * 60 * 24));
    var hour = Math.floor(time / (60 * 60)) - (day * 60 * 60 * 24);
    var minute = Math.floor(time / 60) - (hour * 60) - (day * 60 * 60 * 24);
    var second = Math.floor(time) - (hour * 60 * 60) - (minute * 60) - (day * 60 * 60 * 24);
    if (day > 0) {
        return day + "天";
    }
    return hour + ":" + minute + ":" + second;
}