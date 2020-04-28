/**
 * 交易完成动态JS
 */
/*----------------------------本页面全局变量--------------------------------*/
//用户id
var userid = null;
//token
var token;
//语言类型
var language;
//当前页码
var page = 1;
//每页展示条数
var number = 10;
//共多少页
var totalpage = 1;
//总条数
var total = 0;
/*---------------------------------------------------------------------*/
$(function () {
    userid = window.sessionStorage.getItem("userid");
    token = window.sessionStorage.getItem("token");
    changHead(userid);
    getSubOrderByPage(page);
    language = window.localStorage.getItem("language");
    if (language != undefined && language != null & language == 2) {
        loadProperties();
    }
});

/**
 * 分页查询订单
 */
function getSubOrderByPage(currentpage) {
    page = currentpage;
    $.ajax({
        url: "../usdtpc/auth/getSubOrderSortDesc",
        data: {"page": currentpage, "number": number},
        method: "POST",
        success: function (data) {
            if (data.code == 100) {
                var info = "";
                for (var i = 0; i < data.suborder.length; i++) {
                    if (language == 2) {
                        info += "<li><div class=\"leftTrade\"><div class=\"inforB\"><p class=\"firstInfo\" onclick=\"jumpPerson('" + data.suborder[i].userid + "')\">";
                        info += "<img src=\"" + data.suborder[i].img + "\" onerror=\"javascript:this.src='img/head.png';\"><span>" + data.suborder[i].nickname + "</span></p>";
                        info += "<p><input readonly class=\"dayS\" value=\"" + data.suborder[i].startnum + "\" type=\"text\" title=\"\"></p></div></div>";
                        info += "<div class=\"rightTrade\">";
                        if (data.suborder[i].style == 1) {
                            info += "<span>BQU</span>";
                        } else {
                            info += "<span>AQU</span>";
                        }
                        if (language == 2) {
                            info += "<span>" + unde(data.suborder[i].y_name, "") + "</span>";
                        } else {
                            info += "<span>" + unde(data.suborder[i].currencyname, "") + "</span>";
                        }
                        if (data.suborder[i].style == 1) {
                            info += "<span></span>";
                        } else {
                            info += "<span>M" + data.suborder[i].minute + "</span>";
                        }
                        if (data.suborder[i].style == 1) {
                            info += "<span>surplus stop-loss" + data.suborder[i].range + "%</span>";
                        } else {
                            info += "<span>Win loss" + data.suborder[i].range + "%</span>";
                        }

                        //						if(data.suborder[i].er>0){
                        //							info+="<span>Profit "+data.suborder[i].er+"%</span>";
                        //						}else{
                        //							info+="<span>Loss"+Math.abs(data.suborder[i].er)+"%</span>";
                        //						}
                        if (data.suborder[i].rise_fall != 1) {
                            info += "<span class=\"greenColor\">Going long</span>";
                        } else {
                            info += "<span class=\"redColor\">To buy</span>";
                        }
                        info += "<span>买入量" + unde(data.suborder[i].purchase, 0) + "/$</span>";
                        if (data.suborder[i].income >= 0) {
                            info += "<span class=\"orangeColor\">Profit</span><span class=\"greenColor\">+" + unde(data.suborder[i].income, 0) + "/$</span>";
                        } else {
                            info += "<span class=\"orangeColor\">Loss</span><span class=\"redColor\">-" + Math.abs(unde(data.suborder[i].income, 0)) + "/$</span>";
                        }
                        var date = new Date(data.suborder[i].createtime);
                        var createtime = date.Format("HH:mm:ss");
                        info += "<span>" + createtime + "</span></div></li>";
                    } else {
                        info += "<li><div class=\"leftTrade\"><div class=\"inforB\"><p class=\"firstInfo\" onclick=\"jumpPerson('" + data.suborder[i].userid + "')\">";
                        info += "<img src=\"" + data.suborder[i].img + "\" onerror=\"javascript:this.src='img/head.png';\"><span>" + data.suborder[i].nickname + "</span></p>";
                        info += "<p><input readonly class=\"dayS\" value=\"" + data.suborder[i].startnum + "\" type=\"text\" title=\"\"></p></div></div>";
                        info += "<div class=\"rightTrade\">";
                        if (data.suborder[i].style == 1) {
                            info += "<span>BQU</span>";
                        } else {
                            info += "<span>AQU</span>";
                        }
                        if (language == 2) {
                            info += "<span>" + data.suborder[i].y_name + "</span>";
                        } else {
                            info += "<span>" + data.suborder[i].currencyname + "</span>";
                        }
                        if (data.suborder[i].style == 1) {
                            info += "<span></span>";
                        } else {
                            info += "<span>M" + data.suborder[i].minute + "</span>";
                        }
                        if (data.suborder[i].style == 1) {
                            info += "<span>止盈止损" + unde(data.suborder[i].range, 0) + "%</span>";
                        } else {
                            info += "<span>赢损值" + unde(data.suborder[i].range, 0) + "%</span>";
                        }
                        //						if(data.suborder[i].er>0){
                        //							info+="<span>盈利"+data.suborder[i].er+"%</span>";
                        //						}else{
                        //							info+="<span>亏损"+Math.abs(data.suborder[i].er)+"%</span>";
                        //						}
                        if (data.suborder[i].rise_fall != 1) {
                            info += "<span class=\"greenColor\">买涨</span>";
                        } else {
                            info += "<span class=\"redColor\">买跌</span>";
                        }
                        info += "<span>买入量" + unde(data.suborder[i].purchase, 0) + "/$</span>";
                        if (data.suborder[i].income >= 0) {
                            info += "<span class=\"orangeColor\">盈利</span><span class=\"greenColor\">+" + unde(data.suborder[i].income, 0) + "/$</span>";
                        } else {
                            info += "<span class=\"orangeColor\">亏损</span><span class=\"redColor\">-" + Math.abs(unde(data.suborder[i].income, 0)) + "/$</span>";
                        }
                        var date = new Date(data.suborder[i].createtime);
                        var createtime = date.Format("HH:mm:ss");
                        info += "<span>" + createtime + "</span></div></li>";
                    }
                }
                $("#tradeEndDynamic_list").html(info);
                $(".dayS").rating({
                    min: 0, max: 5, step: 0.5, size: "xl", stars: "5", showClear: false
                });
                totalpage = Math.ceil(data.total / number);
                totalnumber = data.total;
                showPage();
            } else if (data.code == 101) {
                alert("系统中未找到匹配的记录");
            } else {
                alert("不好意思，请求失败了请刷新页面！");
            }
        }, error: function (XMLHttpRequest, textStatus, errorThrown) {
            if (Number(XMLHttpRequest.status) != 0 && XMLHttpRequest.readyState != 0 && textStatus != "error" && errorThrown.length != 0) {
                alert("网络异常，请您检查网络后刷新页面！");
            } else if ("timeout" == textStatus && "timeout" == errorThrown) {
                alert("请求超时，请您检查网络后刷新页面！");
            } else {
                alert("网络异常，请您检查网络后刷新页面！");
            }
        }
    });
}

function jumpPerson(userid) {
    window.location.href = "personalDetails.html?userid=" + userid;
}

function showPage() {
    //之前需要将，上一页创建出来
    if (totalpage <= 5) {
        //总页数在0到5之间时，显示实际的页数
        for (var i = 1; i <= totalpage; i++) {
            $("#page_" + i).html("<a href=\"javascript:getSubOrderByPage(" + i + ");\">" + i + "</a>");
        }
    } else if (totalpage > 5 && page <= 5) {//总页数大于5时，只显示五页，多出的隐藏
        //判断当前页的位置
        if (page <= 3) {//当前页小于等于3时，显示1-5
            for (var i = 1; i <= 5; i++) {
                $("#page_" + i).html("<a href=\"javascript:getSubOrderByPage(" + i + ");\">" + i + "</a>");
            }
        }
    } else if (page > (totalpage - 5)) {//当前页为最后五页时
        for (var i = totalpage - 4, j = 1; i <= totalpage, j <= 5; i++, j++) {
            $("#page_" + j).html("<a href=\"javascript:getSubOrderByPage(" + i + ");\">" + i + "</a>");
        }
    } else {//当前页为中间时
        for (var i = (page - 2), j = 1; i <= (page + 2), j <= 5; i++, j++) {
            $("#page_" + j).html("<a href=\"javascript:getSubOrderByPage(" + i + ");\">" + i + "</a>");
        }
    }
    if (language == 2) {
        if (page <= 1) {
            $("#prev_page").html("<a href=\"javascript:getSubOrderByPage(1);\" aria-label=\"Previous\"><span aria-hidden=\"true\">Prev</span></a>");
        } else {
            $("#prev_page").html("<a href=\"javascript:getSubOrderByPage(" + (page - 1) + ");\" aria-label=\"Previous\"><span aria-hidden=\"true\">Prev</span></a>");
        }
        if (page >= totalpage) {
            $("#next_page").html("<a href=\"javascript:getSubOrderByPage(" + totalpage + ");\" aria-label=\"Next\"><span aria-hidden=\"true\">Next</span></a>");
        } else {
            $("#next_page").html("<a href=\"javascript:getSubOrderByPage(" + (page + 1) + ");\" aria-label=\"Next\"><span aria-hidden=\"true\">Next</span></a>");
        }

    } else {
        if (page <= 1) {
            $("#prev_page").html("<a href=\"javascript:getSubOrderByPage(1);\" aria-label=\"Previous\"><span aria-hidden=\"true\">上一页</span></a>");
        } else {
            $("#prev_page").html("<a href=\"javascript:getSubOrderByPage(" + (page - 1) + ");\" aria-label=\"Previous\"><span aria-hidden=\"true\">上一页</span></a>");
        }
        if (page >= totalpage) {
            $("#next_page").html("<a href=\"javascript:getSubOrderByPage(" + totalpage + ");\" aria-label=\"Next\"><span aria-hidden=\"true\">下一页</span></a>");
        } else {
            $("#next_page").html("<a href=\"javascript:getSubOrderByPage(" + (page + 1) + ");\" aria-label=\"Next\"><span aria-hidden=\"true\">下一页</span></a>");
        }
    }
}