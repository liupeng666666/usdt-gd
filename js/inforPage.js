$(document).ready(function () {
//  $(".leftsidebar_box dd").hide();
    $(".leftsidebar_box dt").click(function () {
//    $(this).parent().parent().find('dt').removeClass("Inforactive");
        let imgs = $(this).parent().parent().find('img');
        for (var i = 0; i < imgs.length; i++) {
            $(imgs).eq(i).attr('src', $(imgs).eq(i).attr('src').replace('C.', '.'))
        }
        // imgs.forEach(element => {
        //   element.attr('src',element.attr('src').replace('C.','.'))
        // });
        // $(this).parent().parent().find('img').attr('src',$(this).parent().parent().find('img').attr('src').replace('C.','.'));
        $(this).addClass("Inforactive");
        $(this).parent().find('dd').removeClass("menu_chioce");
        let imgsrc = $(this).parent().find('img').attr('src')
        $(this).parent().find('img').attr('src', imgsrc.replace('.', 'C.'))
        $(".menu_chioce").slideUp();
        $(this).parent().find('dd').slideToggle();
        $(this).parent().find('dd').addClass("menu_chioce");
    });
})

function showPage(pageName) {
    $('.' + pageName).slideDown().siblings(".commonClass").slideUp();
}

function openGoogleVi() {
    $('.safeSetting').slideDown().siblings(".commonClass").slideUp();
}

function showP2(_this, pageName) {
    $('.leftsidebar_box').hide();
    $('.' + pageName).show();
    $('.commonClass').hide();
    $('.' + pageName + '_1').show();
    $(_this).parent().find('li').removeClass("activeP1");
    $(_this).addClass("activeP1");
    window.scrollTo(0, 0);
}

function showP3(_this, pageName) {
    $('.' + pageName).slideDown().siblings(".commonClass").slideUp();
    $(_this).parent().find('dl').removeClass("Inforactive");
    $(_this).addClass("Inforactive");
    window.scrollTo(0, 0);
}

function guideClick(_this, pageName) {
    $('.userGuidecommonClsss').hide();
    $('.' + pageName).show();
    $(_this).parent().find('li').removeClass("activeLI");
    $(_this).addClass("activeLI");
} 