// JavaScript Document
(function ($) {
    $.fn.extend({
        "slideUpB": function (value) {

            var docthis = this;
            var li_h = $(this).children("li").outerHeight();
            //默认参数
            value = $.extend({
                "li_h": li_h,
                "time": 2000,
                "movetime": 1000
            }, value)

            //向上滑动动画
            function autoani() {
                $("li:first", docthis).animate({"margin-top": -value.li_h}, value.movetime, function () {
                    $(this).css("margin-top", 0);
                    // 查到第一个子元素
                    var item = $(docthis).children('li')[0];
                    // 获取第一个元素
                    var fChild = $(item).prop('outerHTML');
                    // 将第一个节点拼接到最后
                    $(docthis).append(fChild);
                    // 将第一个节点删除
                    $(item).remove();
                })
            }

            //自动间隔时间向上滑动
            var anifun = setInterval(autoani, value.time);

            //悬停时停止滑动，离开时继续执行
            $(docthis).children("li").hover(function () {
                clearInterval(anifun);			//清除自动滑动动画
            }, function () {
                anifun = setInterval(autoani, value.time);	//继续执行动画
            })
        }
    })
})(jQuery)