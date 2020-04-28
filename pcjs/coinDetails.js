var userid;
var token;
var language;
$(function () {
    userid = window.sessionStorage.getItem("userid");
    token = window.sessionStorage.getItem("token");
    changHead(userid);
    language = window.localStorage.getItem("language");
    if (language != undefined && language != null & language == 2) {
        if (language == 2) {
            loadProperties();
        }
    }
    left_currency();

})

function left_currency() {
    $("#ul_usdta").append("");
    $("#ul_usdtb").append("");
    $("#ul_usdtamy").append("");
    $.ajax({
        type: "post",
        url: "../../usdtpc/subUserCurrency/SubUserCurrencySelect",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        async: true,
        success: function (data) {
            if (data.code == 100) {
                for (var i in data.currency) {
                    var str = "";
                    var str1 = "";
                    var str2 = "";
                    var button_name = "去交易";
                    if (language == 2) {
                        button_name = "Go Trade";
                    }
                    var currency = data.currency[i];
                    str += " <li class=\"table\">";
                    str += "  <ul class=\"tableHeader  bhq\">";
                    str += "  <li class=\"name\"><img onerror=\"javascript:this.src='img/btc.png';\" src=\"" + currency.cimg + "\">" + currency.y_name + "</li>";

                    if (currency.bfb < 0) {
                        str += " <li class=\"colorRed\" id=\"ac_" + currency.pid + "\">$" + unde(currency.close, 0) + "</li>";
                        str += " <li class=\"colorRed\" id=\"bc_" + currency.pid + "\">" + (currency.bfb * 100).toFixed(2) + "%</li>";
                    } else {
                        str += " <li class=\"colorGreen\" id=\"ac_" + currency.pid + "\">$" + unde(currency.close, 0) + "</li>";
                        str += " <li class=\"colorGreen\" id=\"bc_" + currency.pid + "\">+" + (currency.bfb * 100).toFixed(2) + "%</li>";
                    }
                    str += "  <li>";
                    str += "   <div class=\"KLine\" id='A_" + currency.pid + "'></div>";
                    str += " </li>";
                    str += " <li>";
                    str += "  <button type=\"button\" class=\"btn btn-warning\" onclick=\"qjy(1,'" + currency.pid + "')\">" + button_name + "</button>";
                    str += " </li>";
                    str += "  </ul>";
                    str += "  </li>";

                    str1 += " <li class=\"table\">";
                    str1 += "  <ul class=\"tableHeader  bhq\">";
                    str1 += "  <li class=\"name\"><img onerror=\"javascript:this.src='img/btc.png';\" src=\"" + currency.cimg + "\">" + currency.y_name + "</li>";

                    if (currency.bfb < 0) {
                        str1 += " <li class=\"colorRed\" id=\"acb_" + currency.pid + "\">$" + unde(currency.close, 0) + "</li>";
                        str1 += " <li class=\"colorRed\" id=\"bcb_" + currency.pid + "\">" + (currency.bfb * 100).toFixed(2) + "%</li>";
                    } else {
                        str1 += " <li class=\"colorGreen\" id=\"acb_" + currency.pid + "\">$" + unde(currency.close, 0) + "</li>";
                        str1 += " <li class=\"colorGreen\" id=\"bcb_" + currency.pid + "\">+" + (currency.bfb * 100).toFixed(2) + "%</li>";
                    }
                    str1 += "  <li>";
                    str1 += "   <div class=\"KLine\" id='B_" + currency.pid + "'></div>";
                    str1 += " </li>";
                    str1 += " <li>";
                    str1 += "  <button type=\"button\" class=\"btn btn-warning\" onclick=\"qjy(2,'" + currency.pid + "')\">" + button_name + "</button>";
                    str1 += " </li>";
                    str1 += "  </ul>";
                    str1 += "  </li>";
                    if (currency.num >= 1) {
                        str2 += " <li class=\"table\">";
                        str2 += "  <ul class=\"tableHeader bhq\">";
                        str2 += "  <li class=\"name\"><img onerror=\"javascript:this.src='img/btc.png';\" src=\"" + currency.cimg + "\">" + currency.y_name + "</li>";

                        if (currency.bfb < 0) {
                            str2 += " <li class=\"colorRed\" id=\"acz_" + currency.pid + "\">$" + unde(currency.close, 0) + "</li>";
                            str2 += " <li class=\"colorRed\" id=\"bcz_" + currency.pid + "\">" + (currency.bfb * 100).toFixed(2) + "%</li>";
                        } else {
                            str2 += " <li class=\"colorGreen\" id=\"acz_" + currency.pid + "\">$" + unde(currency.close, 0) + "</li>";
                            str2 += " <li class=\"colorGreen\" id=\"bcz_" + currency.pid + "\">+" + (currency.bfb * 100).toFixed(2) + "%</li>";
                        }
                        str2 += "  <li>";
                        str2 += "   <div class=\"KLine\" id='C_" + currency.pid + "'></div>";
                        str2 += " </li>";
                        str2 += " <li>";
                        str2 += "  <button type=\"button\" class=\"btn btn-warning\" onclick=\"qjy(1,'" + currency.pid + "')\">" + button_name + "</button>";
                        str2 += " </li>";
                        str2 += "  </ul>";
                        str2 += "  </li>";
                    }
                    $("#ul_usdta").append(str);
                    $("#ul_usdtb").append(str1);
                    $("#ul_usdtamy").append(str2);


                }

                var a_i = 0;
                var b_i = 0;
                var a_minute;
                var a_num = 2;
                var b_num = 2;
                var b_minute;
                for (var i in data.minute) {
                    if (data.minute[i].style == 0) {
                        if (a_i == 0) {
                            a_minute = data.minute[i].pid;
                            a_num = Math.ceil(parseInt(1440) / parseInt(data.minute[i].minute));
                        }
                        a_i += 1;
                    } else {
                        if (b_i == 0) {
                            b_minute = data.minute[i].pid;
                            b_num = Math.ceil(parseInt(1440) / parseInt(data.minute[i].minute));
                        }
                        b_i += 1;
                    }
                }
                for (var i in data.currency) {
                    top_kline(a_minute, data.currency[i].pid, a_num, 1);
                    top_kline(a_minute, data.currency[i].pid, b_num, 2);
                }

            }
        },
        error: function (err) {

        }
    })
}

function top_kline(minuteid, currencyid, num, state) {
    $.ajax({
        type: "post",
        url: "../../usdtpc/subdisc/SubDiscKline",
        async: true,
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        data: {
            sys_currency_id: currencyid,
            sys_minute_id: minuteid,
            num: num
        },
        success: function (data) {
            var data_value = new Array();
            if (data.code == 100) {
                for (var i in data.kline) {
                    var kline = data.kline[data.kline.length - i - 1];
                    kline = JSON.parse(kline);
                    data_value.push(kline.close);
                }
                var data_value2 = new Array();
                var data_value3 = new Array();
                for (var i in data_value) {
                    if (data_value[i] != 0) {
                        data_value3.push(data_value[i]);
                    }
                }
                var min_value = Math.min.apply(0, data_value3);
                for (var i in data_value3) {
                    data_value2.push(parseFloat(data_value3[i]) - parseFloat(min_value));
                }
                if (state == 1) {
                    echart_zx("A_" + currencyid, data_value2);
                    echart_zx("C_" + currencyid, data_value2);
                } else {
                    echart_zx("B_" + currencyid, data_value2);
                }

            }
        },
        error: function (err) {

        }
    });
}

function qjy(state, pid) {
    window.location.href = "trade/tradeAQU.html?state=" + state + "&currencyid=" + pid;
}


function dinshi_bizhong() {
    $.ajax({
        url: "../usdtpc/subUserCurrency/SubUserCurrencySelect",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        async: true,
        type: "POST",
        success: function (data) {
            if (data.code == 100) {
                for (var i in data.currency) {
                    var currency = data.currency[i];
                    if (currency.bfb >= 0) {
                        $("#ac_" + currency.pid).html("$" + unde(currency.close, 0));
                        $("#ac_" + currency.pud).attr("class", "colorGreen");
                        $("#bc_" + currency.pid).html("+" + (unde(currency.bfb, 0) * 100).toFixed(2) + "%");
                        $("#bc_" + currency.pud).attr("class", "colorGreen");

                        $("#acz_" + currency.pid).html("$" + unde(currency.close, 0));
                        $("#acz_" + currency.pud).attr("class", "colorGreen");
                        $("#bcz_" + currency.pid).html("+" + (unde(currency.bfb, 0) * 100).toFixed(2) + "%");
                        $("#bcz_" + currency.pud).attr("class", "colorGreen");

                        $("#acb_" + currency.pid).html("$" + unde(currency.close, 0));
                        $("#acb_" + currency.pud).attr("class", "colorGreen");
                        $("#bcb_" + currency.pid).html("+" + (unde(currency.bfb, 0) * 100).toFixed(2) + "%");
                        $("#bcb_" + currency.pud).attr("class", "colorGreen");
                    } else {
                        $("#ac_" + currency.pid).html("$" + unde(currency.close, 0));
                        $("#ac_" + currency.pud).attr("class", "colorRed");
                        $("#bc_" + currency.pid).html((unde(currency.bfb, 0) * 100).toFixed(2) + "%");
                        $("#bc_" + currency.pud).attr("class", "colorRed");

                        $("#acz_" + currency.pid).html("$" + unde(currency.close, 0));
                        $("#acz_" + currency.pud).attr("class", "colorRed");
                        $("#bcz_" + currency.pid).html((unde(currency.bfb, 0) * 100).toFixed(2) + "%");
                        $("#bcz_" + currency.pud).attr("class", "colorRed");

                        $("#acb_" + currency.pid).html("$" + unde(currency.close, 0));
                        $("#acb_" + currency.pud).attr("class", "colorRed");
                        $("#bcb_" + currency.pid).html((unde(currency.bfb, 0) * 100).toFixed(2) + "%");
                        $("#bcb_" + currency.pud).attr("class", "colorRed");
                    }
                }
            }
        },
        error: function (err) {

        }
    })
}

setInterval("dinshi_bizhong()", 60000);