/**
 * 新闻列表JS
 */
/*----------------------------本页面全局变量--------------------------------*/
//用户id
var userid = null;
//token
var token;
//语言类型
var language;
//下单当前页码
var page = 1;
//下单每页展示条数
var number = 10;
//下单共多少页
var totalpage = 1;
//下单总条数
var total = 0;
var jumptype;
/*---------------------------------------------------------------------*/
$(function () {
    userid = window.sessionStorage.getItem("userid");
    token = window.sessionStorage.getItem("token");
    var request = new Object();
    request = GetRequest();
    jumptype = request["jumptype"];
    changHead(userid);
    getNewsClass();
    language = window.localStorage.getItem("language");
    if (language != undefined && language != null & language == 2) {
        loadProperties();
    }
});

function a() {
    $(".leftsidebar_box dd").hide();
    $(".leftsidebar_box dt").click(function () {
        $(this).parent().parent().find('dt').removeClass("Inforactive");
        let imgs = $(this).parent().parent().find('img');
        for (var i = 0; i < imgs.length; i++) {
            $(imgs).eq(i).attr('src', $(imgs).eq(i).attr('src').replace('C.', '.'));
        }
        // imgs.forEach(element => {
        //   element.attr('src',element.attr('src').replace('C.','.'))
        // });
        // $(this).parent().parent().find('img').attr('src',$(this).parent().parent().find('img').attr('src').replace('C.','.'));
        $(this).addClass("Inforactive");
        $(this).parent().find('dd').removeClass("menu_chioce");
        let imgsrc = $(this).parent().find('img').attr('src');
//	    $(this).parent().find('img').attr('src',imgsrc.replace('.','C.'));
        $(".menu_chioce").slideUp();
        $(this).parent().find('dd').slideToggle();
        $(this).parent().find('dd').addClass("menu_chioce");
    });
}

/**
 * 获取新闻分类
 */
function getNewsClass() {
    $.ajax({
        url: "../usdtpc/auth/getClassByStyle",
        data: {"style": 0},
        method: "GET",
        success: function (data) {
            if (data.code == 100) {
                var info = "";
                for (var i = 0; i < data.sysclass.length; i++) {
                    if (i == 0) {
                        if (language == 2) {
                            info += "<dl class=\"system_log\"><dt class=\"Inforactive\" onClick=\"getNewsByClass('" + data.sysclass[i].pid + "',1)\">";
                            info += "<span></span>" + unde(data.sysclass[i].y_name, "") + "</dt></dl>";
                        } else {
                            info += "<dl class=\"system_log\"><dt class=\"Inforactive\" onClick=\"getNewsByClass('" + data.sysclass[i].pid + "',1)\">";
                            info += "<span></span>" + unde(data.sysclass[i].name, "") + "</dt></dl>";
                        }
                    } else {
                        if (language == 2) {
                            info += "<dl class=\"custom\"><dt onClick=\"getNewsByClass('" + data.sysclass[i].pid + "',1)\">";
                            info += "<span></span>" + unde(data.sysclass[i].y_name, "") + "</dt></dl>";
                        } else {
                            info += "<dl class=\"custom\"><dt onClick=\"getNewsByClass('" + data.sysclass[i].pid + "',1)\">";
                            info += "<span></span>" + unde(data.sysclass[i].name, "") + "</dt></dl>";
                        }
                    }
                }
                if (language == 2) {
                    info += "<dl  class=\"custom\"><dt id=\"kx_24\" onClick=\"getSysNewsFlash(1)\">";
                    info += "<span></span>24-hour newsletter</dt></dl>";
                } else {
                    info += "<dl  class=\"custom\"><dt id=\"kx_24\" onClick=\"getSysNewsFlash(1)\">";
                    info += "<span></span>快讯报道</dt></dl>";
                }
                $("#news_class_li").html(info);

                a();
                if (jumptype == 1) {

                    $("#kx_24").click();
                } else {
                    getNewsByClass(data.sysclass[0].pid, 1);
                }
            } else if (data.code == 101) {
                $("#news_class_li").html("");
                //alert("系统中未找到匹配的记录");
            } else {
                //alert("不好意思，请求失败了请刷新页面！");
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

/**
 * 根据分类查询新闻
 * @param classid
 */
function getNewsByClass(sys_class_id, currentpage) {
    page = currentpage;
    $.ajax({
        url: "../usdtpc/auth/getSysNewsByClass",
        data: {"sys_class_id": sys_class_id, "page": page, "number": number},
        method: "GET",
        success: function (data) {
            if (data.code == 100) {
                var info = "";
                for (var i = 0; i < data.news.length; i++) {
                    if (language == 2) {
                        info += "<li><div onclick=\"jumpNewsDetail('" + data.news[i].pid + "')\" class=\"newsBox\"><img onerror=\"javascript:this.src='img/news.png';\" src=\"" + data.news[i].img + "\" >";
                        info += "<div class=\"newTxt\"><h3>" + unde(data.news[i].y_title, "") + "</h3><p>";
                        info += "<img onerror=\"javascript:this.src='img/head.png';\" src=\"" + data.news[i].userimg + "\"><span>" + unde(data.news[i].nickname, "") + "</span>";
                        info += "<span>" + unde(data.news[i].amount, 0) + "浏览</span><span>" + data.news[i].createtime + "</span>";
                        info += "</p></div></div></li>";

                    } else {
                        info += "<li><div class=\"newsBox\" onclick=\"jumpNewsDetail('" + data.news[i].pid + "')\"><img onerror=\"javascript:this.src='img/news.png';\" src=\"" + data.news[i].img + "\" >";
                        info += "<div class=\"newTxt\"><h3>" + unde(data.news[i].title, "") + "</h3><p>";
                        info += "<img onerror=\"javascript:this.src='img/head.png';\" src=\"" + data.news[i].userimg + "\"><span>" + unde(data.news[i].nickname, "") + "</span>";
                        info += "<span>" + unde(data.news[i].amount, 0) + "浏览</span><span>" + data.news[i].createtime + "</span>";
                        info += "</p></div></div></li>";
                    }
                }
                $("#new_li").html(info);
                totalpage = Math.ceil(data.total / number);
                totalnumber = data.total;
                showNewsPage(sys_class_id);
            } else if (data.code == 101) {
                $("#new_li").html("");
                totalpage = 0;
                totalnumber = 0;
                showNewsPage(sys_class_id);
                //alert("系统中未找到匹配的记录");
            } else {
                //alert("不好意思，请求失败了请刷新页面！");
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

/**
 * 获取24小时快讯
 */
function getSysNewsFlash(p) {
    page = p;
    $.ajax({
        url: "../usdtpc/auth/getSysNewsFlash",
        data: {"page": p, "number": 10},
        method: "GET",
        success: function (data) {
            if (data.code == 100) {
                var info = "";
                for (var i = 0; i < data.news.length; i++) {
                    if (language == 2) {
                        info += "<li><div onclick=\"jumpNewsDetail('" + data.news[i].pid + "')\" class=\"newsBox\">";
                        info += "<div class=\"newTxt\"><h3>" + unde(data.news[i].y_title, "") + "</h3><p>";
                        info += "<img onerror=\"javascript:this.src='img/head.png';\" src=\"" + data.news[i].userimg + "\"><span>" + unde(data.news[i].nickname, "") + "</span>";
                        info += "<span>" + unde(data.news[i].amount, 0) + "浏览</span><span>" + data.news[i].createtime + "</span>";
                        info += "</p></div></div></li>";

                    } else {
                        info += "<li><div class=\"newsBox\" onclick=\"jumpNewsDetail('" + data.news[i].pid + "')\">";
                        info += "<div class=\"newTxt\"><h3>" + unde(data.news[i].title, "") + "</h3><p>";
                        info += "<img onerror=\"javascript:this.src='img/head.png';\" src=\"" + data.news[i].userimg + "\"><span>" + unde(data.news[i].nickname, "") + "</span>";
                        info += "<span>" + unde(data.news[i].amount, 0) + "浏览</span><span>" + data.news[i].createtime + "</span>";
                        info += "</p></div></div></li>";
                    }
                }
                $("#new_li").html(info);
                totalpage = Math.ceil(data.total / number);
                totalnumber = data.total;
                show24NewsPage();
            } else if (data.code == 101) {
                //alert("系统中未找到匹配的记录");
            } else {
                //alert("不好意思，请求失败了请刷新页面！");
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

function jumpNewsDetail(newsid) {
    window.location.href = "newsMessage.html?pid=" + newsid;
}

function showNewsPage(sys_class_id) {
    //之前需要将，上一页创建出来
    if (totalpage <= 5) {
        //总页数在0到5之间时，显示实际的页数
        for (var i = 1; i <= totalpage; i++) {
            $("#page_" + i).html("<a href=\"javascript:getNewsByClass('" + sys_class_id + "'," + i + ");\">" + i + "</a>");
        }
    } else if (totalpage > 5 && page <= 5) {//总页数大于5时，只显示五页，多出的隐藏
        //判断当前页的位置
        if (page <= 3) {//当前页小于等于3时，显示1-5
            for (var i = 1; i <= 5; i++) {
                $("#page_" + i).html("<a href=\"javascript:getNewsByClass('" + sys_class_id + "'," + i + ");\">" + i + "</a>");
            }
        }
    } else if (page > (totalpage - 5)) {//当前页为最后五页时
        for (var i = totalpage - 4, j = 1; i <= totalpage, j <= 5; i++, j++) {
            $("#page_" + j).html("<a href=\"javascript:getNewsByClass('" + sys_class_id + "'," + i + ");\">" + i + "</a>");
        }
    } else {//当前页为中间时
        for (var i = (page - 2), j = 1; i <= (page + 2), j <= 5; i++, j++) {
            $("#page_" + j).html("<a href=\"javascript:getNewsByClass('" + sys_class_id + "'," + i + ");\">" + i + "</a>");
        }
    }
    if (page <= 1) {
        $("#prev_page").html("<a href=\"javascript:getNewsByClass('" + sys_class_id + "',1);\" aria-label=\"Previous\"><span aria-hidden=\"true\">上一页</span></a>");
    } else {
        $("#prev_page").html("<a href=\"javascript:getNewsByClass('" + sys_class_id + "'," + (page - 1) + ");\" aria-label=\"Previous\"><span aria-hidden=\"true\">上一页</span></a>");
    }
    if (page >= totalpage) {
        $("#next_page").html("<a href=\"javascript:getNewsByClass('" + sys_class_id + "'," + totalpage + ");\" aria-label=\"Next\"><span aria-hidden=\"true\">下一页</span></a>");
    } else {
        $("#next_page").html("<a href=\"javascript:getNewsByClass('" + sys_class_id + "'," + (page + 1) + ");\" aria-label=\"Next\"><span aria-hidden=\"true\">下一页</span></a>");
    }
}

function show24NewsPage() {
    //之前需要将，上一页创建出来
    if (totalpage <= 5) {
        //总页数在0到5之间时，显示实际的页数
        for (var i = 1; i <= totalpage; i++) {
            $("#page_" + i).html("<a href=\"javascript:getSysNewsFlash(" + i + ");\">" + i + "</a>");
        }
    } else if (totalpage > 5 && page <= 5) {//总页数大于5时，只显示五页，多出的隐藏
        //判断当前页的位置
        if (page <= 3) {//当前页小于等于3时，显示1-5
            for (var i = 1; i <= 5; i++) {
                $("#page_" + i).html("<a href=\"javascript:getSysNewsFlash(" + i + ");\">" + i + "</a>");
            }
        }
    } else if (page > (totalpage - 5)) {//当前页为最后五页时
        for (var i = totalpage - 4, j = 1; i <= totalpage, j <= 5; i++, j++) {
            $("#page_" + j).html("<a href=\"javascript:getSysNewsFlash(" + i + ");\">" + i + "</a>");
        }
    } else {//当前页为中间时
        for (var i = (page - 2), j = 1; i <= (page + 2), j <= 5; i++, j++) {
            $("#page_" + j).html("<a href=\"javascript:getSysNewsFlash(" + i + ");\">" + i + "</a>");
        }
    }
    if (page <= 1) {
        $("#prev_page").html("<a aria-label=\"Previous\"><span aria-hidden=\"true\">上一页</span></a>");
    } else {
        $("#prev_page").html("<a href=\"javascript:getSysNewsFlash(" + (page - 1) + ");\" aria-label=\"Previous\"><span aria-hidden=\"true\">上一页</span></a>");
    }
    if (page >= totalpage) {
        $("#next_page").html("<a aria-label=\"Next\"><span aria-hidden=\"true\">下一页</span></a>");
    } else {
        $("#next_page").html("<a href=\"javascript:getSysNewsFlash(" + (page + 1) + ");\" aria-label=\"Next\"><span aria-hidden=\"true\">下一页</span></a>");
    }
}