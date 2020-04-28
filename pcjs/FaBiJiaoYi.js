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
/*---------------------------------------------------------------------*/
$(function () {
    userid = window.sessionStorage.getItem("userid");
    token = window.sessionStorage.getItem("token");
    changHead(userid);
    language = window.localStorage.getItem("language");
    if (language != undefined && language != null & language == 2) {
        loadProperties();
    }

});
